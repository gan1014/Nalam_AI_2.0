'use client';
import React, { useState } from 'react';
import ForecastChart from '@/components/charts/ForecastChart';
import SeasonalHeatmap from '@/components/charts/SeasonalHeatmap';
import { TrendingUp, Calendar, Filter } from 'lucide-react';
import { tnDistricts } from '@/lib/district-data';

export default function ForecastsPage() {
  const [disease, setDisease] = useState('dengue');
  const [district, setDistrict] = useState('Chennai');

  const diseases = [
    { id: 'dengue', name: 'Dengue' },
    { id: 'scrub_typhus', name: 'Scrub Typhus' },
    { id: 'gastroenteritis', name: 'Gastroenteritis' },
    { id: 'heat_stroke', name: 'Heat Stroke' },
    { id: 'respiratory', name: 'Respiratory' }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <TrendingUp className="text-gov-teal" /> Disease Forecasts
          </h1>
          <p className="text-gray-400">14-day advance predictions using LEIF v2 XGBoost + LSTM architecture.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={district} onChange={e => setDistrict(e.target.value)}
            className="bg-gov-card border border-gov-border text-white rounded p-2 focus:ring-1 focus:ring-gov-teal outline-none"
          >
            {tnDistricts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button className="bg-gov-card border border-gov-border text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-white/5 transition-colors">
            <Filter size={16} /> Filter Models
          </button>
        </div>
      </div>

      {/* Disease Tabs */}
      <div className="flex border-b border-gov-border mb-8 overflow-x-auto hide-scrollbar">
        {diseases.map(d => (
          <button
            key={d.id}
            onClick={() => setDisease(d.id)}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              disease === d.id 
                ? 'text-gov-teal border-b-2 border-gov-teal bg-gov-teal/5' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="bg-gov-card border border-gov-border rounded-xl p-6 shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">14-Day LSTM Case Projection</h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 bg-[#0d1421] px-3 py-1.5 rounded border border-gov-border">
            <span className="w-2 h-2 rounded-full bg-gov-teal animate-pulse"></span>
            LIVE MODEL
          </div>
        </div>
        
        <ForecastChart disease={disease} />
      </div>

      {/* Seasonal Matrix */}
      <div className="bg-gov-card border border-gov-border rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="text-gov-gold" /> Seasonal Risk Matrix
        </h2>
        <div className="p-4 border border-gov-border/50 rounded-xl bg-[#0d1421]">
          <SeasonalHeatmap disease={disease} />
        </div>
      </div>
    </div>
  );
}
