'use server';  // This file runs only on server (protects API key)

const HF_API = 'https://api-inference.huggingface.co/models';
const KEY = process.env.HUGGINGFACE_API_KEY!;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  text: string;
  model_used: string;
  language_detected: 'ta' | 'en' | 'unknown';
  triage_level: 'EMERGENCY' | 'DOCTOR' | 'MONITOR' | 'INFO' | null;
  is_emergency: boolean;
  loading_time_ms: number;
  error?: string;
}

export interface SymptomClassification {
  disease: string;
  confidence: number;
  triage_level: 'EMERGENCY' | 'DOCTOR' | 'MONITOR';
  recommended_action_tamil: string;
  recommended_action_english: string;
}

async function hfPost(modelId: string, payload: object, retries = 3): Promise<any> {
  const url = `${HF_API}/${modelId}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data?.error?.includes('loading') || data?.error?.includes('currently loading')) {
      const waitTime = (data.estimated_time || 20) * 1000;
      console.log(`Model ${modelId} loading... waiting ${waitTime / 1000}s (attempt ${attempt}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, Math.min(waitTime, 30000)));
      continue;
    }

    if (res.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
      continue;
    }

    if (!res.ok) {
      throw new Error(`HF API error: ${res.status} — ${JSON.stringify(data)}`);
    }

    return data;
  }

  throw new Error(`Model ${modelId} failed after ${retries} retries`);
}

export async function detectLanguage(text: string): Promise<'ta' | 'en' | 'unknown'> {
  const tamilChars = (text.match(/[஀-௿]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;

  if (totalChars > 0 && tamilChars / totalChars > 0.2) return 'ta';
  if (tamilChars === 0 && /^[a-zA-Z0-9\s.,?!'"()\-]+$/.test(text)) return 'en';

  try {
    const result = await hfPost(process.env.HF_LANG_DETECT_MODEL || 'papluca/xlm-roberta-base-language-detection', {
      inputs: text.substring(0, 200)
    });

    if (Array.isArray(result) && result[0]) {
      const top = result[0][0];
      if (top?.label === 'ta') return 'ta';
      if (top?.label === 'en') return 'en';
    }
  } catch {
    // fall back to heuristic
  }

  return 'unknown';
}

const EMERGENCY_KEYWORDS_EN = [
  'breathless', "can't breathe", 'unconscious', 'seizure', 'chest pain',
  'not breathing', 'severe bleeding', 'stroke', 'heart attack', 'passed out',
  'collapsed', 'unresponsive', 'coma', 'paralysis'
];

const EMERGENCY_KEYWORDS_TA = [
  'மூச்சு', 'மயக்கம்', 'வலிப்பு', 'நெஞ்சு வலி', 'இதய', 'மூளை',
  'செயலிழந்த', 'சுவாசிக்க', 'இறந்து', 'உணர்வற்ற'
];

export async function classifySymptoms(symptomText: string): Promise<SymptomClassification> {
  const lowerText = symptomText.toLowerCase();
  const isEmergency =
    EMERGENCY_KEYWORDS_EN.some((keyword) => lowerText.includes(keyword)) ||
    EMERGENCY_KEYWORDS_TA.some((keyword) => symptomText.includes(keyword));

  if (isEmergency) {
    return {
      disease: 'emergency',
      confidence: 0.99,
      triage_level: 'EMERGENCY',
      recommended_action_tamil: 'உடனடியாக 108 அழைக்கவும்! அவசர சிகிச்சை தேவை.',
      recommended_action_english: 'Call 108 IMMEDIATELY! Emergency care needed.'
    };
  }

  const DISEASE_LABELS = [
    'dengue fever with high fever joint pain and rash',
    'scrub typhus with fever headache and lymph nodes',
    'gastroenteritis with vomiting diarrhea stomach pain',
    'heat stroke with extreme heat exposure and dizziness',
    'respiratory illness with cough cold and breathing difficulty',
    'general fever and body pain',
    'healthy no serious symptoms'
  ];

  try {
    const result = await hfPost(process.env.HF_CLASSIFIER_MODEL || 'facebook/bart-large-mnli', {
      inputs: symptomText,
      parameters: {
        candidate_labels: DISEASE_LABELS,
        multi_label: false
      }
    });

    const topLabel = result.labels?.[0] || 'general fever and body pain';
    const topScore = result.scores?.[0] || 0.5;

    const diseaseMap: Record<string, { disease: string; triage: 'EMERGENCY' | 'DOCTOR' | 'MONITOR' }> = {
      'dengue fever': { disease: 'dengue', triage: 'DOCTOR' },
      'scrub typhus': { disease: 'scrub_typhus', triage: 'DOCTOR' },
      'gastroenteritis': { disease: 'gastroenteritis', triage: 'DOCTOR' },
      'heat stroke': { disease: 'heat_stroke', triage: 'DOCTOR' },
      'respiratory illness': { disease: 'respiratory', triage: 'DOCTOR' },
      'general fever': { disease: 'fever', triage: 'MONITOR' },
      healthy: { disease: 'none', triage: 'MONITOR' }
    };

    const matched = Object.entries(diseaseMap).find(([key]) => topLabel.toLowerCase().includes(key));
    const info = matched?.[1] || { disease: 'unknown', triage: 'MONITOR' as const };

    const triageMessages: Record<'EMERGENCY' | 'DOCTOR' | 'MONITOR', { ta: string; en: string }> = {
      EMERGENCY: {
        ta: 'உடனடியாக 108 அழைக்கவும்!',
        en: 'Call 108 immediately!'
      },
      DOCTOR: {
        ta: '24 மணி நேரத்தில் PHC செல்லுங்கள். இலவச சோதனை கிடைக்கும்.',
        en: 'Visit nearest PHC within 24 hours. Free testing available.'
      },
      MONITOR: {
        ta: 'வீட்டிலேயே ஓய்வெடுங்கள். நிறைய தண்ணீர் குடியுங்கள். 2 நாளில் மீண்டும் சரிபாருங்கள்.',
        en: 'Rest at home. Drink plenty of fluids. Recheck in 2 days.'
      }
    };

    return {
      disease: info.disease,
      confidence: topScore,
      triage_level: info.triage,
      recommended_action_tamil: triageMessages[info.triage].ta,
      recommended_action_english: triageMessages[info.triage].en
    };
  } catch {
    return {
      disease: 'unknown',
      confidence: 0.5,
      triage_level: 'MONITOR',
      recommended_action_tamil: '104 helpline-ஐ அழைக்கவும் அல்லது PHC செல்லுங்கள்.',
      recommended_action_english: 'Call 104 helpline or visit nearest PHC.'
    };
  }
}

export async function generateChatResponse(
  messages: ChatMessage[],
  district = 'Tamil Nadu',
  language: 'ta' | 'en' | 'unknown' = 'en'
): Promise<ChatResponse> {
  const startTime = Date.now();
  const userMessage = messages[messages.length - 1]?.content || '';
  const detectedLang = language === 'unknown' ? await detectLanguage(userMessage) : language;

  const EMERGENCY_PHRASES = [
    "can't breathe",
    'unconscious',
    'seizure',
    'chest pain',
    'not breathing',
    'மூச்சு',
    'மயக்கம்',
    'வலிப்பு',
    'நெஞ்சு வலி'
  ];

  const isEmergency = EMERGENCY_PHRASES.some((phrase) =>
    userMessage.toLowerCase().includes(phrase.toLowerCase()) || userMessage.includes(phrase)
  );

  if (isEmergency) {
    return {
      text:
        detectedLang === 'ta'
          ? `🚨 **அவசரநிலை கண்டறியப்பட்டது!**

உடனடியாக **108** அழைக்கவும்!

காத்திருக்காதீர்கள். இப்போதே அழைக்கவும்.

This is a medical emergency. Call 108 NOW.`
          : `🚨 **EMERGENCY DETECTED!**

Call **108 IMMEDIATELY!**

Do NOT wait. Call now.

துரிதமாக 108 அழைக்கவும்!`,
      model_used: 'emergency-detector',
      language_detected: detectedLang,
      triage_level: 'EMERGENCY',
      is_emergency: true,
      loading_time_ms: Date.now() - startTime
    };
  }

  const SYSTEM_CONTEXT =
    detectedLang === 'ta'
      ? `நீங்கள் டாக்டர் நலம், தமிழ்நாடு அரசின் நலம் AI சுகாதார உதவியாளர்.
நீங்கள் தமிழ் மற்றும் ஆங்கிலம் இரண்டிலும் பேசுகிறீர்கள்.
உங்கள் வேலை: அறிகுறிகளை மதிப்பீடு செய்து, எப்போது மருத்துவரிடம் செல்ல வேண்டும் என்று சொல்வது.
தற்போதைய மாவட்டம்: ${district}
எப்போதும் சுருக்கமாக பதில் சொல்லுங்கள் (100 வார்த்தைகளுக்கு குறைவாக).
அவசர அறிகுறிகளுக்கு: 108 அழைக்கவும் என்று சொல்லுங்கள்.
மருத்துவர் தேவை என்றால்: PHC செல்லுங்கள் என்று சொல்லுங்கள்.
நீங்கள் மருத்துவர் ஆலோசனைக்கு மாற்றாக இல்லை.`
      : `You are Dr. Nalam, AI health assistant for Tamil Nadu Government's Nalam AI.
You help citizens with symptom triage and health guidance.
Current district context: ${district}
TRIAGE RULES:
- EMERGENCY (breathlessness/unconsciousness/chest pain): Say CALL 108 NOW in bold
- DOCTOR NEEDED (fever 3+ days, dengue symptoms, severe pain): Visit PHC within 24 hours
- HOME CARE (mild symptoms): Rest, fluids, recheck in 2 days
Always mention: free testing at government PHCs, call 104 for advice.
Keep responses under 120 words. Be caring but concise.
You are NOT a replacement for medical care — always say this.`;

  let prompt = `<s>[INST] ${SYSTEM_CONTEXT}

User: ${userMessage} [/INST]`;

  if (messages.length > 1) {
    const history = messages.slice(-5, -1);
    let historyPrompt = `<s>[INST] ${SYSTEM_CONTEXT} [/INST] `;

    history.forEach((msg) => {
      if (msg.role === 'user') {
        historyPrompt += `[INST] ${msg.content} [/INST] `;
      } else if (msg.role === 'assistant') {
        historyPrompt += `${msg.content} </s>`;
      }
    });

    historyPrompt += `[INST] ${userMessage} [/INST]`;
    prompt = historyPrompt;
  }

  try {
    const result = await hfPost(process.env.HF_MISTRAL_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3', {
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
        stop: ['[INST]', '</s>', '\nUser:', '\nHuman:']
      }
    });

    let responseText = '';
    if (Array.isArray(result)) {
      responseText = result[0]?.generated_text || '';
    } else if (typeof result === 'object') {
      responseText = result.generated_text || '';
    }

    responseText = responseText
      .replace(/\[INST\][\s\S]*?\[\/INST\]/g, '')
      .replace(/<s>|<\/s>/g, '')
      .replace(/^\s+|\s+$/g, '')
      .replace(/User:.*$/gm, '')
      .replace(/Human:.*$/gm, '')
      .trim();

    if (!responseText || responseText.length < 20) {
      throw new Error('Response too short, trying fallback');
    }

    const triageLevel = detectTriageInResponse(responseText);

    return {
      text: responseText,
      model_used: 'Mistral-7B-Instruct-v0.3',
      language_detected: detectedLang,
      triage_level: triageLevel,
      is_emergency: triageLevel === 'EMERGENCY',
      loading_time_ms: Date.now() - startTime
    };
  } catch (primaryError) {
    console.error('Primary model failed:', primaryError);

    try {
      const fallbackResult = await hfPost(process.env.HF_FALLBACK_MODEL || 'HuggingFaceH4/zephyr-7b-beta', {
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          return_full_text: false
        }
      });

      const fallbackText = Array.isArray(fallbackResult)
        ? fallbackResult[0]?.generated_text || ''
        : fallbackResult.generated_text || '';

      const cleaned = fallbackText.replace(/\[INST\][\s\S]*?\[\/INST\]/g, '').trim();

      return {
        text: cleaned || getRuleBasedResponse(userMessage, detectedLang, district),
        model_used: 'zephyr-7b-beta (fallback)',
        language_detected: detectedLang,
        triage_level: detectTriageInResponse(cleaned),
        is_emergency: false,
        loading_time_ms: Date.now() - startTime
      };
    } catch (fallbackError) {
      const ruleResponse = getRuleBasedResponse(userMessage, detectedLang, district);
      return {
        text: ruleResponse,
        model_used: 'rule-based-fallback',
        language_detected: detectedLang,
        triage_level: 'INFO',
        is_emergency: false,
        loading_time_ms: Date.now() - startTime,
        error: 'AI models temporarily unavailable. Using built-in response.'
      };
    }
  }
}

function detectTriageInResponse(text: string): 'EMERGENCY' | 'DOCTOR' | 'MONITOR' | 'INFO' {
  const lower = text.toLowerCase();
  if (lower.includes('108') || lower.includes('emergency') || lower.includes('immediately')) {
    return 'EMERGENCY';
  }
  if (lower.includes('phc') || lower.includes('doctor') || lower.includes('24 hour') || lower.includes('மருத்துவர்')) {
    return 'DOCTOR';
  }
  if (lower.includes('rest') || lower.includes('home') || lower.includes('fluids') || lower.includes('ஓய்வு') || lower.includes('தண்ணீர்')) {
    return 'MONITOR';
  }
  return 'INFO';
}

function getRuleBasedResponse(message: string, lang: 'ta' | 'en' | 'unknown', district: string): string {
  const m = message.toLowerCase();
  const isTamil = lang === 'ta';

  if (m.includes('dengue') || m.includes('டெங்கு') || (m.includes('fever') && (m.includes('joint') || m.includes('rash'))) || (m.includes('காய்ச்சல்') && m.includes('மூட்டு'))) {
    return isTamil
      ? `🦟 டெங்கு அறிகுறிகள் தெரிகின்றன.

✅ **உங்கள் அடுத்த படி:**
1. உடனே அருகிலுள்ள PHC செல்லுங்கள்
2. NS1 Rapid Test கேளுங்கள் (இலவசம்)
3. நிறைய தண்ணீர் குடியுங்கள்
4. Paracetamol மட்டும் எடுங்கள் — Brufen வேண்டாம்

📞 கோடு: 104 | அவசரம்: 108`
      : `🦟 Possible dengue symptoms detected.

✅ **Action needed:**
1. Visit nearest PHC immediately
2. Ask for NS1 Rapid Test (FREE at govt PHC)
3. Drink plenty of fluids
4. Take Paracetamol only — NO Ibuprofen/Aspirin

Platelet drop is dangerous — get tested today.

📞 Helpline: 104 | Emergency: 108`; 
  }

  if (m.includes('vomit') || m.includes('diarrhea') || m.includes('வாந்தி') || m.includes('வயிற்று')) {
    return isTamil
      ? `💧 வயிற்றுப்போக்கு/வாந்தி அறிகுறிகள்.

✅ **உடனடியாக:**
1. ORS பாக்கெட் குடியுங்கள் (PHC-ல் இலவசம்)
2. நிறைய தண்ணீர் குடியுங்கள்
3. 24 மணி நேரத்தில் சரியாகாவிட்டால் PHC செல்லுங்கள்

⚠ குழந்தைகளுக்கு: உடனே PHC செல்லுங்கள்`
      : `💧 Gastroenteritis symptoms detected.

✅ **Immediately:**
1. Take ORS sachets (FREE at PHC)
2. Drink plenty of clean water
3. If not better in 24 hours, visit PHC

⚠ For children under 5: Visit PHC immediately — dehydration is dangerous.`;
  }

  if (m.includes('heat') || m.includes('வெப்பம்') || m.includes('sun') || m.includes('வெயில்')) {
    return isTamil
      ? `☀ வெப்ப அடிப்பு அறிகுறிகள்.

✅ **உடனடியாக:**
1. நிழலான இடத்தில் படுங்கள்
2. தண்ணீர் / மோர் குடியுங்கள்
3. உடலை குளிர வையுங்கள்

⚠ மயக்கம் வந்தால்: 108 அழைக்கவும்`
      : `☀ Heat stroke symptoms.

✅ **Immediately:**
1. Move to cool/shaded area
2. Drink water or buttermilk
3. Cool body with wet cloth

⚠ If unconscious or confused: Call 108 immediately.`;
  }

  if (m.includes('fever') || m.includes('காய்ச்சல்') || m.includes('temperature')) {
    return isTamil
      ? `🌡 காய்ச்சல் அறிகுறிகள்.

${district} மாவட்டத்தில் தற்போது நோய் கண்காணிப்பு நடைபெறுகிறது.

✅ **படிகள்:**
1. Paracetamol எடுங்கள் (மருத்துவர் ஆலோசனை இல்லாமல் Brufen வேண்டாம்)
2. நிறைய தண்ணீர் குடியுங்கள்
3. 3 நாட்களுக்கு மேல் காய்ச்சல்: PHC செல்லுங்கள்

📞 104 — இலவச சுகாதார ஆலோசனை`
      : `🌡 Fever symptoms noted.

Nalam AI is monitoring disease risk in ${district}.

✅ **Steps:**
1. Take Paracetamol (NOT Ibuprofen without doctor advice)
2. Drink plenty of fluids
3. If fever continues 3+ days: Visit PHC for testing
4. Watch for rash, joint pain (dengue signs)

📞 104 — Free health helpline`;
  }

  if (m.includes('phc') || m.includes('hospital') || m.includes('மருத்துவமனை') || m.includes('அருகில்')) {
    return isTamil
      ? `🏥 ${district} மாவட்டத்தில் PHC கண்டுபிடிக்க:

✅ நலம் AI-யில்: PHC Finder பக்கம் செல்லுங்கள்
✅ GPS கொண்டு அருகிலுள்ள PHC காண்பிக்கும்
✅ அனைத்து அரசு PHC-களிலும் இலவச சோதனை

📞 104 — சுகாதார helpline
🚑 108 — இலவச ambulance`
      : `🏥 To find nearest PHC in ${district}:

✅ Use PHC Finder on Nalam AI portal
✅ GPS will show nearest government PHC
✅ FREE testing at all government PHCs

All dengue, scrub typhus tests are completely FREE.

📞 104 — Health helpline | 🚑 108 — Free ambulance`;
  }

  return isTamil
    ? `வணக்கம்! நான் டாக்டர் நலம். உங்கள் அறிகுறிகளை சொல்லுங்கள்.

தற்போது நலம் AI மாதிரிகள் ஏற்றப்படுகின்றன. சற்று நேரம் காத்திருங்கள் அல்லது மீண்டும் அனுப்புங்கள்.

📞 உடனடி உதவிக்கு: 104 helpline அழைக்கவும்.`
    : `Hello! I'm Dr. Nalam. Please describe your symptoms and I'll help with guidance.

Note: AI models are warming up (this takes ~20 seconds on first use). Please resend your message.

📞 For immediate help: Call 104 (free health helpline).`;
}
