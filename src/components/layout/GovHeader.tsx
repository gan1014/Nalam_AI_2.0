'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, PhoneCall, ShieldCheck } from 'lucide-react';

const GovHeader = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Disease Risk Map', href: '/admin/risk-map' },
    { name: 'Public Health Portal', href: '/' },
    { name: 'PHC Finder', href: '/public-portal/phc-finder' },
    { name: 'Medicine Tracker', href: '/public-portal/pharmacy' },
    { name: 'Report Analysis', href: '/public-portal/report-analysis' },
  ];

  return (
    <header className="w-full flex flex-col font-sans border-b-4 border-gov-gold">
      {/* Top Bar */}
      <div className="bg-gov-navy text-white text-xs py-1.5 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span>🇮🇳</span>
          <span className="hidden md:inline">Government of Tamil Nadu | தமிழ்நாடு அரசு</span>
          <span className="md:hidden">TN Gov | தமிழ்நாடு அரசு</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-2">
            <button className="hover:text-gov-gold transition-colors">A+</button>
            <button className="hover:text-gov-gold transition-colors">A</button>
            <button className="hover:text-gov-gold transition-colors">A-</button>
          </div>
          <span className="hidden md:inline text-white/40">|</span>
          <button className="hover:text-gov-gold transition-colors hidden md:inline">Screen Reader</button>
          <span className="hidden md:inline text-white/40">|</span>
          <button className="hover:text-gov-gold transition-colors">Skip to Content</button>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* TN Emblem Programmatic SVG */}
          <div className="w-16 h-16 shrink-0">
            <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-md">
              <circle cx="40" cy="40" r="38" fill="#1a237e" stroke="#f57f17" strokeWidth="2"/>
              <circle cx="40" cy="40" r="30" fill="none" stroke="#f57f17" strokeWidth="1"/>
              <circle cx="40" cy="18" r="5" fill="#f57f17"/>
              {[0,45,90,135,180,225,270,315].map((angle, i) => (
                <line key={i} x1="40" y1="18" 
                  x2={40 + 8*Math.sin(angle*Math.PI/180)} 
                  y2={18 - 8*Math.cos(angle*Math.PI/180)}
                  stroke="#f57f17" strokeWidth="1"/>
              ))}
              <rect x="36" y="30" width="8" height="20" rx="2" fill="#f57f17"/>
              <ellipse cx="40" cy="28" rx="5" ry="3" fill="#f57f17"/>
              <path d="M15 60 Q25 55 35 60 Q45 65 55 60 Q65 55 65 60" 
                    fill="none" stroke="#f57f17" strokeWidth="1.5"/>
              <text x="40" y="72" textAnchor="middle" fill="#f57f17" 
                    fontSize="6" fontWeight="bold">TAMIL NADU</text>
            </svg>
          </div>

          <div className="w-[1px] h-12 bg-gray-200 hidden md:block mx-1"></div>

          {/* New Nalam AI Logo */}
          <div className="w-16 h-16 shrink-0">
            <img src="/images/logo.png" alt="Nalam AI Logo" className="w-full h-full object-contain" />
          </div>
          
          {/* Title Block */}
          <div className="flex flex-col text-center md:text-left">
            <h1 className="text-2xl md:text-[28px] font-bold text-gov-navy font-tamil leading-tight">நலம் AI</h1>
            <h2 className="text-sm md:text-[18px] text-gov-blue font-semibold tracking-wide leading-tight mt-0.5">Nalam AI — Disease Surveillance System</h2>
            <p className="text-[10px] md:text-[13px] text-gov-gray font-medium mt-1 uppercase tracking-wider">Tamil Nadu Department of Health & Family Welfare</p>
          </div>
        </div>

        {/* Ministry Block */}
        <div className="hidden lg:flex flex-col items-end text-right border-l-2 border-gray-100 pl-6 py-1">
          <span className="text-[10px] text-gov-gray font-bold uppercase tracking-widest mb-1">Supported by:</span>
          <div className="flex gap-4 items-center">
            <span className="text-sm font-bold text-gov-navy">TNSDC</span>
            <span className="w-1 h-1 rounded-full bg-gov-gray/30"></span>
            <span className="text-sm font-bold text-gov-navy">NHM Tamil Nadu</span>
            <span className="w-1 h-1 rounded-full bg-gov-gray/30"></span>
            <span className="text-sm font-bold text-gov-navy">IDSP</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-gov-blue relative shadow-md z-50">
        <div className="px-4 md:px-8 flex items-center justify-between lg:justify-start">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-3 text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex flex-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className={`px-5 py-4 text-sm font-semibold transition-all ${
                  pathname === link.href 
                    ? 'text-white border-b-4 border-gov-gold bg-white/10' 
                    : 'text-white/80 hover:text-white hover:bg-white/5 border-b-4 border-transparent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/admin/login"
              className="ml-4 mr-2 px-4 py-1.5 bg-gov-navy border border-gov-gold text-gov-gold hover:bg-gov-gold hover:text-gov-navy rounded-full text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck size={14} /> Admin Login
            </Link>
          </nav>

          {/* Emergency Numbers */}
          <div className="flex items-center gap-1 md:gap-3 py-2">
            <a href="tel:104" className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gov-red text-white text-[11px] md:text-sm font-bold rounded-lg shadow-lg hover:bg-red-800 transition-colors animate-pulse">
              <PhoneCall size={14} className="md:w-[16px] md:h-[16px]" />
              <span>Helpline: 104</span>
            </a>
            <a href="tel:108" className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gov-red text-white text-[11px] md:text-sm font-bold rounded-lg shadow-lg hover:bg-red-800 transition-colors animate-pulse">
              <span className="text-lg leading-none">🚑</span>
              <span>Ambulance: 108</span>
            </a>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <nav className="lg:hidden flex flex-col bg-gov-blue border-t border-white/10 absolute w-full left-0 top-full shadow-2xl">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-6 py-4 text-sm font-semibold border-b border-white/5 ${
                  pathname === link.href 
                    ? 'text-gov-gold bg-white/5' 
                    : 'text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-4 text-sm font-bold text-gov-gold hover:bg-white/5 border-b border-white/5 flex items-center gap-2"
            >
              <ShieldCheck size={18} /> Admin Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default GovHeader;
