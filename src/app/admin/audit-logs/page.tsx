'use client';
import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  ShieldCheck, 
  User, 
  Terminal, 
  Calendar,
  AlertCircle,
  Smartphone,
  Mail,
  ExternalLink
} from 'lucide-react';

const MOCK_LOGS = [
  { id: 'LOG-8821', user: 'admin_ganesh', action: 'BULK_SMS_DISPATCH', resource: 'Ward 127 - Kodambakkam', status: 'SUCCESS', ip: '106.201.21.4', timestamp: '2026-04-23 18:45:12' },
  { id: 'LOG-8820', user: 'system_ai', action: 'OUTBREAK_DETECTION', resource: 'Chennai/Dengue/LSTM_V2', status: 'ALERT_GENERATED', ip: 'internal', timestamp: '2026-04-23 18:30:05' },
  { id: 'LOG-8819', user: 'admin_ganesh', action: 'LOGIN_SUCCESS', resource: 'Admin Dashboard', status: 'SUCCESS', ip: '106.201.21.4', timestamp: '2026-04-23 18:02:44' },
  { id: 'LOG-8818', user: 'dr_saravanan', action: 'RESOURCE_UPDATE', resource: 'Zone 9 - PHC Medicine Stock', status: 'SUCCESS', ip: '117.193.45.12', timestamp: '2026-04-23 17:15:30' },
  { id: 'LOG-8817', user: 'citizen_9921', action: 'SYMPTOM_REPORT', resource: 'Voice Triage - Perambur', status: 'TRIAGED_HIGH', ip: '49.37.11.88', timestamp: '2026-04-23 16:55:22' },
  { id: 'LOG-8816', user: 'system_auth', action: 'FAILED_LOGIN', resource: 'Admin Portal', status: 'BLOCKED', ip: '192.168.1.104', timestamp: '2026-04-23 16:20:11' },
  { id: 'LOG-8815', user: 'admin_ganesh', action: 'EMAIL_DISPATCH', resource: 'Official Notification - DHO', status: 'SUCCESS', ip: '106.201.21.4', timestamp: '2026-04-23 15:45:00' },
  { id: 'LOG-8814', user: 'system_ai', action: 'REPORT_ANALYSIS', resource: 'CBC_INTERPRETATION', status: 'COMPLETED', ip: 'internal', timestamp: '2026-04-23 14:10:33' },
  { id: 'LOG-8813', user: 'dr_anitha', action: 'LOGIN_SUCCESS', resource: 'Medical Portal', status: 'SUCCESS', ip: '122.164.22.9', timestamp: '2026-04-23 13:55:12' },
  { id: 'LOG-8812', user: 'admin_ganesh', action: 'CONFIG_CHANGE', resource: 'Threshold LSTM-05', status: 'SUCCESS', ip: '106.201.21.4', timestamp: '2026-04-23 12:30:45' },
];

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = MOCK_LOGS.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'FAILED': 
      case 'BLOCKED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'ALERT_GENERATED': 
      case 'TRIAGED_HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('SMS')) return <Smartphone size={14} />;
    if (action.includes('EMAIL')) return <Mail size={14} />;
    if (action.includes('LOGIN')) return <User size={14} />;
    if (action.includes('AI') || action.includes('DETECTION')) return <Terminal size={14} />;
    return <FileText size={14} />;
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <ShieldCheck className="text-gov-teal" size={32} /> Audit Logs
          </h1>
          <p className="text-slate-400 font-medium">
            CERT-In & RTI Act 2005 compliant system logs. Real-time traceability for all administrative actions.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-700 text-white">
            <Download size={14} /> Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gov-blue text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-gov-blue/20">
            <ExternalLink size={14} /> Verify Chain-of-Trust
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL LOGS', value: '14,208', color: 'text-white' },
          { label: 'SECURITY ALERTS', value: '12', color: 'text-red-500' },
          { label: 'AI ACTIONS', value: '4,892', color: 'text-gov-teal' },
          { label: 'DISPATCHES', value: '9,304', color: 'text-gov-gold' },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by user, action or resource..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gov-teal/30 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 border border-slate-700">
            <Calendar size={14} /> Last 24h
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 border border-slate-700">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-800/30 text-slate-500 border-b border-slate-800">
                <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Log ID</th>
                <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Timestamp</th>
                <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">User/Entity</th>
                <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Action</th>
                <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Resource</th>
                <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{log.id}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-gov-teal uppercase">
                        {log.user.charAt(0)}
                      </div>
                      <span className="text-white font-bold text-xs">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                      {getActionIcon(log.action)}
                      {log.action.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-medium">{log.resource}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black border ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle size={32} className="mx-auto mb-3 opacity-20" />
            <p>No logs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
