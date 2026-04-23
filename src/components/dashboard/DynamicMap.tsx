'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for missing default icon in Leaflet when using React
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Fix for default marker issues in React Leaflet
if (typeof window !== 'undefined') {
  (L.Marker.prototype.options as any).icon = icon;
}

export default function DynamicMap({ center = [13.0827, 80.2707], zoom = 11 }: any) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/chennai_wards.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error loading GeoJSON", err));
  }, []);

  // Function to style each ward based on random mock risk or properties
  const geoJsonStyle = (feature: any) => {
    // Generate a pseudo-random risk level based on feature name string length or a random number
    let hash = 0;
    if (feature.properties?.Zone_Name) {
      hash = feature.properties.Zone_Name.length + (feature.properties.Ward_No || 0);
    } else {
      hash = Math.floor(Math.random() * 100);
    }
    
    const riskFactor = (hash * 13) % 100; // 0 to 99
    
    let fillColor = '#22c55e'; // Low (Green)
    let fillOpacity = 0.2;
    let riskLabel = 'LOW';
    let riskColor = '#22c55e';

    if (riskFactor > 85) {
      fillColor = '#ef4444'; // Critical (Red)
      fillOpacity = 0.6;
      riskLabel = 'CRITICAL';
      riskColor = '#ef4444';
    } else if (riskFactor > 60) {
      fillColor = '#f97316'; // High (Orange)
      fillOpacity = 0.5;
      riskLabel = 'HIGH';
      riskColor = '#f97316';
    } else if (riskFactor > 30) {
      fillColor = '#eab308'; // Watch (Yellow)
      fillOpacity = 0.4;
      riskLabel = 'WATCH';
      riskColor = '#eab308';
    }

    feature.properties.calculatedRisk = riskLabel;
    feature.properties.riskColor = riskColor;

    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: '#ffffff', // Ward borders
      fillOpacity
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.Zone_Name) {
      const wardNo = feature.properties.Ward_No || 'Unknown';
      const zoneName = feature.properties.Zone_Name;
      const risk = feature.properties.calculatedRisk || 'LOW';
      const color = feature.properties.riskColor || '#22c55e';
      
      layer.bindPopup(`
        <div class="p-2 min-w-[150px] font-sans">
          <h3 class="font-bold text-gray-800 text-sm mb-1">${zoneName}</h3>
          <p class="text-xs text-gray-600 mb-2">Ward No: <span class="font-bold">${wardNo}</span></p>
          <div class="flex items-center justify-between border-t pt-2">
            <span class="text-[10px] font-bold text-gray-500 uppercase">Current Risk</span>
            <span class="text-xs font-black px-2 py-0.5 rounded" style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}40;">
              ${risk}
            </span>
          </div>
          ${risk === 'CRITICAL' ? `<a href="/admin/alerts?ward=${zoneName}" class="block text-center mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold py-1.5 rounded transition-colors shadow-sm no-underline cursor-pointer">VIEW ALERTS</a>` : ''}
        </div>
      `, { className: 'custom-popup rounded-xl overflow-hidden shadow-xl border-0' });
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] z-0 rounded-lg overflow-hidden border border-gov-border/50 shadow-inner bg-[#0a101a]">
      <MapContainer 
        center={center as [number, number]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', background: '#0a101a' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container { background: #0a101a !important; }
      `}} />
    </div>
  );
}
