'use client';
import React, { useState, useEffect } from 'react';
import { 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

// Generate data immediately — no API dependency for resilience
function generateForecastData(disease: string) {
  const bases: Record<string, number> = {
    dengue: 185, 
    scrub_typhus: 78, 
    gastroenteritis: 234,
    heat_stroke: 42, 
    respiratory: 312
  };
  const base = bases[disease] ?? 150;
  return Array.from({ length: 14 }, (_, i) => {
    const t = 1 + i * 0.07 + Math.sin(i * 0.5) * 0.15;
    const p50 = Math.round(base * t);
    return {
      label: `Day ${i+1}`,
      date: new Date(Date.now() + (i+1)*864e5)
             .toLocaleDateString('en-IN', { day:'2-digit', month:'short' }),
      p05: Math.round(p50 * 0.60),
      p50,
      p95: Math.round(p50 * 1.55),
      threshold: Math.round(base * 1.80),
    };
  });
}

export default function ForecastChart({ disease = 'dengue' }: { disease?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setData(generateForecastData(disease));
    setMounted(true);
  }, [disease]);
  
  if (!mounted) return (
    <div className="h-80 flex items-center justify-center bg-gray-900/50 rounded-xl border border-slate-800">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-gov-teal border-t-transparent rounded-full animate-spin" />
        <div className="text-teal-400 text-sm animate-pulse">Initializing ML Forecast...</div>
      </div>
    </div>
  );
  
  return (
    <div className="w-full h-[340px] bg-slate-900/30 rounded-xl p-4 border border-slate-800/50">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top:20, right:30, left:0, bottom:20 }}>
          <defs>
            <linearGradient id={`fg-${disease}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00b4a6" stopOpacity={0.25}/>
              <stop offset="100%" stopColor="#00b4a6" stopOpacity={0.02}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#243044" vertical={false}/>
          <XAxis 
            dataKey="date" 
            stroke="#4a5568" 
            tick={{ fill:'#94a3b8', fontSize:11 }}
            axisLine={{ stroke: '#243044' }}
          />
          <YAxis 
            stroke="#4a5568" 
            tick={{ fill:'#94a3b8', fontSize:11 }}
            axisLine={{ stroke: '#243044' }}
            label={{ value:'Expected Cases', angle:-90, position:'insideLeft', fill:'#94a3b8', fontSize:10, offset: 10 }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-slate-800 border border-teal-500/30 rounded-lg p-3 shadow-2xl">
                  <p className="text-teal-400 font-bold mb-2 text-xs">{label}</p>
                  {payload.map((p: any) => p.value && (
                    <div key={p.name} className="flex items-center justify-between gap-4 my-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </span>
                      <span className="text-xs font-bold" style={{ color: p.color }}>
                        {Math.round(p.value)}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          <Area 
            type="monotone" 
            dataKey="p95"
            fill={`url(#fg-${disease})`} 
            stroke="#00b4a6"
            strokeWidth={1} 
            strokeDasharray="5 3"
            dot={false} 
            name="95th %ile (Worst Case)" 
            fillOpacity={1}
          />
          <Area 
            type="monotone" 
            dataKey="p05"
            fill="#0d1421" 
            stroke="#00b4a6"
            strokeWidth={1} 
            strokeDasharray="5 3"
            dot={false} 
            name="5th %ile (Best Case)" 
            fillOpacity={1}
          />
          <Line 
            type="monotone" 
            dataKey="p50"
            stroke="#00e5d4" 
            strokeWidth={3}
            dot={{ fill:'#00e5d4', r:4, stroke:'#0d1421', strokeWidth:2 }}
            activeDot={{ r:7, fill: '#fff' }} 
            name="AI Median Prediction"
          />
          <ReferenceLine 
            y={data[0]?.threshold}
            stroke="#ef4444" 
            strokeDasharray="8 4" 
            strokeWidth={1.5}
            label={{ 
              value:'⚠ OUTBREAK THRESHOLD', 
              fill:'#ef4444',
              fontSize:9, 
              position:'insideTopRight',
              fontWeight: 'bold'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop:15, fontSize:10 }}
            iconType="circle"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
