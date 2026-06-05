import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, classifySymptoms, detectLanguage } from '@/lib/huggingface';
import type { ChatMessage } from '@/lib/huggingface';

export const runtime = 'nodejs';  // NOT edge — HF calls need longer timeout
export const maxDuration = 60;    // 60 second timeout (models may be cold)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, district, mode } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages array required' }, { status: 400 });
    }
    
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // Detect language from user message
    const language = await detectLanguage(userMessage);
    
    // If mode is 'classify' — just do symptom classification
    if (mode === 'classify') {
      const classification = await classifySymptoms(userMessage);
      return NextResponse.json({ classification, language });
    }
    
    // Main chat response
    const response = await generateChatResponse(
      messages as ChatMessage[],
      district || 'Tamil Nadu',
      language
    );
    
    return NextResponse.json({
      message: response.text,
      model: response.model_used,
      language: response.language_detected,
      triage_level: response.triage_level,
      is_emergency: response.is_emergency,
      loading_time_ms: response.loading_time_ms,
      error: response.error || null,
    });
    
  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Return a helpful error, not a 500
    return NextResponse.json({
      message: 'டாக்டர் நலம் தற்போது இணைக்கப்படுகிறார். சற்று நேரம் காத்திருங்கள். / Dr. Nalam is connecting. Please try again in 30 seconds. 📞 Emergency: Call 108 | Helpline: 104',
      model: 'error-handler',
      language: 'unknown',
      triage_level: 'INFO',
      is_emergency: false,
      loading_time_ms: 0,
      error: 'Model loading or rate limit. Retry in 30 seconds.'
    });
  }
}
