import React, { useState, useEffect } from 'react';
import { ChevronLeft, Shield, Check } from 'lucide-react';

interface PolicyProps {
  title: string;
  lastUpdated: string;
  content: string;
  onBack: () => void;
}

export const PolicyScreen = ({ title, lastUpdated, content, onBack }: PolicyProps) => {
  return (
    <div className="h-full bg-[#030810] relative flex flex-col pt-16 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full" />
      
      <button onClick={onBack} className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center z-20">
        <ChevronLeft size={24} className="text-white" />
      </button>

      <div className="px-8 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
          <Shield className="text-blue-400" size={24} />
        </div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter leading-none">{title}</h1>
        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Last Updated: {lastUpdated}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 no-scrollbar pb-10 relative z-10">
        <div className="prose prose-invert prose-sm max-w-none">
          {content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-white/60 leading-relaxed font-medium mb-4 whitespace-pre-wrap">
              {paragraph.startsWith('---') ? null : paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
