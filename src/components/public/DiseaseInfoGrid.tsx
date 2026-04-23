'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, AlertCircle, Info, Beaker } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const diseases = [
  {
    id: 'dengue',
    name: 'Dengue',
    name_ta: 'டெங்கு',
    risk: 'High',
    color: 'text-red-500',
    symptoms: ['High Fever (கடுமையான காய்ச்சல்)', 'Headache (தலைவலி)', 'Joint Pain (மூட்டு வலி)', 'Skin Rash (சொறி)'],
    prevention: ['Remove stagnant water', 'Use mosquito nets', 'Wear full sleeves'],
    testing: 'NS1 Rapid Test — FREE at all PHCs',
    insight: 'Rainfall 2 weeks ago is the strongest predictor for current surge.'
  },
  {
    id: 'scrub_typhus',
    name: 'Scrub Typhus',
    name_ta: 'ஸ்க்ரப் டைபஸ்',
    risk: 'Moderate',
    color: 'text-orange-500',
    symptoms: ['Fever with chills', 'Eschar (black mark on skin)', 'Body aches', 'Cough'],
    prevention: ['Avoid tall grass/scrub', 'Wash clothes after field work', 'Use insect repellent'],
    testing: 'Weil-Felix Test available at Govt Hospitals',
    insight: 'Harvest season increases field worker exposure to mites.'
  },
  {
    id: 'gastro',
    name: 'Gastroenteritis',
    name_ta: 'வயிற்றுப்போக்கு',
    risk: 'Low',
    color: 'text-green-500',
    symptoms: ['Vomiting', 'Diarrhea', 'Stomach cramps', 'Dehydration'],
    prevention: ['Boil water before drinking', 'Wash hands before food', 'Avoid street food'],
    testing: 'Stool culture at any PHC',
    insight: 'Temperature spikes above 38°C correlate with water contamination.'
  },
  {
    id: 'heat_stroke',
    name: 'Heat Stroke',
    name_ta: 'வெப்ப அடிப்பு',
    risk: 'Seasonal',
    color: 'text-yellow-500',
    symptoms: ['High body temp (>104°F)', 'Confusion', 'Rapid pulse', 'Dry skin'],
    prevention: ['Drink ORS/Buttermilk', 'Avoid 12pm-4pm sun', 'Wear cotton clothes'],
    testing: 'Clinical assessment at nearest PHC',
    insight: 'Humidity + Temperature index (Heat Index) is critical for under-15s.'
  },
  {
    id: 'respiratory',
    name: 'Respiratory Illness',
    name_ta: 'சுவாச நோய்',
    risk: 'Moderate',
    color: 'text-blue-500',
    symptoms: ['Persistent cough', 'Sore throat', 'Chest tightness', 'Wheezing'],
    prevention: ['Wear masks in crowds', 'Avoid smoke/dust', 'Regular vaccination'],
    testing: 'X-Ray & Sputum test at Govt Hospitals',
    insight: 'PM2.5 levels during festival periods trigger asthma clusters.'
  }
];

const DiseaseInfoGrid = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {diseases.map((d) => (
        <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <button 
            onClick={() => setExpanded(expanded === d.id ? null : d.id)}
            className="p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 ${d.color}`}>
                <Beaker size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gov-navy flex items-center gap-2">
                  {d.name} <span className="font-tamil text-xs opacity-60">{d.name_ta}</span>
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current ${d.color}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${d.color}`}>
                    Current Risk: {d.risk}
                  </span>
                </div>
              </div>
            </div>
            {expanded === d.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </button>

          <AnimatePresence>
            {expanded === d.id && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-6 space-y-5 border-t border-gray-50 pt-5 bg-gray-50/50">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gov-gray uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle size={12} /> Symptoms | அறிகுறிகள்
                    </p>
                    <ul className="grid grid-cols-1 gap-1">
                      {d.symptoms.map(s => (
                        <li key={s} className="text-xs text-gov-navy flex items-start gap-2">
                          <span className="text-gov-teal">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gov-gray uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={12} /> Prevention | தடுப்பு
                    </p>
                    <ul className="grid grid-cols-1 gap-1">
                      {d.prevention.map(p => (
                        <li key={p} className="text-xs text-gov-navy flex items-start gap-2">
                          <span className="text-gov-teal">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gov-teal uppercase tracking-widest flex items-center gap-2 mb-1">
                      <Info size={12} /> AI Insight
                    </p>
                    <p className="text-[11px] text-gov-navy font-medium leading-relaxed italic">
                      "{d.insight}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default DiseaseInfoGrid;
