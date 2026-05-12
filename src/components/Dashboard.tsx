import { ChevronLeft, Menu, Send, User, Home, ClipboardList, Package, Download, Plus, Search, Sparkles, FileText, Music, Image as ImageIcon, Globe, Youtube, LayoutGrid, Users, Timer } from 'lucide-react';
import { Calendar } from './Calendar';

interface DashboardProps {
  onChat: () => void;
  onProfile: () => void;
}

export const Dashboard = ({ onChat, onProfile }: DashboardProps) => {
  const uploadTypes = [
    { name: 'PDF', icon: <FileText size={18} />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { name: 'Audio', icon: <Music size={18} />, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { name: 'Image', icon: <ImageIcon size={18} />, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
    { name: 'Website', icon: <Globe size={18} />, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { name: 'YouTube', icon: <Youtube size={18} />, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { name: 'Notes', icon: <ClipboardList size={18} />, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { name: 'Friends', icon: <Users size={18} />, color: 'bg-green-500/20 text-green-400 border-green-400/30' },
    { name: 'Focus', icon: <Timer size={18} />, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-400/30' },
  ];

  return (
    <div className="h-full bg-[#03070c] relative flex flex-col overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button 
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl active:scale-95 transition-all hover:bg-white/10"
            onClick={() => (window as any).navigateTo('s5')}
          >
            <ChevronLeft className="text-white/70" size={22} />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl active:scale-95 transition-all hover:bg-white/10">
            <Menu className="text-white/70" size={22} />
          </div>
        </div>
        <div className="text-center group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-500 mb-0.5 animate-pulse">PRO VERSION</div>
          <div className="text-2xl font-black text-white tracking-tighter italic">ALLWIN<span className="text-blue-500 ml-1">AI 2</span></div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-xl active:scale-95 transition-all" onClick={onProfile}>
          <div className="w-full h-full rounded-[14px] bg-[#03070c] flex items-center justify-center">
            <User className="text-blue-400" size={20} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="px-6 py-4 z-10">
        <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-8 rounded-[40px] backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
          <div className="absolute top-[-40%] right-[-20%] w-60 h-60 bg-blue-500/20 blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 blur-[60px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Intelligence</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-white leading-[0.9] mb-4 tracking-tighter italic">
              ENGINEER YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">KNOWLEDGE.</span>
            </h2>
            
            <p className="text-white/40 text-[13px] leading-relaxed mb-6 font-medium max-w-[80%]">
              Harness the Swarm 2.0 engine to extract summaries, generate quizzes, and visualize insights from any source.
            </p>
            
            <button className="group relative px-6 py-3 rounded-2xl overflow-hidden active:scale-95 transition-all">
              <div className="absolute inset-0 bg-blue-600 transition-transform translate-y-0 group-hover:-translate-y-full duration-500" />
              <div className="absolute inset-0 bg-white transition-transform translate-y-full group-hover:translate-y-0 duration-500" />
              <span className="relative font-black text-[10px] uppercase tracking-[0.2em] text-white group-hover:text-black transition-colors duration-500">
                Launch Flow Agent
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="px-6 mb-6 z-10">
        <Calendar />
      </div>

      {/* Upload Grid */}
      <div className="px-6 flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full" />
            <h3 className="text-[11px] font-black text-white/40 uppercase tracking-widest">Workspace Portals</h3>
          </div>
          <LayoutGrid size={14} className="text-white/20" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pb-4">
          {uploadTypes.map((item) => (
            <div 
              key={item.name} 
              className={`p-6 rounded-[32px] border ${item.color} flex flex-col gap-4 group active:scale-95 transition-all cursor-pointer backdrop-blur-md relative overflow-hidden`}
              onClick={() => {
                if (item.name === 'Notes') (window as any).navigateTo('s_notes');
                else if (item.name === 'YouTube') (window as any).navigateTo('s_yt_summary');
                else if (item.name === 'Friends') (window as any).navigateTo('s_safe_chat');
                else if (item.name === 'Focus') (window as any).navigateTo('s_focus');
                else (window as any).navigateTo('s5'); // PDF, Audio, Image, Website go to MediaUpload
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rotate-45 translate-x-8 -translate-y-8" />
              <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 shadow-xl border border-white/5">
                {item.icon}
              </div>
              <div className="font-bold text-lg tracking-tighter text-white uppercase italic">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="absolute bottom-24 inset-x-6 z-30">
        <div 
          className="bg-black/60 border border-white/10 rounded-[28px] flex items-center px-5 h-[58px] gap-3 backdrop-blur-2xl shadow-2xl group transition-all focus-within:border-blue-500/50" 
          onClick={onChat}
        >
          <Search size={20} className="text-white/30 group-focus-within:text-blue-400" />
          <input 
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-white text-[15px] placeholder:text-white/20 font-medium" 
            placeholder="Ask anything or search..." 
            readOnly
          />
          <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 inset-x-0 h-20 bg-[#03070c]/90 border-t border-white/5 flex items-center justify-around px-6 backdrop-blur-2xl z-40">
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <Home size={22} className="text-blue-500 transition-all group-active:scale-90" />
          <div className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Home</div>
        </div>
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group opacity-40 hover:opacity-100 transition-opacity">
          <ClipboardList size={22} className="text-white transition-all group-active:scale-90" />
          <div className="text-[10px] text-white font-bold uppercase tracking-tighter">Tests</div>
        </div>
        <div className="relative -mt-10">
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_8px_25px_rgba(37,99,235,0.4)] border-2 border-white/20 rotate-45 active:rotate-[135deg] transition-all duration-500">
            <div className="-rotate-45">
              <Sparkles size={28} className="text-white" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group opacity-40 hover:opacity-100 transition-opacity" onClick={onChat}>
          <Search size={22} className="text-white transition-all group-active:scale-90" />
          <div className="text-[10px] text-white font-bold uppercase tracking-tighter">AI Help</div>
        </div>
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group opacity-40 hover:opacity-100 transition-opacity" onClick={onProfile}>
          <User size={22} className="text-white transition-all group-active:scale-90" />
          <div className="text-[10px] text-white font-bold uppercase tracking-tighter">Profile</div>
        </div>
      </nav>
    </div>
  );
};
