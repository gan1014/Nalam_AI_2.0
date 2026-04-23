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
import { generateForecastData } from '@/lib/forecast-data';

interface ForecastChartProps {
  disease: string;
}

const CustomForecastTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gov-dark text-white p-3 rounded shadow-lg border border-gov-border text-sm">
        <p className="font-bold mb-2 text-gov-gold">{label}</p>
        <p className="text-gray-300">
          <span className="inline-block w-3 h-3 bg-gov-teal opacity-30 mr-2 rounded-full"></span>
          95% CI Range: {payload[0]?.value} - {payload[2]?.value}
        </p>
        <p className="text-white font-semibold mt-1">
          <span className="inline-block w-3 h-3 bg-gov-teal mr-2 rounded-full"></span>
          Median Forecast: {payload[1]?.value} cases
        </p>
      </div>
    );
  }
  return null;
};

const ForecastChart = ({ disease }: ForecastChartProps) => {
  const data = generateForecastData(disease);

  return (
    <div className="w-full flex flex-col">
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <defs>
            <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00b4a6" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#00b4a6" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#243044" vertical={false}/>
          <XAxis dataKey="date" stroke="#4a5568" tick={{ fill: '#94a3b8', fontSize: 11 }}
                 angle={-35} textAnchor="end" height={60}/>
          <YAxis stroke="#4a5568" tick={{ fill: '#94a3b8', fontSize: 11 }}
                 label={{ value: 'Predicted Cases', angle: -90, position: 'insideLeft',
                          fill: '#94a3b8', fontSize: 11 }}/>
          <Tooltip content={<CustomForecastTooltip/>}/>
          <Area type="monotone" dataKey="p95" fill="url(#ciGradient)" stroke="#00b4a6"
                strokeWidth={1} strokeDasharray="4 2" dot={false} name="95th Percentile"/>
          <Area type="monotone" dataKey="p05" fill="#0d1421" stroke="#00b4a6"
                strokeWidth={1} strokeDasharray="4 2" dot={false} fillOpacity={1} name="5th Percentile"/>
          <Line type="monotone" dataKey="p50" stroke="#00e5d4" strokeWidth={3}
                dot={{ fill: '#00e5d4', r: 4, strokeWidth: 2, stroke: '#0d1421' }}
                activeDot={{ r: 7, fill: '#00e5d4' }} name="Median Forecast"/>
          <ReferenceLine y={data[0]?.threshold} stroke="#ef4444" strokeDasharray="8 4"
                         strokeWidth={2} label={{ value: '⚠ HIGH threshold', 
                         fill: '#ef4444', fontSize: 11, position: 'right' }}/>
          <Legend wrapperStyle={{ paddingTop: '20px', color: '#94a3b8' }}/>
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* 3 summary stat cards in grid */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-gov-card border border-gov-border rounded-lg p-4 text-center">
          <p className="text-gov-gray text-xs font-semibold uppercase mb-1">Peak Prediction</p>
          <p className="text-white text-2xl font-bold">{data[6]?.p95}</p>
          <p className="text-gov-red text-xs mt-1">Expected {data[6]?.date}</p>
        </div>
        <div className="bg-gov-card border border-gov-border rounded-lg p-4 text-center">
          <p className="text-gov-gray text-xs font-semibold uppercase mb-1">Median (Day 14)</p>
          <p className="text-gov-teal text-2xl font-bold">{data[13]?.p50}</p>
          <p className="text-gov-offwhite text-xs mt-1">Sustained level</p>
        </div>
        <div className="bg-gov-card border border-gov-border rounded-lg p-4 text-center">
          <p className="text-gov-gray text-xs font-semibold uppercase mb-1">Model Confidence</p>
          <p className="text-gov-gold text-2xl font-bold">95% CI</p>
          <p className="text-gov-offwhite text-xs mt-1">XGBoost + LSTM</p>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;
