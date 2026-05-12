export const WelcomeScreen = () => {
  return (
    <div id="s1" className="h-full bg-black relative flex flex-col items-center justify-center p-8">
      <img 
        className="absolute inset-0 w-full h-full object-cover opacity-60" 
        src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=2020" 
        alt="Welcome" 
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-blue-500 opacity-50" />
            <svg viewBox="0 0 50 50" fill="none" className="w-14 h-14 relative z-10">
              <rect x="6" y="14" width="18" height="18" rx="4" stroke="#fff" strokeWidth="2.5" />
              <rect x="14" y="6" width="18" height="18" rx="4" stroke="#fff" strokeWidth="2.5" />
              <circle cx="38" cy="12" r="6" fill="#fff" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2 text-center drop-shadow-2xl">
          ALLWIN AI <span className="text-blue-500">2</span>
        </h1>
        <p className="text-white/60 font-medium tracking-widest text-[10px] uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
          Next Gen Education Partner
        </p>
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
        <div className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase">Initializing Core...</div>
      </div>
    </div>
  );
};
