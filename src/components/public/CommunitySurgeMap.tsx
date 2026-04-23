'use client';
import React from 'react';
import { Users, MapPin, Activity } from 'lucide-react';

const CommunitySurgeMap = () => {
  // Generate random dots around TN region for visual effect
  const dots = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${20 + Math.random() * 60}%`,
    left: `${30 + Math.random() * 40}%`,
    size: Math.random() > 0.7 ? 'w-4 h-4' : 'w-2 h-2',
    opacity: 0.3 + Math.random() * 0.7
  }));

  return (
    <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-2xl overflow-hidden relative min-h-[400px]">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            <Users className="text-gov-teal" size={20} /> Community Surge Map
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time symptom report clusters (24h)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-white font-bold">LIVE FEED</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      
      {/* Abstract TN Map Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <MapPin size={300} className="text-gov-teal" strokeWidth={0.5} />
      </div>

      {/* Surge Dots */}
      {dots.map(dot => (
        <div 
          key={dot.id}
          className={`absolute rounded-full bg-gov-teal shadow-[0_0_15px_rgba(0,180,166,0.6)] animate-pulse ${dot.size}`}
          style={{ top: dot.top, left: dot.left, opacity: dot.opacity }}
        />
      ))}

      <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl">
        <div className="flex items-start gap-3">
          <Activity className="text-gov-gold shrink-0 mt-1" size={16} />
          <p className="text-[11px] text-slate-300 leading-relaxed">
            <span className="font-bold text-white">Privacy Protected:</span> Clusters only display when 3+ independent reports are received within a 2km radius. Currently monitoring 1,248 active signals across 38 districts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunitySurgeMap;
