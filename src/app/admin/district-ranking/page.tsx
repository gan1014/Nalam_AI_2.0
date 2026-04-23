'use client';
import React, { useState, useMemo } from 'react';
import GovHeader from '@/components/layout/GovHeader';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertCircle, 
  ChevronDown, 
  Download, 
  Filter, 
  Search,
  Zap,
  Map as MapIcon,
  Bell
} from 'lucide-react';

const DISTRICT_RANKINGS = [
  { rank: 1, district: 'Chennai', district_tamil: 'சென்னை', risk: 'CRITICAL', score: 0.94, trend: 'up', forecast_p50: 312, festival_flag: true, action: 'SEND ALERT' },
  { rank: 2, district: 'Thiruvallur', district_tamil: 'திருவள்ளூர்', risk: 'HIGH', score: 0.81, trend: 'up', forecast_p50: 198, festival_flag: true, action: 'SEND ALERT' },
  { rank: 3, district: 'Chengalpattu', district_tamil: 'செங்கல்பட்டு', risk: 'HIGH', score: 0.78, trend: 'stable', forecast_p50: 176, festival_flag: false, action: 'PREPARE' },
  { rank: 4, district: 'Kanchipuram', district_tamil: 'காஞ்சிபுரம்', risk: 'HIGH', score: 0.74, trend: 'up', forecast_p50: 145, festival_flag: false, action: 'PREPARE' },
  { rank: 5, district: 'Cuddalore', district_tamil: 'கடலூர்', risk: 'WATCH', score: 0.62, trend: 'down', forecast_p50: 89, festival_flag: false, action: 'MONITOR' },
  { rank: 6, district: 'Vellore', district_tamil: 'வேலூர்', risk: 'WATCH', score: 0.58, trend: 'stable', forecast_p50: 72, festival_flag: false, action: 'MONITOR' },
  { rank: 7, district: 'Salem', district_tamil: 'சேலம்', risk: 'WATCH', score: 0.54, trend: 'up', forecast_p50: 65, festival_flag: false, action: 'WATCH' },
  { rank: 8, district: 'Coimbatore', district_tamil: 'கோயம்புத்தூர்', risk: 'WATCH', score: 0.51, trend: 'stable', forecast_p50: 58, festival_flag: false, action: 'WATCH' },
  { rank: 9, district: 'Madurai', district_tamil: 'மதுரை', risk: 'LOW', score: 0.42, trend: 'down', forecast_p50: 34, festival_flag: false, action: 'OK' },
  { rank: 10, district: 'Tiruchirappalli', district_tamil: 'திருச்சிராப்பள்ளி', risk: 'LOW', score: 0.38, trend: 'stable', forecast_p50: 28, festival_flag: false, action: 'OK' },
  { rank: 11, district: 'Thanjavur', district_tamil: 'தஞ்சாவூர்', risk: 'LOW', score: 0.35, trend: 'down', forecast_p50: 22, festival_flag: false, action: 'OK' },
  { rank: 12, district: 'Tiruvannamalai', district_tamil: 'திருவண்ணாமலை', risk: 'LOW', score: 0.31, trend: 'stable', forecast_p50: 19, festival_flag: false, action: 'OK' },
  { rank: 13, district: 'Erode', district_tamil: 'ஈரோடு', risk: 'LOW', score: 0.28, trend: 'down', forecast_p50: 15, festival_flag: false, action: 'OK' },
  { rank: 14, district: 'Tiruppur', district_tamil: 'திருப்பூர்', risk: 'LOW', score: 0.25, trend: 'stable', forecast_p50: 12, festival_flag: false, action: 'OK' },
  { rank: 15, district: 'Dindigul', district_tamil: 'திண்டுக்கல்', risk: 'LOW', score: 0.22, trend: 'stable', forecast_p50: 10, festival_flag: false, action: 'OK' },
  { rank: 16, district: 'Tirunelveli', district_tamil: 'திருநெல்வேலி', risk: 'LOW', score: 0.19, trend: 'down', forecast_p50: 8, festival_flag: false, action: 'OK' },
  { rank: 17, district: 'Kanniyakumari', district_tamil: 'கன்னியாகுமரி', risk: 'LOW', score: 0.17, trend: 'stable', forecast_p50: 6, festival_flag: false, action: 'OK' },
  { rank: 18, district: 'Tuticorin', district_tamil: 'தூத்துக்குடி', risk: 'LOW', score: 0.15, trend: 'stable', forecast_p50: 5, festival_flag: false, action: 'OK' },
  { rank: 19, district: 'Namakkal', district_tamil: 'நாமக்கல்', risk: 'LOW', score: 0.14, trend: 'down', forecast_p50: 4, festival_flag: false, action: 'OK' },
  { rank: 20, district: 'Pudukkottai', district_tamil: 'புதுக்கோட்டை', risk: 'LOW', score: 0.13, trend: 'stable', forecast_p50: 3, festival_flag: false, action: 'OK' },
  // ... Simplified for demo, can be expanded to full 38
];

export default function DistrictRankingPage() {
  const [selectedDisease, setSelectedDisease] = useState('Dengue');
  const [searchQuery, setSearchQuery] = useState('');

  const diseases = ['Dengue', 'Scrub Typhus', 'Gastroenteritis', 'Heat Stroke', 'Respiratory', 'Composite'];

  const filteredDistricts = useMemo(() => {
    return DISTRICT_RANKINGS.filter(d => 
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.district_tamil.includes(searchQuery)
    );
  }, [searchQuery]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'WATCH': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-600 border-green-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} className="text-red-500" />;
      case 'down': return <TrendingDown size={16} className="text-green-500" />;
      default: return <Minus size={16} className="text-slate-400" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#080c14] text-slate-200">
      <GovHeader />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-gov-gold/10 text-gov-gold px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gov-gold/20">
              <Zap size={12} /> Week 17 Risk Index
            </div>
            <h1 className="text-3xl font-black text-white font-tamil">
              Weekly District Risk Ranking | வாராந்திர மாவட்ட அபாய தரவரிசை
            </h1>
            <p className="text-slate-400 text-sm">
              All 38 Tamil Nadu Districts × 5 Diseases — Predicted Surge Probabilities
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-700">
              <Download size={14} /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gov-blue text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-gov-blue/20">
              <Bell size={14} /> Bulk Alert HIGH Risk
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'CRITICAL', count: 1, color: 'text-red-500', bg: 'bg-red-500/10' },
            { label: 'HIGH RISK', count: 3, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { label: 'WATCH', count: 4, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
            { label: 'LOW RISK', count: 30, color: 'text-green-500', bg: 'bg-green-500/10' },
          ].map(card => (
            <div key={card.label} className={`p-6 rounded-2xl border border-slate-800 ${card.bg}`}>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{card.label}</p>
              <p className={`text-4xl font-black ${card.color}`}>{card.count}</p>
              <p className="text-[10px] text-slate-400 mt-2">Districts affected</p>
            </div>
          ))}
        </div>

        {/* CONTROLS AREA */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex flex-wrap gap-2 flex-1">
            {diseases.map(d => (
              <button 
                key={d}
                onClick={() => setSelectedDisease(d)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedDisease === d 
                    ? 'bg-gov-teal text-white shadow-lg shadow-gov-teal/20' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search district..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gov-teal/50 transition-all"
            />
          </div>
        </div>

        {/* RANKING TABLE */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-800/50 text-slate-500 border-b border-slate-800">
                  <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Rank</th>
                  <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">District</th>
                  <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Risk Level</th>
                  <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Composite Score</th>
                  <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px] text-center">Trend</th>
                  <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Forecast (14d)</th>
                  <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px] text-center">Festival</th>
                  <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDistricts.map((d) => (
                  <tr key={d.district} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <span className="font-black text-slate-500 text-lg">#{d.rank}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{d.district}</span>
                        <span className="text-slate-500 text-[10px] font-tamil">{d.district_tamil}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getRiskColor(d.risk)}`}>
                        {d.risk}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-24">
                          <div 
                            className={`h-full rounded-full ${
                              d.score > 0.8 ? 'bg-red-500' : d.score > 0.6 ? 'bg-orange-500' : 'bg-teal-500'
                            }`}
                            style={{ width: `${d.score * 100}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-xs">{(d.score * 100).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center">
                        {getTrendIcon(d.trend)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{d.forecast_p50}</span>
                        <span className="text-[10px] text-slate-500">exp. cases</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {d.festival_flag ? (
                        <span className="text-xl animate-bounce inline-block" title="Festival Alert Active">🎊</span>
                      ) : (
                        <span className="text-slate-800 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <button className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${
                        d.risk === 'CRITICAL' || d.risk === 'HIGH'
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}>
                        {d.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
