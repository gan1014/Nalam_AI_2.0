'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, AlertTriangle, CheckCircle, Volume2, AlertCircle, Download, Heart, Wind, Activity, Shield, FileText } from 'lucide-react';

interface VoiceCheckResult {
  transcript: string;
  detected_language: string;
  symptoms: Array<{ name: string; confidence: number; severity: number }>;
  audio_events: Array<{ event: string; confidence: number }>;
  predicted_condition: string;
  condition_confidence: number;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  triage_recommendation: string;
  overall_confidence: number;
  recommendations: any;
  timestamp: string;
}

export default function VoiceHealthScreeningDashboard() {
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<VoiceCheckResult | null>(null);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondata = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        await sendAudioToBackend(audioChunksRef.current);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsListening(true);
      setTranscript('');
      setError('');
    } catch (err) {
      setError('Microphone access denied');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsListening(false);
    }
  };

  const sendAudioToBackend = async (audioBlobs: Blob[]) => {
    try {
      setIsAnalyzing(true);
      const audioBlob = new Blob(audioBlobs, { type: 'audio/wav' });
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        const response = await fetch('/api/voice-screening/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audio_base64: base64Audio,
            language: language === 'ta' ? 'ta' : 'en',
            anonymize: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        setResult(data);
        setTranscript(data.transcript);
      };

      reader.readAsDataURL(audioBlob);
    } catch (err) {
      setError('Failed to analyze voice');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    const colors = {
      LOW: 'bg-green-100 border-green-300 text-green-800',
      MEDIUM: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      HIGH: 'bg-red-100 border-red-300 text-red-800',
    };
    return colors[level as keyof typeof colors] || colors.LOW;
  };

  const content = { en: { title: 'Voice Health Screening', subtitle: 'AI-powered screening (Educational use only)' }, ta: { title: 'குரல் சுகாதார சோதனை', subtitle: 'AI-இல் கூறப்பட்ட சோதனை' } };
  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gov-blue to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-tamil">{t.title}</h1>
          <p className="text-white/80">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          <div className="flex flex-col items-center justify-center gap-8 mb-8">
            <button onClick={isListening ? stopRecording : startRecording} disabled={isAnalyzing} className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-lg ${isListening ? 'bg-red-500 animate-pulse' : isAnalyzing ? 'bg-blue-500' : 'bg-gov-teal hover:scale-105'} text-white`}>
              {isListening ? <MicOff className="w-16 h-16" /> : isAnalyzing ? <Volume2 className="w-16 h-16 animate-bounce" /> : <Mic className="w-16 h-16" />}
            </button>

            <button onClick={() => setLanguage((l) => (l === 'en' ? 'ta' : 'en'))} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-semibold text-gray-800">
              {language === 'en' ? '🇹🇦 தமிழ்' : '🇬🇧 English'}
            </button>
          </div>

          {transcript && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border-l-4 border-gov-teal">
              <p className="text-gray-700 italic">"{transcript}"</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-8">⚠️ {error}</div>
          )}
        </div>

        {result && (
          <div className="space-y-6">
            <div className={`rounded-2xl border-2 p-8 ${getRiskColor(result.risk_level)}`}>
              <h2 className="text-2xl font-bold font-tamil">{result.predicted_condition}</h2>
              <p className="text-sm">Risk: {(result.risk_score * 100).toFixed(1)}%</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gov-navy mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5" /> Symptoms
                </h3>
                {result.symptoms.map((s, idx) => (
                  <div key={idx} className="bg-blue-50 p-3 rounded mb-2">
                    {s.name}: {(s.confidence * 100).toFixed(0)}%
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gov-navy mb-3 flex items-center gap-2">
                  <Wind className="w-5 h-5" /> Audio Events
                </h3>
                {result.audio_events.map((e, idx) => (
                  <div key={idx} className="bg-purple-50 p-3 rounded mb-2">
                    {e.event}: {(e.confidence * 100).toFixed(0)}%
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
