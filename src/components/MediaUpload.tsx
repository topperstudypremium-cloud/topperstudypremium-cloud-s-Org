import React, { useState, useRef } from 'react';
import { ChevronLeft, Plus, X, Globe, Youtube, Clipboard, FileText, ImageIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MediaUploadProps {
  onAnalyze: () => void;
  onBack: () => void;
}

export const MediaUpload = ({ onAnalyze, onBack }: MediaUploadProps) => {
  const [sylFiles, setSylFiles] = useState<File[]>([]);
  const [paperFiles, setPaperFiles] = useState<File[]>([]);
  const [showNeon, setShowNeon] = useState(false);
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);
  const [currentNeonSubject, setCurrentSubject] = useState('');
  const syllabusInputRef = useRef<HTMLInputElement>(null);
  const paperInputRef = useRef<HTMLInputElement>(null);

  const handleSyllabusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const news = Array.from(e.target.files);
      setSylFiles(prev => [...prev, ...news].slice(0, 6));
    }
  };

  const handlePaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const news = Array.from(e.target.files);
      setPaperFiles(prev => [...prev, ...news].slice(0, 6));
    }
  };

  const removeSyl = (idx: number) => setSylFiles(prev => prev.filter((_, i) => i !== idx));
  const removePaper = (idx: number) => setPaperFiles(prev => prev.filter((_, i) => i !== idx));

  const neonSubjects = [
    { name: 'Physics', color: 'purple', icon: <Zap color="#9060ff" size={40} /> },
    { name: 'Chemistry', color: 'green', icon: <Zap color="#00ff88" size={40} /> },
    { name: 'Math', color: 'blue', icon: <Zap color="#4488ff" size={40} /> },
    { name: 'Biology', color: 'pink', icon: <Zap color="#ff4499" size={40} /> },
    { name: 'Science', color: 'orange', icon: <Zap color="#ff8800" size={40} /> },
    { name: 'Hindi/English', color: 'violet', icon: <Zap color="#aa44ff" size={40} /> },
  ];

  const canAnalyze = sylFiles.length > 0 || paperFiles.length > 0;

  return (
    <div className="h-full bg-[radial-gradient(ellipse_160%_80%_at_50%_95%,#050d1a_0%,#020609_60%,#000_100%)] relative flex flex-col items-center p-[60px_22px_36px] gap-[18px]">
      {/* Background bubbles */}
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="bub" 
          style={{ 
            width: `${25 + i * 20}px`, 
            height: `${25 + i * 20}px`,
            top: `${50 + i * 5}%`,
            left: `${i * 15}%`,
            '--duration': `${3 + i * 0.5}s`,
            '--tx': `${5 + i}px`,
            '--ty': `${-10 - i}px`
          } as any} 
        />
      ))}

      <button className="back" onClick={onBack}><ChevronLeft size={20} /></button>
      
      <div className="text-[24px] font-normal text-white tracking-widest uppercase">pdf & photos</div>

      <div className="flex gap-[14px] w-full mt-4">
        {/* Syllabus Upload */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div 
            className={`w-full min-h-[110px] bg-white/5 rounded-[18px] border border-white/10 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden backdrop-blur-xl transition-all p-2.5 ${sylFiles.length > 0 ? 'border-cyan/60 shadow-[0_0_18px_rgba(0,212,255,0.22)]' : ''}`}
            onClick={() => syllabusInputRef.current?.click()}
          >
            {sylFiles.length === 0 ? (
              <Plus size={34} color="rgba(255,255,255,0.8)" strokeWidth={1} />
            ) : (
              <div className="w-full flex flex-col gap-1 max-h-[90px] overflow-y-auto">
                {sylFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-1 bg-cyan/10 border border-cyan/30 rounded-lg p-1 px-2 text-[10px] text-cyan overflow-hidden">
                    <span className="shrink-0">{f.type.includes('pdf') ? '📄' : '🖼'}</span>
                    <span className="truncate flex-1">{f.name}</span>
                    <X size={10} className="cursor-pointer" onClick={(e) => {e.stopPropagation(); removeSyl(i);}} />
                  </div>
                ))}
              </div>
            )}
            <input 
              type="file" 
              ref={syllabusInputRef} 
              className="hidden" 
              multiple 
              accept=".pdf,image/*" 
              onChange={handleSyllabusChange} 
            />
          </div>
          <div className="text-[11px] text-[#7a9bbf] text-center font-light leading-snug">upload syllabus</div>
        </div>

        {/* Previous Paper Upload - Opens Neon Screen */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div 
            className={`w-full min-h-[110px] bg-white/5 rounded-[18px] border border-white/10 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden backdrop-blur-xl transition-all p-2.5 ${paperFiles.length > 0 ? 'border-purple/60 shadow-[0_0_18px_rgba(160,80,255,0.25)]' : ''}`}
            onClick={() => setShowNeon(true)}
          >
            {paperFiles.length === 0 ? (
              <Plus size={34} color="rgba(255,255,255,0.8)" strokeWidth={1} />
            ) : (
              <div className="w-full flex flex-col gap-1 max-h-[90px] overflow-y-auto">
                {paperFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-1 bg-purple/10 border border-purple/30 rounded-lg p-1 px-2 text-[10px] text-[#b080ff] overflow-hidden">
                    <span className="shrink-0">{f.type.includes('pdf') ? '📄' : '🖼'}</span>
                    <span className="truncate flex-1">{f.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-[11px] text-[#7a9bbf] text-center font-light leading-snug">upload previous paper</div>
        </div>
      </div>

      <button 
        className={`mt-auto p-[15px_48px] rounded-[18px] bg-[#121212e6] text-white/40 text-[15px] font-medium cursor-pointer border border-white/10 backdrop-blur-md transition-all ${canAnalyze ? 'text-white border-cyan shadow-[0_0_22px_rgba(0,212,255,0.35)] animate-pulse' : ''}`}
        onClick={canAnalyze ? () => {
          (window as any).analysisContext = {
            subject: currentNeonSubject || 'Selected Documents',
            syllabusNames: sylFiles.map(f => f.name),
            paperNames: paperFiles.map(f => f.name)
          };
          onAnalyze();
        } : undefined}
      >
        Analyze
      </button>

      {/* Neon Screen Overlay */}
      <AnimatePresence>
        {showNeon && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 bg-[radial-gradient(ellipse_180%_120%_at_50%_50%,#0a0818_0%,#050410_60%,#000_100%)] flex flex-col"
          >
            <div className="neon-blob absolute w-[200px] h-[200px] top-[-50px] left-[-50px] bg-[radial-gradient(circle,#6030ff,transparent)] blur-[80px] opacity-25 pointer-events-none" />
            <div className="neon-blob absolute w-[180px] h-[180px] top-200px right-[-60px] bg-[radial-gradient(circle,#ff3090,transparent)] blur-[80px] opacity-25 pointer-events-none" />
            <button 
              className="back" 
              onClick={() => setShowNeon(false)}
              aria-label="Go back to subject selection"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-center mt-16 mb-4 relative z-10">
              <div className="text-[22px] font-black text-white italic tracking-tighter uppercase mb-1">Select Previous Paper</div>
              <div className="text-[11px] text-white/30 font-black uppercase tracking-[0.3em]">Choose your subject to upload</div>
            </div>

            <div className="grid grid-cols-2 flex-1 mt-4">
              {neonSubjects.map((subj) => (
                <div 
                  key={subj.name}
                  className="relative flex items-center justify-center cursor-pointer group"
                  onClick={() => {
                    setCurrentSubject(subj.name);
                    setShowUploadOverlay(true);
                  }}
                >
                  <div className="absolute inset-[10px] rounded-[24px] bg-white/5 backdrop-blur-[20px] border border-white/10 group-active:scale-95 transition-all" />
                  <div className={`relative z-10 glow-${subj.color}`}>{subj.icon}</div>
                </div>
              ))}
            </div>

            {/* Paper Upload Overlay */}
            <AnimatePresence>
              {showUploadOverlay && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-[30px] gap-5 z-[100]"
                >
                  <button className="absolute top-4 right-4 bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-white" onClick={() => setShowUploadOverlay(false)}>✕</button>
                  <div className="text-[22px] font-bold text-white text-center">{currentNeonSubject} — Previous Papers</div>
                  <div className="text-[14px] text-white/50 text-center">Upload upto 6 PDF files or photos</div>
                  
                  <div 
                    className="w-full p-[30px] border-2 border-dashed border-purple/50 rounded-[20px] flex flex-col items-center gap-3 cursor-pointer bg-purple/5 transition-all hover:bg-purple/10"
                    onClick={() => paperInputRef.current?.click()}
                  >
                    <input type="file" ref={paperInputRef} className="hidden" multiple accept=".pdf,image/*" onChange={handlePaperChange} />
                    <div className="text-4xl">📂</div>
                    <div className="text-[14px] text-white/60 text-center">
                      Tap to select files<br />
                      <small className="opacity-50">PDF, JPG, PNG supported • Max 6 files</small>
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-2 max-h-[180px] overflow-y-auto">
                    {paperFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-purple/15 border border-purple/30 rounded-[10px] p-2 px-3">
                        <span className="text-base">{f.type.includes('pdf') ? '📄' : '🖼'}</span>
                        <span className="flex-1 text-[12px] text-[#ddd] truncate">{f.name}</span>
                        <button className="text-red-400 text-sm" onClick={() => removePaper(i)}>✕</button>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="w-full p-[14px] rounded-[14px] border-none bg-[linear-gradient(135deg,#9060ff,#6040cc)] text-white text-base font-bold cursor-pointer shadow-[0_4px_20px_rgba(144,96,255,0.4)] active:scale-95"
                    onClick={() => setShowUploadOverlay(false)}
                  >
                    Done ✓
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
