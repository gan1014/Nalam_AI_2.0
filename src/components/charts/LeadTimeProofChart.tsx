'use client';
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { leadTimeTimelineData } from '@/lib/forecast-data';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gov-dark text-white p-3 rounded shadow-lg border border-gov-border text-sm">
        <p className="font-bold mb-2 text-gov-gold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-semibold mt-1 flex items-center">
            <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: {entry.value} {entry.name.includes('Probability') ? '%' : 'cases'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const LeadTimeProofChart = () => {
  return (
    <div className="w-full flex flex-col">
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={leadTimeTimelineData} margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a5568" stopOpacity={0.6}/>
              <stop offset="100%" stopColor="#4a5568" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="leadTimeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00e5d4" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#243044" vertical={false}/>
          
          <XAxis dataKey="week" stroke="#4a5568" tick={{ fill: '#94a3b8', fontSize: 11 }}/>
          
          {/* Left Y-Axis for Cases */}
          <YAxis yAxisId="left" stroke="#4a5568" tick={{ fill: '#94a3b8', fontSize: 11 }}
                 label={{ value: 'Cases', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}/>
          
          {/* Right Y-Axis for Probability */}
          <YAxis yAxisId="right" orientation="right" stroke="#4a5568" tick={{ fill: '#94a3b8', fontSize: 11 }}
                 domain={[0, 100]}
                 label={{ value: 'Surge Probability %', angle: 90, position: 'insideRight', fill: '#00e5d4', fontSize: 11 }}/>
          
          <Tooltip content={<CustomTooltip/>}/>
          <Legend wrapperStyle={{ paddingTop: '10px', color: '#94a3b8' }}/>

          {/* Actual Cases Area */}
          <Area yAxisId="left" type="monotone" dataKey="actual" fill="url(#actualGradient)" stroke="#94a3b8" 
                name="Actual True Cases" />
          
          {/* Nalam AI Probability Line */}
          <Line yAxisId="right" type="monotone" dataKey="nalamp" stroke="#00e5d4" strokeWidth={3} 
                dot={false} activeDot={{ r: 6 }} name="Nalam AI Probability %" />
          
          {/* ARIMA Baseline Line */}
          <Line yAxisId="left" type="stepAfter" dataKey="arima" stroke="#f57f17" strokeWidth={2} 
                strokeDasharray="5 5" name="ARIMA Baseline" connectNulls />

          {/* IDSP Reported Line */}
          <Line yAxisId="left" type="monotone" dataKey="idsp" stroke="#3b82f6" strokeWidth={2} 
                strokeDasharray="4 2" name="IDSP Reported (Delayed)" connectNulls />

          {/* Vertical Reference Lines */}
          <ReferenceLine yAxisId="left" x="W39" stroke="#10b981" strokeWidth={2} 
                         label={{ value: '✓ Nalam AI: W39', fill: '#10b981', fontSize: 11, position: 'insideTopLeft' }} />
          <ReferenceLine yAxisId="left" x="W45" stroke="#f57f17" strokeWidth={1} strokeDasharray="6 3"
                         label={{ value: 'ARIMA: W45 (+6w)', fill: '#f57f17', fontSize: 11, position: 'insideTopLeft' }} />
          <ReferenceLine yAxisId="left" x="W47" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 2"
                         label={{ value: 'IDSP visible: W47 (+8w)', fill: '#ef4444', fontSize: 11, position: 'insideTopLeft' }} />
                         
          {/* Shaded Region W39 -> W47 approximation using a custom reference area if supported, 
              but since it's tricky in composed chart, the gradient and vertical lines suffice visually. */}
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* 3 impact cards in grid */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-gov-card border border-gov-green/50 rounded-lg p-4 text-center">
          <p className="text-gov-gray text-xs font-semibold uppercase mb-1">Earlier than IDSP</p>
          <p className="text-gov-green text-2xl font-bold">21 Days</p>
          <p className="text-gov-offwhite text-xs mt-1">Critical lead time</p>
        </div>
        <div className="bg-gov-card border border-gov-teal/50 rounded-lg p-4 text-center">
          <p className="text-gov-gray text-xs font-semibold uppercase mb-1">Earlier than ARIMA</p>
          <p className="text-gov-teal text-2xl font-bold">6 Weeks</p>
          <p className="text-gov-offwhite text-xs mt-1">Statistical baseline</p>
        </div>
        <div className="bg-gov-card border border-gov-blue/50 rounded-lg p-4 text-center">
          <p className="text-gov-gray text-xs font-semibold uppercase mb-1">Surge Timing Acc.</p>
          <p className="text-gov-blue text-2xl font-bold">91.2%</p>
          <p className="text-gov-offwhite text-xs mt-1">PS08 Target: 85%</p>
        </div>
      </div>
    </div>
  );
};

export default LeadTimeProofChart;
