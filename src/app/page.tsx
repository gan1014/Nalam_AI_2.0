import React from 'react';
import DiseaseRiskChecker from '@/components/public/DiseaseRiskChecker';
import VoiceSymptomChecker from '@/components/public/VoiceSymptomChecker';
import SMSSubscription from '@/components/public/SMSSubscription';
import StatsTicker from '@/components/public/StatsTicker';
import DiseaseInfoGrid from '@/components/public/DiseaseInfoGrid';
import GovSchemes from '@/components/public/GovSchemes';
import CommunitySurgeMap from '@/components/public/CommunitySurgeMap';
import GovHeader from '@/components/layout/GovHeader';
import GovFooter from '@/components/layout/GovFooter';
import Link from 'next/link';
import { Pill, Activity, Stethoscope, Smartphone, ShieldCheck, ArrowRight, FileText, Bot } from 'lucide-react';

export default function PublicPortal() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-gov-offwhite">
      <GovHeader />
      <StatsTicker />
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-gov-navy via-gov-blue to-slate-900 pt-20 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          
          {/* Official Logo */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white p-4 rounded-3xl shadow-2xl border-b-4 border-gov-gold">
              <img src="/images/logo.png" alt="Nalam AI Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
            <ShieldCheck size={16} className="text-gov-gold" />
            AI-powered 14-21 day advance warning • 38 Districts • 5 Diseases • 77M Protected
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold font-tamil text-white leading-tight mb-6 drop-shadow-lg max-w-4xl mx-auto">
            உங்கள் மாவட்டத்தின் நோய் அபாய நிலையை சரிபாருங்கள்
          </h1>
          <h2 className="text-xl md:text-2xl text-white/90 font-medium mb-12 drop-shadow-md">
            Check your district's disease risk — <span className="text-gov-gold font-bold">Free for all Tamil Nadu citizens</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#risk-checker" className="bg-gov-teal hover:bg-gov-teal/90 text-white px-8 py-4 rounded-full font-black flex items-center gap-2 transition-all shadow-xl shadow-gov-teal/20">
              <Activity size={20} /> Start Risk Check
            </Link>
            <Link href="/public-portal/report-analysis" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full font-black flex items-center gap-2 transition-all backdrop-blur-md">
              <FileText size={20} /> Analyze Medical Report
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK LINKS GRID */}
      <div className="container mx-auto max-w-6xl -mt-10 px-4 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/public-portal/phc-finder" className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center gap-3 group transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              🏥
            </div>
            <span className="font-bold text-gov-navy text-sm">Find Nearest PHC</span>
          </Link>
          <Link href="/public-portal/pharmacy" className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center gap-3 group transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
              <Pill size={24} />
            </div>
            <span className="font-bold text-gov-navy text-sm">Medicine Tracker</span>
          </Link>
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center gap-3 group transition-all hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 bg-gov-teal/5 rounded-xl flex items-center justify-center text-gov-teal group-hover:scale-110 transition-transform">
              <Bot size={24} />
            </div>
            <span className="font-bold text-gov-navy text-sm">Ask Dr. Nalam</span>
          </div>
          <Link href="#sms" className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center gap-3 group transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <Smartphone size={24} />
            </div>
            <span className="font-bold text-gov-navy text-sm">SMS Alerts</span>
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl space-y-24">
          
          {/* Risk Checker & Voice Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div id="risk-checker" className="lg:col-span-2">
              <div className="mb-8">
                <h3 className="text-3xl font-black text-gov-navy font-tamil mb-2">District Health Risk Checker</h3>
                <p className="text-gov-gray font-medium">Select your district to view the 14-day advance disease risk forecast generated by LEIF v2.</p>
              </div>
              <DiseaseRiskChecker />
            </div>
            <div className="space-y-8">
              <div id="symptom-checker">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gov-navy font-tamil">AI Voice Triage</h4>
                  <p className="text-xs text-gov-gray mt-1">Speak your symptoms in Tamil or English for instant triage.</p>
                </div>
                <VoiceSymptomChecker />
              </div>
              <CommunitySurgeMap />
            </div>
          </div>

          {/* Disease Information Section */}
          <div className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-gov-navy font-tamil">Disease Knowledge Center</h3>
              <p className="text-gov-gray font-medium">Learn about symptoms, prevention, and government resources for seasonal diseases.</p>
            </div>
            <DiseaseInfoGrid />
          </div>

          {/* Report Analysis CTA */}
          <div className="bg-gov-navy rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gov-teal/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                  <Sparkles size={14} className="text-gov-gold" /> New Feature
                </div>
                <h3 className="text-3xl md:text-5xl font-black font-tamil leading-tight">
                  Medical Report Analysis
                </h3>
                <p className="text-white/70 text-lg">
                  Upload your blood test or CBC reports and our AI will help you understand the results and triage for potential seasonal diseases.
                </p>
                <Link href="/public-portal/report-analysis" className="inline-flex items-center gap-3 bg-gov-gold text-gov-navy px-8 py-4 rounded-xl font-black hover:bg-white transition-all shadow-xl shadow-gov-gold/20 group">
                  Try Report Analyzer <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                      <div className="w-10 h-10 rounded-full bg-gov-teal/20 flex items-center justify-center">
                        <FileText size={20} className="text-gov-teal" />
                      </div>
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gov-teal w-3/4 animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-white/5 rounded-full w-full" />
                      <div className="h-2 bg-white/5 rounded-full w-5/6" />
                      <div className="h-2 bg-white/5 rounded-full w-4/6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Government Schemes */}
          <div className="space-y-10">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-gov-navy font-tamil">Government Health Schemes</h3>
              <p className="text-gov-gray font-medium">Free healthcare and support programs by the Government of Tamil Nadu.</p>
            </div>
            <GovSchemes />
          </div>

          {/* SMS Subscription Section */}
          <div id="sms" className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 space-y-6">
                <h3 className="text-3xl font-black text-gov-navy font-tamil">Stay Alert with SMS</h3>
                <p className="text-gov-gray leading-relaxed">
                  Join 12,408 citizens receiving real-time health alerts for their specific ward. Be the first to know about surge risks in your area.
                </p>
                <ul className="space-y-3">
                  {['14-day early warning', 'Ward-specific alerts', 'Precautions in Tamil', 'Completely Free'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-gov-navy">
                      <CheckCircle2 size={18} className="text-gov-teal" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-12">
                <SMSSubscription />
              </div>
            </div>
          </div>

        </div>
      </section>

      <GovFooter />
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}

import { CheckCircle2, Sparkles } from 'lucide-react';
