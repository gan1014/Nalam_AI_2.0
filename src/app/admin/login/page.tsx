'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10) + 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (parseInt(captchaAnswer) !== num1 + num2) {
      setError('Invalid CAPTCHA. Please try again.');
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setCaptchaAnswer('');
      setLoading(false);
      return;
    }

    // Mock authentication for demonstration
    setTimeout(() => {
      if (username === 'admin' && password === 'tnhealth2026') {
        router.push('/admin');
      } else {
        setError('Invalid credentials. For demo, use: admin / tnhealth2026');
        setNum1(Math.floor(Math.random() * 10) + 1);
        setNum2(Math.floor(Math.random() * 10) + 1);
        setCaptchaAnswer('');
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
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-teal outline-none transition-all"
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
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-teal outline-none transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gov-gray mb-1 uppercase">Human Verification</label>
              <div className="flex gap-4">
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center font-mono font-bold text-lg text-gov-navy tracking-widest flex-1 select-none">
                  {num1} + {num2} = ?
                </div>
                <input 
                  type="text" 
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-teal outline-none transition-all text-center font-bold"
                  placeholder="Answer"
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
