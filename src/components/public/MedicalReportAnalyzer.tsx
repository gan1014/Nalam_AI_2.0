'use client';
import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Share2, 
  ArrowRight,
  ShieldAlert,
  Loader2,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MedicalReportAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState('CBC');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const analyzeReport = async () => {
    if (!file || !hasAcceptedDisclaimer) return;

    setIsAnalyzing(true);
    setResults(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportType', reportType);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.analysis) {
        setResults(data.analysis);
      } else {
        setError(data.error || 'Failed to analyze report');
      }
    } catch (err) {
      setError('An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!results) return;
    const element = document.createElement("a");
    const file = new Blob([`NALAM AI - MEDICAL REPORT ANALYSIS\nType: ${reportType}\nDate: ${new Date().toLocaleDateString()}\n\n${results}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Nalam_AI_Analysis_${reportType}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (!results) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nalam AI Medical Analysis',
          text: `Check out my Nalam AI medical report analysis for ${reportType}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(results);
      alert('Analysis copied to clipboard!');
    }
  };

  const reportTypes = [
    { id: 'CBC', label: 'CBC Blood Count' },
    { id: 'DENGUE', label: 'Dengue NS1/IgM' },
    { id: 'MALARIA', label: 'Malaria Test' },
    { id: 'TYPHOID', label: 'Typhoid Test' },
    { id: 'GENERAL', label: 'General Blood Test' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-gov-teal/10 text-gov-teal px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-gov-teal/20">
          <FileText size={14} /> AI Diagnostic Support
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gov-navy font-tamil leading-tight">
          Medical Report Analysis | மருத்துவ அறிக்கை பகுப்பாய்வு
        </h1>
        <p className="text-gov-gray font-medium max-w-2xl mx-auto">
          Upload your blood test, CBC, or dengue report for instant AI interpretation and health guidance.
        </p>
      </div>

      {/* DISCLAIMER BOX */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-red-500 text-white p-2 rounded-lg shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-red-900 font-bold text-lg mb-1">⚠ Important Notice | முக்கியமான அறிவிப்பு</h3>
              <p className="text-red-700 text-sm leading-relaxed">
                This AI analysis is for <strong>EDUCATIONAL PURPOSES ONLY</strong>. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified doctor at a Government PHC for medical decisions. For emergencies, call 108 immediately.
              </p>
              <p className="text-red-700/70 text-xs mt-2 font-tamil">
                இந்த AI பகுப்பாய்வு கல்வி நோக்கங்களுக்காக மட்டுமே. மருத்துவர் ஆலோசனைக்கு மாற்றாகாது.
              </p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={hasAcceptedDisclaimer}
                onChange={(e) => setHasAcceptedDisclaimer(e.target.checked)}
                className="w-5 h-5 rounded border-red-300 text-red-600 focus:ring-red-500 transition-all"
              />
              <span className="text-red-900 font-bold text-sm group-hover:underline">✓ I understand and accept these terms — Proceed</span>
            </label>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 ${hasAcceptedDisclaimer ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* UPLOAD PANEL */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-gov-navy font-bold mb-4 flex items-center gap-2">
                <Upload size={18} className="text-gov-teal" /> 1. Upload Report
              </h3>
              
              <label className="block w-full cursor-pointer group">
                <div className="border-2 border-dashed border-gray-200 group-hover:border-gov-teal group-hover:bg-gov-teal/5 rounded-xl p-8 transition-all flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="text-gray-400 group-hover:text-gov-teal" size={24} />
                  </div>
                  <p className="text-sm font-bold text-gov-navy group-hover:text-gov-teal">
                    {file ? file.name : 'Drag & Drop or Browse'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">PDF, JPG, PNG (Max 10MB)</p>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </label>

              <div className="mt-6">
                <h3 className="text-gov-navy font-bold mb-3 flex items-center gap-2">
                  <Search size={18} className="text-gov-teal" /> 2. Select Report Type
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {reportTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setReportType(type.id)}
                      className={`px-4 py-3 rounded-lg text-xs font-bold text-left transition-all border ${
                        reportType === type.id 
                          ? 'bg-gov-teal text-white border-gov-teal shadow-lg shadow-gov-teal/20' 
                          : 'bg-gray-50 text-gov-gray border-gray-100 hover:bg-gray-100'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={analyzeReport}
                disabled={!file || isAnalyzing}
                className="w-full mt-8 bg-gov-navy hover:bg-gov-blue text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-xl shadow-gov-navy/10 group"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Analyzing Report...
                  </>
                ) : (
                  <>
                    Start AI Analysis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-gov-teal/20 border-t-gov-teal rounded-full animate-spin" />
                    <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gov-teal" size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gov-navy">Processing Lab Data...</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                      Dr. Nalam AI is extracting key metrics and comparing them against standard clinical ranges.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-2 h-2 bg-gov-teal rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />
                    ))}
                  </div>
                </motion.div>
              ) : results ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gov-teal p-6 text-white flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">Analysis Results</h3>
                      <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{reportType} REPORT • PROCESSED BY NALAM AI</p>
                    </div>
                    <CheckCircle2 size={32} />
                  </div>
                  
                  <div className="p-8 prose prose-slate max-w-none prose-sm">
                    <div className="whitespace-pre-wrap font-medium text-gov-navy leading-relaxed">
                      {results}
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-4">
                    <button 
                      onClick={handleDownload}
                      className="flex-1 bg-white border border-gray-200 text-gov-navy font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <Download size={18} /> Download Results
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex-1 bg-white border border-gray-200 text-gov-navy font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <Share2 size={18} /> Share Analysis
                    </button>
                    <button 
                      onClick={() => window.location.href = 'tel:108'}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-xl shadow-red-600/20"
                    >
                      <Phone size={20} /> EMERGENCY? CALL 108 NOW
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gray-50/50 rounded-2xl p-12 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <FileText className="text-gray-300" size={40} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gov-gray">Awaiting Report Upload</h3>
                    <p className="text-sm text-gray-400 max-w-xs">
                      Your analysis will appear here once you upload a file and start the processing.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReportAnalyzer;
