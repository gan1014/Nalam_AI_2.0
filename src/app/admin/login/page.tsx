'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const generateRandomCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setCaptchaText(generateRandomCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptchaText(generateRandomCaptcha());
    setCaptchaInput('');
  };

  useEffect(() => {
    if (canvasRef.current && captchaText) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      ctx.fillStyle = '#a3cfd1'; 
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = '#112a75';
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.lineWidth = Math.random() * 2;
        ctx.stroke();
      }

      ctx.font = 'bold 36px "Courier New", Courier, monospace';
      ctx.fillStyle = '#112a75';
      ctx.textBaseline = 'middle';
      
      for (let i = 0; i < captchaText.length; i++) {
        const char = captchaText[i];
        const x = (width / captchaText.length) * i + 20;
        const y = (height / 2) + (Math.random() * 6 - 3); 
        const angle = (Math.random() - 0.5) * 0.4; 

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(1 + Math.random() * 0.3, 1 + Math.random() * 0.3); 
        ctx.fillText(char, -10, 0);
        ctx.restore();
      }

      // Apply heavy pixel distortion to mimic classic CAPTCHAs
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const newImageData = ctx.createImageData(width, height);
      const newPixels = newImageData.data;

      // Fill new image with background color first
      for (let i = 0; i < newPixels.length; i += 4) {
        newPixels[i] = 163;     // #a3
        newPixels[i + 1] = 207; // #cf
        newPixels[i + 2] = 209; // #d1
        newPixels[i + 3] = 255; // alpha
      }

      const phaseX = Math.random() * Math.PI * 2;
      const phaseY = Math.random() * Math.PI * 2;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const offsetX = Math.floor(Math.sin(y / 8 + phaseY) * 4);
          const offsetY = Math.floor(Math.sin(x / 10 + phaseX) * 3);
          
          const srcY = y + offsetY;
          const srcX = x + offsetX;
          
          if (srcY >= 0 && srcY < height && srcX >= 0 && srcX < width) {
            const srcIdx = (srcY * width + srcX) * 4;
            const dstIdx = (y * width + x) * 4;
            newPixels[dstIdx] = pixels[srcIdx];
            newPixels[dstIdx + 1] = pixels[srcIdx + 1];
            newPixels[dstIdx + 2] = pixels[srcIdx + 2];
            newPixels[dstIdx + 3] = pixels[srcIdx + 3];
          }
        }
      }
      ctx.putImageData(newImageData, 0, 0);
    }
  }, [captchaText]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
      setError('Invalid CAPTCHA. Please try again.');
      refreshCaptcha();
      setLoading(false);
      return;
    }

    // Mock authentication for demonstration
    setTimeout(() => {
      if (username === 'admin' && password === 'tnhealth2026') {
        document.cookie = "auth_token=admin_token; path=/; max-age=86400";
        router.push('/admin');
      } else {
        setError('Invalid credentials. For demo, use: admin / tnhealth2026');
        refreshCaptcha();
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gov-offwhite flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        
        <div className="bg-gov-navy p-8 text-center border-b-4 border-gov-gold">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-gov-navy overflow-hidden">
            <img src="/images/logo.png" alt="Nalam AI Logo" className="w-full h-full object-cover scale-110" />
          </div>
          <h1 className="text-2xl font-bold text-white font-tamil mb-1">நிர்வாகி உள்நுழைவு</h1>
          <h2 className="text-sm font-semibold text-gov-gold uppercase tracking-widest">Nalam AI Command Center</h2>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 mb-6 text-sm font-bold border border-red-200">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gov-gray mb-1 uppercase">Official ID</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-teal outline-none transition-all text-gray-900 font-medium"
                  placeholder="Enter employee ID"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gov-gray mb-1 uppercase">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-teal outline-none transition-all text-gray-900 font-medium"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gov-gray uppercase">Human Verification</label>
                <button 
                  type="button" 
                  onClick={refreshCaptcha} 
                  className="text-xs text-gov-blue hover:text-gov-teal transition-colors font-bold flex items-center"
                >
                  ⟳ REFRESH
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-full h-16 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
                  <canvas 
                    ref={canvasRef} 
                    width={250} 
                    height={64} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <input 
                  type="text" 
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-teal outline-none transition-all text-center font-bold font-mono tracking-widest uppercase text-gray-900"
                  placeholder="Enter characters above"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gov-teal text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition-colors shadow-md disabled:opacity-70 flex justify-center mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'SECURE LOGIN'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gov-blue hover:underline font-semibold">
              ← Back to Public Portal
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-500 max-w-sm">
        <p>This is a restricted government portal. Unauthorized access is prohibited under the IT Act 2000.</p>
      </div>
    </div>
  );
}
