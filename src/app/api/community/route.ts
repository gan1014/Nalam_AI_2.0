import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { district, ward, symptoms, duration, affectedCount } = body;

    // In a real app, save to Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      try {
        await supabase.from('community_reports').insert([
          { district, ward, symptoms, duration, affected_count: affectedCount }
        ]);
      } catch (e) {
        console.error("Supabase insert failed:", e);
      }
    }

    // Determine if this triggers a cluster alert
    // If >= 3 people affected, or duration >= 5 days with fever, trigger cluster
    let isCluster = false;
    if (affectedCount >= 3 || (duration >= 5 && symptoms.includes('fever'))) {
      isCluster = true;
    }

    return NextResponse.json({
      success: true,
      reference_id: `NALAM-${Math.floor(Math.random() * 90000) + 10000}`,
      district_report_count_24h: Math.floor(Math.random() * 50) + 12,
      cluster_alert_triggered: isCluster,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
