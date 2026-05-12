import { ChevronLeft, User, Mail, Folder, MessageSquare, Cloud, Swords } from 'lucide-react';

interface HelpCenterProps {
  onBack: () => void;
  onFiles: () => void;
}

export const HelpCenter = ({ onBack, onFiles }: HelpCenterProps) => {
  return (
    <div className="h-full bg-[#0d0d0f] flex flex-col relative overflow-hidden">
      <div className="screen-header">
        <button className="back !relative !top-0 !left-0" onClick={onBack}>
          <ChevronLeft size={24} />
        </button>
        <div className="text-[22px] font-black italic tracking-tighter text-white uppercase">Help Center</div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-[16px_14px_30px] flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          
          <div className="bg-[#1a1c22] border border-white/5 rounded-[16px] p-[20px_14px_16px] flex flex-col items-center justify-center gap-2.5 cursor-pointer min-h-[120px] transition-all active:scale-95 text-center group" onClick={() => (window as any).location.href='tel:+917985899764'}>
            <div className="w-[54px] h-[54px] rounded-full bg-[#1a2a6e] flex items-center justify-center shadow-[0_4px_16px_rgba(30,80,200,0.35)]">
              <User size={26} color="white" fill="white" />
            </div>
            <div className="text-[13px] text-white/75 font-medium">Customer helpline</div>
          </div>

          <div className="bg-[#1a1c22] border border-white/5 rounded-[16px] p-[20px_14px_16px] flex flex-col items-center justify-center gap-2.5 cursor-pointer min-h-[120px] transition-all active:scale-95 text-center" onClick={() => (window as any).location.href='mailto:topperflowproai2@gmail.com'}>
            <div className="w-[54px] h-[54px] rounded-full bg-[#1a2a6e] flex items-center justify-center shadow-[0_4px_16px_rgba(30,80,200,0.35)]">
              <Mail size={26} color="white" />
            </div>
            <div className="text-[13px] text-white/75 font-medium">Email</div>
          </div>

          <div className="bg-[#1a1c22] border border-white/5 rounded-[16px] p-4 flex gap-1 cursor-pointer min-h-[120px] transition-all active:scale-95 col-span-1 justify-between" onClick={onFiles}>
            <div className="flex flex-col gap-1">
              <div className="text-[18px] font-extrabold text-white tracking-widest">FILES</div>
              <div className="text-[11px] text-white/40">Your downloads</div>
            </div>
            <div className="text-[52px] leading-none drop-shadow-[0_4px_12px_rgba(255,180,0,0.3)] mt-[-4px]">📁</div>
          </div>

          <div className="bg-[#1a1c22] border border-white/5 rounded-[16px] p-[20px_14px_16px] flex flex-col items-center justify-center gap-2.5 cursor-pointer min-h-[120px] transition-all active:scale-95 text-center">
            <div className="w-[54px] h-[54px] rounded-full bg-[#075e54] flex items-center justify-center shadow-[0_4px_16px_rgba(7,94,84,0.35)]">
              <MessageSquare size={26} color="white" fill="white" />
            </div>
            <div className="text-[13px] text-white/75 font-medium">Chat now</div>
          </div>

          <div className="bg-[#1a1c22] border border-white/5 rounded-[16px] p-4 flex gap-1 cursor-pointer min-h-[120px] transition-all active:scale-95 col-span-1 justify-between" onClick={onFiles}>
            <div className="flex flex-col gap-0.5">
              <div className="text-[17px] font-extrabold text-white">AICLOUD</div>
              <div className="text-[12px] text-white/45">Easy backup</div>
              <div className="text-[10px] text-cyan font-semibold mt-1 bg-cyan/10 border border-cyan/20 rounded-md p-[2px_8px] inline-block w-fit">1 GB Free</div>
            </div>
            <div className="text-[46px] drop-shadow-[0_4px_14px_rgba(0,120,255,0.4)] mt-[-4px]">☁️</div>
          </div>

          <div className="bg-[#1a1c22] border border-white/5 rounded-[16px] p-4 flex gap-1 cursor-pointer min-h-[120px] transition-all active:scale-95 justify-between">
            <div className="text-[18px] font-extrabold text-white">GAME</div>
            <div className="text-[46px] drop-shadow-[0_4px_14px_rgba(0,100,255,0.5)]">⚔️</div>
          </div>

          <div className="bg-[#1a1c22] border border-white/5 rounded-[16px] p-[18px] flex flex-col items-start gap-3 cursor-pointer min-h-auto col-span-2">
            <div className="text-[16px] font-bold text-gold">📚 Quick Select Subject</div>
            <div className="grid grid-cols-2 gap-2 w-full">
              {['Physics', 'Chemistry', 'Math', 'Biology'].map(s => (
                <div key={s} className="p-[10px_8px] rounded-[10px] bg-[#08142acc] border-[1.5px] border-white/10 text-white text-[13px] font-semibold text-center transition-all hover:border-cyan">
                  {s}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
