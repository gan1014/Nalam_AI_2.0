'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Map, Layers, Download, Filter } from 'lucide-react';
import { tnDistricts } from '@/lib/district-data';

const DynamicMap = dynamic(() => import('@/components/dashboard/DynamicMap'), { ssr: false });

export default function RiskMapPage() {
  const [district, setDistrict] = useState('Chennai');
  const [disease, setDisease] = useState('dengue');

  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Map className="text-gov-teal" /> Interactive Risk Map
          </h1>
          <p className="text-gray-400">High-resolution choropleth mapping of disease risk down to the ward level.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={district} onChange={e => setDistrict(e.target.value)}
            className="bg-gov-card border border-gov-border text-white rounded p-2 focus:ring-1 focus:ring-gov-teal outline-none"
          >
            <option value="All">All Tamil Nadu</option>
            {tnDistricts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select 
            value={disease} onChange={e => setDisease(e.target.value)}
            className="bg-gov-card border border-gov-border text-white rounded p-2 focus:ring-1 focus:ring-gov-teal outline-none"
          >
            <option value="dengue">Dengue</option>
            <option value="scrub_typhus">Scrub Typhus</option>
            <option value="gastroenteritis">Gastroenteritis</option>
            <option value="heat_stroke">Heat Stroke</option>
            <option value="respiratory">Respiratory</option>
          </select>
          <button className="bg-gov-teal text-white font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-teal-600 transition-colors shadow-md">
            <Download size={16} /> Export GIS
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gov-card border border-gov-border rounded-xl shadow-lg relative flex overflow-hidden">
        
        {/* Dynamic Map Area */}
        <div className="flex-1 relative bg-[#0a101a]">
          <DynamicMap />
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
            <button className="w-10 h-10 bg-gov-dark border border-gov-border rounded-lg flex items-center justify-center text-white hover:bg-gov-blue transition-colors shadow-md">
              <Layers size={20} />
            </button>
            <button className="w-10 h-10 bg-gov-dark border border-gov-border rounded-lg flex items-center justify-center text-white hover:bg-gov-blue transition-colors shadow-md">
              <Filter size={20} />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-gov-dark border border-gov-border rounded-lg p-4 shadow-xl backdrop-blur-md z-[400]">
            <h4 className="text-white font-bold text-sm mb-3">Risk Level</h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-sm bg-gov-red"></span> Critical (&gt;80%)</div>
              <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-sm bg-gov-orange"></span> High (50-80%)</div>
              <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-sm bg-gov-yellow"></span> Watch (20-50%)</div>
              <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-sm bg-gov-green"></span> Low (&lt;20%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
