import React, { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, Loader2, BookOpen, Clock, Target, Rocket, Download } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { geminiService } from '../services/geminiService';

interface DocumentAnalysisProps {
  onBack: () => void;
}

export const DocumentAnalysis = ({ onBack }: DocumentAnalysisProps) => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<string>('');
  const [error, setError] = useState('');

  const context = (window as any).analysisContext || { subject: 'General Study', syllabusNames: [], paperNames: [] };

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        setLoading(true);
        const result = await geminiService.analyzeAcademicDocuments(
          context.subject,
          context.syllabusNames || context.filenames || [],
          context.paperNames || []
        );
        setAnalysis(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, []);

  return (
    <div className="h-full bg-[#030810] flex flex-col pt-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
      
      <button onClick={onBack} className="back">
        <ChevronLeft size={24} />
      </button>

      <div className="px-8 mt-4 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Sparkles size={20} />
          </div>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">AI Intelligence</span>
        </div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">
          {context.subject} <br />
          <span className="text-white/40">Analysis Report</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 no-scrollbar pb-32 relative z-10">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl border border-white/5 bg-white/5 flex items-center justify-center animate-pulse">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles size={24} className="text-blue-400 animate-bounce" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-white font-black italic uppercase tracking-tighter text-xl mb-2">Analyzing Patterns...</p>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Our Study-Bot is processing your documents</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[32px] text-center">
            <p className="text-red-500 font-bold mb-2">Analysis Failed</p>
            <p className="text-red-400/60 text-xs">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full font-bold text-xs"
            >
              Retry
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white/5 border border-white/10 rounded-[28px] backdrop-blur-xl">
                <BookOpen className="text-blue-400 mb-3" size={20} />
                <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Topics Found</div>
                <div className="text-lg font-black text-white italic">12+ Major</div>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-[28px] backdrop-blur-xl">
                <Target className="text-purple-400 mb-3" size={20} />
                <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Difficulty</div>
                <div className="text-lg font-black text-white italic">Moderate</div>
              </div>
            </div>

            {/* Analysis Content */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-2xl markdown-body text-white/80">
              <Markdown>{analysis}</Markdown>
            </div>

            {/* CTA */}
            <div className="p-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[40px] shadow-2xl shadow-blue-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rotate-45 translate-x-16 -translate-y-16" />
               <Rocket className="text-white mb-4" size={32} />
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">Ready to Score 90%+?</h3>
               <p className="text-white/70 text-xs font-bold leading-relaxed mb-6">Our AI generated a custom roadmap just for you. Follow it strictly.</p>
               <button className="w-full py-4 bg-white text-blue-600 rounded-[22px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95 transition-all">
                 <Download size={16} />
                 Download Roadmap
               </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
