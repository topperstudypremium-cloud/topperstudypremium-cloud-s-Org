import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Settings, 
  Timer, 
  Smartphone, 
  ShieldAlert, 
  Unlock, 
  Lock, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Bot,
  Flame,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface AppBlock {
  id: string;
  name: string;
  icon: string;
  blocked: boolean;
  timeSpent: string;
}

export const FocusMode = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'apps' | 'timer' | 'settings'>('dashboard');
  const [screenTime, setScreenTime] = useState(0);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isStrictMode, setIsStrictMode] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [unlockReason, setUnlockReason] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppBlock | null>(null);

  const [apps, setApps] = useState<AppBlock[]>([
    { id: '1', name: 'Instagram', icon: '📸', blocked: true, timeSpent: '45m' },
    { id: '2', name: 'YouTube', icon: '📺', blocked: true, timeSpent: '1h 20m' },
    { id: '3', name: 'Facebook', icon: '👥', blocked: false, timeSpent: '15m' },
    { id: '4', name: 'Snapchat', icon: '👻', blocked: true, timeSpent: '30m' },
    { id: '5', name: 'Threads', icon: '🧵', blocked: false, timeSpent: '5m' },
  ]);

  const [goals, setGoals] = useState([
    { id: 'g1', title: '2hrs Education', progress: 65, reward: '15m Instagram' },
    { id: 'g2', title: 'Complete Pomodoro', progress: 30, reward: 'Unlock YouTube' },
  ]);

  const [schedules, setSchedules] = useState([
    { id: 's1', name: 'Office Hours', start: '09:00', end: '17:00', active: true },
    { id: 's2', name: 'Late Night', start: '23:00', end: '07:00', active: false },
  ]);

  // Global Screen Time counter
  useEffect(() => {
    const timer = setInterval(() => {
      setScreenTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pomodoro Timer
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAppClick = async (app: AppBlock) => {
    if (app.blocked) {
      setSelectedApp(app);
      setIsAnalyzing(true);
      const msg = await geminiService.getMotivation(app.name, app.timeSpent);
      setMotivation(msg);
      setShowOverlay(true);
      setIsAnalyzing(false);
    }
  };

  const handleUnlockRequest = async () => {
    if (!unlockReason.trim()) return;
    setIsAnalyzing(true);
    const analysis = await geminiService.analyzeUnlockReason(unlockReason);
    
    if (analysis.valid) {
      setApps(prev => prev.map(a => a.id === selectedApp?.id ? { ...a, blocked: false } : a));
      setShowOverlay(false);
      setUnlockReason("");
      alert(analysis.response);
    } else {
      setMotivation(analysis.response);
      setUnlockReason("");
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="h-full bg-[#03070c] text-white flex flex-col relative overflow-hidden">
      <header className="screen-header">
        <button onClick={onBack} className="back">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1" />
        <div className="flex flex-col items-end">
          <h1 className="text-xl font-black italic tracking-tighter text-white">STAY <span className="text-blue-500">FOCUSED</span></h1>
          <p className="text-[10px] font-black tracking-widest text-white/30 uppercase">AI Productivity Engine</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 flex gap-2 mb-8">
        {[
          { id: 'dashboard', icon: <Flame size={18} />, label: 'Stats' },
          { id: 'apps', icon: <Smartphone size={18} />, label: 'Apps' },
          { id: 'timer', icon: <Timer size={18} />, label: 'Timer' },
          { id: 'settings', icon: <Settings size={18} />, label: 'Config' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' 
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Screen Time Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Session Time</div>
                <div className="text-5xl font-black italic tracking-tighter mb-4">{formatTime(screenTime)}</div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Active Tracking</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-md">
                <ShieldAlert className="text-orange-500 mb-2" size={24} />
                <div className="text-2xl font-black">12</div>
                <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">Distractions Blocked</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-md">
                <Bot className="text-blue-400 mb-2" size={24} />
                <div className="text-2xl font-black">High</div>
                <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">AI Strict Level</div>
              </div>
            </div>

            {/* Motivation Section */}
            <div className="pt-4">
               <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Current Focus Message</div>
               <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 italic text-white/70 text-sm leading-relaxed border-l-4 border-l-blue-500">
                {motivation || "Padh le bhai, mauka hai abhi. Baad mein toh sirf 'kaash' hi bachega."}
               </div>
            </div>

            {/* Goal-Based Limits */}
            <div className="pt-4">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Goal-Based Rewards</div>
              <div className="space-y-3">
                {goals.map(goal => (
                  <div key={goal.id} className="bg-white/5 border border-white/10 p-5 rounded-[28px]">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-xs font-black uppercase tracking-tight">{goal.title}</div>
                      <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{goal.reward}</div>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        className="h-full bg-blue-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <div className="bg-white/5 border border-white/10 p-6 rounded-[32px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-red-500" size={20} />
                    <span className="text-sm font-black uppercase italic tracking-tighter">Strict Mode</span>
                  </div>
                  <button 
                    onClick={() => setIsStrictMode(!isStrictMode)}
                    className={`w-12 h-6 rounded-full transition-all relative ${isStrictMode ? 'bg-red-600' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isStrictMode ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
                <p className="text-[10px] text-white/30 font-bold uppercase leading-relaxed">
                  When enabled, you cannot modify settings or bypass blocks without AI approval. Essential for deep work.
                </p>
             </div>

             <div className="bg-white/5 border border-white/10 p-6 rounded-[32px]">
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Active Schedules</h3>
                <div className="space-y-3">
                  {schedules.map(schedule => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                        <div className="text-xs font-bold text-white uppercase">{schedule.name}</div>
                        <div className="text-[9px] text-white/30 font-bold">{schedule.start} - {schedule.end}</div>
                      </div>
                      <button 
                        onClick={() => setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, active: !s.active } : s))}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${schedule.active ? 'bg-blue-600' : 'bg-white/5'}`}
                      >
                        {schedule.active ? <CheckCircle2 size={18} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                      </button>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[32px] flex items-center gap-4">
                <Bot className="text-blue-500" size={24} />
                <div>
                  <div className="text-xs font-black uppercase italic tracking-tighter mb-1">AI Coaching</div>
                  <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed">Gemini 1.5 Flash is actively monitoring your distraction patterns.</p>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'apps' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Installed Apps Monitor</h3>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-white/20">STRICT MODE</span>
                <button 
                  onClick={() => setIsStrictMode(!isStrictMode)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${isStrictMode ? 'bg-blue-600' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isStrictMode ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
            
            {apps.map(app => (
              <div 
                key={app.id} 
                onClick={() => handleAppClick(app)}
                className="p-5 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-between group active:scale-95 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-2xl shadow-xl border border-white/5">
                    {app.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white uppercase tracking-tight">{app.name}</h4>
                    <p className="text-[10px] text-white/30 font-bold uppercase">{app.timeSpent} spent today</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setApps(prev => prev.map(a => a.id === app.id ? { ...a, blocked: !a.blocked } : a)); }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    app.blocked ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                  }`}
                >
                  {app.blocked ? <Lock size={20} /> : <Unlock size={20} />}
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'timer' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="128" cy="128" r="120" 
                  className="stroke-white/5 fill-none" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="128" cy="128" r="120" 
                  className="stroke-blue-500 fill-none transition-all duration-1000" 
                  strokeWidth="8" 
                  strokeDasharray={754}
                  strokeDashoffset={754 - (754 * (pomodoroTime / (25 * 60)))}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-black italic tracking-tighter text-white">{formatTime(pomodoroTime)}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mt-2">Pomodoro Phase</div>
              </div>
            </div>

            <div className="flex gap-4 mt-12 w-full max-w-xs">
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex-1 h-16 rounded-[24px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl ${
                  isTimerRunning ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-blue-600/30'
                }`}
              >
                {isTimerRunning ? <Pause size={24} /> : <Play size={24} />}
                <span className="font-black uppercase tracking-widest text-xs">{isTimerRunning ? 'Pause' : 'Start'}</span>
              </button>
              <button 
                onClick={() => { setPomodoroTime(25 * 60); setIsTimerRunning(false); }}
                className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center active:rotate-180 transition-all duration-500"
              >
                <RotateCcw size={20} className="text-white/40" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* AI Block Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="absolute top-20 w-32 h-32 bg-red-600/20 blur-[60px] rounded-full animate-pulse" />
            
            <div className="w-20 h-20 rounded-3xl bg-red-600 flex items-center justify-center mb-8 shadow-2xl shadow-red-600/40 rotate-12">
              <AlertTriangle size={40} className="text-white" />
            </div>

            <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-red-500 uppercase">STAY FOCUSED!</h2>
            
            <div className="max-w-xs mb-12">
              <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-4">AI Coach Analysis:</p>
              <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 relative">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">AI is thinking...</span>
                  </div>
                ) : (
                  <p className="text-lg font-black italic leading-tight text-white">{motivation}</p>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Bot size={16} />
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Bypassing requires valid reason</div>
              <input 
                placeholder="KYU KHOLNA HAI? (EX: WORK MESSAGE)"
                className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-center text-sm font-black text-white uppercase outline-none focus:border-red-500 transition-all"
                value={unlockReason}
                onChange={e => setUnlockReason(e.target.value)}
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowOverlay(false)}
                  className="flex-1 h-14 rounded-2xl bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-[10px]"
                >
                  Close & Work
                </button>
                <button 
                  onClick={handleUnlockRequest}
                  disabled={isAnalyzing || !unlockReason}
                  className="flex-1 h-14 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Unlock size={16} />}
                  Submit Reason
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
