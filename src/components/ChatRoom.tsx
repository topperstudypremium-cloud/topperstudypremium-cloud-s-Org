import { useState, useEffect, useRef } from 'react';
import { Phone, MoreVertical, Plus, Image as ImageIcon, Mic, X, Check, Send, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ChatRoomProps {
  onBack: () => void;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const ChatRoom = ({ onBack }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm **ALLWIN AI 2**. Ask me anything — I can see images, PDFs & notes. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [voiceSecs, setVoiceSecs] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMsg = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: userMsg }]
          }
        ],
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          systemInstruction: "You are ALLWIN AI 2, a smart and helpful educational assistant. Keep answers clear, concise, and professional. Use markdown for better formatting.",
        }
      });

      setIsTyping(false);
      const aiResponse = response.text || "Sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to my brain right now. Please check your internet or API key." }]);
    }
  };

  const startVoice = () => {
    setShowVoice(true);
    setVoiceSecs(0);
    const interval = setInterval(() => setVoiceSecs(s => s + 1), 1000);
    (window as any)._voiceInterval = interval;
  };

  const closeVoice = () => {
    clearInterval((window as any)._voiceInterval);
    setShowVoice(false);
  };

  const sendVoice = () => {
    if (voiceSecs < 1) return;
    const duration = voiceSecs;
    closeVoice();
    setMessages(prev => [...prev, { role: 'user', text: `🎤 Voice message (${duration}s)` }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: 'Got your voice message! Processing... 🔊' }]);
    }, 1200);
  };

  return (
    <div className="h-full bg-[#13151a] flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="screen-header">
        <button onClick={onBack} className="back">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="text-[18px] font-black italic text-white leading-none uppercase tracking-tighter">ALLWIN AI 2</div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] uppercase font-black tracking-widest text-[#00d4ff]/60">ONLINE</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg viewBox="0 0 50 50" fill="none" className="w-6 h-6">
              <rect x="6" y="14" width="18" height="18" rx="2" stroke="#fff" strokeWidth="2" fill="rgba(255,255,255,0.08)"/>
              <rect x="14" y="6" width="18" height="18" rx="2" stroke="#fff" strokeWidth="2" fill="rgba(255,255,255,0.06)"/>
              <circle cx="38" cy="12" r="5" fill="#fff"/>
            </svg>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-[16px_12px] flex flex-col gap-2.5" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 animate-in slide-in-from-bottom-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-[30px] h-[30px] rounded-full shrink-0 flex items-center justify-center text-sm mt-0.5 ${m.role === 'ai' ? 'bg-[#1e2330] border border-white/10' : 'bg-[linear-gradient(135deg,#2060ff,#0099ff)]'}`}>
              {m.role === 'ai' ? '🤖' : '👤'}
            </div>
            <div className={`max-w-[78%] p-[10px_14px] text-[14px] leading-relaxed ${m.role === 'ai' ? 'bg-[#1e2330] text-[#d8e0f0] rounded-[4px_18px_18px_18px] border border-white/5' : 'bg-[linear-gradient(135deg,#2060ff,#0099ff)] text-white rounded-[18px_4px_18px_18px]'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-[30px] h-[30px] rounded-full shrink-0 flex items-center justify-center text-sm bg-[#1e2330] border border-white/10">🤖</div>
            <div className="bg-[#1e2330] p-[12px_14px] rounded-[4px_18px_18px_18px] border border-white/5 flex gap-1 items-center">
              {[0, 1, 2].map(j => (
                <div key={j} className="w-1.5 h-1.5 rounded-full bg-white/35 animate-bounce" style={{ animationDelay: `${j * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="shrink-0 p-[10px_12px] bg-[#1a1d24] border-t border-white/5 flex items-center gap-2">
        <button className="w-9 h-9 rounded-full bg-white/8 border-[1.5px] border-white/15 text-white flex items-center justify-center shrink-0">
          <Plus size={20} />
        </button>
        <input 
          className="flex-1 bg-white/5 border border-white/10 rounded-[22px] p-[10px_16px] text-white text-[14px] outline-none focus:border-cyan/40" 
          placeholder="Text message" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
        />
        <button className="w-9 h-9 rounded-full bg-white/8 border border-white/12 text-white/60 flex items-center justify-center shrink-0">
          <ImageIcon size={16} />
        </button>
        <button className="w-9 h-9 rounded-full bg-cyan/15 border border-cyan/30 text-white/60 flex items-center justify-center shrink-0" onClick={startVoice}>
          <Mic size={16} />
        </button>
      </div>

      {/* Voice Panel */}
      <AnimatePresence>
        {showVoice && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-[#1a1d24] rounded-t-[20px] border-t border-white/10 p-[16px_12px_20px] flex flex-col z-50 shadow-2xl"
          >
            <div className="w-full h-[140px] rounded-[16px] bg-[linear-gradient(135deg,#1e2330,#181c28)] border border-white/5 relative overflow-hidden flex items-center justify-center mb-3.5">
              {/* Student character placeholder */}
              <div className="absolute left-[-8px] bottom-0 w-[120px] h-[130px] opacity-80">
                <svg viewBox="0 0 120 140" fill="none">
                  <ellipse cx="60" cy="105" rx="35" ry="30" fill="#e86010"/>
                  <ellipse cx="60" cy="60" rx="24" ry="26" fill="#ffb899"/>
                </svg>
              </div>
              <div className="absolute top-[22px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#ff6eb0] shadow-[0_0_10px_rgba(255,110,176,0.6)] animate-pulse" />
              <div className="flex gap-1 items-center">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-0.5 rounded-full bg-cyan/70 animate-ping" style={{ height: `${10 + Math.random() * 20}px`, animationDuration: `${0.5 + Math.random() * 0.5}s` }} />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button className="flex-1 p-[14px] rounded-[50px] bg-white/10 border border-white/15 text-cyan font-semibold flex items-center justify-center gap-2 active:scale-95" onClick={closeVoice}>
                <X size={14} strokeWidth={2.5} /> Cancel
              </button>
              <div className="w-14 h-14 rounded-full bg-white/15 border border-white/15 flex items-center justify-center text-[22px] cursor-pointer animate-pulse">🎤</div>
              <button className={`flex-1 p-[14px] rounded-[50px] bg-white/5 border border-white/10 text-white/40 font-semibold flex items-center justify-center gap-2 active:scale-95 ${voiceSecs > 1 ? 'text-green-400 border-green-400/30' : ''}`} onClick={sendVoice}>
                <Check size={14} strokeWidth={2.5} /> Attach
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
