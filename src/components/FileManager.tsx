import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Cloud, Trash2, Loader2, Upload, File, HardDrive, AlertCircle, CheckCircle2, RefreshCcw, XCircle, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getSupabase } from '../lib/supabase';

interface FileManagerProps {
  onBack: () => void;
}

export const FileManager = ({ onBack }: FileManagerProps) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [error, setError] = useState('');
  
  const LIMIT_GB = 1;
  const LIMIT_BYTES = LIMIT_GB * 1024 * 1024 * 1024;

  const fetchFiles = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data, error } = await supabase.storage.from('user-uploads').list(user.id);
      if (error) throw error;
      
      if (data) {
        // Map files to include a status
        const fileList = data.map(f => ({ ...f, status: 'synced' }));
        setFiles(fileList);
        const size = data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
        setTotalSize(size);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (totalSize + file.size > LIMIT_BYTES) {
      alert("Storage limit reached! (1GB Max)");
      return;
    }

    const tempId = Date.now().toString();
    const newFilePlaceholder = {
      id: tempId,
      name: file.name,
      metadata: { size: file.size },
      status: 'syncing',
      progress: 0
    };

    setFiles(prev => [newFilePlaceholder, ...prev]);
    setUploading(true);
    setUploadProgress(0);
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setFiles(prev => prev.filter(f => f.id !== tempId));
      return;
    }

    try {
      const { error } = await supabase.storage
        .from('user-uploads')
        .upload(`${user.id}/${file.name}`, file, {
          upsert: true,
          onUploadProgress: (progress: any) => {
            const percent = (progress.loaded / progress.total) * 100;
            const rounded = Math.round(percent);
            setUploadProgress(rounded);
            setFiles(prev => prev.map(f => f.id === tempId ? { ...f, progress: rounded } : f));
          }
        } as any);
      
      if (error) throw error;
      await fetchFiles();
    } catch (err: any) {
      setFiles(prev => prev.map(f => f.id === tempId ? { ...f, status: 'error', error: err.message } : f));
      alert(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (name: string) => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase.storage.from('user-uploads').remove([`${user.id}/${name}`]);
      if (error) throw error;
      fetchFiles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const usagePercent = (totalSize / LIMIT_BYTES) * 100;

  return (
    <div className="h-full bg-[#030810] flex flex-col pt-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
      
      <button onClick={onBack} className="back">
        <ChevronLeft size={24} className="text-white" />
      </button>

      <div className="px-8 mb-8">
        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-6 underline decoration-blue-500 decoration-2 underline-offset-4">Cloud Storage</h1>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <HardDrive className="text-blue-400" size={20} />
              <div className="flex flex-col">
                <span className="text-white/70 font-black uppercase tracking-[0.2em] text-[10px]">Space Used</span>
                <span className="text-white font-black text-lg">
                  {formatSize(totalSize)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-white/30 font-black uppercase tracking-widest text-[9px] block">Total Capacity</span>
              <span className="text-white/50 font-black text-sm">{LIMIT_GB} GB</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(usagePercent, 100)}%` }}
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-full relative shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-move_2s_linear_infinite]" />
              </motion.div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                {usagePercent.toFixed(2)}% Used
              </span>
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                {formatSize(LIMIT_BYTES - totalSize)} Available
              </span>
            </div>
          </div>
          <p className="text-white/20 text-[10px] mt-4 font-bold tracking-widest text-center uppercase">Cloud Secure Vault</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 no-scrollbar pb-32">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/30 text-[10px] font-black uppercase tracking-widest">My Files</h3>
          <label className="flex items-center gap-2 text-blue-400 font-bold text-xs cursor-pointer">
            <Upload size={14} />
            Upload New
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 opacity-20"><Loader2 className="animate-spin" /></div>
        ) : files.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center opacity-20 text-center gap-2">
            <Cloud size={40} />
            <p className="text-xs font-bold uppercase tracking-widest">No files found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map(file => (
              <div key={file.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group relative">
                <div className="flex items-center gap-3 truncate pr-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    {file.status === 'syncing' ? <RefreshCcw size={18} className="animate-spin" /> : <File size={18} />}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-white truncate">{file.name}</div>
                      
                      {/* Sync Status Badge */}
                      {file.status === 'synced' && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                          <CheckCircle2 size={8} className="text-green-500" />
                          <span className="text-[7px] font-black uppercase tracking-widest text-green-500">Synced</span>
                        </div>
                      )}
                      {file.status === 'syncing' && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 animate-pulse">
                          <RefreshCcw size={8} className="text-blue-500 animate-spin" />
                          <span className="text-[7px] font-black uppercase tracking-widest text-blue-500">{file.progress}%</span>
                        </div>
                      )}
                      {file.status === 'error' && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                          <XCircle size={8} className="text-red-500" />
                          <span className="text-[7px] font-black uppercase tracking-widest text-red-500">Error</span>
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-white/30 font-bold">{(file.metadata?.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>
                
                {/* Individual Progress Bar for active uploads */}
                {file.status === 'syncing' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden rounded-b-2xl">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {file.status === 'synced' && (
                    <button 
                      onClick={() => {
                        (window as any).analysisContext = { subject: 'General', filenames: [file.name] };
                        (window as any).navigateTo('s_analysis');
                      }}
                      className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 active:scale-90 transition-all"
                      title="Analyze with AI"
                    >
                      <Wand2 size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteFile(file.name)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mini Upload Toast instead of full screen overlay */}
      {uploading && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-8 right-8 bg-[#0a0f1a] border border-blue-500/30 p-4 rounded-[24px] shadow-2xl backdrop-blur-3xl z-[100] flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
            <RefreshCcw size={20} className="animate-spin" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Uploading Document</span>
              <span className="text-[10px] font-black text-blue-400">{uploadProgress}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${uploadProgress}%` }}
                className="h-full bg-blue-500"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
