import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Edit2, Play, HelpCircle, FileText, Shield, Info, Users, Sun, Languages, ChevronRight, Check, X, Clock } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

interface FriendRequest {
  id: string;
  sender_name: string;
  sender_avatar?: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface ProfileSettingsProps {
  onBack: () => void;
  onUpgrade: () => void;
  onHelp: () => void;
  onNotes: () => void;
}

export const ProfileSettings = ({ onBack, onUpgrade, onHelp, onNotes }: ProfileSettingsProps) => {
  const [requests, setRequests] = useState<FriendRequest[]>([
    // Mock data initially for visual preview
    { id: '1', sender_name: 'Rahul Sharma', status: 'pending' },
    { id: '2', sender_name: 'Priya Singh', status: 'pending' },
  ]);

  useEffect(() => {
    const fetchRequests = async () => {
      const supabase = getSupabase();
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from('friend_requests')
          .select('*')
          .eq('status', 'pending');
        
        if (data) {
          // setRequests(data); // Uncomment when table exists
        }
      } catch (err) {
        console.error('Supabase error:', err);
      }
    };
    
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'accepted' | 'declined') => {
    setRequests(prev => prev.filter(r => r.id !== id));
    
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      await supabase
        .from('friend_requests')
        .update({ status: action })
        .eq('id', id);
    } catch (err) {
      console.error('Error updating request:', err);
    }
  };
  return (
    <div className="h-full bg-[linear-gradient(160deg,#e8d8ff_0%,#d0dcff_30%,#ccd8ff_55%,#d8e8ff_75%,#e0d0ff_100%)] relative flex flex-col overflow-y-auto no-scrollbar">
      <div className="absolute w-[220px] h-[220px] top-[-30px] left-[-60px] bg-[radial-gradient(circle,#c8b4ff,transparent)] blur-[60px] opacity-50 pointer-events-none rounded-full" />
      <div className="absolute w-[180px] h-[180px] top-[120px] right-[-40px] bg-[radial-gradient(circle,#b4c8ff,transparent)] blur-[60px] opacity-50 pointer-events-none rounded-full" />
      
      <header className="screen-header !bg-transparent !border-none">
        <button onClick={onBack} className="back !m-0 !bg-white/40 !backdrop-blur-xl">
          <ChevronLeft size={24} className="text-black/70" />
        </button>
        <div className="flex-1" />
        <div className="text-[17px] font-black italic text-[#1a1a2e] uppercase tracking-tighter">Settings</div>
      </header>

      <div className="text-center pb-4 relative z-10">
        <div className="w-20 h-20 rounded-full bg-white/60 border-2 border-white/90 shadow-[0_4px_20px_rgba(160,120,255,0.25),inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center justify-center mx-auto my-3 backdrop-blur-md">
          <User size={42} stroke="rgba(130,90,210,0.8)" strokeWidth={1.8} />
        </div>
        <div className="text-[17px] font-extrabold text-[#1a1a2e] mb-3">TOPPERFLOWPROAI</div>
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[50px] bg-white/55 border border-white/80 text-[14px] font-semibold text-[#2a2a4a] backdrop-blur-xl shadow-[0_2px_12px_rgba(140,120,255,0.15)] cursor-pointer">
          <Edit2 size={14} />
          Edit Profile
        </div>
      </div>

      <div className="mx-3.5 mt-3.5 rounded-[18px] bg-white/55 border border-white/75 p-[16px_18px] flex items-center justify-between backdrop-blur-xl shadow-[0_2px_16px_rgba(140,120,255,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] relative z-10">
        <div className="flex flex-col gap-0.5">
          <div className="text-[22px] font-extrabold text-[#1a1a2e]">Free</div>
          <div className="text-[12px] text-[#6a7090] font-normal">Upgrade your plan to unlock more benefits</div>
        </div>
        <button className="px-[18px] py-[9px] rounded-[12px] border-none bg-[linear-gradient(135deg,#9060ff,#7040ee)] text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(120,60,255,0.4)] active:scale-95 transition-all" onClick={onUpgrade}>
          Upgrade
        </button>
      </div>

      <div className="mx-3.5 mt-2.5 rounded-[18px] bg-white/50 border border-white/70 p-[14px_18px] backdrop-blur-xl shadow-[0_2px_16px_rgba(140,120,255,0.08),inset_0_1px_0_rgba(255,255,255,0.75)] relative z-10">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-[76px] h-[46px] rounded-[14px] bg-[linear-gradient(135deg,#1a1a2a,#2a2a3a)] flex items-center justify-center gap-1 shrink-0">
            <div className="w-[22px] h-[22px] rounded-full border-[1.5px] border-white/60 flex items-center justify-center">
              <User size={14} color="white" />
            </div>
            <div className="w-[22px] h-[22px] rounded-full border-[1.5px] border-white/60 border-dashed opacity-70 flex items-center justify-center">
              <span className="text-white text-[10px]">+</span>
            </div>
          </div>
          <div className="text-[22px] font-bold text-[#1a1a2e]">Add Friend</div>
          <ChevronRight size={18} className="ml-auto text-[#9090a0]" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[13px] text-[#6a7090] font-normal">Home Page Display</div>
          <div className="w-11 h-[26px] bg-[#d0d4e0] rounded-[13px] relative cursor-pointer">
            <div className="absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full shadow-md" />
          </div>
        </div>

        {requests.length > 0 && (
          <div className="mt-4 pt-3 border-t border-black/5">
            <div className="text-[12px] font-bold text-[#5050a0] mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} /> Pending Requests
            </div>
            <div className="flex flex-col gap-2.5">
              {requests.map(req => (
                <div key={req.id} className="flex items-center justify-between bg-white/40 p-2 rounded-xl border border-white/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#6070ff]/10 flex items-center justify-center text-[#6070ff] font-bold text-xs">
                      {req.sender_name.charAt(0)}
                    </div>
                    <div className="text-[14px] font-semibold text-[#1a1a2e]">{req.sender_name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAction(req.id, 'declined')}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center active:scale-90 transition-all border border-red-100"
                    >
                      <X size={14} />
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'accepted')}
                      className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center active:scale-90 transition-all border border-green-100 shadow-sm shadow-green-200"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mx-3.5 mt-2.5 rounded-[18px] bg-white/50 border border-white/70 p-[14px_18px] backdrop-blur-xl shadow-[0_2px_16px_rgba(140,120,255,0.08),inset_0_1px_0_rgba(255,255,255,0.75)] relative z-10 cursor-pointer" onClick={() => (window as any).navigateTo('s_focus')}>
        <div className="flex items-center gap-3.5">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-[linear-gradient(135deg,#ff6060,#ff9060)] flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
            <Clock size={22} color="white" />
          </div>
          <div className="flex flex-col">
            <div className="text-[18px] font-bold text-[#1a1a2e]">Stay Focused</div>
            <div className="text-[11px] text-[#6a7090]">AI Screen Time & App Blocker</div>
          </div>
          <ChevronRight size={18} className="ml-auto text-[#9090a0]" />
        </div>
      </div>

      <div className="mx-3.5 mt-2.5 rounded-[18px] bg-white/50 border border-white/70 p-[14px_18px] backdrop-blur-xl shadow-[0_2px_16px_rgba(140,120,255,0.08),inset_0_1px_0_rgba(255,255,255,0.75)] relative z-10 cursor-pointer" onClick={() => (window as any).navigateTo('s_safe_chat')}>
        <div className="flex items-center gap-3.5">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-[linear-gradient(135deg,#6070ff,#9060ff)] flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
            <Users size={22} color="white" />
          </div>
          <div className="flex flex-col">
            <div className="text-[18px] font-bold text-[#1a1a2e]">Safe Friend Chat</div>
            <div className="text-[11px] text-[#6a7090]">Study together securely</div>
          </div>
          <ChevronRight size={18} className="ml-auto text-[#9090a0]" />
        </div>
      </div>

      <div className="mx-3.5 mt-2.5 rounded-[18px] bg-white/50 border border-white/70 p-[14px_18px] backdrop-blur-xl shadow-[0_2px_16px_rgba(140,120,255,0.08),inset_0_1px_0_rgba(255,255,255,0.75)] relative z-10 cursor-pointer" onClick={onNotes}>
        <div className="flex items-center gap-3.5">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-[linear-gradient(135deg,#00d4ff,#006eff)] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <FileText size={22} color="white" />
          </div>
          <div className="flex flex-col">
            <div className="text-[18px] font-bold text-[#1a1a2e]">AI Notes</div>
            <div className="text-[11px] text-[#6a7090]">Mind Maps, Tables & Podcasts</div>
          </div>
          <ChevronRight size={18} className="ml-auto text-[#9090a0]" />
        </div>
      </div>

      <div className="mx-3.5 mt-2.5 rounded-[18px] bg-white/50 border border-white/70 p-[14px_18px] backdrop-blur-xl shadow-[0_2px_16px_rgba(140,120,255,0.08),inset_0_1px_0_rgba(255,255,255,0.75)] relative z-10 cursor-pointer" onClick={onNotes}>
        <div className="flex items-center gap-3.5">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-black/5 flex items-center justify-center shrink-0">
            <Edit2 size={20} className="text-[#6070ff]" />
          </div>
          <div className="flex flex-col">
            <div className="text-base font-bold text-[#1a1a2e]">Simple Notepad</div>
            <div className="text-[10px] text-[#6a7090] uppercase tracking-widest font-black">Quick Drafts</div>
          </div>
          <ChevronRight size={18} className="ml-auto text-[#9090a0]" />
        </div>
      </div>

      <div className="mx-3.5 mt-[18px] px-2 flex flex-wrap gap-x-4 gap-y-2 relative z-10 pb-4 border-b border-black/5 mb-4">
        <button onClick={() => (window as any).navigateTo('s_privacy')} className="text-[10px] font-bold text-black/30 uppercase tracking-widest hover:text-blue-600 transition-colors">Privacy Policy</button>
        <button onClick={() => (window as any).navigateTo('s_terms')} className="text-[10px] font-bold text-black/30 uppercase tracking-widest hover:text-blue-600 transition-colors">Terms of Service</button>
        <button onClick={() => (window as any).navigateTo('s_update_policy')} className="text-[10px] font-bold text-black/30 uppercase tracking-widest hover:text-blue-600 transition-colors">Update Policy</button>
        <button onClick={() => (window as any).navigateTo('s_takeover_policy')} className="text-[10px] font-bold text-black/30 uppercase tracking-widest hover:text-blue-600 transition-colors">Takeover Policy</button>
      </div>

      <div className="mx-3.5 mt-[18px] relative z-10 pb-10">
        <div className="text-[22px] font-bold text-[#1a1a2e] mb-3.5 flex items-center gap-1.5 px-1">
          <span className="text-base text-[#5050a0]">‹</span> Storage
        </div>
        <div className="flex flex-col gap-2">
          {[
            { icon: <HelpCircle size={20} />, text: 'Help & Support', action: onHelp },
            { icon: <FileText size={20} />, text: 'Terms of Service' },
            { icon: <Shield size={20} />, text: 'Privacy Policy' },
            { icon: <Info size={20} />, text: 'Version Update' },
            { icon: <Users size={20} />, text: 'User Takeover' },
            { icon: <Sun size={20} />, text: 'Appearance' },
            { icon: <Languages size={20} />, text: 'Language' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3.5 p-[15px_18px] rounded-[16px] bg-white/55 border border-white/72 backdrop-blur-md shadow-[0_1px_8px_rgba(140,120,255,0.07),inset_0_1px_0_rgba(255,255,255,0.7)] hover:bg-white/75 transition-all cursor-pointer group" onClick={item.action}>
              <div className="w-7 h-7 flex items-center justify-center shrink-0 text-[#5060a0]">
                {item.icon}
              </div>
              <div className="flex-1 text-[15px] font-medium text-[#1a1a2e]">{item.text}</div>
              <ChevronRight size={16} className="text-[#b0b8d0]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
