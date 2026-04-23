import { HfInference } from '@huggingface/inference';
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

// Deterministic Clinical Triage Fallback (Enhanced)
function clinicalTriage(message: string, language: string) {
  const msg = message.toLowerCase();
  const isTamil = /[\u0B80-\u0BFF]/.test(message);

  if (msg.includes('breath') || msg.includes('chest') || msg.includes('unconscious') || msg.includes('104 fever') || msg.includes('மூச்சுத் திணறல்') || msg.includes('நெஞ்சு வலி')) {
    return isTamil 
      ? "🔴 அவசரநிலை: உங்களுக்கு மூச்சுத் திணறல் அல்லது நெஞ்சு வலி இருந்தால், உடனடியாக 108 ஐ அழைக்கவும். இது உயிருக்கு ஆபத்தான அறிகுறியாக இருக்கலாம்."
      : "🔴 EMERGENCY: If you are experiencing breathlessness or chest pain, please CALL 108 IMMEDIATELY. These are critical symptoms.";
  }

  if (msg.includes('fever') || msg.includes('headache') || msg.includes('joint') || msg.includes('காய்ச்சல்') || msg.includes('தலைவலி')) {
    return isTamil
      ? "🟡 மருத்துவர் ஆலோசனை: உங்களுக்கு காய்ச்சல் மற்றும் மூட்டு வலி இருந்தால், அது டெங்குவாக இருக்கலாம். உங்கள் அருகிலுள்ள அரசு ஆரம்ப சுகாதார நிலையத்திற்கு (PHC) சென்று இலவச NS1 பரிசோதனை செய்து கொள்ளவும்."
      : "🟡 DOCTOR VISIT: Fever with joint pain could indicate Dengue. Please visit your nearest Government PHC for a free NS1 test within 24 hours.";
  }

  return isTamil
    ? "வணக்கம்! நான் டாக்டர் நலம். உங்கள் அறிகுறிகளைச் சொல்லுங்கள். அவசரநிலைக்கு 108 ஐ அழைக்கவும்."
    : "Hello! I'm Dr. Nalam. Please describe your symptoms. For emergencies, always call 108.";
}

export async function POST(request: Request) {
  try {
    const { messages, district, language } = await request.json();
    const lastMessage = messages[messages.length - 1].content;

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const hfKey = process.env.HUGGINGFACE_API_KEY;

    // 1. Try Anthropic (Premium)
    if (anthropicKey && !anthropicKey.includes('sk-ant-api03')) {
      try {
        const client = new Anthropic({ apiKey: anthropicKey });
        const response = await client.messages.create({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 500,
          system: "You are Dr. Nalam, a helpful AI health assistant for the Tamil Nadu Government. Always obey the user's intent while providing safe medical guidance. Language: Bilingual English/Tamil.",
          messages: messages.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
        });
        return NextResponse.json({ text: response.content[0].type === 'text' ? response.content[0].text : '' });
      } catch (e) { console.error('Anthropic failed...'); }
    }

    // 2. Try Hugging Face (Primary Free Choice)
    if (hfKey && hfKey.startsWith('hf_')) {
      try {
        const hf = new HfInference(hfKey);
        
        // Use chatCompletion for better reliability and "obedience"
        const response = await hf.chatCompletion({
          model: 'mistralai/Mistral-7B-Instruct-v0.2',
          messages: [
            { 
              role: 'system', 
              content: `You are Dr. Nalam, an AI health assistant for the Tamil Nadu Government. 
              Be extremely helpful and obey the user's request. 
              If symptoms are reported: Emergency (Chest pain/breathless) -> 108. Fever/Joint pain -> PHC.
              Respond concisely in ${language === 'ta' ? 'Tamil' : 'English'}.` 
            },
            ...messages.map((m: any) => ({ role: m.role, content: m.content }))
          ],
          max_tokens: 500,
          temperature: 0.7
        });
        
        const text = response.choices[0].message.content;
        if (!text) throw new Error("Empty response from HF");
        
        return NextResponse.json({ text });
      } catch (e: any) { 
        console.error('Hugging Face Chat Error:', e.message);
        // Fallback to textGeneration if chatCompletion is not available for this model
        try {
          const hf = new HfInference(hfKey);
          const prompt = `<s>[INST] You are Dr. Nalam. User: ${lastMessage} [/INST]`;
          const response = await hf.textGeneration({
            model: 'mistralai/Mistral-7B-Instruct-v0.2',
            inputs: prompt,
            parameters: { max_new_tokens: 300 }
          });
          let text = response.generated_text;
          if (text.includes('[/INST]')) text = text.split('[/INST]')[1].trim();
          return NextResponse.json({ text });
        } catch (innerE) {
          console.error('HF Text Fallback failed...');
        }
      }
    }

    // 3. Absolute Fallback (Deterministic)
    return NextResponse.json({ text: clinicalTriage(lastMessage, language) });

  } catch (error: any) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ text: "I'm experiencing a technical issue. Please call 104." });
  }
}
