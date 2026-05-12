import { ChevronLeft, Atom, Beaker, Calculator, Book, Languages, Microscope, FlaskConical, Globe2, Check } from 'lucide-react';

interface SubjectSelectionProps {
  selectedSubjects: string[];
  onToggle: (subj: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SubjectSelection = ({ selectedSubjects, onToggle, onNext, onBack }: SubjectSelectionProps) => {
  const subjects = [
    { name: 'Physics', icon: <Atom size={20} />, color: 'from-blue-500 to-cyan-400' },
    { name: 'Chemistry', icon: <FlaskConical size={20} />, color: 'from-orange-500 to-yellow-400' },
    { name: 'Math', icon: <Calculator size={20} />, color: 'from-purple-500 to-pink-500' },
    { name: 'Hindi', icon: <Languages size={20} />, color: 'from-red-500 to-orange-400' },
    { name: 'English', icon: <Languages size={20} />, color: 'from-indigo-500 to-blue-500' },
    { name: 'Biology', icon: <Microscope size={20} />, color: 'from-green-500 to-emerald-400' },
    { name: 'Science', icon: <Beaker size={20} />, color: 'from-cyan-500 to-blue-400' },
    { name: 'Social Science', icon: <Globe2 size={20} />, color: 'from-brown-500 to-orange-300' }
  ];

  return (
    <div className="h-full bg-[#030810] relative flex flex-col pt-16 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-5%] left-[-10%] w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
      
      <button 
        className="back" 
        onClick={onBack}
      >
        <ChevronLeft size={24} />
      </button>

      <div className="px-6 mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent">
          Choose Your<br />Subject
        </h1>
        <p className="text-white/40 text-sm mt-3 font-medium tracking-wide uppercase">Select multiple to specialize</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 no-scrollbar pb-32">
        <div className="grid grid-cols-1 gap-3.5">
          {subjects.map((subj) => {
            const isSelected = selectedSubjects.includes(subj.name);
            return (
              <button
                key={subj.name}
                onClick={() => onToggle(subj.name)}
                className={`
                  relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 active:scale-98
                  ${isSelected 
                    ? 'bg-white/10 border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' 
                    : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/15'}
                `}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${subj.color} flex items-center justify-center text-white shadow-lg shadow-black/20`}>
                  {subj.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-[16px] font-bold ${isSelected ? 'text-white' : 'text-white/70'}`}>
                    {subj.name}
                  </div>
                  <div className="text-[11px] text-white/30 uppercase font-bold tracking-tighter">Academic Course</div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center scale-110 shadow-lg shadow-blue-500/40">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-8 pt-12 bg-gradient-to-t from-[#030810] via-[#030810]/95 to-transparent z-30 flex justify-center">
        <button 
          className={`
            w-full p-4 rounded-2xl text-white font-black tracking-widest text-lg transition-all active:scale-95 shadow-xl
            ${selectedSubjects.length > 0 
              ? 'bg-[linear-gradient(135deg,#2060ff,#0099ff)] shadow-blue-500/20' 
              : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'}
          `}
          onClick={onNext}
          disabled={selectedSubjects.length === 0}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};
