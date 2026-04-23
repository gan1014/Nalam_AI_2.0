'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Activity, Bell, Users, ShieldAlert, Clock, MapPin, Send, CheckCircle } from 'lucide-react';
import LeadTimeProofChart from '@/components/charts/LeadTimeProofChart';
import FestivalCalendarWidget from '@/components/dashboard/FestivalCalendarWidget';

const DynamicMap = dynamic(() => import('@/components/dashboard/DynamicMap'), { ssr: false });

const StatCard = ({ icon, value, label, trend, sublabel, color }: any) => (
  <div className="bg-gov-card border border-gov-border rounded-xl p-5 shadow-lg flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded bg-${color}/20 text-${color}`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
    <p className="text-sm font-semibold text-gray-300">{label}</p>
    <p className="text-xs text-gray-500 mt-2">{sublabel}</p>
  </div>
);

const AlertCard = ({ alert }: any) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  return (
    <div className="bg-gov-card border border-gov-border rounded-xl p-5 mb-4 shadow-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gov-red"></div>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gov-red animate-pulse"></span>
          <span className="text-sm font-bold text-white">{alert.ward}</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-900/50 text-red-400 border border-red-800 uppercase">
          {alert.disease} - {alert.risk}
        </span>
      </div>
      
      <p className="text-sm text-gray-300 mb-4">{alert.message}</p>
      
      {!showConfirm ? (
        <button 
          onClick={() => setShowConfirm(true)}
          className="w-full py-2 bg-gov-teal/20 hover:bg-gov-teal/30 text-gov-teal font-bold rounded text-sm transition-colors border border-gov-teal/30"
        >
          Verify & Dispatch
        </button>
      ) : (
        <div className="bg-[#0a101a] p-3 rounded border border-gov-border animate-in fade-in slide-in-from-top-2 text-xs">
          <p className="text-gray-400 mb-2">Confirm dispatch to {alert.contacts} contacts?</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-gov-teal text-white rounded font-bold hover:bg-teal-600 transition-colors flex items-center justify-center gap-1">
              <Send size={12}/> Send SMS
            </button>
            <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const alerts = [
    { id: 1, ward: 'Ward 123 - Adyar', disease: 'Dengue', risk: 'CRITICAL', message: 'High predicted case surge within 48 hours. Rainfall threshold breached.', contacts: 450 },
    { id: 2, ward: 'Ward 084 - Ambattur', disease: 'Scrub Typhus', risk: 'HIGH', message: 'Vector clustering detected. Historical peak alignment.', contacts: 212 }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Surveillance Command Center</h1>
          <p className="text-gray-400">Live multi-disease monitoring and alert dispatch for Chennai Metro.</p>
        </div>
      </div>

      {/* TOP STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <StatCard icon={<MapPin/>} value="201" label="Wards Monitored" sublabel="Chennai Metro" trend="0%" color="gov-teal" />
        <StatCard icon={<ShieldAlert/>} value="5" label="Active Critical" sublabel="Outbreak Alerts" trend="+2 new" color="gov-red" />
        <StatCard icon={<Send/>} value="1,248" label="Alerts Sent" sublabel="SMS + Email" trend="12 Today" color="gov-yellow" />
        <StatCard icon={<Users/>} value="3.4M" label="Citizens Protected" sublabel="Subscribed Users" trend="+1.4%" color="gov-green" />
        <StatCard icon={<Clock/>} value="21 Days" label="Lead Time Adv." sublabel="vs IDSP Baseline" trend="EXCEEDED" color="gov-teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* WARD MAP AREA (70%) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gov-card border border-gov-border rounded-xl p-1 shadow-lg h-[400px] flex flex-col relative overflow-hidden">
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <h2 className="text-xl font-bold text-white mb-1 drop-shadow-md">Interactive Ward Map</h2>
              <p className="text-xs text-gray-300 drop-shadow-md">Live geo-spatial risk visualization</p>
            </div>
            <div className="flex-1 w-full h-full relative z-10">
              <DynamicMap />
            </div>
            {/* Overlay tools mockup */}
            <div className="absolute top-4 right-4 bg-gov-dark/90 p-3 rounded border border-gov-border backdrop-blur-sm z-20 flex flex-col gap-2 shadow-lg">
              <label className="text-xs text-gray-300 flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-gov-teal w-3 h-3"/> District Bounds
              </label>
              <label className="text-xs text-gray-300 flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-gov-teal w-3 h-3"/> Risk Layer
              </label>
            </div>
          </div>

          <div className="bg-gov-card border border-gov-border rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Nalam AI vs IDSP Lead Time Proof</h3>
            <LeadTimeProofChart />
          </div>

          <div className="mt-8">
            <FestivalCalendarWidget />
          </div>
        </div>

        {/* ALERT QUEUE AREA (30%) */}
        <div className="space-y-4">
          <div className="bg-gov-card border border-gov-border rounded-xl p-4 shadow-lg flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell size={20} className="text-gov-gold" />
              Dispatch Queue
            </h3>
            <span className="bg-gov-red text-white text-xs font-bold px-2 py-1 rounded-full">
              {alerts.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
          </div>
          
          {alerts.length === 0 && (
            <div className="bg-gov-card border border-gov-border rounded-xl p-8 text-center text-gray-500">
              <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p>No pending alerts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
