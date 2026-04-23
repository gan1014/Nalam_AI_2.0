import { NextResponse } from 'next/server';
import { generateForecastData } from '@/lib/forecast-data';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district') || 'Chennai';
  const disease = searchParams.get('disease') || 'dengue';

  // In a real scenario, this would query Supabase for the specific district's LSTM prediction.
  // For the demo/hackathon, we generate the plausible data structure.
  
  // If user provided valid Supabase keys, we could log the API call here
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      await supabase.from('api_logs').insert([
        { endpoint: '/api/predictions', params: { district, disease } }
      ]);
    } catch (e) {
      console.warn("Supabase logging failed, skipping.");
    }
  }

  // Generate 14-day forecast data
  const forecast = generateForecastData(disease);
  const day14 = forecast[13];

  // Determine risk level based on day14 p50 vs threshold
  let riskLevel = 'LOW';
  let probability = { LOW: 0.8, WATCH: 0.15, HIGH: 0.05, CRITICAL: 0.0 };
  
  if (day14.p50 > day14.threshold * 1.5) {
    riskLevel = 'CRITICAL';
    probability = { LOW: 0.05, WATCH: 0.1, HIGH: 0.2, CRITICAL: 0.65 };
  } else if (day14.p50 > day14.threshold) {
    riskLevel = 'HIGH';
    probability = { LOW: 0.1, WATCH: 0.2, HIGH: 0.6, CRITICAL: 0.1 };
  } else if (day14.p50 > day14.threshold * 0.7) {
    riskLevel = 'WATCH';
    probability = { LOW: 0.3, WATCH: 0.5, HIGH: 0.15, CRITICAL: 0.05 };
  }

  // SHAP reasons specific to disease
  let shapReasons = [];
  if (disease === 'dengue') {
    shapReasons = [
      { feature: 'rainfall_7d', value_english: 'Heavy rainfall in past 7 days', value_tamil: 'கடந்த 7 நாட்களில் அதிக மழைப்பொழிவு' },
      { feature: 'temp_humidity_index', value_english: 'High Mosquito Breeding Index', value_tamil: 'கொசு உற்பத்திக்கு சாதகமான தட்பவெப்பம்' },
      { feature: 'historical_cluster', value_english: 'Historical peak alignment', value_tamil: 'வரலாற்று உச்சநிலை நேரடி ஒப்பீடு' }
    ];
  } else if (disease === 'scrub_typhus') {
    shapReasons = [
      { feature: 'vegetation_index', value_english: 'High vegetation density post-monsoon', value_tamil: 'பருவமழைக்கு பின் அடர்ந்த தாவரங்கள்' },
      { feature: 'rural_proximity', value_english: 'Proximity to agricultural zones', value_tamil: 'விவசாய மண்டலங்களுக்கு அருகில்' }
    ];
  } else {
    shapReasons = [
      { feature: 'syndromic_trend', value_english: 'Rising fever complaints at local PHCs', value_tamil: 'உள்ளூர் மருத்துவமனைகளில் காய்ச்சல் அதிகரிப்பு' },
      { feature: 'seasonal_factor', value_english: 'Expected seasonal variation', value_tamil: 'எதிர்பார்க்கப்படும் பருவநிலை மாற்றம்' }
    ];
  }

  return NextResponse.json({
    district,
    disease,
    risk_level: riskLevel,
    probability,
    lstm_forecast: {
      date: day14.date,
      p05: day14.p05,
      p50: day14.p50,
      p95: day14.p95
    },
    shap_reasons: shapReasons,
    timestamp: new Date().toISOString()
  });
}
