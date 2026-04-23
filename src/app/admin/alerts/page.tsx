'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Bell, Search, Filter, AlertTriangle, Send, Mail, Smartphone, Eye, CheckCircle2 } from 'lucide-react';
import { tnDistricts } from '@/lib/district-data';
import { useSearchParams } from 'next/navigation';
import FaceRecognitionModal from '@/components/admin/FaceRecognitionModal';

function AlertsDispatchContent() {
  const searchParams = useSearchParams();
  const filterWard = searchParams.get('ward');
  const [district, setDistrict] = useState('Chennai');
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const [testPhone, setTestPhone] = useState('+91');
  const [isSending, setIsSending] = useState(false);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [pendingDispatchData, setPendingDispatchData] = useState<{id: number, type: 'SMS' | 'EMAIL'} | null>(null);

  const initialAlerts = [
    { id: 1042, district: 'Chennai', ward: 'Teynampet', disease: 'Dengue', risk: 'CRITICAL', trigger: 'LSTM > 95th Percentile + Rainfall threshold', confidence: '96.8%', primaryFactor: 'Unseasonal rainfall (84mm) + high larval density in Zone 9.', recommendation: 'Immediate fogging and source reduction in Teynampet. Alert PHCs.', affected: 45000, date: 'Today, 08:30 AM', status: 'PENDING DISPATCH' },
    { id: 1041, district: 'Chennai', ward: 'Kodambakkam', disease: 'Dengue', risk: 'CRITICAL', trigger: 'EMRI 108 Fever Call Cluster', confidence: '92.4%', primaryFactor: 'Abnormal cluster of fever calls (108) reported from Ward 127.', recommendation: 'Door-to-door screening in Kodambakkam. Mobile medical units deployment.', affected: 9800, date: 'Today, 09:15 AM', status: 'PENDING DISPATCH' },
    { id: 1043, district: 'Chennai', ward: 'Ambattur', disease: 'Scrub Typhus', risk: 'HIGH', trigger: 'Community Report Cluster Detected', confidence: '88.5%', primaryFactor: 'Community symptoms matching scrub typhus in slum areas.', recommendation: 'Targeted antibiotic stocking at Ambattur PHC. Public awareness on sanitation.', affected: 12000, date: 'Today, 09:15 AM', status: 'PENDING DISPATCH' },
    { id: 1044, district: 'Chennai', ward: 'Anna Nagar', disease: 'Gastroenteritis', risk: 'HIGH', trigger: 'Water Contamination Signal (TWB)', confidence: '91.2%', primaryFactor: 'Low chlorine levels detected in secondary water mains.', recommendation: 'Initiate water tank cleaning drive. Distribute chlorine tablets.', affected: 25000, date: 'Today, 10:30 AM', status: 'PENDING DISPATCH' },
    { id: 1045, district: 'Chennai', ward: 'Royapuram', disease: 'Heat Stroke', risk: 'WATCH', trigger: 'Heat Index > 42°C Forecast', confidence: '95.0%', primaryFactor: 'Sustained high temperatures in high-density urban canyons.', recommendation: 'Setup cool-roof centers. Public advisory on hydration.', affected: 60000, date: 'Tomorrow (Forecast)', status: 'PENDING DISPATCH' },
    { id: 1046, district: 'Chennai', ward: 'Perambur', disease: 'Respiratory', risk: 'WATCH', trigger: 'PM2.5 Level Breached (150+)', confidence: '82.7%', primaryFactor: 'High AQI combined with low wind speed in industrial periphery.', recommendation: 'Health advisory for vulnerable populations. Mask distribution.', affected: 35000, date: 'Today, 11:00 AM', status: 'PENDING DISPATCH' },
    { id: 1038, district: 'Coimbatore', ward: 'Zone 4', disease: 'Respiratory', risk: 'WATCH', trigger: 'Syndromic surveillance spike at PHC', confidence: '84.2%', primaryFactor: 'PM2.5 levels exceeding WHO limits for 48 hours.', recommendation: 'Air quality advisory for elderly. Stock inhalers at Zone 4 PHCs.', affected: 8500, date: 'Yesterday', status: 'DISPATCHED' },
  ];

  const [activeAlerts, setActiveAlerts] = useState(initialAlerts);

  useEffect(() => {
    if (filterWard) {
      const alert = activeAlerts.find(a => a.ward.toLowerCase().includes(filterWard.toLowerCase()));
      if (alert) {
        setSelectedAlert(alert.id);
      } else {
        const newId = 2000 + Math.floor(Math.random() * 100);
        setActiveAlerts(prev => [{
          id: newId,
          district: 'Chennai',
          ward: filterWard,
          disease: 'Dengue',
          risk: 'CRITICAL',
          trigger: 'Manual Map Selection Trigger',
          confidence: '94.2%',
          primaryFactor: `Specific environmental data for ${filterWard} suggests high vector breeding potential.`,
          recommendation: `Initiate emergency containment protocol for ${filterWard}.`,
          affected: 15000,
          date: 'Just Now',
          status: 'PENDING DISPATCH'
        }, ...prev]);
        setSelectedAlert(newId);
      }
    }
  }, [filterWard]);

  const handleDispatch = async (id: number, type: 'SMS' | 'EMAIL') => {
    if (type === 'EMAIL') {
      // REQUIRE FACE RECOGNITION FIRST
      setPendingDispatchData({ id, type });
      setIsFaceModalOpen(true);
      return;
    }
    
    await executeDispatch(id, type);
  };

  const executeDispatch = async (id: number, type: 'SMS' | 'EMAIL') => {
    if (type === 'EMAIL') {
      setIsSending(true);
      const alert = activeAlerts.find(a => a.id === id);
      try {
        const res = await fetch('/api/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailType: 'OFFICIAL',
            alertId: alert?.id,
            disease: alert?.disease,
            ward: alert?.ward,
            affected: alert?.affected,
            targetEmails: ['shinchanhimawari1011@gmail.com'] 
          })
        });
        if (res.ok) {
          setActiveAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'DISPATCHED' } : a));
        } else {
          window.alert('Failed to send email. Check API logs.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSending(false);
        setPendingDispatchData(null);
      }
    } else if (type === 'SMS') {
      setIsSending(true);
      const alert = activeAlerts.find(a => a.id === id);
      try {
        const res = await fetch('/api/sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Nalam AI Alert: High ${alert?.disease} risk in ${alert?.ward}. Take precautions.`,
            targetPhones: [testPhone] 
          })
        });
        if (res.ok) {
          setActiveAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'DISPATCHED' } : a));
        } else {
          const data = await res.json();
          window.alert(`SMS Failed: ${data.error}. \n\nReason: ${data.details || 'Check .env.local keys'}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSending(false);
        setPendingDispatchData(null);
      }
    }
  };

  return (
    <>
      <div className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Bell className="text-gov-gold" /> Alerts & Dispatch Operations
          </h1>
          <p className="text-gray-400">Manage high-risk disease warnings and dispatch automated SMS/Email campaigns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex gap-2">
            <select 
              value={district} onChange={e => setDistrict(e.target.value)}
              className="flex-1 bg-gov-card border border-gov-border text-white rounded p-2 focus:ring-1 focus:ring-gov-teal outline-none"
            >
              <option value="All">All Districts</option>
              {tnDistricts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button className="bg-gov-card border border-gov-border text-white px-3 py-2 rounded hover:bg-white/5 transition-colors">
              <Filter size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div 
                key={alert.id}
                onClick={() => setSelectedAlert(alert.id)}
                className={`bg-gov-card border rounded-xl p-4 cursor-pointer transition-all ${
                  selectedAlert === alert.id ? 'border-gov-teal ring-1 ring-gov-teal' : 'border-gov-border hover:border-gray-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    alert.risk === 'CRITICAL' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                    alert.risk === 'HIGH' ? 'bg-orange-900/50 text-orange-400 border border-orange-800' :
                    'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                  }`}>
                    {alert.risk} - {alert.disease}
                  </span>
                  <span className="text-xs text-gray-500">#{alert.id}</span>
                </div>
                <h3 className="text-white font-bold mb-1">{alert.district} - {alert.ward}</h3>
                <p className="text-xs text-gray-400 mb-3 line-clamp-1">{alert.trigger}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{alert.date}</span>
                  <span className={alert.status === 'DISPATCHED' ? 'text-gov-green font-bold' : 'text-gov-gold font-bold'}>
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Action Panel */}
        <div className="lg:col-span-2">
          {selectedAlert ? (
            <div className="bg-gov-card border border-gov-border rounded-xl shadow-lg overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95 duration-200">
              {(() => {
                const alert = activeAlerts.find(a => a.id === selectedAlert);
                if (!alert) return <div className="p-12 text-center text-gray-500">Alert not found.</div>;
                return (
                  <>
                    <div className={`p-6 border-b ${
                      alert?.risk === 'CRITICAL' ? 'bg-gov-red/10 border-gov-red/30' : 
                      alert?.risk === 'HIGH' ? 'bg-gov-orange/10 border-gov-orange/30' : 
                      'bg-gov-yellow/10 border-gov-yellow/30'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className={alert?.risk === 'CRITICAL' ? 'text-gov-red' : alert?.risk === 'HIGH' ? 'text-gov-orange' : 'text-gov-yellow'} size={28} />
                          <div>
                            <h2 className="text-2xl font-bold text-white">{alert?.disease} Surge Alert</h2>
                            <p className="text-gray-300 font-medium">{alert?.district} — {alert?.ward}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Pop. at Risk</p>
                          <p className="text-xl font-black text-white">{alert?.affected.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-b border-gov-border">
                      <h3 className="text-sm font-bold text-gov-teal uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Eye size={16}/> Explain Risk (AI Triage)
                      </h3>
                      <div className="bg-[#0d1421] rounded-lg p-4 text-sm text-gray-300 space-y-3 font-mono border border-gray-800">
                        <p><strong className="text-white">Trigger:</strong> {alert?.trigger}</p>
                        <p><strong className="text-white">Confidence:</strong> {alert?.confidence || '94.2%'} (XGBoost Feature Importance)</p>
                        <p><strong className="text-white">Primary Factor:</strong> {alert?.primaryFactor || 'Environmental risk factors detected.'}</p>
                        <p><strong className="text-white">Recommendation:</strong> {alert?.recommendation || 'Standard containment protocol.'}</p>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-sm font-bold text-gov-gold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Send size={16}/> Dispatch Communications
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* SMS Campaign */}
                        <div className="bg-[#0d1421] border border-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-white font-bold flex items-center gap-2"><Smartphone size={16} className="text-gov-blue"/> Target: Citizens</h4>
                            <span className="text-xs bg-gov-blue/20 text-gov-blue px-2 py-1 rounded font-bold">12,408 Subs</span>
                          </div>
                          
                          <div className="mb-4">
                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Test Phone Number</label>
                            <input 
                              type="text" 
                              value={testPhone} 
                              onChange={e => setTestPhone(e.target.value)}
                              placeholder="+91..."
                              className="w-full bg-black/50 border border-gray-800 rounded px-2 py-1.5 text-xs text-white focus:border-gov-blue outline-none"
                            />
                          </div>

                          <div className="bg-gray-900 p-3 rounded text-sm text-gray-400 mb-4 h-24 overflow-y-auto">
                            "நலம் AI எச்சரிக்கை: உங்கள் பகுதியில் {alert?.disease} ஆபத்து அதிகமாக உள்ளது. கொசு உற்பத்தியை தடுக்கவும். காய்ச்சல் வந்தால் உடனடியாக அருகில் உள்ள அரசு மருத்துவமனை (PHC) செல்லவும்."
                          </div>
                          <button 
                            onClick={() => handleDispatch(alert.id, 'SMS')}
                            className={`w-full py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors ${alert?.status === 'DISPATCHED' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gov-blue hover:bg-blue-600 text-white shadow-md'}`} 
                            disabled={alert?.status === 'DISPATCHED' || isSending}
                          >
                            <Smartphone size={16}/> {isSending ? 'Sending...' : 'Send Mass SMS'}
                          </button>
                        </div>

                        {/* Email Campaign */}
                        <div className="bg-[#0d1421] border border-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-white font-bold flex items-center gap-2"><Mail size={16} className="text-gov-teal"/> Target: Authorities</h4>
                            <span className="text-xs bg-gov-teal/20 text-gov-teal px-2 py-1 rounded font-bold">DHO, PHC, TNMSC</span>
                          </div>
                          <div className="bg-gray-900 p-3 rounded text-sm text-gray-400 mb-4 h-24 overflow-y-auto">
                            "Subject: CRITICAL: {alert?.disease} Surge Alert - {alert?.ward}. Action required: Mobilize vector control teams, initiate medicine indents for paracetamol and IV fluids. View dashboard for precise geo-locations."
                          </div>
                          <button 
                            onClick={() => handleDispatch(alert.id, 'EMAIL')}
                            className={`w-full py-2 rounded font-bold flex items-center justify-center gap-2 transition-colors ${alert?.status === 'DISPATCHED' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gov-teal hover:bg-teal-600 text-white shadow-md'}`} 
                            disabled={alert?.status === 'DISPATCHED' || isSending}
                          >
                            {isSending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Mail size={16}/>}
                            {isSending ? 'Sending...' : 'Send Official Emails'}
                          </button>
                        </div>
                      </div>
                      
                      {alert?.status === 'DISPATCHED' && (
                        <div className="mt-auto bg-green-900/20 border border-green-900/50 p-3 rounded-lg flex items-center justify-center gap-2 text-gov-green font-bold text-sm">
                          <CheckCircle2 size={18} /> Communications already dispatched successfully.
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="bg-gov-card border border-gov-border rounded-xl h-full flex flex-col items-center justify-center text-gray-500 p-8">
              <Bell size={48} className="opacity-20 mb-4" />
              <p className="text-lg font-bold text-gray-400">No Alert Selected</p>
              <p className="text-sm">Select an alert from the queue to view details and dispatch communications.</p>
            </div>
          )}
        </div>
      </div>
      </div>

      <FaceRecognitionModal 
        isOpen={isFaceModalOpen}
        onClose={() => setIsFaceModalOpen(false)}
        onVerified={() => {
          if (pendingDispatchData) {
            executeDispatch(pendingDispatchData.id, pendingDispatchData.type);
          }
        }}
        adminName="Admin Ganesh"
      />
    </>
  );
}

export default function AlertsDispatchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-white">Loading Command Center...</div>}>
      <AlertsDispatchContent />
    </Suspense>
  );
}
