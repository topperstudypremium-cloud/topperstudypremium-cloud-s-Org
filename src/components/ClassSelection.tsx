import { ChevronLeft } from 'lucide-react';

interface ClassSelectionProps {
  selectedClass: string | null;
  onSelect: (cls: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ClassSelection = ({ selectedClass, onSelect, onNext, onBack }: ClassSelectionProps) => {
  const classes = ['9', '10', '11', '12', 'IIT-JEE', 'NEET'];

  return (
    <div className="h-full bg-[#030810] relative flex flex-col pt-20 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-5%] left-[-10%] w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
      
      <button 
        className="back" 
        onClick={onBack}
      >
        <ChevronLeft size={24} />
      </button>

      <div className="px-8 mb-10 text-center">
        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2 underline decoration-blue-500 decoration-4 underline-offset-8">TARGET CLASS</h1>
        <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase mt-4">Personalize your AI profile</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 no-scrollbar pb-32">
        <div className="grid grid-cols-2 gap-4 w-full">
          {classes.map((cls) => {
            const isTarget = cls === 'IIT-JEE' || cls === 'NEET';
            const isSelected = selectedClass === cls;
            return (
              <button
                key={cls}
                className={`
                  relative overflow-hidden flex flex-col items-center justify-center rounded-[32px] border transition-all duration-300 active:scale-95
                  ${isTarget ? 'col-span-2 py-8' : 'py-10'}
                  ${isSelected 
                    ? 'bg-blue-600 border-blue-500 shadow-[0_10px_30px_rgba(37,99,235,0.3)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'}
                `}
                onClick={() => onSelect(cls)}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
                <div className={`font-black tracking-tighter ${isSelected ? 'text-white' : 'text-white/70'} ${isTarget ? 'text-2xl' : 'text-4xl'}`}>
                  {cls}
                </div>
                {!isSelected && <div className="text-[10px] text-white/30 font-bold uppercase mt-2">Class</div>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-8 pt-12 bg-gradient-to-t from-[#030810] via-[#030810]/95 to-transparent z-10 flex justify-center">
        <button 
          className={`
            w-full p-5 rounded-3xl text-lg font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl
            ${selectedClass 
              ? 'bg-white text-black shadow-white/10' 
              : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'}
          `}
          onClick={onNext}
          disabled={!selectedClass}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};
