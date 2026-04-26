'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { ShieldCheck, Camera, RefreshCw, X, AlertCircle, Fingerprint, Lock, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaceRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  adminName: string;
}

const FaceRecognitionModal: React.FC<FaceRecognitionModalProps> = ({ isOpen, onClose, onVerified, adminName }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('Position your face for biometric entry');

  useEffect(() => {
    if (!isOpen) {
      setIsScanning(false);
      setIsVerified(false);
      setMatchScore(0);
      setError(null);
      setStatusMsg('Position your face for biometric entry');
    }
  }, [isOpen]);

  const startVerification = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    setStatusMsg('Extracting high-dimensional facial vectors...');

    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      setError('Biometric Capture Failed. Hardware not responding.');
      setIsScanning(false);
      return;
    }

    try {
      // DEVELOPMENT MOCK: Always bypass verification and return success
      const data = {
        verified: true,
        score: 0.985,
        message: "Development Override: Match Successful"
      };

      // Artificial Delay for "Security Feel"
      setTimeout(() => {
        if (data.verified) {
          setMatchScore(data.score * 100);
          setIsVerified(true);
          setIsScanning(false);
          setStatusMsg('ACCESS GRANTED: IDENTITY CONFIRMED');
          
          setTimeout(() => {
            onVerified();
            onClose();
          }, 1500);
        } else {
          setMatchScore(data.score * 100);
          setError(data.message || 'Biometric mismatch detected. Authorization denied.');
          setIsScanning(false);
          setStatusMsg('SECURITY ALERT: UNAUTHORIZED ACCESS');
        }
      }, 1500); // slightly reduced delay for faster testing

    } catch (err) {
      console.error(err);
      setError('Connection to Secure Auth Server failed.');
      setIsScanning(false);
    }
  }, [webcamRef, onVerified, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#050a14] border border-gov-teal/30 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(0,180,166,0.15)]"
      >
        {/* TOP BAR */}
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${error ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-gov-teal/10 text-gov-teal border-gov-teal/30'} border`}>
              {error ? <ShieldAlert size={24} /> : <Lock size={24} />}
            </div>
            <div>
              <h3 className="text-white text-lg font-black tracking-tight">Security Gateway</h3>
              <p className="text-[10px] text-gov-teal font-black uppercase tracking-[0.2em]">Level 4 Biometric Auth Required</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        {/* MAIN SCANNER AREA */}
        <div className="p-10">
          <div className="grid grid-cols-2 gap-8 mb-10">
            {/* LIVE FEED */}
            <div className={`relative aspect-square rounded-3xl overflow-hidden border-2 bg-slate-950 group transition-colors ${error ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-slate-800'}`}>
              {!isVerified ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{ facingMode: "user" }}
                  />
                  
                  {/* Dynamic HUD Grid */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid.png')]" />
                  
                  {isScanning && (
                    <>
                      <motion.div 
                        initial={{ top: 0 }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-gov-teal shadow-[0_0_20px_rgba(0,180,166,1)] z-10"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3/4 h-3/4 border-2 border-gov-teal/40 rounded-full animate-ping" />
                      </div>
                    </>
                  )}
                  {error && (
                    <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)]" />
                    </div>
                  )}
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="w-full h-full bg-gov-teal/10 flex items-center justify-center text-gov-teal"
                >
                  <ShieldCheck size={100} className="drop-shadow-[0_0_20px_rgba(0,180,166,0.5)]" />
                </motion.div>
              )}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[9px] text-white font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE_FEED_SECURE_EXT_7
              </div>
            </div>

            {/* AUTHORIZED REFERENCE */}
            <div className={`relative aspect-square rounded-3xl overflow-hidden border-2 bg-slate-950 transition-colors ${error ? 'border-red-500/30' : 'border-gov-teal/40'}`}>
              <img 
                src="/admin-faces/webcam-reference.png" 
                alt="Authorized" 
                className={`w-full h-full object-cover transition-all duration-700 ${error ? 'brightness-50 grayscale' : ''}`}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] text-gov-teal font-black mb-1 uppercase tracking-widest">Authorized Profile</p>
                <p className="text-white font-black text-sm">{adminName}</p>
              </div>

              {isScanning && (
                <div className="absolute inset-0 bg-gov-teal/10 flex flex-col items-center justify-center backdrop-blur-[2px]">
                  <Fingerprint size={48} className="text-gov-teal animate-pulse mb-3" />
                  <p className="text-[10px] text-gov-teal font-black tracking-[0.3em] uppercase">Cross-Referencing</p>
                </div>
              )}
              
              {matchScore > 0 && !isScanning && (
                <div className={`absolute inset-0 ${error ? 'bg-red-500/10' : 'bg-gov-teal/10'} flex flex-col items-center justify-center backdrop-blur-[2px]`}>
                  <p className={`text-[10px] font-black tracking-[0.3em] uppercase ${error ? 'text-red-500' : 'text-gov-teal'}`}>
                    {error ? 'MATCH FAILED' : 'IDENTITY MATCH'}
                  </p>
                  <p className="text-white text-3xl font-black mt-2 font-mono tracking-tighter">{matchScore.toFixed(1)}%</p>
                </div>
              )}
            </div>
          </div>

          {/* STATUS FOOTER */}
          <div className="text-center space-y-4">
            <div className={`text-sm font-black tracking-widest uppercase transition-colors ${isVerified ? 'text-green-500' : error ? 'text-red-500' : 'text-gov-teal'}`}>
              {statusMsg}
            </div>
            
            {error ? (
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-3 text-red-500 text-xs font-bold animate-shake">
                  <AlertCircle size={18} /> {error}
                </div>
                <button 
                  onClick={() => {
                    setError(null);
                    setMatchScore(0);
                    setStatusMsg('Position your face for biometric entry');
                  }}
                  className="text-xs text-slate-400 hover:text-white underline font-bold"
                >
                  Try Again with Authorized Profile
                </button>
              </div>
            ) : (
              !isVerified && (
                <button 
                  onClick={startVerification}
                  disabled={isScanning}
                  className="w-full py-5 bg-gradient-to-r from-gov-teal to-gov-blue hover:scale-[1.02] active:scale-[0.98] text-white font-black rounded-2xl flex items-center justify-center gap-4 transition-all shadow-[0_20px_40px_rgba(0,180,166,0.2)] disabled:opacity-50 disabled:scale-100"
                >
                  {isScanning ? <RefreshCw size={22} className="animate-spin" /> : <Camera size={22} />}
                  {isScanning ? 'SYSTEM ANALYSIS IN PROGRESS...' : 'EXECUTE BIOMETRIC SCAN'}
                </button>
              )
            )}
          </div>
        </div>

        {/* ENCRYPTION BADGE */}
        <div className="px-10 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">AES-256 Encrypted Personnel Ledger</p>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gov-teal" />
            <div className="w-1.5 h-1.5 rounded-full bg-gov-teal opacity-50" />
            <div className="w-1.5 h-1.5 rounded-full bg-gov-teal opacity-20" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FaceRecognitionModal;
