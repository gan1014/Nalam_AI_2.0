'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Stethoscope, 
  Send, 
  X, 
  Minimize2, 
  User, 
  Bot, 
  AlertCircle, 
  Phone,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // Changed to string for stable hydration
}

const DrNalamChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial message with stable timestamp on client
    setMessages([
      {
        role: 'assistant',
        content: 'வணக்கம்! நான் டாக்டர் நலம். உங்கள் அறிகுறிகளை என்னிடம் சொல்லுங்கள். \n\nHello! I\'m Dr. Nalam, your AI health assistant. Tell me your symptoms and I\'ll help you understand whether you need emergency care, a doctor visit, or home care. Remember: for emergencies, always call 108.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToSend = presetText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          district: 'Chennai',
          language: /[\u0B80-\u0BFF]/.test(textToSend) ? 'ta' : 'en'
        })
      });

      const data = await response.json();

      if (data.text) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again or visit your nearest PHC.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { en: 'I have fever', ta: 'எனக்கு காய்ச்சல் உள்ளது' },
    { en: 'Dengue symptoms?', ta: 'டெங்கு அறிகுறிகள்?' },
    { en: 'Find nearest PHC', ta: 'அருகிலுள்ள PHC' },
    { en: 'Emergency Help', ta: 'அவசர உதவி' }
  ];

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-white px-4 py-2 rounded-full shadow-lg border border-slate-200 text-gov-navy font-bold text-sm hidden md:flex items-center gap-2"
            >
              <Sparkles size={16} className="text-gov-teal animate-pulse" />
              Ask Dr. Nalam
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            setUnreadCount(0);
          }}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          } bg-gradient-to-br from-gov-teal to-gov-blue text-white hover:scale-110 active:scale-95 group relative`}
        >
          <div className="absolute inset-0 rounded-full bg-gov-teal/20 animate-ping group-hover:hidden" />
          <Stethoscope size={30} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[10000] w-[380px] h-[600px] max-h-[calc(100vh-40px)] bg-[#0d1421] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-gov-navy to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gov-teal/20 border border-gov-teal/30 flex items-center justify-center text-gov-teal">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-none flex items-center gap-1.5">
                    Dr. Nalam <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">AI Health Assistant | டாக்டர் நலம்</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Minimize2 size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Emergency Banner */}
            <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500" />
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                Emergency? Call 108 Immediately
              </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === 'user' 
                      ? 'bg-gov-teal text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none shadow-md'
                  }`}>
                    {m.role === 'assistant' && (m.content.includes('108') || m.content.includes('EMERGENCY')) ? (
                      <div className="space-y-3">
                        <div className="whitespace-pre-wrap">{m.content}</div>
                        <button 
                          onClick={() => window.location.href = 'tel:108'}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-600/20"
                        >
                          <Phone size={16} /> CALL 108 NOW
                        </button>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    )}
                    <div className={`text-[10px] mt-1.5 opacity-50 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gov-teal rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-gov-teal rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-gov-teal rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="p-4 pt-0 flex flex-wrap gap-2">
                {quickActions.map(action => (
                  <button 
                    key={action.en}
                    onClick={() => handleSendMessage(undefined, action.en)}
                    className="text-[10px] bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors flex flex-col"
                  >
                    <span className="font-bold">{action.en}</span>
                    <span className="font-tamil opacity-60 text-[9px]">{action.ta}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask symptoms or health info..."
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-gov-teal/50 transition-all placeholder:text-slate-500"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 w-8 h-8 rounded-lg bg-gov-teal text-white flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[9px] text-slate-500 mt-2 text-center">
                ⚠ AI Assistant — Not a substitute for professional medical care
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Bubble */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-6 right-6 z-[10000] bg-gov-teal text-white p-4 rounded-2xl shadow-2xl border-2 border-white/20 flex items-center gap-3 animate-bounce"
          >
            <MessageSquare size={24} />
            <span className="font-bold text-sm">Resume with Dr. Nalam</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default DrNalamChatbot;
