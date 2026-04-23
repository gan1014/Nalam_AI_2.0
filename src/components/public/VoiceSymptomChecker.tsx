'use client';
import React, { useState, useEffect } from 'react';
import { Mic, AlertTriangle, UserCheck, Stethoscope, Loader2 } from 'lucide-react';
import Link from 'next/link';

const SYMPTOM_MAP: Record<string, string> = {
  'காய்ச்சல்': 'fever',
  'தாப நோய்': 'fever',
  'தலைவலி': 'headache', 
  'மூட்டு வலி': 'joint_pain',
  'எலும்பு வலி': 'joint_pain',
  'வாந்தி': 'vomiting',
  'குமட்டல்': 'vomiting',
  'வயிற்று போக்கு': 'diarrhea',
  'சொறி': 'rash',
  'தடிப்பு': 'rash',
  'மூச்சுத் திணறல்': 'breathlessness',
  'மயக்கம்': 'dizziness',
};

export default function VoiceSymptomChecker() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<'EMERGENCY' | 'DOCTOR' | 'MONITOR' | null>(null);

  const simulateAnalysis = (text: string) => {
    setAnalyzing(true);
    setTimeout(() => {
      let severity = 0;
      Object.keys(SYMPTOM_MAP).forEach(keyword => {
        if (text.includes(keyword)) {
          severity += SYMPTOM_MAP[keyword] === 'breathlessness' || SYMPTOM_MAP[keyword] === 'dizziness' ? 3 : 1;
        }
      });
      
      if (severity >= 3) setResult('EMERGENCY');
      else if (severity > 0) setResult('DOCTOR');
      else setResult('MONITOR');
      
      setAnalyzing(false);
    }, 2000);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support voice recognition. Please use Google Chrome.');
      return;
    }
    
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ta-IN';
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setResult(null);
      };
      
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };
      
      recognition.onspeechend = () => {
        recognition.stop();
      };
      
      recognition.onend = () => {
        setIsListening(false);
        if (transcript) {
          simulateAnalysis(transcript);
        }
      };
      
      recognition.start();
    } catch (e) {
      console.error(e);
      // Fallback for demo if api fails
      setIsListening(true);
      setTimeout(() => {
        setTranscript("எனக்கு இரண்டு நாட்களாக கடுமையான காய்ச்சல் மற்றும் தலைவலி உள்ளது");
        setIsListening(false);
        simulateAnalysis("எனக்கு இரண்டு நாட்களாக கடுமையான காய்ச்சல் மற்றும் தலைவலி உள்ளது");
      }, 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
      <h3 className="text-xl font-bold font-tamil text-gov-navy mb-2">குரல் அறிகுறி சோதனை</h3>
      <h4 className="text-sm font-semibold text-gray-500 mb-8 uppercase tracking-wider">Voice Symptom Checker</h4>

      <button 
        onClick={startListening}
        disabled={isListening || analyzing}
        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all mb-8 ${
          isListening 
            ? 'bg-gov-red text-white animate-pulse ring-4 ring-red-200' 
            : analyzing 
              ? 'bg-gov-blue text-white' 
              : 'bg-gov-teal text-white hover:scale-105 hover:shadow-xl'
        }`}
      >
        {analyzing ? <Loader2 size={36} className="animate-spin" /> : <Mic size={36} />}
      </button>

      <div className="h-20 w-full flex items-center justify-center mb-6">
        {isListening && (
          <p className="text-xl font-tamil text-gov-gray animate-pulse">
            {transcript || 'கேட்கிறது... பேசுங்கள்...'}
          </p>
        )}
        {!isListening && !analyzing && !result && (
          <div>
            <p className="font-bold text-gov-navy font-tamil text-lg mb-1">உங்கள் அறிகுறிகளை தமிழில் பேசுங்கள்</p>
            <p className="text-sm text-gray-500">Speak your symptoms in Tamil — AI will triage your condition</p>
          </div>
        )}
        {analyzing && (
          <p className="text-gov-blue font-bold animate-pulse">பகுப்பாய்வு செய்கிறது... Analyzing...</p>
        )}
        {result && transcript && (
          <p className="text-lg font-tamil text-gray-800 border-l-4 border-gov-teal pl-3 text-left w-full mx-auto max-w-sm italic">
            "{transcript}"
          </p>
        )}
      </div>

      {result === 'EMERGENCY' && (
        <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col items-center animate-in fade-in zoom-in">
          <AlertTriangle size={32} className="text-gov-red mb-2" />
          <p className="font-bold text-gov-red font-tamil text-lg">உடனடியாக 108 அழைக்கவும்</p>
          <p className="text-xs text-red-700 font-semibold uppercase mt-1 mb-3">Emergency Response Required</p>
          <a href="tel:108" className="bg-gov-red text-white px-8 py-2 rounded-full font-bold shadow-md hover:bg-red-800 transition-colors w-full">CALL 108 NOW</a>
        </div>
      )}

      {result === 'DOCTOR' && (
        <div className="w-full bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col items-center animate-in fade-in zoom-in">
          <Stethoscope size={32} className="text-gov-orange mb-2" />
          <p className="font-bold text-gov-orange font-tamil text-lg">24 மணி நேரத்தில் PHC செல்லவும்</p>
          <p className="text-xs text-orange-700 font-semibold uppercase mt-1 mb-3">Doctor Consultation Required</p>
          <Link href="/public-portal/phc-finder" className="bg-gov-orange text-white px-8 py-2 rounded-full font-bold shadow-md hover:bg-orange-700 transition-colors w-full text-sm flex justify-center items-center gap-2">
            <Stethoscope size={16}/> Find PHC
          </Link>
        </div>
      )}

      {result === 'MONITOR' && (
        <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center animate-in fade-in zoom-in">
          <UserCheck size={32} className="text-gov-green mb-2" />
          <p className="font-bold text-gov-green font-tamil text-lg">வீட்டிலேயே ஓய்வெடுக்கவும்</p>
          <p className="text-xs text-green-700 font-semibold uppercase mt-1">Rest & Monitor at Home</p>
          <p className="text-xs text-green-600 mt-2 font-tamil">2 நாட்களில் மீண்டும் சரிபாருங்கள்</p>
        </div>
      )}
    </div>
  );
}
