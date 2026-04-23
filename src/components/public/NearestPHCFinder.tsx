'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Phone, Clock, AlertTriangle, ChevronDown } from 'lucide-react';
import { TN_PHC_DATABASE, PHC } from '@/lib/phc-data';
import { tnDistricts } from '@/lib/district-data';

export default function NearestPHCFinder() {
  const [activeTab, setActiveTab] = useState<'gps' | 'search'>('search');
  const [district, setDistrict] = useState<string>('Chennai');
  const [specialty, setSpecialty] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PHC[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);

  // Load initial district data
  useEffect(() => {
    if (activeTab === 'search') {
      let filtered = TN_PHC_DATABASE.filter(p => p.district === district);
      if (specialty !== 'All') {
        if (specialty === '24hr') filtered = filtered.filter(p => p.is_24hr);
        else filtered = filtered.filter(p => 
          p.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase())) ||
          p.facilities.some(f => f.toLowerCase().includes(specialty.toLowerCase()))
        );
      }
      setResults(filtered);
    }
  }, [district, specialty, activeTab]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleDetectLocation = () => {
    setLoading(true);
    setActiveTab('gps');
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const mapped = TN_PHC_DATABASE.map(phc => ({
          ...phc,
          distance_km: calculateDistance(userLat, userLng, phc.lat, phc.lng)
        })).sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));

        setResults(mapped);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setLoading(false);
        setActiveTab('search');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="w-full bg-gov-offwhite min-h-screen pb-12">
      {/* Emergency Strip */}
      <div className="w-full bg-gov-red text-white py-2 px-4 text-center font-bold text-sm flex items-center justify-center gap-3 animate-pulse shadow-md">
        <span className="text-lg">🚑</span>
        <span>Medical Emergency? Call 108 (Free) | Health Helpline: 104</span>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gov-navy text-white p-6 text-center">
            <h1 className="text-2xl font-bold font-tamil mb-1">அருகிலுள்ள அரசு மருத்துவமனை (PHC) கண்டுபிடி</h1>
            <h2 className="text-lg text-white/90 font-medium">Find Nearest Primary Health Centre</h2>
            <p className="text-sm text-gov-gold mt-2">Official Directory • {TN_PHC_DATABASE.length} Units Statewide</p>
          </div>

          {/* Warning Banner */}
          {district === 'Chennai' && activeTab === 'search' && (
            <div className="bg-gov-orange/10 border-l-4 border-gov-orange p-4 flex items-start gap-3">
              <AlertTriangle className="text-gov-orange shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-gov-dark font-bold text-sm">⚠ Dengue HIGH risk in this district.</p>
                <p className="text-gov-gray text-xs mt-1">If experiencing sudden high fever, ask for NS1 Rapid Test at any government facility.</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <button 
                onClick={handleDetectLocation}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-md ${
                  activeTab === 'gps' 
                  ? 'bg-gov-teal text-white ring-2 ring-gov-teal ring-offset-2' 
                  : 'bg-white text-gov-teal border border-gov-teal hover:bg-gov-teal/5'
                }`}
              >
                <Navigation size={18} />
                📍 Use My Location
              </button>
              
              <button 
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-md ${
                  activeTab === 'search' 
                  ? 'bg-gov-blue text-white ring-2 ring-gov-blue ring-offset-2' 
                  : 'bg-white text-gov-blue border border-gov-blue hover:bg-gov-blue/5'
                }`}
              >
                <Search size={18} />
                🔍 Search by District
              </button>
            </div>

            {activeTab === 'search' && (
              <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
                <div className="flex-1 relative">
                  <label className="text-xs font-bold text-gov-gray uppercase mb-1 block">District</label>
                  <select 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg appearance-none font-medium focus:ring-2 focus:ring-gov-blue outline-none"
                  >
                    {tnDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-[28px] text-gray-400 pointer-events-none" size={20} />
                </div>
                <div className="flex-1 relative">
                  <label className="text-xs font-bold text-gov-gray uppercase mb-1 block">Specialty Needed</label>
                  <select 
                    value={specialty} 
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg appearance-none font-medium focus:ring-2 focus:ring-gov-blue outline-none"
                  >
                    <option value="All">All Facilities</option>
                    <option value="Dengue">Dengue Testing</option>
                    <option value="Scrub Typhus">Scrub Typhus</option>
                    <option value="24hr">24 Hours Emergency</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-[28px] text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="p-6 bg-gray-50/50">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-gov-teal">
                <div className="w-12 h-12 border-4 border-gov-teal border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold">Detecting your location...</p>
                <p className="text-sm text-gray-500 mt-2">Searching 2,127 PHCs in Tamil Nadu</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gov-navy">
                    {activeTab === 'gps' ? 'Nearest Facilities to You' : `${results.length} Facilities in ${district}`}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.slice(0, visibleCount).map((phc) => (
                    <div key={phc.id} className={`bg-white rounded-xl shadow-md overflow-hidden border-l-[6px] flex flex-col ${
                      phc.is_24hr ? 'border-l-gov-green' : 'border-l-gov-teal'
                    }`}>
                      <div className="p-5 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gov-gray border border-gray-200">
                            {phc.type}
                          </span>
                          <div className="flex gap-2">
                            {phc.is_24hr && (
                              <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-100 text-gov-green border border-green-200">
                                24 HRS
                              </span>
                            )}
                            {phc.distance_km !== undefined && (
                              <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-50 text-gov-blue border border-blue-100 flex items-center gap-1">
                                <Navigation size={10} />
                                {phc.distance_km.toFixed(1)} km
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gov-navy leading-tight">{phc.name}</h3>
                        <h4 className="text-sm font-tamil text-gov-teal mb-3">{phc.name_tamil}</h4>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p className="flex items-start gap-2">
                            <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                            <span className="leading-tight">{phc.address}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-400 shrink-0" />
                            <span>{phc.timings}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-gray-400 shrink-0">🛏</span>
                            <span>{phc.beds} beds available</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {phc.specialties.slice(0, 3).map((spec, i) => (
                            <span key={i} className="text-[10px] bg-gov-blue/10 text-gov-blue px-2 py-1 rounded-full font-medium">
                              {spec}
                            </span>
                          ))}
                          {phc.specialties.length > 3 && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">
                              +{phc.specialties.length - 3} more
                            </span>
                          )}
                        </div>

                        {phc.abdm_code && (
                          <div className="text-[10px] text-gray-400 font-mono bg-gray-50 p-1 rounded inline-block">
                            ABDM: {phc.abdm_code}
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 p-3 flex gap-2 border-t border-gray-100">
                        <a href={`tel:${phc.phone}`} className="flex-1 flex justify-center items-center gap-2 bg-white border border-gray-300 text-gov-dark py-2 rounded font-semibold text-sm hover:bg-gray-50 transition-colors">
                          <Phone size={14} />
                          Call
                        </a>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${phc.lat},${phc.lng}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex justify-center items-center gap-2 bg-gov-navy text-white py-2 rounded font-semibold text-sm hover:bg-blue-900 transition-colors shadow-sm"
                        >
                          <MapPin size={14} />
                          Directions
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {visibleCount < results.length && (
                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="px-6 py-2 bg-white border border-gov-blue text-gov-blue font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      Show More Facilities
                    </button>
                  </div>
                )}
                
                {results.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    <p>No facilities found matching your criteria.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
