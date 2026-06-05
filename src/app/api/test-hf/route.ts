import { NextResponse } from 'next/server';

export async function GET() {
  const KEY = process.env.HUGGINGFACE_API_KEY;
  if (!KEY) return NextResponse.json({ error: 'HUGGINGFACE_API_KEY not set' });
  
  try {
    // Test language detection (fastest model)
    const res = await fetch(
      'https://api-inference.huggingface.co/models/papluca/xlm-roberta-base-language-detection',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: 'எனக்கு காய்ச்சல் உள்ளது' })
      }
    );
    const data = await res.json();
    return NextResponse.json({
      status: 'API key working',
      test_result: data,
      key_prefix: KEY.substring(0, 8) + '...'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
