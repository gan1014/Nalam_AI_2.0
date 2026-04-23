'use client';
import React from 'react';

const StatsTicker = () => {
  const stats = [
    { label: 'Citizens Protected', value: '77M+', icon: '🛡' },
    { label: 'Districts Monitored', value: '38', icon: '📍' },
    { label: 'Advance Warning', value: '21 Days', icon: '⚡', color: 'text-gov-teal' },
    { label: 'Alerts Sent Today', value: '1,248', icon: '📱' },
    { label: 'Model Accuracy', value: '94.67%', icon: '🎯', color: 'text-gov-gold' },
    { label: 'LSTM MAPE', value: '0.19', icon: '📈' },
    { label: 'Diseases Tracked', value: '5', icon: '🦠' },
    { label: 'Data Streams', value: '8', icon: '📡' },
  ];

  return (
    <div className="bg-[#0a0f18] text-slate-300 py-3 border-y border-white/5 overflow-hidden relative group">
      <div className="flex animate-[scroll_40s_linear_infinite] group-hover:[animation-play-state:paused]">
        <div className="flex gap-16 whitespace-nowrap px-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg">{stat.icon}</span>
              <div className="flex items-center gap-2">
                <span className={`font-black text-sm tracking-tight ${stat.color || 'text-white'}`}>{stat.value}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex gap-16 whitespace-nowrap px-8">
          {stats.map((stat, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3">
              <span className="text-lg">{stat.icon}</span>
              <div className="flex items-center gap-2">
                <span className={`font-black text-sm tracking-tight ${stat.color || 'text-white'}`}>{stat.value}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default StatsTicker;
