'use client';
import React from 'react';
import { ExternalLink, Phone, ShieldPlus, Heart, Hospital, Pill } from 'lucide-react';

const schemes = [
  {
    name: 'CMCHIS - Health Insurance',
    name_ta: 'முதலமைச்சரின் விரிவான மருத்துவக் காப்பீடு',
    desc: 'Up to ₹5 Lakhs per family for life-saving treatments.',
    icon: <ShieldPlus className="text-blue-500" />,
    contact: '1800 425 3993'
  },
  {
    name: '108 Free Ambulance',
    name_ta: '108 இலவச ஆம்புலன்ஸ் சேவை',
    desc: 'Immediate emergency transport to nearest trauma care.',
    icon: <Phone className="text-red-500" />,
    contact: '108'
  },
  {
    name: '104 Health Helpline',
    name_ta: '104 சுகாதார உதவி மையம்',
    desc: 'Medical advice, counseling, and hospital information.',
    icon: <Heart className="text-pink-500" />,
    contact: '104'
  },
  {
    name: 'Makkalai Thedi Maruthuvam',
    name_ta: 'மக்களைத் தேடி மருத்துவம்',
    desc: 'Doorstep delivery of NCD drugs and diagnostics.',
    icon: <Hospital className="text-gov-teal" />,
    contact: 'Visit Nearest PHC'
  }
];

const GovSchemes = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {schemes.map((scheme) => (
        <div key={scheme.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {scheme.icon}
          </div>
          <h3 className="text-sm font-bold text-gov-navy leading-tight">{scheme.name}</h3>
          <p className="text-[10px] text-slate-500 font-tamil mt-1">{scheme.name_ta}</p>
          <p className="text-[11px] text-gov-gray mt-3 leading-relaxed">{scheme.desc}</p>
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-gov-navy">{scheme.contact}</span>
            <ExternalLink size={14} className="text-gov-teal opacity-40 group-hover:opacity-100" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GovSchemes;
