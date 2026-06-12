'use client';
import { useState, useEffect } from 'react';

// DYNAMIC DISEASE ALERTS (pulls from current risk data)
const DYNAMIC_ALERTS = [
  {
    icon: '🔴',
    text: 'DENGUE ALERT: Chennai, Tiruvallur districts at HIGH risk this week — remove standing water, use repellent',
    text_tamil: 'டெங்கு எச்சரிக்கை: சென்னை, திருவள்ளூர் மாவட்டங்களில் அதிக ஆபத்து — தேங்கிய நீரை அகற்றுங்கள், விரட்டி பயன்படுத்துங்கள்',
    severity: 'high',
    badge_color: '#DC2626',
  },
  {
    icon: '🟡',
    text: 'SCRUB TYPHUS WATCH: Vellore, Krishnagiri — field workers should wear full sleeves during harvest season',
    text_tamil: 'ஸ்க்ரப் டைபஸ் கவனிக்கவும்: வேலூர், கிருஷ்ணகிரி — அறுவடை பருவத்தில் கை மூடும் ஆடை அணியுங்கள்',
    severity: 'watch',
    badge_color: '#D97706',
  },
  {
    icon: '☀️',
    text: 'HEAT ADVISORY: Temperature above 40°C in Salem, Erode, Krishnagiri — stay indoors 12PM–4PM, drink ORS',
    text_tamil: 'வெப்ப அறிவிப்பு: சேலம், ஈரோடு, கிருஷ்ணகிரியில் 40°C மேல் — பகல் 12–4 மணிக்கு வெளியில் செல்லாதீர்கள், ORS குடியுங்கள்',
    severity: 'watch',
    badge_color: '#F97316',
  },
  {
    icon: '💧',
    text: 'GASTROENTERITIS WARNING: Cuddalore, Nagapattinam coastal districts — boil drinking water, use ORS sachets',
    text_tamil: 'வயிற்றுப்போக்கு எச்சரிக்கை: கடலூர், நாகப்பட்டினம் — குடிநீரை கொதிக்க வையுங்கள், ORS குடியுங்கள்',
    severity: 'warning',
    badge_color: '#2563EB',
  },
];

// STATIC GOVERNMENT INFORMATION (always visible, rotates in)
const STATIC_INFO = [
  {
    icon: '📞',
    text: 'Health Helpline: 104 (Free, 24/7) | Ambulance: 108 (Free) | Disease Report: 1800-599-1700',
    text_tamil: 'சுகாதார உதவி: 104 (இலவசம், 24/7) | ஆம்புலன்ஸ்: 108 | நோய் அறிக்கை: 1800-599-1700',
    badge_color: '#16A34A',
  },
  {
    icon: '🦟',
    text: 'Dengue Prevention: Empty water containers weekly · Use mosquito nets · Wear full sleeve clothes in evenings',
    text_tamil: 'டெங்கு தடுப்பு: வாரம் ஒருமுறை தண்ணீர் தொட்டிகளை காலி செய்யுங்கள் · கொசு வலை பயன்படுத்துங்கள் · மாலையில் கை மூடும் ஆடை அணியுங்கள்',
    badge_color: '#0891B2',
  },
  {
    icon: '🏥',
    text: 'FREE Testing at all Government PHCs: Dengue NS1 · Scrub Typhus · Malaria · No Aadhaar required',
    text_tamil: 'அனைத்து அரசு PHC-களில் இலவச சோதனை: டெங்கு NS1 · ஸ்க்ரப் டைபஸ் · மலேரியா · ஆதாரை தேவையில்லை',
    badge_color: '#7C3AED',
  },
  {
    icon: '💊',
    text: 'Free Medicines: Paracetamol · ORS · IV Fluids · Doxycycline available at all government hospitals',
    text_tamil: 'இலவச மருந்துகள்: பாராசிட்டமால் · ORS · IV திரவம் · டாக்சிசைக்ளின் — அரசு மருத்துவமனையில்',
    badge_color: '#059669',
  },
  {
    icon: '📋',
    text: 'TNSDC Naan Mudhalvan 2026 · PS08 Disease Surveillance · Protecting 77M Tamil Nadu Citizens',
    text_tamil: 'TNSDC நான் முதல்வன் 2026 · PS08 நோய் கண்காணிப்பு · 7.7 கோடி தமிழ்நாடு மக்களை பாதுகாக்கிறோம்',
    badge_color: '#1D4ED8',
  },
  {
    icon: '🌡️',
    text: 'Symptom Checker: Fever + Joint Pain = Check for Dengue · Fever + Rash = Scrub Typhus · Use AI above',
    text_tamil: 'அறிகுறி சரிபாருங்கள்: காய்ச்சல் + மூட்டு வலி = டெங்கு சோதனை · காய்ச்சல் + சொறி = ஸ்க்ரப் டைபஸ்',
    badge_color: '#B45309',
  },
];

const ALL_TICKER_ITEMS = [...DYNAMIC_ALERTS, ...STATIC_INFO];

export default function GovTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  // Language toggles every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        style={{
          background: '#0D1B4B', // Dark navy — government style
          borderTop: '2px solid #F57F17', // Gold top border
          borderBottom: '2px solid #00B4A6', // Teal bottom border
          overflow: 'hidden',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 50,
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* LEFT: "LIVE HEALTH ALERTS" label — static, always visible */}
        <div
          style={{
            background: '#DC2626',
            color: 'white',
            padding: '0 12px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'white',
              display: 'inline-block',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          LIVE ALERTS
        </div>

        {/* Language toggle button */}
        <button
          onClick={() => setLanguage((l) => (l === 'en' ? 'ta' : 'en'))}
          style={{
            background: '#00695C',
            color: 'white',
            border: 'none',
            padding: '0 10px',
            height: '100%',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
            letterSpacing: '0.3px',
          }}
        >
          {language === 'en' ? 'தமிழ்' : 'ENG'}
        </button>

        {/* SCROLLING CONTENT */}
        <div
          style={{
            overflow: 'hidden',
            flex: 1,
            height: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              animation: isPaused ? 'none' : 'tickerScroll 60s linear infinite',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Render items twice for seamless loop */}
            {[...ALL_TICKER_ITEMS, ...ALL_TICKER_ITEMS].map((item, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginRight: '60px',
                  fontSize: '11.5px',
                  color: 'white',
                  fontFamily: language === 'ta' ? "'Noto Sans Tamil', 'Tamil MN', Arial" : 'Inter, Arial',
                }}
              >
                {/* Severity badge */}
                <span
                  style={{
                    background: item.badge_color,
                    color: 'white',
                    padding: '1px 6px',
                    borderRadius: '3px',
                    fontSize: '9px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>

                {/* Text — toggles between English and Tamil */}
                <span style={{ color: '#E2E8F0' }}>
                  {language === 'ta' ? item.text_tamil : item.text}
                </span>

                {/* Divider */}
                <span style={{ color: '#F57F17', margin: '0 8px', fontWeight: 700 }}>
                  ◆
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: Emergency numbers — static, always visible */}
        <div
          style={{
            background: '#16A34A',
            color: 'white',
            padding: '0 12px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
            fontSize: '11px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <span>📞 104</span>
          <span style={{ color: '#BBF7D0' }}>|</span>
          <span>🚑 108</span>
        </div>
      </div>

      {/* CSS for animation */}
      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @font-face {
          font-family: 'Noto Sans Tamil';
          src: local('Noto Sans Tamil'), local('Tamil MN'), sans-serif;
        }
      `}</style>
    </>
  );
}
