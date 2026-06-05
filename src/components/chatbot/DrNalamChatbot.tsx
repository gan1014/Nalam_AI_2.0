'use client'

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  triage_level?: 'EMERGENCY' | 'DOCTOR' | 'MONITOR' | 'INFO' | null;
  is_emergency?: boolean;
  model_used?: string;
  language?: string;
}

interface Props {
  district?: string;
}

const QUICK_ACTIONS = [
  { en: 'I have fever', ta: 'எனக்கு காய்ச்சல் உள்ளது', emoji: '🌡' },
  { en: 'Dengue symptoms?', ta: 'டெங்கு அறிகுறிகள்?', emoji: '🦟' },
  { en: 'Find nearest PHC', ta: 'அருகிலுள்ள PHC', emoji: '🏥' },
  { en: 'Emergency Help', ta: 'அவசர உதவி', emoji: '🚨' },
  { en: 'Stomach pain & vomiting', ta: 'வயிறு வலி & வாந்தி', emoji: '💊' },
  { en: 'Is water safe to drink?', ta: 'தண்ணீர் பாதுகாப்பானதா?', emoji: '💧' },
];

export default function DrNalamChatbot({ district = 'Tamil Nadu' }: Props) {
  const [isOpen, setIsOpen]       = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [modelStatus, setModelStatus] = useState<'idle'|'loading'|'ready'|'error'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `வணக்கம்! நான் **டாக்டர் நலம்** (Dr. Nalam), தமிழ்நாடு அரசின் AI சுகாதார உதவியாளர்.\n\nHello! I'm **Dr. Nalam**, your AI health assistant for Tamil Nadu.\n\nTell me your symptoms in **Tamil or English** and I'll help you understand:\n🔴 Emergency — Call 108 now\n🟡 Doctor visit needed\n🟢 Home care tips\n\n⚠ *Not a replacement for medical care.*`,
        timestamp: new Date(),
        triage_level: 'INFO',
        is_emergency: false,
      };
      setMessages([welcome]);
    }
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages.length]);

  const sendMessage = useCallback(async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setModelStatus('loading');

    const loadingMessages = [
      '🔄 Connecting to Dr. Nalam AI...',
      '⏳ AI model is warming up (first request takes ~20 seconds)...',
      '🧠 Analyzing your symptoms...',
      '📋 Preparing health guidance...',
    ];
    let msgIdx = 0;
    setLoadingMsg(loadingMessages[0]);
    const loadingInterval = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, loadingMessages.length - 1);
      setLoadingMsg(loadingMessages[msgIdx]);
    }, 8000);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      history.push({ role: 'user', content: messageText });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          district,
          mode: 'chat'
        }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'I apologize, something went wrong. Please try again or call 104.',
        timestamp: new Date(),
        triage_level: data.triage_level,
        is_emergency: data.is_emergency,
        model_used: data.model,
        language: data.language,
      };

      setMessages(prev => [...prev, assistantMsg]);
      setModelStatus('ready');

      if (!isOpen) setUnreadCount(prev => prev + 1);
    } catch (err) {
      console.error('DrNalam sendMessage error:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠ Connection issue. AI models may be loading.\n\nPlease try again in 30 seconds.\n\n📞 **Immediate help:** Call **104** (free health helpline)\n🚑 **Emergency:** Call **108**',
        timestamp: new Date(),
        triage_level: 'INFO',
        is_emergency: false,
      };
      setMessages(prev => [...prev, errorMsg]);
      setModelStatus('error');
    } finally {
      clearInterval(loadingInterval);
      setIsLoading(false);
      setLoadingMsg('');
    }
  }, [input, isLoading, messages, district, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  const getTriageColor = (level?: string | null) => {
    if (level === 'EMERGENCY') return '#DC2626';
    if (level === 'DOCTOR')    return '#D97706';
    if (level === 'MONITOR')   return '#16A34A';
    return 'transparent';
  };

  const panelW = isExpanded ? '440px' : '370px';
  const panelH = isExpanded ? '600px' : '520px';

  return (
    <>
      <div style={{ position:'fixed', bottom:'24px', right:'24px', zIndex:9999 }}>
        {unreadCount > 0 && !isOpen && (
          <div style={{
            position:'absolute', top:'-8px', right:'-8px', zIndex:10000,
            background:'#DC2626', color:'#fff', borderRadius:'50%',
            width:'22px', height:'22px', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'12px', fontWeight:700
          }}>
            {unreadCount}
          </div>
        )}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              display:'flex', alignItems:'center', gap:'8px',
              background:'#0D1B4B', color:'#fff', border:'2px solid #00B4A6',
              borderRadius:'24px', padding:'10px 18px',
              fontSize:'14px', fontWeight:600, cursor:'pointer',
              boxShadow:'0 4px 20px rgba(0,180,166,0.3)',
            }}
          >
            <span style={{fontSize:'20px'}}>⚕</span>
            Ask Dr. Nalam
          </button>
        )}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              display:'block', marginTop:'8px',
              width:'52px', height:'52px', borderRadius:'50%',
              background:'#00695C', border:'none', cursor:'pointer',
              fontSize:'22px', boxShadow:'0 4px 16px rgba(0,105,92,0.4)',
            }}
            title="Voice symptom checker"
          >
            🎙
          </button>
        )}
      </div>

      {isOpen && (
        <div style={{
          position:'fixed', bottom:'24px', right:'24px', zIndex:9998,
          width:panelW, height:panelH,
          background:'#0D1B4B', borderRadius:'16px',
          border:'1px solid #1E3A5F',
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
          display:'flex', flexDirection:'column',
          overflow:'hidden', transition:'all 0.3s ease',
          fontFamily:'Inter, Arial, sans-serif',
        }}>
          <div style={{
            background:'linear-gradient(135deg,#0D1B4B,#1565C0)',
            padding:'12px 16px',
            borderBottom:'2px solid #00B4A6',
          }}>
            <div style={{
              background:'#DC2626', color:'#fff', fontSize:'10px',
              fontWeight:700, textAlign:'center', padding:'3px',
              borderRadius:'4px', marginBottom:'8px', letterSpacing:'0.5px'
            }}>
              ⚡ EMERGENCY? CALL 108 IMMEDIATELY
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <div style={{
                  width:'40px', height:'40px', borderRadius:'50%',
                  background:'#00695C', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:'20px'
                }}>⚕</div>
                <div>
                  <div style={{color:'#fff', fontWeight:700, fontSize:'15px'}}>
                    Dr. Nalam
                    <span style={{
                      marginLeft:'8px', background:'#16A34A', color:'#fff',
                      fontSize:'9px', padding:'2px 6px', borderRadius:'8px',
                      fontWeight:600
                    }}>● Online</span>
                  </div>
                  <div style={{color:'#94A3B8', fontSize:'11px'}}>
                    AI Health Assistant | டாக்டர் நலம்
                  </div>
                </div>
              </div>
              <div style={{display:'flex', gap:'8px'}}>
                <button onClick={() => setIsExpanded(!isExpanded)}
                  style={{background:'none',border:'none',color:'#94A3B8',
                    cursor:'pointer',fontSize:'16px',padding:'4px'}}>
                  {isExpanded ? '⊡' : '⊞'}
                </button>
                <button onClick={() => setIsOpen(false)}
                  style={{background:'none',border:'none',color:'#94A3B8',
                    cursor:'pointer',fontSize:'18px',padding:'4px'}}>
                  ✕
                </button>
              </div>
            </div>
            <div style={{marginTop:'6px', fontSize:'9px', color:'#64748B', textAlign:'right'}}>
              {modelStatus === 'loading' ? '⏳ AI model loading...' :
               modelStatus === 'ready'   ? '✓ Mistral-7B Active' :
               modelStatus === 'error'   ? '⚠ Using fallback' :
               '🤗 Hugging Face Free Tier'}
            </div>
          </div>

          <div style={{
            flex:1, overflowY:'auto', padding:'12px',
            display:'flex', flexDirection:'column', gap:'10px',
            background:'#0F1C35',
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display:'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width:'28px', height:'28px', borderRadius:'50%',
                    background:'#00695C', display:'flex', alignItems:'center',
                    justifyContent:'center', fontSize:'14px',
                    flexShrink:0, marginRight:'6px', alignSelf:'flex-end'
                  }}>⚕</div>
                )}
                <div style={{maxWidth:'82%'}}>
                  {msg.is_emergency && (
                    <div style={{
                      background:'#DC2626', color:'#fff', borderRadius:'8px',
                      padding:'8px 12px', marginBottom:'6px', textAlign:'center',
                    }}>
                      <div style={{fontWeight:700, fontSize:'13px'}}>🚨 EMERGENCY</div>
                      <a href="tel:108" style={{
                        display:'block', background:'#fff', color:'#DC2626',
                        borderRadius:'6px', padding:'6px', marginTop:'4px',
                        fontWeight:700, fontSize:'14px', textDecoration:'none',
                      }}>📞 CALL 108 NOW</a>
                    </div>
                  )}
                  {msg.triage_level && msg.triage_level !== 'INFO' && msg.triage_level !== 'EMERGENCY' && (
                    <div style={{
                      fontSize:'10px', fontWeight:600, padding:'2px 8px',
                      borderRadius:'4px', marginBottom:'4px', display:'inline-block',
                      background: msg.triage_level === 'DOCTOR' ? '#FEF3C7' : '#DCFCE7',
                      color: msg.triage_level === 'DOCTOR' ? '#D97706' : '#16A34A',
                    }}>
                      {msg.triage_level === 'DOCTOR' ? '🟡 Visit Doctor' : '🟢 Home Care'}
                    </div>
                  )}
                  <div style={{
                    background: msg.role === 'user' ? '#00695C' : '#1E293B',
                    color:'#F8FAFC', borderRadius: msg.role === 'user'
                      ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    padding:'10px 14px', fontSize:'13px', lineHeight:'1.55',
                    borderLeft: msg.role === 'assistant' && msg.triage_level
                      ? `3px solid ${getTriageColor(msg.triage_level)}`
                      : 'none',
                  }}
                    dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
                  />
                  <div style={{
                    fontSize:'9px', color:'#475569', marginTop:'2px',
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                  }}>
                    {msg.timestamp.toLocaleTimeString('en-IN', {
                      hour:'2-digit', minute:'2-digit'
                    })}
                    {msg.model_used && ` · ${msg.model_used}`}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <div style={{
                  width:'28px', height:'28px', borderRadius:'50%',
                  background:'#00695C', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:'14px'
                }}>⚕</div>
                <div style={{
                  background:'#1E293B', borderRadius:'4px 16px 16px 16px',
                  padding:'10px 14px',
                }}>
                  <div style={{
                    display:'flex', gap:'4px', alignItems:'center',
                    marginBottom:'4px',
                  }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width:'6px', height:'6px', borderRadius:'50%',
                        background:'#00B4A6',
                        animation:`bounce 1.4s ease-in-out ${i*0.2}s infinite`,
                      }}/>
                    ))}
                  </div>
                  <div style={{fontSize:'10px', color:'#64748B'}}>{loadingMsg}</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {messages.length <= 1 && (
            <div style={{
              padding:'8px 12px', background:'#0F1C35',
              borderTop:'1px solid #1E3A5F',
              display:'flex', flexWrap:'wrap', gap:'6px',
            }}>
              {QUICK_ACTIONS.map((qa, i) => (
                <button key={i}
                  onClick={() => sendMessage(qa.en)}
                  disabled={isLoading}
                  style={{
                    background:'#1E293B', color:'#94A3B8',
                    border:'1px solid #243044', borderRadius:'14px',
                    padding:'4px 10px', fontSize:'11px', cursor:'pointer',
                    display:'flex', alignItems:'center', gap:'4px',
                    whiteSpace:'nowrap',
                  }}
                >
                  {qa.emoji} {qa.en}
                  <span style={{color:'#475569', fontSize:'9px'}}>/ {qa.ta}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{
            padding:'10px 12px', background:'#0D1B4B',
            borderTop:'1px solid #1E3A5F',
          }}>
            <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask symptoms or health info... / அறிகுறிகளை கேளுங்கள்..."
                disabled={isLoading}
                style={{
                  flex:1, background:'#1E293B', border:'1px solid #243044',
                  borderRadius:'20px', padding:'8px 14px',
                  color:'#F8FAFC', fontSize:'12px', outline:'none',
                  opacity: isLoading ? 0.6 : 1,
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                style={{
                  width:'36px', height:'36px', borderRadius:'50%',
                  background: isLoading || !input.trim() ? '#243044' : '#00695C',
                  border:'none', cursor: isLoading ? 'wait' : 'pointer',
                  fontSize:'16px', color:'#fff', flexShrink:0,
                  transition:'background 0.2s',
                }}
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
            <div style={{
              fontSize:'9px', color:'#334155', textAlign:'center', marginTop:'4px'
            }}>
              ⚠ AI Assistant — Not a substitute for professional medical care
            </div>
          </div>

          <style>{`
            @keyframes bounce {
              0%,80%,100%{transform:translateY(0)}
              40%{transform:translateY(-6px)}
            }
          `}</style>
        </div>
      )}
    </>
  );
}
