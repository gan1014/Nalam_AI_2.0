import { NextRequest, NextResponse } from 'next/server';
import { classifySymptoms, detectLanguage } from '@/lib/huggingface';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { symptoms } = await req.json();
    if (!symptoms) return NextResponse.json({ error: 'symptoms required' }, { status: 400 });
    
    const [classification, language] = await Promise.all([
      classifySymptoms(symptoms),
      detectLanguage(symptoms)
    ]);
    
    return NextResponse.json({ classification, language, symptoms });
  } catch (err: any) {
    return NextResponse.json({
      classification: {
        disease: 'unknown', confidence: 0.5, triage_level: 'MONITOR',
        recommended_action_tamil: 'PHC செல்லுங்கள் அல்லது 104 அழைக்கவும்',
        recommended_action_english: 'Visit PHC or call 104 helpline'
      },
      language: 'unknown',
      error: err.message
    });
  }
}
