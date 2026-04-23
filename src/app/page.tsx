import React from 'react';
import DiseaseRiskChecker from '@/components/public/DiseaseRiskChecker';
import VoiceSymptomChecker from '@/components/public/VoiceSymptomChecker';
import SMSSubscription from '@/components/public/SMSSubscription';
import Link from 'next/link';
import { Pill, Activity, Stethoscope, Smartphone, ShieldCheck } from 'lucide-react';

export default function PublicPortal() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-gov-navy to-gov-blue pt-20 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
            <ShieldCheck size={16} className="text-gov-gold" />
            AI-powered 14-21 day advance warning • 38 Districts • 5 Diseases • 77M Protected
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-tamil text-white leading-tight mb-4 drop-shadow-lg">
            உங்கள் மாவட்டத்தின் நோய் அபாய நிலையை சரிபாருங்கள்
          </h1>
          <h2 className="text-xl md:text-2xl text-white/90 font-medium mb-12 drop-shadow-md">
            Check your district's disease risk — <span className="text-gov-gold font-bold">Free for all Tamil Nadu citizens</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#risk-checker" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all backdrop-blur-md">
              <Activity size={18} className="text-gov-gold" /> Dengue Risk
            </Link>
            <Link href="#symptom-checker" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all backdrop-blur-md">
              <Stethoscope size={18} className="text-gov-teal" /> Symptom Check
            </Link>
            <Link href="/public-portal/phc-finder" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all backdrop-blur-md">
              🏥 Find PHC
            </Link>
            <Link href="/public-portal/pharmacy" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all backdrop-blur-md">
              <Pill size={18} className="text-blue-300" /> Medicines
            </Link>
            <Link href="#sms" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all backdrop-blur-md">
              <Smartphone size={18} className="text-gov-orange" /> SMS Alert
            </Link>
          </div>
        </div>
      </section>

      {/* STATS TICKER */}
      <div className="bg-gov-dark text-gov-offwhite py-3 border-y border-white/10 overflow-hidden relative shadow-inner">
        <div className="whitespace-nowrap flex animate-[scroll_30s_linear_infinite]">
          <div className="flex gap-12 font-bold text-sm">
            <span>🛡 77M citizens protected</span>
            <span className="text-gov-gray">|</span>
            <span>📍 38 districts monitored</span>
            <span className="text-gov-gray">|</span>
            <span className="text-gov-teal">⚡ 21 days advance warning</span>
            <span className="text-gov-gray">|</span>
            <span>📱 1,248 alerts sent</span>
            <span className="text-gov-gray">|</span>
            <span className="text-gov-gold">🎯 94.67% XGBoost accuracy</span>
            <span className="text-gov-gray">|</span>
            <span>📈 0.19 LSTM MAPE</span>
          </div>
          {/* Duplicate for seamless scrolling */}
          <div className="flex gap-12 font-bold text-sm ml-12">
            <span>🛡 77M citizens protected</span>
            <span className="text-gov-gray">|</span>
            <span>📍 38 districts monitored</span>
            <span className="text-gov-gray">|</span>
            <span className="text-gov-teal">⚡ 21 days advance warning</span>
            <span className="text-gov-gray">|</span>
            <span>📱 1,248 alerts sent</span>
            <span className="text-gov-gray">|</span>
            <span className="text-gov-gold">🎯 94.67% XGBoost accuracy</span>
            <span className="text-gov-gray">|</span>
            <span>📈 0.19 LSTM MAPE</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <section className="bg-gov-offwhite py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Risk Checker (Takes 2 columns on wide screens) */}
            <div id="risk-checker" className="lg:col-span-2">
              <DiseaseRiskChecker />
            </div>
            
            {/* Right Column: Voice Check & SMS */}
            <div className="space-y-8 flex flex-col">
              <div id="symptom-checker" className="flex-1">
                <VoiceSymptomChecker />
              </div>
              <div id="sms" className="flex-none">
                <SMSSubscription />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
