'use client';

import React from 'react';
import VoiceHealthScreeningDashboard from '@/components/voice-screening/VoiceHealthScreeningDashboard';

export default function VoiceScreeningPage() {
  return (
    <div className="w-full min-h-screen">
      <VoiceHealthScreeningDashboard />
      
      {/* Disclaimer Section */}
      <div className="bg-gray-100 border-t border-gray-300 py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h3 className="font-bold text-blue-900 mb-2">⚠️ Medical Disclaimer</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              This Voice Health Screening System provides <strong>preliminary health screening for educational and informational purposes only</strong>. 
              It is <strong>NOT</strong> a medical diagnosis system and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p className="text-blue-800 text-sm leading-relaxed mt-3">
              <strong>If you experience severe symptoms or suspect a serious health condition:</strong>
            </p>
            <ul className="text-blue-800 text-sm leading-relaxed mt-2 ml-4 list-disc">
              <li>Call emergency services (108 in Tamil Nadu)</li>
              <li>Visit the nearest government hospital</li>
              <li>Consult with a qualified healthcare provider</li>
            </ul>
            <p className="text-blue-800 text-sm leading-relaxed mt-3">
              Data is processed locally and <strong>not stored</strong> for privacy protection. 
              Aggregated signals may be used for community health monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
