import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, Eraser, PenTool, Trash2, Download, Square, Circle as CircleIcon, Slash, Type, Share2, Users } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface WhiteboardProps {
  onBack: () => void;
  roomId?: string;
}

export const Whiteboard = ({ onBack, roomId = 'global-study' }: WhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'rect' | 'circle' | 'line' | 'text'>('pen');
  const [color, setColor] = useState('#ffffff');
  const [size, setSize] = useState(2);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  const [channel, setChannel] = useState<any>(null);

  const [remoteScreenSharing, setRemoteScreenSharing] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Supabase Real-time setup
    const supabase = getSupabase();
    if (supabase) {
      const roomChannel = supabase.channel(`whiteboard:${roomId}`)
        .on('broadcast', { event: 'draw' }, ({ payload }) => {
          remoteDraw(payload);
        })
        .on('broadcast', { event: 'clear' }, () => {
          const c = canvasRef.current;
          const ct = c?.getContext('2d');
          if (c && ct) ct.clearRect(0, 0, c.width, c.height);
        })
        .on('broadcast', { event: 'screenshare' }, ({ payload }) => {
          setRemoteScreenSharing(payload.active ? payload.peerId : null);
        })
        .subscribe();
      
      setChannel(roomChannel);
      return () => { roomChannel.unsubscribe(); };
    }
  }, [roomId]);

  const remoteDraw = (data: any) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.size;
    ctx.lineCap = 'round';

    if (data.type === 'pen' || data.type === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(data.lastX, data.lastY);
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    } else if (data.type === 'rect') {
      ctx.strokeRect(data.x, data.y, data.width, data.height);
    } else if (data.type === 'circle') {
      ctx.beginPath();
      ctx.arc(data.x, data.y, data.radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (data.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(data.x1, data.y1);
      ctx.lineTo(data.x2, data.y2);
      ctx.stroke();
    } else if (data.type === 'text') {
      ctx.font = `${data.size * 5}px Inter`;
      ctx.fillStyle = data.color;
      ctx.fillText(data.text, data.x, data.y);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    setStartX(x);
    setStartY(y);
    setIsDrawing(true);
    
    // Save snapshot for shapes
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (tool === 'text') {
      const text = prompt("Enter text:");
      if (text) {
        ctx.font = `${size * 5}px Inter`;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        channel?.send({
          type: 'broadcast',
          event: 'draw',
          payload: { type: 'text', text, x, y, color, size }
        });
      }
      setIsDrawing(false);
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === 'text') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !snapshot) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.putImageData(snapshot, 0, 0); // Restore snapshot
    ctx.strokeStyle = tool === 'eraser' ? '#030810' : color;
    ctx.lineWidth = tool === 'eraser' ? 30 : size;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
      // Broadcast movement
      channel?.send({
        type: 'broadcast',
        event: 'draw',
        payload: { type: tool, x, y, lastX: startX, lastY: startY, color: ctx.strokeStyle, size: ctx.lineWidth }
      });
      setStartX(x);
      setStartY(y);
    } else if (tool === 'rect') {
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: any) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (tool !== 'pen' && tool !== 'eraser' && tool !== 'text') {
      const rect = canvasRef.current?.getBoundingClientRect();
      const x = ('clientX' in e) ? e.clientX - (rect?.left || 0) : startX;
      const y = ('clientY' in e) ? e.clientY - (rect?.top || 0) : startY;

      channel?.send({
        type: 'broadcast',
        event: 'draw',
        payload: { 
          type: tool, 
          x: startX, y: startY, 
          width: x - startX, height: y - startY,
          x1: startX, y1: startY, x2: x, y2: y,
          radius: Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2)),
          color, size 
        }
      });
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      channel?.send({ type: 'broadcast', event: 'clear' });
    }
  };

  const saveAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const shareScreen = async () => {
    try {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        setScreenStream(null);
        channel?.send({ type: 'broadcast', event: 'screenshare', payload: { active: false } });
        return;
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: "always" } as any,
        audio: false 
      });
      
      setScreenStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      channel?.send({ 
        type: 'broadcast', 
        event: 'screenshare', 
        payload: { active: true, peerId: (window as any).currentUserId || 'anonymous' } 
      });

      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        channel?.send({ type: 'broadcast', event: 'screenshare', payload: { active: false } });
      };
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  };

  return (
    <div className="h-full bg-[#030810] flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1e3a8a_0%,transparent_60%)] opacity-10 pointer-events-none" />

      {/* Remote Sharing Notification */}
      <AnimatePresence>
        {remoteScreenSharing && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest z-[100] shadow-xl flex items-center gap-2 border border-blue-400"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Peer is currently sharing screen
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Share Overlay */}
      {screenStream && (
        <motion.div 
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          className="absolute bottom-24 right-6 w-64 aspect-video rounded-2xl overflow-hidden border-2 border-blue-500 shadow-2xl z-[60] bg-black group"
        >
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => {
                screenStream.getTracks().forEach(t => t.stop());
                setScreenStream(null);
              }}
              className="p-2 bg-red-600 rounded-full text-white"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 rounded text-[8px] font-black uppercase tracking-widest text-white">
            Sharing Screen
          </div>
        </motion.div>
      )}

      {/* Header Toolbar */}
      <div className="absolute top-6 inset-x-6 flex items-center justify-between z-50 pointer-events-none">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center pointer-events-auto backdrop-blur-md active:scale-95 transition-all">
          <ChevronLeft size={24} className="text-white" />
        </button>
        
        <div className="flex items-center gap-1.5 p-1.5 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-2xl pointer-events-auto shadow-2xl">
          {[
            { id: 'pen', icon: <PenTool size={16} /> },
            { id: 'rect', icon: <Square size={16} /> },
            { id: 'circle', icon: <CircleIcon size={16} /> },
            { id: 'line', icon: <Slash size={16} /> },
            { id: 'text', icon: <Type size={16} /> },
            { id: 'eraser', icon: <Eraser size={16} /> }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setTool(t.id as any)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${tool === t.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'text-white/40 hover:text-white'}`}
            >
              {t.icon}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button onClick={clear} className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button onClick={shareScreen} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 backdrop-blur-md">
            <Share2 size={18} />
          </button>
          <button onClick={saveAsImage} className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
            <Download size={18} />
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="flex-1 cursor-crosshair relative z-10"
      />

      {/* Footer Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/60 border border-white/10 rounded-full backdrop-blur-2xl flex items-center gap-6 z-50 shadow-2xl">
        <div className="flex gap-2">
          {['#ffffff', '#3b82f6', '#ef4444', '#22c55e', '#eab308', '#ec4899', '#a855f7'].map(c => (
            <button 
              key={c}
              onClick={() => { setColor(c); if(tool === 'eraser') setTool('pen'); }}
              className={`w-6 h-6 rounded-full border-2 transition-transform active:scale-125 ${color === c ? 'border-white scale-125 shadow-lg shadow-white/20' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Size</span>
          <input 
            type="range" min="1" max="20" value={size} 
            onChange={e => setSize(parseInt(e.target.value))}
            className="w-24 h-1 bg-white/10 rounded-full appearance-none accent-blue-500 cursor-pointer" 
          />
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <Users size={14} className="text-blue-500" />
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">Live Swarm</span>
        </div>
      </div>
    </div>
  );
};
