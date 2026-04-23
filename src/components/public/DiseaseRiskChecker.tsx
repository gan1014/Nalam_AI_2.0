'use client';
import React, { useState } from 'react';
import { ShieldAlert, Download, Navigation, ShieldCheck, AlertTriangle } from 'lucide-react';
import { tnDistricts, tnDistrictsTamil } from '@/lib/district-data';
import Link from 'next/link';

export default function DiseaseRiskChecker() {
  const [district, setDistrict] = useState('');
  const [disease, setDisease] = useState('dengue');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkRisk = async () => {
    if (!district) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/predictions?district=${district}&disease=${disease}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'CRITICAL': return 'bg-gov-red text-white border-red-900';
      case 'HIGH': return 'bg-gov-orange text-white border-orange-900';
      case 'WATCH': return 'bg-gov-yellow text-gov-dark border-yellow-700';
      case 'LOW': return 'bg-gov-green text-white border-green-900';
      default: return 'bg-gray-200 text-gray-800 border-gray-400';
    }
  };

  const getRiskLabelTamil = (level: string) => {
    switch(level) {
      case 'CRITICAL': return 'மிக அதிக ஆபத்து';
      case 'HIGH': return 'அதிக ஆபத்து';
      case 'WATCH': return 'கண்காணிப்பு';
      case 'LOW': return 'குறைந்த ஆபத்து';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gov-navy text-white p-6 border-b-4 border-gov-gold">
        <h2 className="text-2xl font-bold font-tamil mb-1 flex items-center gap-2">
          <ShieldAlert /> நோய் அபாய சரிபார்ப்பு
        </h2>
        <h3 className="text-lg font-medium text-white/90">Disease Risk Checker</h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gov-gray mb-2">District (மாவட்டம்)</label>
            <select 
              value={district} onChange={e => setDistrict(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-teal outline-none"
            >
              <option value="" disabled>Select your district</option>
              {tnDistricts.map((d, i) => (
                <option key={d} value={d}>{d} - {tnDistrictsTamil[i]}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-gov-gray mb-2">Disease (நோய்)</label>
            <select 
              value={disease} onChange={e => setDisease(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-teal outline-none"
            >
              <option value="dengue">டெங்கு (Dengue)</option>
              <option value="scrub_typhus">ஸ்க்ரப் டைபஸ் (Scrub Typhus)</option>
              <option value="gastroenteritis">குடல் அழற்சி (Gastroenteritis)</option>
              <option value="heat_stroke">வெப்ப அடிப்பு (Heat Stroke)</option>
              <option value="respiratory">சுவாச நோய் (Respiratory)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={checkRisk} disabled={!district || loading}
          className="w-full py-4 bg-gov-teal text-white rounded-lg font-bold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-md"
        >
          {loading ? 'சரிபார்க்கிறது...' : 'சரிபார்க்கவும் / Check Risk'}
        </button>

        {result && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className={`inline-block px-6 py-2 rounded-full font-bold text-lg uppercase tracking-wider mb-4 border-2 ${getRiskColor(result.risk_level)}`}>
              {result.risk_level} / {getRiskLabelTamil(result.risk_level)}
            </div>
            
            <div className="mb-6">
              <h4 className="text-2xl font-bold text-gov-navy">{result.lstm_forecast.p50} cases predicted in next 14 days</h4>
              <p className="text-gray-600">LSTM Forecast: {result.lstm_forecast.p05} – {result.lstm_forecast.p95} cases (95% confidence)</p>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden flex">
              <div className="bg-gov-green h-full transition-all" style={{width: `${result.probability.LOW * 100}%`}}></div>
              <div className="bg-gov-yellow h-full transition-all" style={{width: `${result.probability.WATCH * 100}%`}}></div>
              <div className="bg-gov-orange h-full transition-all" style={{width: `${result.probability.HIGH * 100}%`}}></div>
              <div className="bg-gov-red h-full transition-all" style={{width: `${result.probability.CRITICAL * 100}%`}}></div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <h5 className="font-bold text-gov-navy mb-3 text-sm uppercase">Top Risk Factors (முக்கிய காரணங்கள்)</h5>
              <ul className="space-y-3">
                {result.shap_reasons.map((reason: any, idx: number) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <AlertTriangle className="text-gov-orange shrink-0 mt-0.5" size={16} />
                    <div>
                      <p className="font-bold text-sm text-gray-800 font-tamil">{reason.value_tamil}</p>
                      <p className="text-xs text-gray-500">{reason.value_english}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#sms" className="flex-1 bg-gov-navy text-white py-3 rounded text-center font-bold text-sm hover:bg-blue-900 transition-colors">
                Subscribe to SMS Alerts
              </a>
              <Link href="/public-portal/phc-finder" className="flex-1 bg-gov-blue text-white py-3 rounded text-center font-bold text-sm hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                <Navigation size={16} /> Find Nearest PHC
              </Link>
              <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded font-bold text-sm hover:bg-gray-50">
                <Download size={16} /> Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
