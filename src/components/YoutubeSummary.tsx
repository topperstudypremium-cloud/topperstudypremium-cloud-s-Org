import { useState } from 'react';
import { Youtube, ChevronLeft, Send, Loader2, PlayCircle, ClipboardList, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { geminiService } from '../services/geminiService';

interface YoutubeSummaryProps {
  onBack: () => void;
}

export const YoutubeSummary = ({ onBack }: YoutubeSummaryProps) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);
    try {
      const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      if (!youtubeApiKey) {
        throw new Error("YouTube API Key is missing. Please add it to your environment variables.");
      }
      const data = await geminiService.summarizeYoutubeVideo(url, youtubeApiKey);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while summarizing the video.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#03070c] text-white flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-red-600/10 to-transparent pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 blur-[80px] rounded-full" />
      
      {/* Header */}
      <header className="screen-header">
        <button onClick={onBack} className="back">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1" />
        <div className="flex flex-col items-end">
          <h1 className="text-xl font-black tracking-tighter italic">YT <span className="text-red-500">SUMMARY</span></h1>
          <p className="text-[10px] uppercase font-black tracking-widest text-white/30">AI Video Analyzer</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
        {!result ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <Youtube className="text-red-500" size={32} />
              </div>
              <h2 className="text-2xl font-black leading-tight mb-4 tracking-tighter uppercase italic">Ready to <span className="text-red-500">Simplify?</span></h2>
              <p className="text-white/40 text-sm mb-8 leading-relaxed">Paste a YouTube video link below and let AI extract the key insights, study notes, and a detailed summary for you.</p>
              
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-4 pr-12 text-sm text-white outline-none focus:border-red-500/50 transition-all"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                    <PlayCircle size={20} />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest px-2">{error}</p>
                )}

                <button 
                  onClick={handleSummarize}
                  disabled={isLoading || !url}
                  className="w-full h-14 rounded-2xl bg-white text-black font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-2 shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Summary
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 p-4 rounded-[24px]">
                <ClipboardList size={20} className="text-blue-400 mb-2" />
                <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Study Notes</div>
                <p className="text-[9px] text-white/30 mt-1 uppercase">Automated lecture notes</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-[24px]">
                <Sparkles size={20} className="text-orange-400 mb-2" />
                <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Key Insights</div>
                <p className="text-[9px] text-white/30 mt-1 uppercase">Main takeaways only</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Video Preview Card */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
              <img src={result.thumbnail} alt={result.title} className="w-full aspect-video object-cover opacity-60" />
              <div className="p-6">
                <h3 className="text-lg font-bold leading-tight">{result.title}</h3>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => { setResult(null); setUrl(''); }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest"
                  >
                    Summarize Another
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Content */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Sparkles size={16} className="text-red-500" />
                </div>
                <span className="text-[12px] font-black text-white uppercase tracking-widest">AI Intelligence Report</span>
              </div>
              
              <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-li:my-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.summary}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#03070c] to-transparent pointer-events-none" />
    </div>
  );
};
