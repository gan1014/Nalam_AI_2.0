'use client';
import React, { useState } from 'react';
import { Package, Download, Mail, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { tnDistricts } from '@/lib/district-data';

export default function ResourceMobilisationPage() {
  const [district, setDistrict] = useState('Chennai');
  const [disease, setDisease] = useState('dengue');
  const predictedCases = 287; // Mock for demo based on prompt
  const wardCount = 15; // Mock

  const resources = [
    { name: 'Isolation Beds', calc: `${predictedCases} × 15%`, req: Math.ceil(predictedCases * 0.15), cur: 28, unit: 'beds', action: 'REQUEST' },
    { name: 'Dengue NS1 Kits', calc: `${predictedCases} × 120%`, req: Math.ceil(predictedCases * 1.2), cur: 450, unit: 'kits', action: 'OK' },
    { name: 'IV Fluid Bags', calc: `${Math.ceil(predictedCases * 0.15)} × 2`, req: Math.ceil(predictedCases * 0.15) * 2, cur: 120, unit: 'bags', action: 'OK' },
    { name: 'Doctors (additional)', calc: `⌈${Math.ceil(predictedCases * 0.15)}÷8⌉`, req: Math.ceil(Math.ceil(predictedCases * 0.15) / 8), cur: 2, unit: 'doctors', action: 'DEPLOY' },
    { name: 'Nurses (additional)', calc: `⌈${Math.ceil(predictedCases * 0.15)}÷4⌉`, req: Math.ceil(Math.ceil(predictedCases * 0.15) / 4), cur: 8, unit: 'nurses', action: 'DEPLOY' },
    { name: 'Fumigation Teams', calc: `⌈${wardCount}÷15⌉`, req: Math.ceil(wardCount / 1.5), cur: 5, unit: 'teams', action: 'ACTIVATE' }, // Simplified calc for display
    { name: 'Rapid Test Kits', calc: `${predictedCases} × 120%`, req: Math.ceil(predictedCases * 1.2), cur: 200, unit: 'kits', action: 'PROCURE' },
    { name: 'ORS Sachets', calc: `${predictedCases} × 5`, req: predictedCases * 5, cur: 2000, unit: 'sachets', action: 'OK' },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Package className="text-gov-gold" /> Resource Mobilisation Calculator
          </h1>
          <p className="text-gray-400 font-tamil">வள இயக்கம் கணிப்பாளர்</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-gov-card border border-gov-border text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-white/5 transition-colors text-sm">
            <Download size={16} /> Download PDF
          </button>
          <button className="bg-gov-card border border-gov-border text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-white/5 transition-colors text-sm">
            <Mail size={16} /> Send to Collector
          </button>
          <button className="bg-[#25D366] text-white font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-[#128C7E] transition-colors text-sm">
            <MessageSquare size={16} /> Share WhatsApp
          </button>
        </div>
      </div>

      <div className="bg-gov-card border border-gov-border rounded-xl p-6 shadow-lg mb-8">
        <div className="flex gap-4 mb-6">
          <select 
            value={district} onChange={e => setDistrict(e.target.value)}
            className="flex-1 p-3 bg-[#0d1421] border border-gov-border rounded-lg text-white font-medium outline-none focus:ring-1 focus:ring-gov-teal"
          >
            {tnDistricts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select 
            value={disease} onChange={e => setDisease(e.target.value)}
            className="flex-1 p-3 bg-[#0d1421] border border-gov-border rounded-lg text-white font-medium outline-none focus:ring-1 focus:ring-gov-teal"
          >
            <option value="dengue">Dengue</option>
            <option value="scrub_typhus">Scrub Typhus</option>
          </select>
        </div>

        <div className="bg-gov-blue/10 border border-gov-blue/30 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="text-gov-blue" />
          <p className="text-blue-100 font-medium">Based on <strong className="text-white text-lg">{predictedCases}</strong> predicted cases in next 14 days (LSTM p50).</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-[#0d1421] text-gray-400 border-b border-gov-border">
              <tr>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Calculation</th>
                <th className="px-6 py-4 text-white">Required</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Gap</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r, i) => {
                const gap = r.cur - r.req;
                const isPositive = gap >= 0;
                
                return (
                  <tr key={i} className="border-b border-gov-border/50 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{r.name}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{r.calc}</td>
                    <td className="px-6 py-4 font-bold text-white">{r.req} <span className="text-gray-500 font-normal text-xs">{r.unit}</span></td>
                    <td className="px-6 py-4">{r.cur} <span className="text-gray-500 font-normal text-xs">{r.unit}</span></td>
                    <td className={`px-6 py-4 font-bold ${isPositive ? 'text-gov-green' : 'text-gov-red'}`}>
                      {isPositive ? `+${gap}` : gap}
                    </td>
                    <td className="px-6 py-4">
                      {isPositive ? (
                        <span className="flex items-center gap-1 text-gov-green text-xs font-bold px-2 py-1 bg-gov-green/10 rounded w-fit">
                          <CheckCircle2 size={12} /> ADEQUATE
                        </span>
                      ) : (
                        <button className="text-xs font-bold px-3 py-1.5 bg-gov-red text-white hover:bg-red-700 transition-colors rounded shadow-sm">
                          {r.action}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
