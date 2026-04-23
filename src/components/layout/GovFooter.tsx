import React from 'react';
import Link from 'next/link';
import { PhoneCall, MapPin, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

const GovFooter = () => {
  return (
    <footer className="bg-gov-dark text-white pt-12 pb-6 border-t-[6px] border-gov-gold font-sans">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          
          {/* Column 1: Branding */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold font-tamil text-gov-gold">நலம் AI</h2>
              <span className="text-xl font-semibold border-l border-white/20 pl-3">Nalam AI</span>
            </div>
            <p className="text-gov-offwhite mb-6 text-sm leading-relaxed max-w-sm">
              Protecting 77 million Tamil Nadu citizens through AI-powered early warning disease surveillance across all 38 districts.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gov-blue transition-colors text-white">
                <span className="sr-only">Twitter</span>
                𝕏
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gov-blue transition-colors text-white">
                <span className="sr-only">Facebook</span>
                f
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gov-gold">
              Quick Links <span className="text-sm font-tamil font-normal text-white/80">| விரைவு இணைப்புகள்</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm text-gov-offwhite">
              <li><Link href="/admin/risk-map" className="hover:text-gov-gold transition-colors">Disease Risk Check</Link></li>
              <li><Link href="/public-portal/phc-finder" className="hover:text-gov-gold transition-colors">PHC Finder</Link></li>
              <li><Link href="/public-portal/pharmacy" className="hover:text-gov-gold transition-colors">Medicine Tracker</Link></li>
              <li><Link href="/public-portal/community-report" className="hover:text-gov-gold transition-colors">Community Report</Link></li>
              <li><Link href="/#sms" className="hover:text-gov-gold transition-colors">SMS Subscribe</Link></li>
              <li><Link href="/admin/login" className="hover:text-gov-gold transition-colors">Admin Login</Link></li>
              <li><Link href="#" className="hover:text-gov-gold transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-gov-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-gov-gold transition-colors">RTI Information</Link></li>
            </ul>
          </div>

          {/* Column 3: Emergency Contacts */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gov-gold">
              Emergency Contacts <span className="text-sm font-tamil font-normal text-white/80">| அவசர தொடர்பு</span>
            </h3>
            <div className="space-y-4">
              <a href="tel:108" className="flex items-center gap-3 bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                <div className="bg-gov-red p-2 rounded-md"><AlertCircle size={20} className="text-white"/></div>
                <div>
                  <div className="font-bold text-lg">108 — EMRI Ambulance</div>
                  <div className="text-xs text-white/70">Free, 24/7 Emergency Service</div>
                </div>
              </a>
              
              <a href="tel:104" className="flex items-center gap-3 bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                <div className="bg-gov-teal p-2 rounded-md"><PhoneCall size={20} className="text-white"/></div>
                <div>
                  <div className="font-bold text-lg">104 — Health Helpline</div>
                  <div className="text-xs text-white/70">State Medical Advice & Complaints</div>
                </div>
              </a>

              <div className="text-sm text-gov-offwhite space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gov-gold shrink-0"/>
                  <span>044-1070 — Greater Chennai Disaster Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-gov-gold shrink-0"/>
                  <span>1800-XXX-XXXX — TNMSC Medicine Helpline</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gov-offwhite/80 space-y-1">
            <p>© 2026 Government of Tamil Nadu | Department of Health & Family Welfare</p>
            <p>Developed under TNSDC Naan Mudhalvan 2026 Programme</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gov-offwhite/80 font-medium">
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-gov-green"/> CERT-In Compliant</span>
            <span className="text-white/30">|</span>
            <span>DPDP Act 2023</span>
            <span className="text-white/30">|</span>
            <span>RTI Act 2005</span>
            <span className="text-white/30">|</span>
            <span className="text-gov-gold">Powered by Nalam AI — PS08 Solution</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default GovFooter;
