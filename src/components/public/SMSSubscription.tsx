'use client';
import React, { useState } from 'react';
import { Smartphone, Bell, CheckCircle2 } from 'lucide-react';
import { tnDistricts } from '@/lib/district-data';

export default function SMSSubscription() {
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [disease, setDisease] = useState('all');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10 && district) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div id="sms" className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gov-blue text-white p-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-tamil mb-1 flex items-center gap-2">
            <Bell size={20} /> SMS எச்சரிக்கைகள்
          </h3>
          <p className="text-sm text-blue-100 font-semibold">Subscribe to Disease Alerts</p>
        </div>
        <Smartphone size={40} className="text-white/20" />
      </div>

      <div className="p-6">
        {submitted ? (
          <div className="py-8 text-center animate-in fade-in zoom-in">
            <CheckCircle2 size={48} className="text-gov-green mx-auto mb-4" />
            <p className="text-lg font-bold text-gov-navy font-tamil mb-1">நன்றி!</p>
            <p className="text-sm text-gray-600 font-tamil mb-2">உங்கள் மாவட்டத்தில் அதிக ஆபத்து இருக்கும்போது SMS அனுப்பப்படும்</p>
            <p className="text-xs text-gray-500">You have been subscribed to alerts for {district}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Phone Number *</label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gov-blue">
                <span className="bg-gray-100 px-4 py-3 text-gray-600 font-bold border-r border-gray-300">+91</span>
                <input 
                  type="tel" required pattern="[0-9]{10}" maxLength={10}
                  value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit number"
                  className="w-full px-4 py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">District *</label>
              <select 
                required value={district} onChange={e => setDistrict(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gov-blue"
              >
                <option value="" disabled>Select District</option>
                {tnDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Disease Preference</label>
              <select 
                value={disease} onChange={e => setDisease(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gov-blue"
              >
                <option value="all">All Diseases (அனைத்து நோய்கள்)</option>
                <option value="dengue">Dengue Only</option>
                <option value="scrub_typhus">Scrub Typhus Only</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 py-4 bg-gov-navy text-white rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-md"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
