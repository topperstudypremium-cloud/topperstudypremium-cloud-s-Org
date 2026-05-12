import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, UserPlus, Shield, Sparkles, Send, MoreVertical, Layout, Trash2, Maximize2, QrCode, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSupabase } from '../lib/supabase';

interface SafeFriendZoneProps {
  onBack: () => void;
  onWhiteboard: () => void;
}

export const SafeFriendZone = ({ onBack, onWhiteboard }: SafeFriendZoneProps) => {
  const [friendId, setFriendId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [channel, setChannel] = useState<any>(null);
  
  const safePhrases = [
    "Hi", "Let's study together", "How are you?", "Did you do the homework?", 
    "Open mind map", "Send me the code", "Check the whiteboard", "Wait a minute",
    "Yes", "No", "Thanks", "Great job!", "Start Voice", "Solution please",
    "2x+5x-3x=0?", "Tomorrow school?", "Quiz time!", "PDF summary", "I'm back",
    "Ready for class", "AI is smart", "Study hard", "Note saved", "Need help"
  ];

  useEffect(() => {
    if (isConnected && friendId) {
      const supabase = getSupabase();
      if (!supabase) return;

      const chatChannel = supabase.channel(`chat:${friendId}`)
        .on('broadcast', { event: 'msg' }, ({ payload }) => {
          setChatMessages(prev => [...prev, { sender: 'them', text: payload.text }]);
        })
        .subscribe();
      
      setChannel(chatChannel);
      return () => { chatChannel.unsubscribe(); };
    }
  }, [isConnected, friendId]);

  const handleConnect = () => {
    if (friendId.length > 4) {
      setIsConnecting(true);
      setTimeout(() => {
        (window as any).currentFriendId = friendId;
        setIsConnecting(false);
        setIsConnected(true);
        setChatMessages([{ sender: 'system', text: 'Secure Tunnel Established' }]);
      }, 1500);
    }
  };

  const sendSafeMsg = (msg: string) => {
    setChatMessages(prev => [...prev, { sender: 'me', text: msg }]);
    channel?.send({
      type: 'broadcast',
      event: 'msg',
      payload: { text: msg }
    });
  };

  return (
    <div className="h-full bg-[#030810] flex flex-col relative overflow-hidden">
      {!isConnected ? (
        <div className="h-full p-8 pt-20 flex flex-col">
          <button onClick={onBack} className="back">
            <ChevronLeft size={24} className="text-white" />
          </button>
          
          <div className="mb-12">
            <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none mb-3">SAFE FRIEND<br /><span className="text-blue-500">ZONE</span></h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Connect with your study partner</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 relative group rotate-3 hover:rotate-0 transition-all duration-500">
                  <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity animate-pulse" />
                  <UserPlus className="text-blue-400" size={28} />
                </div>
                
                <div className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-6">Partner Credentials</div>
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      placeholder="ENTER FRIEND ID"
                      className="bg-black/40 border-2 border-white/5 rounded-2xl p-4 w-full text-center text-xl font-black text-white tracking-[0.2em] outline-none focus:border-blue-500 focus:bg-black/60 transition-all shadow-inner"
                      value={friendId}
                      onChange={e => setFriendId(e.target.value.toUpperCase())}
                    />
                    {friendId && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 rounded-full text-[8px] font-black text-white uppercase tracking-tighter"
                      >
                        Target ID Locked
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={handleConnect}
                      disabled={friendId.length < 5 || isConnecting}
                      className="flex-1 p-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                      {isConnecting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <Send size={18} />
                          Secure Chat
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (friendId.length > 4) {
                           (window as any).currentFriendId = friendId;
                           onWhiteboard();
                        } else {
                          alert("Please enter a valid Friend ID first");
                        }
                      }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all"
                      title="Collaborative Whiteboard"
                    >
                      <Layout size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Fake QR Section (Polished) */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Local Session ID</div>
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">#USR-291</div>
                </div>
                <div className="w-full h-32 bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-px opacity-10">
                    {Array.from({length: 72}).map((_, i) => (
                      <div key={i} className={`bg-white ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'}`} />
                    ))}
                  </div>
                  <div className="z-10 bg-black/60 p-3 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                    <QrCode size={32} className="text-white/60" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full" />
          </div>

          <div className="mt-12 p-6 rounded-[28px] border border-blue-500/10 bg-blue-500/5 flex items-center gap-4">
            <Shield className="text-blue-400 shrink-0" size={24} />
            <p className="text-[11px] text-white/50 leading-relaxed font-medium">Safe Mode is active. Only pre-defined professional messages are allowed to ensure a focused study environment.</p>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col p-6 pt-12 relative z-10">
          <header className="screen-header">
            <button onClick={() => setIsConnected(false)} className="back !relative !top-0 !left-0">
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1" />
            <div className="flex flex-col items-end">
              <div className="font-black italic text-lg leading-tight uppercase tracking-tighter text-white">{friendId}</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-white/40">Secure Session</span>
              </div>
            </div>
            <button onClick={onWhiteboard} className="ml-4 p-2.5 rounded-xl bg-blue-600 shadow-xl shadow-blue-500/20 text-white">
              <Layout size={18} />
            </button>
          </header>

          <div className="flex-1 bg-black/40 rounded-[32px] border border-white/5 p-4 flex flex-col gap-3 overflow-y-auto no-scrollbar mb-6">
            {chatMessages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.sender === 'me' ? 'justify-end' : m.sender === 'system' ? 'justify-center' : 'justify-start'}`}
              >
                <div className={`p-3 px-4 rounded-2xl text-sm font-medium ${
                  m.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20' : 
                  m.sender === 'system' ? 'text-white/20 text-[10px] uppercase font-black tracking-widest' : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                }`}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 pb-8 overflow-y-auto max-h-[280px] no-scrollbar p-1">
            {safePhrases.map((phrase, i) => (
              <button 
                key={i} 
                onClick={() => sendSafeMsg(phrase)}
                className="p-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[11px] font-bold text-left hover:bg-white/10 hover:text-white transition-all active:scale-95 truncate shadow-sm shadow-black/20"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
