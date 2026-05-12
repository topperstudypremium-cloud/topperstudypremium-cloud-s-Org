import { useState } from 'react';
import { X, Check, ChevronLeft } from 'lucide-react';

interface PlanSelectionProps {
  onBack: () => void;
}

export const PlanSelection = ({ onBack }: PlanSelectionProps) => {
  const [tier, setTier] = useState<'pro' | 'max'>('pro');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  const prices = {
    pro: { monthly: '₹1,950.00', yearly: '₹19,600.00', sub: '₹1,633.33/month', save: '₹3,800.00' },
    max: { monthly: '₹3,500.00', yearly: '₹35,000.00', sub: '₹2,916.67/month', save: '₹7,000.00' },
  };

  const features = tier === 'max' ? [
    'Everything in Pro', 'Extended AI model usage', 'Priority access & faster responses',
    'Advanced analytics dashboard', 'Unlimited reports & documents', 'Best for power users'
  ] : [
    'Access to the latest AI models', 'Access to Computer Use', 'Deeper sourcing from proprietary index',
    'Create reports, documents', 'Usage limits best for most users'
  ];

  return (
    <div className="h-full bg-[#0a0a0a] relative flex flex-col items-center p-[70px_20px_30px] overflow-y-auto no-scrollbar">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      <button className="back" onClick={onBack}>
        <ChevronLeft size={24} />
      </button>

      <button className="absolute top-14 right-[18px] bg-white/15 border border-white/20 rounded-[12px] p-[8px_16px] text-white text-[14px] font-semibold cursor-pointer z-10">Restore</button>

      {/* Plan Logo */}
      <svg className="w-20 h-20 mb-3.5" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="14" r="8" fill="url(#gg1)"/>
        <circle cx="40" cy="66" r="8" fill="url(#gg2)"/>
        <path d="M14 40 L66 40" stroke="url(#gg3)" stroke-width="5" stroke-linecap="round"/>
        <path d="M20 20 L60 60" stroke="url(#gg4)" stroke-width="5" stroke-linecap="round"/>
        <path d="M60 20 L20 60" stroke="url(#gg5)" stroke-width="5" stroke-linecap="round"/>
        <defs>
          <radialGradient id="gg1"><stop offset="0%" stopColor="#88ffaa"/><stop offset="100%" stopColor="#44cc77"/></radialGradient>
          <radialGradient id="gg2"><stop offset="0%" stopColor="#88ffaa"/><stop offset="100%" stopColor="#44cc77"/></radialGradient>
          <linearGradient id="gg3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#44cc77"/><stop offset="100%" stopColor="#88ffaa"/></linearGradient>
          <linearGradient id="gg4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#44cc77"/><stop offset="100%" stopColor="#88ffaa"/></linearGradient>
          <linearGradient id="gg5" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#44cc77"/><stop offset="100%" stopColor="#88ffaa"/></linearGradient>
        </defs>
      </svg>

      <div className="text-[26px] font-bold text-white mb-1.5">Select your plan</div>
      <div className="text-[14px] text-white/45 mb-[22px] text-center px-4">Ask once, get trusted answers fast</div>

      <div className="w-full bg-white/10 rounded-[50px] p-1 flex mb-[18px] border border-white/10">
        <button 
          className={`flex-1 py-3 rounded-[46px] font-semibold transition-all ${tier === 'pro' ? 'bg-cyan text-black' : 'bg-transparent text-white/50'}`}
          onClick={() => setTier('pro')}
        >
          pro⊙
        </button>
        <button 
          className={`flex-1 py-3 rounded-[46px] font-semibold transition-all ${tier === 'max' ? 'bg-cyan text-black' : 'bg-transparent text-white/50'}`}
          onClick={() => setTier('max')}
        >
          max⊙
        </button>
      </div>

      <div className="w-full flex flex-col gap-3 mb-6">
        {features.map((f, i) => (
          <div key={i} className="flex gap-2.5 text-[14px] text-white/55">
            <Check size={13} className="text-cyan mt-1 shrink-0" />
            <span>{f}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2.5 w-full mb-5">
        <div 
          className={`flex-1 bg-white/5 border-[1.5px] rounded-[16px] p-[16px_14px] cursor-pointer transition-all relative ${billing === 'monthly' ? 'border-cyan bg-cyan/10' : 'border-white/10'}`}
          onClick={() => setBilling('monthly')}
        >
          <div className="text-base font-bold text-white mb-1.5">Monthly</div>
          <div className={`text-[22px] font-extrabold text-white ${billing === 'monthly' ? 'text-cyan' : ''}`}>{prices[tier].monthly}</div>
          <div className={`text-[12px] text-white/40 ${billing === 'monthly' ? 'text-cyan/70' : ''}`}>per month</div>
          {billing === 'monthly' && <div className="absolute top-2 right-2 w-[22px] h-[22px] bg-cyan rounded-full flex items-center justify-center text-black text-[10px]">✓</div>}
        </div>

        <div 
          className={`flex-1 bg-white/5 border-[1.5px] rounded-[16px] p-[16px_14px] cursor-pointer transition-all relative ${billing === 'yearly' ? 'border-cyan bg-cyan/10' : 'border-white/10'}`}
          onClick={() => setBilling('yearly')}
        >
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-[#f0a060] text-white text-[10px] font-bold px-2.5 py-1 rounded-[50px] whitespace-nowrap">Save {prices[tier].save}</div>
          <div className="text-base font-bold text-white mb-1.5">Yearly</div>
          <div className={`text-[22px] font-extrabold text-white ${billing === 'yearly' ? 'text-cyan' : ''}`}>{prices[tier].yearly}</div>
          <div className={`text-[12px] text-white/40 ${billing === 'yearly' ? 'text-cyan/70' : ''}`}>{prices[tier].sub}</div>
          {billing === 'yearly' && <div className="absolute top-2 right-2 w-[22px] h-[22px] bg-cyan rounded-full flex items-center justify-center text-black text-[10px]">✓</div>}
        </div>
      </div>

      <button className="w-full p-[18px] rounded-[50px] border-none bg-cyan text-black text-[18px] font-extrabold cursor-pointer shadow-[0_4px_24px_rgba(0,212,255,0.4)] active:scale-95 transition-all tracking-tight">
        Get {tier === 'max' ? 'Max' : 'Pro'}
      </button>
    </div>
  );
};
