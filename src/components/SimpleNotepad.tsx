import React, { useState } from 'react';
import { ChevronLeft, Edit3, Sparkles, Brain, Table as TableIcon, Zap, Music, Video, Square, ListChecks, Plus } from 'lucide-react';

interface NotepadProps {
  onBack: () => void;
}

export const SimpleNotepad = ({ onBack }: NotepadProps) => {
  const [note, setNote] = useState('');
  
  const aiTools = [
    { name: 'Mind Map', icon: <Brain size={16} /> },
    { name: 'Table', icon: <TableIcon size={16} /> },
    { name: 'Enhance', icon: <Zap size={16} /> },
    { name: 'Polish', icon: <Sparkles size={16} /> },
    { name: 'Audio View', icon: <Music size={16} /> },
    { name: 'Video View', icon: <Video size={16} /> },
    { name: 'Flashcard', icon: <Square size={16} /> },
    { name: 'Quiz', icon: <ListChecks size={16} /> }
  ];

  return (
    <div className="h-full bg-[#030810] flex flex-col pt-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 blur-[120px] rounded-full" />
      
      <header className="px-6 flex items-center justify-between mb-8 relative z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-xl font-black text-white italic tracking-tighter">ALLWIN NOTES</h1>
        <button className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Plus size={20} className="text-white" />
        </button>
      </header>

      <div className="flex-1 px-6 pb-32 relative z-10">
        <textarea 
          placeholder="Start writing your thoughts..."
          className="w-full h-full bg-transparent border-none outline-none text-white/80 text-lg leading-relaxed placeholder:text-white/10 resize-none font-medium"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#030810] via-[#030810]/90 to-transparent z-20">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {aiTools.map(tool => (
            <button 
              key={tool.name}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/50 whitespace-nowrap hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/30 transition-all font-bold text-xs uppercase tracking-widest"
            >
              {tool.icon}
              {tool.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
