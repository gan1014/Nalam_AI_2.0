'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, MapPin, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { tnDistricts, tnDistrictsTamil } from '@/lib/district-data';

const SYMPTOMS = [
  { id: 'fever', en: 'Fever (38°C+)', ta: 'காய்ச்சல் (38°C+)' },
  { id: 'headache', en: 'Severe Headache', ta: 'கடுமையான தலைவலி' },
  { id: 'joint_pain', en: 'Joint/Body Pain', ta: 'மூட்டு/எலும்பு வலி' },
  { id: 'rash', en: 'Skin Rash', ta: 'சொறி/தடிப்பு' },
  { id: 'vomiting', en: 'Vomiting', ta: 'வாந்தி' },
  { id: 'diarrhea', en: 'Diarrhea', ta: 'வயிற்று போக்கு' },
  { id: 'breathless', en: 'Breathlessness', ta: 'மூச்சுத் திணறல்' },
  { id: 'fatigue', en: 'Extreme Fatigue', ta: 'சோர்வு' },
  { id: 'heat', en: 'Heat exposure', ta: 'வெப்பம்/சூரியன் தாக்கம்' },
  { id: 'cough', en: 'Persistent Cough', ta: 'தொடர் இருமல்' },
];

export default function CommunityReport() {
  const [step, setStep] = useState(1);
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState(2);
  const [affectedCount, setAffectedCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const submitReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district,
          ward,
          symptoms: selectedSymptoms,
          duration,
          affectedCount
        })
      });
      const data = await response.json();
      setResult(data);
      setStep(5); // Success step
    } catch (err) {
      console.error(err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gov-offwhite min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-tamil text-gov-navy mb-2">சமூக அறிகுறி அறிக்கை</h1>
          <h2 className="text-xl text-gov-blue font-bold mb-4">Community Symptom Report</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-gov-gray bg-white py-2 px-4 rounded-full shadow-sm inline-flex border border-gray-200">
            <ShieldCheck size={16} className="text-gov-green" />
            <span className="font-semibold">Anonymous · Secure · Helps protect your community</span>
          </div>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-gov-teal -z-10 -translate-y-1/2 transition-all" style={{ width: `${((step-1)/3)*100}%` }}></div>
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                step > num ? 'bg-gov-teal border-gov-teal text-white' : 
                step === num ? 'bg-white border-gov-teal text-gov-teal' : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {step > num ? <Check size={14} /> : num}
              </div>
            ))}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* STEP 1: LOCATION */}
          {step === 1 && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-gov-navy mb-6 flex items-center gap-2">
                <MapPin className="text-gov-teal" /> Step 1: Location
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gov-gray mb-2">District (மாவட்டம்) *</label>
                  <select 
                    value={district} 
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-teal outline-none"
                  >
                    <option value="" disabled>Select District</option>
                    {tnDistricts.map((d, i) => (
                      <option key={d} value={d}>{d} - {tnDistrictsTamil[i]}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gov-gray mb-2">Zone/Ward/Taluk (Optional)</label>
                  <input 
                    type="text" 
                    value={ward} 
                    onChange={e => setWard(e.target.value)}
                    placeholder="E.g., Anna Nagar, Ward 12"
                    className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-teal outline-none"
                  />
                </div>

                <button 
                  disabled={!district}
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-gov-navy text-white rounded-lg font-bold hover:bg-blue-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Next Step <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SYMPTOMS */}
          {step === 2 && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-gov-navy mb-6">Step 2: What are your symptoms?</h3>
              <p className="text-sm text-gray-500 mb-4 font-tamil">உங்களுக்கு உள்ள அறிகுறிகளை தேர்ந்தெடுக்கவும்</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {SYMPTOMS.map(sym => (
                  <label 
                    key={sym.id} 
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedSymptoms.includes(sym.id) 
                      ? 'bg-teal-50 border-gov-teal' 
                      : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 shrink-0 ${
                      selectedSymptoms.includes(sym.id) ? 'bg-gov-teal border-gov-teal' : 'border-gray-300 bg-white'
                    }`}>
                      {selectedSymptoms.includes(sym.id) && <Check size={14} className="text-white" />}
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${selectedSymptoms.includes(sym.id) ? 'text-gov-teal' : 'text-gray-800'}`}>
                        {sym.en}
                      </div>
                      <div className="text-xs text-gray-500 font-tamil mt-1">{sym.ta}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-6 py-4 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Back</button>
                <button 
                  disabled={selectedSymptoms.length === 0}
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 bg-gov-navy text-white rounded-lg font-bold hover:bg-blue-900 transition-colors disabled:opacity-50"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DURATION */}
          {step === 3 && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-gov-navy mb-6">Step 3: Duration & Spread</h3>
              
              <div className="space-y-8 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">How many days have you had these symptoms?</label>
                  <p className="text-xs text-gray-500 font-tamil mb-4">எத்தனை நாட்களாக இந்த அறிகுறிகள் உள்ளன?</p>
                  
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" min="1" max="14" 
                      value={duration} 
                      onChange={e => setDuration(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gov-teal"
                    />
                    <span className="font-bold text-gov-teal bg-teal-50 px-4 py-2 rounded-lg min-w-[80px] text-center">
                      {duration} Days
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">How many people in your household are affected?</label>
                  <p className="text-xs text-gray-500 font-tamil mb-4">உங்கள் வீட்டில் எத்தனை பேருக்கு பாதிப்பு உள்ளது?</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, '5+'].map(num => (
                      <button
                        key={num}
                        onClick={() => setAffectedCount(num === '5+' ? 5 : num as number)}
                        className={`w-14 h-14 rounded-full font-bold text-lg border-2 transition-all ${
                          affectedCount === (num === '5+' ? 5 : num)
                          ? 'bg-gov-teal border-gov-teal text-white shadow-md'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gov-teal/50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="px-6 py-4 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Back</button>
                <button 
                  onClick={() => setStep(4)}
                  className="flex-1 py-4 bg-gov-navy text-white rounded-lg font-bold hover:bg-blue-900 transition-colors"
                >
                  Review
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRM */}
          {step === 4 && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-gov-navy mb-6">Step 4: Confirm Submission</h3>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="text-gray-500">District</div>
                  <div className="font-bold text-right">{district}</div>
                  
                  <div className="text-gray-500">Symptoms</div>
                  <div className="font-bold text-right">{selectedSymptoms.length} selected</div>
                  
                  <div className="text-gray-500">Duration</div>
                  <div className="font-bold text-right">{duration} Days</div>
                  
                  <div className="text-gray-500">Affected</div>
                  <div className="font-bold text-right">{affectedCount} Person(s)</div>
                </div>
                
                <div className="pt-4 border-t border-blue-200 mt-4">
                  <p className="text-xs text-center text-gov-blue font-semibold flex items-center justify-center gap-2">
                    <ShieldCheck size={16} /> Your report is ANONYMOUS. No personal data collected.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(3)} className="px-6 py-4 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Back</button>
                <button 
                  onClick={submitReport}
                  disabled={loading}
                  className="flex-1 py-4 bg-gov-teal text-white rounded-lg font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                >
                  {loading ? 'Submitting...' : 'SUBMIT REPORT'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && result && (
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-gov-green" />
              </div>
              
              <h2 className="text-2xl font-bold text-gov-navy font-tamil mb-2">நன்றி! உங்கள் அறிக்கை பதிவு செய்யப்பட்டது</h2>
              <h3 className="text-lg text-gray-600 mb-6">Thank you! Your report has been recorded.</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg inline-block mb-8 border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Reference ID</p>
                <p className="text-xl font-mono font-bold text-gov-dark">{result.reference_id}</p>
              </div>

              {result.cluster_alert_triggered ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3 text-left mb-8 shadow-sm">
                  <AlertTriangle className="shrink-0 mt-0.5 text-gov-red" />
                  <div>
                    <p className="font-bold">⚠ Cluster Alert Triggered</p>
                    <p className="text-sm mt-1">Based on recent reports from {district}, the District Health Officer has been notified of a potential outbreak cluster.</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gov-blue bg-blue-50 py-3 rounded-lg border border-blue-100 mb-8">
                  {result.district_report_count_24h} reports submitted from {district} today.
                </p>
              )}

              <button 
                onClick={() => {
                  setStep(1);
                  setDistrict('');
                  setSelectedSymptoms([]);
                }}
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Submit Another Report
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
