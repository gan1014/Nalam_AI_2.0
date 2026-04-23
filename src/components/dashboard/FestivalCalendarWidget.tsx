'use client';
import React, { useState, useMemo } from 'react';
import { TN_FESTIVAL_CALENDAR, FestivalEvent } from '@/lib/festival-calendar';
import { Calendar, AlertTriangle, Info, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const FestivalCalendarWidget = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-indexed

  // Get current week number
  const currentWeek = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }, []);

  // Find active festivals for this week
  const activeFestivals = useMemo(() => {
    return TN_FESTIVAL_CALENDAR.filter(f => f.week_numbers.includes(currentWeek));
  }, [currentWeek]);

  // Upcoming events for the next 8 weeks
  const upcomingEvents = useMemo(() => {
    return TN_FESTIVAL_CALENDAR
      .filter(f => f.week_numbers.some(w => w > currentWeek && w <= currentWeek + 8))
      .sort((a, b) => Math.min(...a.week_numbers) - Math.min(...b.week_numbers));
  }, [currentWeek]);

  const monthNames = [
    { en: 'January', ta: 'ஜனவரி' },
    { en: 'February', ta: 'பிப்ரவரி' },
    { en: 'March', ta: 'மார்ச்' },
    { en: 'April', ta: 'ஏப்ரல்' },
    { en: 'May', ta: 'மே' },
    { en: 'June', ta: 'ஜூன்' },
    { en: 'July', ta: 'ஜூலை' },
    { en: 'August', ta: 'ஆகஸ்ட்' },
    { en: 'September', ta: 'செப்டம்பர்' },
    { en: 'October', ta: 'அக்டோபர்' },
    { en: 'November', ta: 'நவம்பர்' },
    { en: 'December', ta: 'டிசம்பர்' },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'pilgrimage': return 'bg-purple-500';
      case 'festival': return 'bg-orange-500';
      case 'school_holiday': return 'bg-blue-500';
      case 'harvest': return 'bg-green-500';
      case 'mass_gathering': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/50">
        <div className="flex items-center gap-3 mb-1">
          <Calendar className="text-gov-gold" size={24} />
          <h3 className="text-xl font-bold text-white">📅 Festival & Seasonal Disease Risk Calendar</h3>
        </div>
        <p className="text-slate-400 text-sm font-tamil">திருவிழா & பருவகால நோய் அபாய நாட்காட்டி</p>
        <p className="text-xs text-slate-500 mt-2">AI-adjusted risk forecasts accounting for 10 Tamil Nadu festivals and seasonal events. PS08 Section 3 Implementation.</p>
      </div>

      <div className="p-6 space-y-8">
        {/* CURRENT WEEK ALERT */}
        {activeFestivals.length > 0 ? (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-5 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500 p-2 rounded-lg text-white">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-1">🎊 FESTIVAL ALERT — This Week (W{currentWeek})</h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                  <span className="text-white font-bold text-lg">{activeFestivals[0].name}</span>
                  <span className="text-slate-400 font-tamil">{activeFestivals[0].name_tamil}</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  "Disease risk elevated: {Object.entries(activeFestivals[0].disease_risk_multipliers).map(([d, m]) => `${d.replace('_', ' ')} +${Math.round((m - 1) * 100)}%`).join(', ')} based on historical patterns"
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeFestivals[0].districts_affected.map(d => (
                    <span key={d} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white font-medium">{d}</span>
                  ))}
                </div>
                <button className="text-orange-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  <Info size={14} /> View recommended actions
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-5 flex items-center justify-center text-slate-500 text-sm italic">
            No major festivals active in Week {currentWeek}. Normal seasonal baseline applies.
          </div>
        )}

        {/* ANNUAL CALENDAR VIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {monthNames.map((month, idx) => {
            const monthNum = idx + 1;
            const eventsInMonth = TN_FESTIVAL_CALENDAR.filter(f => f.month === monthNum);
            const isSelected = selectedMonth === monthNum;

            return (
              <div 
                key={month.en}
                onClick={() => setSelectedMonth(monthNum)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected ? 'bg-slate-800 border-teal-500/50 ring-1 ring-teal-500/30' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-bold text-sm">{month.en}</span>
                  <span className="text-slate-500 text-[10px] font-tamil">{month.ta}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 h-6">
                  {eventsInMonth.map(f => (
                    <div 
                      key={f.id} 
                      className={`w-2.5 h-2.5 rounded-full ${getEventColor(f.type)}`}
                      title={`${f.name}: ${f.historical_disease_spike_pct}% spike`}
                    />
                  ))}
                </div>
                {isSelected && eventsInMonth.length > 0 && (
                  <div className="mt-3 space-y-1.5 animate-in fade-in slide-in-from-top-1">
                    {eventsInMonth.map(f => (
                      <div key={f.id} className="text-[10px] text-slate-300 flex items-center gap-1.5">
                        <div className={`w-1 h-1 rounded-full ${getEventColor(f.type)}`} />
                        {f.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* UPCOMING EVENTS TABLE */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
            <h4 className="text-white font-bold text-sm">Upcoming Events (Next 8 Weeks)</h4>
            <Filter size={14} className="text-slate-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="px-5 py-3 font-bold uppercase tracking-wider">Week</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider">Event</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider">Districts</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-center">Risk Factor</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {upcomingEvents.map(event => {
                  const maxRisk = Math.max(...Object.values(event.disease_risk_multipliers)) || 1.0;
                  return (
                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 text-slate-400 font-mono">W{Math.min(...event.week_numbers)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`} />
                          <div>
                            <p className="text-white font-medium">{event.name}</p>
                            <p className="text-slate-500 text-[10px] font-tamil">{event.name_tamil}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-400 leading-tight">
                        {event.districts_affected.join(', ').length > 40 
                          ? event.districts_affected[0] 
                          : event.districts_affected.join(', ')}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2 py-1 rounded font-bold ${
                          maxRisk > 1.8 ? 'bg-red-500/20 text-red-400' :
                          maxRisk > 1.4 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-teal-500/20 text-teal-400'
                        }`}>
                          {maxRisk.toFixed(1)}x
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 max-w-[200px] truncate" title={event.precautions[0]}>
                        {event.precautions[0]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* PREDICTION LOGIC EXPLANATION */}
        <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 flex gap-4 items-center">
          <div className="shrink-0 w-12 h-12 rounded-full border border-teal-500/30 flex items-center justify-center bg-teal-500/10">
            <Activity className="text-teal-400" size={24} />
          </div>
          <div>
            <h5 className="text-teal-400 font-bold text-sm mb-1">How festivals affect our predictions:</h5>
            <p className="text-slate-400 text-xs leading-relaxed">
              LEIF v2 cross-references these event windows with current weather data. If a festival coincides with high rainfall or temperature, 
              the risk score is mathematically amplified using the multipliers shown above, providing "human-centric" surveillance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalCalendarWidget;

// Re-importing Activity for the explanation block
import { Activity } from 'lucide-react';
