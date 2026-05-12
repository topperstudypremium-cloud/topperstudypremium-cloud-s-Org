import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  Sparkles, 
  Table, 
  Network, 
  Mic2, 
  BrainCircuit, 
  Plus, 
  X, 
  Check, 
  FileText,
  Loader2,
  Trash2,
  Copy,
  Wand2,
  Brush,
  Headphones,
  Video,
  Layers,
  Puzzle,
  Youtube,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'text' | 'ai_output';
  aiType?: 'table' | 'mindmap' | 'podcast' | 'quiz' | 'enhance' | 'polish' | 'audio_overview' | 'video_overview' | 'flashcard' | 'youtube';
}

const QuizView = ({ content }: { content: string }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  let questions: any[] = [];
  try {
    const jsonStr = content.includes('```json') 
      ? content.split('```json')[1].split('```')[0].trim() 
      : content.trim();
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      questions = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.questions)) questions = parsed.questions;
      else if (Array.isArray(parsed.quiz)) questions = parsed.quiz;
    }
  } catch (e) {
    return <div className="text-red-400 p-4 bg-red-400/10 rounded-xl border border-red-400/20">AI generated an invalid quiz format. Try again!</div>;
  }

  if (finished) {
    return (
      <div className="text-center p-6 bg-white/5 rounded-3xl border border-white/10" onClick={e => e.stopPropagation()}>
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-xl font-bold mb-2">Quiz Completed!</h3>
        <p className="text-white/60 mb-6">You scored {score} out of {questions.length}</p>
        <button 
          onClick={() => { setCurrentIdx(0); setScore(0); setFinished(false); setSelected(null); }}
          className="px-6 py-3 bg-blue-600 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];
  if (!q) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isCorrect = selected === q.answer || (typeof q.answer === 'string' && q.options[selected!] === q.answer);
    if (isCorrect) setScore(score + 1);
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="p-4 bg-white/5 rounded-3xl border border-white/10" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] uppercase font-black tracking-widest text-white/30">Question {currentIdx + 1}/{questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentIdx ? 'bg-cyan-500' : i < currentIdx ? 'bg-cyan-500/30' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
      
      <h3 className="text-lg font-bold mb-6 leading-tight">{q.question}</h3>
      
      <div className="space-y-2 mb-8">
        {q.options.map((opt: string, i: number) => (
          <button 
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full p-4 rounded-2xl border text-left transition-all font-medium ${
              selected === i 
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-100' 
                : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                selected === i ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10' : 'border-white/10 text-white/20'
              }`}>
                {String.fromCharCode(65 + i)}
              </div>
              {opt}
            </div>
          </button>
        ))}
      </div>

      <button 
        disabled={selected === null}
        onClick={handleNext}
        className="w-full p-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl disabled:opacity-20 active:scale-95 transition-all shadow-xl"
      >
        {currentIdx === questions.length - 1 ? 'Finish' : 'Next Question'}
      </button>
    </div>
  );
};

const YouTubeView = ({ content }: { content: string }) => {
  let videos: any[] = [];
  try {
    const jsonStr = content.includes('```json') 
      ? content.split('```json')[1].split('```')[0].trim() 
      : content.trim();
    videos = JSON.parse(jsonStr);
  } catch (e) {
    // Fallback to markdown parser if it's not JSON
    return (
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    );
  }

  if (!Array.isArray(videos) || videos.length === 0) return null;

  return (
    <div className="space-y-4" onClick={e => e.stopPropagation()}>
      {videos.map((vid: any, i: number) => (
        <a 
          key={i} 
          href={`https://www.youtube.com/watch?v=${vid.id}`} 
          target="_blank" 
          rel="referrer"
          className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group"
        >
          <div className="relative w-32 aspect-video rounded-xl overflow-hidden shrink-0 border border-white/10">
            <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <Youtube size={12} className="text-white" />
            </div>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{vid.title}</h4>
            <p className="text-[10px] text-white/40 mt-1 line-clamp-1">{vid.channel}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

interface AINotesProps {
  onBack: () => void;
}

export const AINotes = ({ onBack }: AINotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [editMode, setEditMode] = useState<'preview' | 'source'>('source');

  const handleCreateNote = () => {
    setIsAdding(true);
    setNoteTitle('');
    setNoteText('');
    setCurrentNote(null);
    setEditMode('source');
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    
    if (currentNote) {
      setNotes(notes.map(n => n.id === currentNote.id ? { ...n, title: noteTitle, content: noteText } : n));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteTitle || 'Untitled Note',
        content: noteText,
        date: new Date().toLocaleDateString(),
        type: 'text'
      };
      setNotes([newNote, ...notes]);
    }
    setIsAdding(false);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
  };

  const callAI = async (type: 'table' | 'mindmap' | 'podcast' | 'quiz' | 'enhance' | 'polish' | 'audio_overview' | 'video_overview' | 'flashcard' | 'youtube') => {
    if (!noteText.trim() && !currentNote?.content) return;
    
    const content = noteText || currentNote?.content || '';
    setIsLoading(true);
    setIsMenuOpen(false);

    let prompt = "";
    let systemInstruction = "";

    if (type === 'youtube') {
      try {
        const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        if (!apiKey) {
          throw new Error("YouTube API Key Missing. Please set VITE_YOUTUBE_API_KEY in settings.");
        }
        
        // Use Gemini to extract best search query
        const queryResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: `Extract the main subject from these notes and give me a 3-5 word search query for educational videos on YouTube: ${content}` }] }],
          config: { systemInstruction: "Output ONLY the search query string, nothing else." }
        });
        
        const searchQuery = queryResponse.text.trim();
        const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(searchQuery)}&type=video&key=${apiKey}`);
        const ytData = await ytRes.json();
        
        if (ytData.error) throw new Error(ytData.error.message);

        const videoData = ytData.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channel: item.snippet.channelTitle,
          description: item.snippet.description
        }));
        
        const aiNote: Note = {
          id: Date.now().toString(),
          title: `YouTube Resources: ${noteTitle || currentNote?.title || 'Note'}`,
          content: JSON.stringify(videoData, null, 2),
          date: new Date().toLocaleDateString(),
          type: 'ai_output',
          aiType: 'youtube'
        };

        setNotes([aiNote, ...notes]);
        if (isAdding) setIsAdding(false);
        setIsLoading(false);
        return;
      } catch (err: any) {
        alert(err.message);
        setIsLoading(false);
        return;
      }
    }

    switch (type) {
      case 'enhance':
        systemInstruction = "You are an AI Note Expert. Enhance the user's notes by adding structure, clarity, and more context where missing. Use markdown formatting.";
        prompt = `Enhance these notes: ${content}`;
        break;
      case 'polish':
        systemInstruction = "You are an AI Note Expert. Fix grammar, spelling, and improve the flow of the text to make it sound professional yet accessible. Use markdown.";
        prompt = `Polish these notes: ${content}`;
        break;
      case 'audio_overview':
        systemInstruction = "Create a script for a 2-minute audio summary of these notes. Include a warm introduction and a clear summary of top takeaways.";
        prompt = `Create an audio overview script for: ${content}`;
        break;
      case 'video_overview':
        systemInstruction = "Create a storyboard or script for a short educational video summarizing these notes. Include visual cues in [brackets] and spoken script.";
        prompt = `Create a video overview structure for: ${content}`;
        break;
      case 'flashcard':
        systemInstruction = "Generate a set of 5-10 flashcards based on this text. Format as 'Q: Question' followed by 'A: Answer'. Use markdown.";
        prompt = `Create flashcards from these notes: ${content}`;
        break;
      case 'table':
        systemInstruction = "You are an AI Note Expert. Convert the information into a Markdown table format. Provide only the table, no extra talk.";
        prompt = `Convert this note into a markdown table: ${content}`;
        break;
      case 'mindmap':
        systemInstruction = "You are an AI Note Expert. Generate a Mermaid.js syntax flow-chart representing the hierarchy of the notes. Provide only the mermaid code block.";
        prompt = `Create a Mermaid.js mind map for these notes: ${content}`;
        break;
      case 'podcast':
        systemInstruction = "Create a conversational podcast script between two AI experts (Host and Guest) who are discussing these notes in a simple, engaging way (like NotebookLM). Tone should be friendly and educational.";
        prompt = `Create a podcast script from these notes: ${content}`;
        break;
      case 'quiz':
        systemInstruction = "Generate 5 MCQ questions based on this text in JSON format with 'question', 'options', and 'answer' fields. Provide only the JSON data.";
        prompt = `Create a quiz from these notes: ${content}`;
        break;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { systemInstruction }
      });

      const aiResponse = response.text || "Failed to generate content.";
      
      const aiNote: Note = {
        id: Date.now().toString(),
        title: `AI ${type.charAt(0).toUpperCase() + type.slice(1)}: ${noteTitle || currentNote?.title || 'Note'}`,
        content: aiResponse,
        date: new Date().toLocaleDateString(),
        type: 'ai_output',
        aiType: type
      };

      setNotes([aiNote, ...notes]);
      if (isAdding) setIsAdding(false);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-full bg-[#0a0a10] text-white flex flex-col relative overflow-hidden">
      {/* Glassmorphic Background Elements */}
      <div className="absolute top-[-10%] left-[-20%] w-[150%] h-[150%] bg-[#0a0a10] z-0" />
      <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-cyan-500/20 blur-[120px] rounded-full z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-purple-500/20 blur-[150px] rounded-full z-0" />

      <header className="screen-header">
        <button onClick={onBack} className="back">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1" />
        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group hover:scale-110 transition-transform">
          <Sparkles size={24} className="text-white group-hover:rotate-12 transition-transform" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10 no-scrollbar">
        {notes.length === 0 && !isAdding ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mb-8 rotate-12 relative group mx-auto">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <FileText size={40} className="text-white/20 group-hover:text-blue-500/50 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 italic tracking-tighter uppercase">No Records Found</h3>
            <p className="text-white/30 text-[10px] max-w-[240px] leading-relaxed uppercase tracking-[0.2em] font-black mx-auto">Your knowledge swarm is currently empty. Start by adding a new note.</p>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            {isAdding ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <input 
                    placeholder="Note Title..."
                    className="bg-transparent border-none text-xl font-bold w-full focus:outline-none placeholder:text-white/20"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                  {currentNote?.type === 'ai_output' && (
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 shrink-0">
                      <button 
                        onClick={() => setEditMode('preview')}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${editMode === 'preview' ? 'bg-cyan-500 text-white' : 'text-white/40'}`}
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => setEditMode('source')}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${editMode === 'source' ? 'bg-cyan-500 text-white' : 'text-white/40'}`}
                      >
                        Source
                      </button>
                    </div>
                  )}
                </div>

                {editMode === 'preview' && currentNote?.type === 'ai_output' ? (
                  <div className="min-h-[200px] mb-4">
                    {currentNote.aiType === 'quiz' ? (
                      <QuizView content={noteText} />
                    ) : currentNote.aiType === 'youtube' ? (
                      <YouTubeView content={noteText} />
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {noteText}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea 
                    autoFocus
                    placeholder="Start writing or let AI help..."
                    className="bg-transparent border-none text-white/70 w-full min-h-[200px] focus:outline-none resize-none placeholder:text-white/20 leading-relaxed"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                )}

                <div className="flex justify-end gap-3 mt-4">
                  {(currentNote?.type === 'ai_output' && (currentNote?.aiType === 'podcast' || currentNote?.aiType === 'audio_overview')) && (
                    <button 
                      onClick={() => speakText(currentNote.content)}
                      className={`p-3 rounded-2xl border transition-all ${isSpeaking ? 'bg-red-500 border-red-400 animate-pulse' : 'bg-white/5 border-white/10'}`}
                    >
                      <Mic2 size={20} className={isSpeaking ? 'text-white' : 'text-orange-500'} />
                    </button>
                  )}
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <X size={20} />
                  </button>
                  <button 
                    onClick={handleSaveNote}
                    className="p-3 px-6 rounded-2xl bg-blue-600 font-bold flex items-center gap-2"
                  >
                    <Check size={20} /> Save
                  </button>
                </div>
              </motion.div>
            ) : null}

            {notes.map((note) => (
              <motion.div 
                layout
                key={note.id}
                className={`p-5 rounded-[28px] border border-white/10 backdrop-blur-xl relative group ${
                  note.type === 'ai_output' ? 'bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border-cyan-500/20' : 'bg-white/5'
                }`}
                onClick={() => {
                  setCurrentNote(note);
                  setNoteTitle(note.title);
                  setNoteText(note.content);
                  setIsAdding(true);
                  if (note.type === 'ai_output') setEditMode('preview');
                  else setEditMode('source');
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {note.type === 'ai_output' && <Sparkles size={14} className="text-cyan-400" />}
                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{note.title}</h3>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-white/50 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-white/50 text-sm line-clamp-3 leading-relaxed mb-3 prose prose-invert prose-sm max-w-none">
                  {note.aiType === 'quiz' ? (
                    <QuizView content={note.content} />
                  ) : note.aiType === 'youtube' ? (
                    <YouTubeView content={note.content} />
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {note.content}
                    </ReactMarkdown>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-black">{note.date}</span>
                  <div className="flex items-center gap-2">
                    {note.type === 'ai_output' && (
                      <div className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-cyan-500/30 text-cyan-400 bg-cyan-500/10`}>
                        {note.aiType || 'AI GEN'}
                      </div>
                    )}
                    <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                      <Maximize2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-32 right-6 z-50 flex flex-col gap-3 items-end"
          >
            {[
              { id: 'enhance', icon: <Wand2 size={20} />, label: "Enhance", color: "from-blue-400 to-indigo-500" },
              { id: 'polish', icon: <Brush size={20} />, label: "Polish", color: "from-indigo-400 to-purple-500" },
              { id: 'table', icon: <Table size={20} />, label: "Generate Table", color: "from-blue-500 to-cyan-400" },
              { id: 'mindmap', icon: <Network size={20} />, label: "Create Mind Map", color: "from-purple-500 to-pink-500" },
              { id: 'audio_overview', icon: <Headphones size={20} />, label: "Audio Overview", color: "from-orange-400 to-amber-500" },
              { id: 'video_overview', icon: <Video size={20} />, label: "Video Overview", color: "from-red-400 to-rose-500" },
              { id: 'youtube', icon: <Youtube size={20} />, label: "YouTube Research", color: "from-red-600 to-rose-700" },
              { id: 'flashcard', icon: <Layers size={20} />, label: "Flashcards", color: "from-emerald-400 to-teal-500" },
              { id: 'quiz', icon: <Puzzle size={20} />, label: "Quiz", color: "from-green-500 to-emerald-600" },
            ].map((item, i) => (
              <motion.button 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => callAI(item.id as any)}
                className="flex items-center gap-3 pr-2 group"
              >
                <span className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 uppercase tracking-widest text-[10px]">
                  {item.label}
                </span>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center shadow-xl shadow-black/40`}>
                  {item.icon}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 inset-x-0 flex justify-center gap-4 px-6 z-40">
        <button 
          onClick={handleCreateNote}
          className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center gap-2 font-bold text-lg active:scale-95 transition-transform"
        >
          <Plus size={24} /> New Note
        </button>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          disabled={isLoading}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
            isLoading 
              ? 'bg-white/10 text-white/30' 
              : isMenuOpen 
                ? 'bg-red-500 rotate-45' 
                : 'bg-gradient-to-tr from-cyan-400 to-purple-600 shadow-cyan-500/40'
          }`}
        >
          {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
        </button>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="relative">
              <Loader2 size={60} className="text-cyan-500 animate-spin" />
              <Sparkles size={24} className="text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-8 text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI is processing your note...
            </p>
            <p className="text-white/40 text-sm mt-2">Almost ready with the magic ✨</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
