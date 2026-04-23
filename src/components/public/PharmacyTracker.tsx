'use client';

import React, { useState } from 'react';
import { Pill, MapPin, Search, Navigation, AlertCircle, Phone, Info, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ESSENTIAL_MEDICINES, TN_PHARMACIES, Medicine, Pharmacy } from '@/lib/pharmacy-data';
import { tnDistricts } from '@/lib/district-data';

export default function PharmacyTracker() {
  const [activeTab, setActiveTab] = useState<'medicines' | 'pharmacies' | 'free'>('medicines');
  const [diseaseFilter, setDiseaseFilter] = useState('all');
  const [district, setDistrict] = useState('Chennai');

  const filteredMedicines = ESSENTIAL_MEDICINES.filter(m => 
    diseaseFilter === 'all' || m.disease === diseaseFilter || m.disease === 'all'
  );

  const diseaseTabs = [
    { id: 'all', label: 'All', icon: '💊' },
    { id: 'dengue', label: 'Dengue', icon: '🦟' },
    { id: 'scrub_typhus', label: 'Scrub Typhus', icon: '🌿' },
    { id: 'gastroenteritis', label: 'Gastro', icon: '💧' },
    { id: 'heat_stroke', label: 'Heat Stroke', icon: '☀' },
    { id: 'respiratory', label: 'Respiratory', icon: '🫁' }
  ];

  return (
    <div className="w-full bg-gov-offwhite min-h-screen pb-12">
      {/* Header */}
      <div className="bg-gov-navy text-white py-12 text-center border-b-[6px] border-gov-gold relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-tamil mb-2">மருந்து இருப்பு மற்றும் மருந்தகங்கள்</h1>
          <h2 className="text-xl text-white/90 font-medium max-w-2xl mx-auto px-4">
            Statewide Medicine Tracker & Pharmacy Locator
          </h2>
          <p className="text-gov-gold mt-4 font-semibold">Live TNMSC Stock Integration • Directing Citizens to Free Healthcare</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-6 relative z-20">
        
        {/* Main Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <button 
              onClick={() => setActiveTab('medicines')}
              className={`flex-1 py-4 px-6 font-bold text-center transition-colors ${activeTab === 'medicines' ? 'bg-gov-blue text-white' : 'hover:bg-gray-50 text-gov-navy'}`}
            >
              Medicine Availability
              <div className="text-xs font-tamil mt-1 font-normal opacity-80">மருந்து கிடைக்கும் தன்மை</div>
            </button>
            <button 
              onClick={() => setActiveTab('pharmacies')}
              className={`flex-1 py-4 px-6 font-bold text-center transition-colors ${activeTab === 'pharmacies' ? 'bg-gov-blue text-white' : 'hover:bg-gray-50 text-gov-navy'}`}
            >
              Find Pharmacy
              <div className="text-xs font-tamil mt-1 font-normal opacity-80">மருந்தகம் கண்டுபிடி</div>
            </button>
            <button 
              onClick={() => setActiveTab('free')}
              className={`flex-1 py-4 px-6 font-bold text-center transition-colors ${activeTab === 'free' ? 'bg-gov-blue text-white' : 'hover:bg-gray-50 text-gov-navy'}`}
            >
              Government Free Medicines
              <div className="text-xs font-tamil mt-1 font-normal opacity-80">இலவச மருந்துகள்</div>
            </button>
          </div>

          {/* TAB 1: MEDICINES */}
          {activeTab === 'medicines' && (
            <div className="p-6">
              {/* Disease Filters */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {diseaseTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDiseaseFilter(tab.id)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
                      diseaseFilter === tab.id
                      ? 'bg-gov-teal text-white ring-2 ring-offset-2 ring-gov-teal'
                      : 'bg-white border border-gray-300 text-gov-gray hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.icon}</span> {tab.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMedicines.map(med => (
                  <div key={med.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-5 flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-100 text-gov-blue border border-blue-200 uppercase tracking-wider">
                          {med.category}
                        </span>
                        {med.government_free ? (
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-gov-green/10 text-gov-green border border-gov-green/20 flex items-center gap-1">
                            <CheckCircle2 size={12} /> GOV FREE
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200">
                            Private: ₹{med.price_private_inr}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gov-navy mb-1">{med.name}</h3>
                      <h4 className="text-sm font-tamil text-gov-teal mb-3">{med.name_tamil}</h4>
                      
                      <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">{med.description}</p>

                      {/* Stock Gauge */}
                      <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-gov-gray">Statewide Stock Status:</span>
                          <span className={
                            med.stock_state === 'ADEQUATE' ? 'text-gov-green' :
                            med.stock_state === 'LOW' ? 'text-gov-orange' : 'text-gov-red'
                          }>
                            {med.stock_state} ({med.stock_pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full ${
                              med.stock_state === 'ADEQUATE' ? 'bg-gov-green' :
                              med.stock_state === 'LOW' ? 'bg-gov-orange' : 'bg-gov-red'
                            }`}
                            style={{ width: `${med.stock_pct}%` }}
                          ></div>
                        </div>
                        
                        {med.low_stock_districts.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            <span className="text-[10px] text-gray-500 mr-1 mt-0.5">Low in:</span>
                            {med.low_stock_districts.map(d => (
                              <span key={d} className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">
                                {d}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer accordion/info */}
                    <div className="bg-blue-50/50 p-4 border-t border-blue-100 text-sm">
                      <div className="font-bold text-gov-navy mb-2 flex items-center gap-2">
                        <MapPin size={16} className="text-gov-blue" /> Available At:
                      </div>
                      <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-1 text-xs">
                        {med.available_at.map((loc, i) => <li key={i}>{loc}</li>)}
                      </ul>
                      
                      <div className="flex items-start gap-2 bg-white p-3 rounded border border-blue-100">
                        <Info size={16} className="text-gov-teal mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gov-dark">{med.how_to_get}</p>
                          <p className="text-[11px] font-tamil text-gov-gray mt-1">{med.how_to_get_tamil}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PHARMACIES */}
          {activeTab === 'pharmacies' && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <select 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg font-medium outline-none focus:ring-2 focus:ring-gov-blue"
                  >
                    {tnDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
                <button className="px-6 py-3 bg-gov-teal text-white font-bold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                  <Navigation size={18} /> Near Me
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {TN_PHARMACIES.map(pharm => (
                  <div key={pharm.id} className="border border-gray-200 rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gov-navy text-lg">{pharm.name}</h3>
                      {pharm.type === 'government' ? (
                        <span className="bg-gov-gold/20 text-gov-orange border border-gov-gold px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                          GOVERNMENT
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-gov-blue border border-blue-100 px-2 py-1 rounded text-xs font-bold whitespace-nowrap uppercase">
                          {pharm.type}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-600 flex-grow">
                      <p className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" /> {pharm.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-gray-400">🕒</span> {pharm.hours}
                      </p>
                    </div>

                    {pharm.accepts_gov_prescription && (
                      <div className="bg-green-50 text-gov-green text-xs p-2 rounded mb-4 font-semibold flex items-center gap-2 border border-green-100">
                        <CheckCircle2 size={14} /> Accepts Government Prescriptions
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <a href={`tel:${pharm.phone}`} className="flex-1 text-center py-2 border border-gray-300 rounded font-semibold text-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Phone size={14} /> Call
                      </a>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${pharm.lat},${pharm.lng}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 bg-gov-navy text-white rounded font-semibold text-sm hover:bg-blue-900 flex items-center justify-center gap-2">
                        <Navigation size={14} /> Route
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GOVERNMENT FREE */}
          {activeTab === 'free' && (
            <div className="p-8">
              <div className="bg-gov-blue/5 border border-gov-blue/20 rounded-xl p-6 text-center mb-8">
                <ShieldCheck size={48} className="mx-auto text-gov-gold mb-4" />
                <h2 className="text-2xl font-bold text-gov-navy mb-2">Tamil Nadu Free Medicine Scheme</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  The Government of Tamil Nadu provides essential medicines completely free of cost to all citizens through Government Hospitals and Primary Health Centres (PHCs).
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gov-navy mb-4 border-b pb-2">Who is Eligible?</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3 items-start">
                      <CheckCircle2 className="text-gov-green shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">All citizens receiving treatment at Government Facilities</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle2 className="text-gov-green shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">Holders of Chief Minister's Comprehensive Health Insurance Scheme</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle2 className="text-gov-green shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">Pregnant women and infants (Muthulakshmi Reddy Scheme)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gov-navy mb-4 border-b pb-2">How to Avail (எப்படி பெறுவது)</h3>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="bg-gov-blue text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">1</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Visit nearest PHC or Govt Hospital</p>
                        <p className="text-xs text-gray-500 font-tamil mt-1">அருகிலுள்ள அரசு மருத்துவமனை செல்லுங்கள்</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="bg-gov-blue text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">2</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Get an OPD Token (Free)</p>
                        <p className="text-xs text-gray-500 font-tamil mt-1">இலவச OPD டோக்கன் பெறுங்கள்</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="bg-gov-blue text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">3</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Consult Doctor & Collect from Pharmacy</p>
                        <p className="text-xs text-gray-500 font-tamil mt-1">மருத்துவரை அணுகி மருந்தகத்தில் பெறுங்கள்</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button onClick={() => setActiveTab('pharmacies')} className="bg-gov-navy text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-900 transition-colors">
                  Find Nearest Government Pharmacy
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
