import React, { useState } from 'react';
import { Mail, Lock, User, ChevronLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { motion } from 'motion/react';

interface AuthProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const Auth = ({ onBack, onSuccess }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase is not configured.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: name }
          }
        });
        if (error) throw error;
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#030810] relative flex flex-col p-8 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full" />

      <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-12">
        <ChevronLeft size={24} className="text-white" />
      </button>

      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
          <Sparkles className="text-white" size={32} />
        </div>
        <h2 className="text-3xl font-black text-white italic mb-2 tracking-tighter">
          {isLogin ? 'WELCOME BACK' : 'JOIN THE SWARM'}
        </h2>
        <p className="text-white/50 text-sm font-medium mb-8 uppercase tracking-widest">
          {isLogin ? 'Login to your premium account' : 'Create your AI-powered profile'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              <input 
                placeholder="Full Name"
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-medium"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
            <input 
              type="email"
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-medium"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
            <input 
              type="password"
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-medium"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-400 text-xs font-bold px-2">{error}</p>}

          <div className="space-y-3">
            <button 
              type="submit"
              disabled={loading}
              className="w-full p-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform mt-4 disabled:opacity-50"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : (
                <> {isLogin ? 'Login' : 'Create Account'} <ArrowRight size={20} /> </>
              )}
            </button>

            <button 
              type="button"
              onClick={onSuccess}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Continue as Guest
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-white/40 text-sm font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-white font-black italic underline decoration-blue-500 decoration-2 underline-offset-4"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};
