import { ChevronRight, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingScreen = ({ onNext, onSkip }: OnboardingProps) => {
  return (
    <div className="h-full relative overflow-hidden flex flex-col bg-[#030810]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1e3a8a_0%,transparent_60%)] opacity-30" />
      
      <button 
        className="absolute top-12 right-6 p-2 px-4 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-bold tracking-widest uppercase backdrop-blur-xl z-20 active:scale-95 transition-all" 
        onClick={onSkip}
      >
        Skip
      </button>

      <div className="flex-1 flex flex-col items-center justify-center pt-24 px-8 relative z-10">
        <div className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl relative mb-12">
          <div className="absolute inset-0 blur-3xl bg-blue-500 opacity-40 animate-pulse" />
          <Sparkles size={48} className="text-white relative z-10" />
        </div>
        
        <div className="text-center">
          <h2 className="text-[42px] font-black leading-[1.1] text-white tracking-tighter mb-4 italic">
            LIMITLESS<br />
            <span className="text-blue-500">LEARNING</span>
          </h2>
          <p className="text-white/40 text-lg font-medium leading-relaxed max-w-[240px] mx-auto">
            Unlock the power of AI to transform your study notes.
          </p>
        </div>
      </div>

      <div className="p-8 pb-12 relative z-10 flex flex-col gap-8">
        <div className="flex gap-2 justify-center">
          <div className="w-8 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <div className="w-2 h-2 rounded-full bg-white/10" />
          <div className="w-2 h-2 rounded-full bg-white/10" />
        </div>
        
        <button 
          className="w-full p-5 rounded-3xl bg-white text-black text-lg font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group" 
          onClick={onNext}
        >
          GET STARTED <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
