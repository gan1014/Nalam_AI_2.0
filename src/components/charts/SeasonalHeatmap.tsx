'use client';
import React from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const riskData: { [key: string]: number[] } = {
  dengue: [1, 1, 2, 2, 3, 4, 8, 10, 9, 7, 5, 3],
  scrub_typhus: [3, 2, 1, 1, 1, 2, 3, 5, 7, 9, 10, 6],
  gastroenteritis: [2, 3, 5, 8, 10, 7, 4, 3, 2, 3, 4, 2],
  heat_stroke: [1, 2, 6, 10, 10, 8, 4, 2, 1, 1, 1, 1],
  respiratory: [10, 8, 5, 3, 2, 1, 1, 2, 4, 6, 9, 10]
};

export default function SeasonalHeatmap({ disease = 'dengue' }: { disease?: string }) {
  const data = riskData[disease] || riskData.dengue;

  const getColor = (val: number) => {
    if (val >= 8) return 'bg-red-500';
    if (val >= 5) return 'bg-orange-500';
    if (val >= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-2 mb-4">
        {months.map((m, i) => (
          <div key={m} className="text-center">
            <div className={`h-16 rounded-lg mb-2 shadow-inner transition-all hover:scale-105 cursor-pointer ${getColor(data[i])}`}></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">{m}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-xs text-gray-400 font-bold uppercase">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="text-xs text-gray-400 font-bold uppercase">Watch</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span className="text-xs text-gray-400 font-bold uppercase">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-xs text-gray-400 font-bold uppercase">Critical</span>
        </div>
      </div>
    </div>
  );
}
