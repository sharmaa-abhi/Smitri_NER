"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, UserCheck, Shield, Loader2, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('kamla.devi@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto py-8 relative">
      {/* Loading Overlay Animation */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-blue-100 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Logging you in...</h3>
              <p className="text-xs text-slate-600 font-medium">Preparing your personalized memory dashboard</p>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 h-full rounded-full animate-pulse w-full" />
            </div>
          </div>
        </div>
      )}

      <ScrollReveal direction="up">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-4 border-slate-200 shadow-xl space-y-8 relative">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Please log in to continue your memory wellness journey.
          </p>
        </div>

        {/* Demo One-Click Login Callout */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2.5 text-center">
          <p className="text-xs sm:text-sm font-bold text-blue-950">
            Quick Prototype Demo Access:
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={handleQuickDemo}
            className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 disabled:opacity-75 text-white rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Enter as Demo User (Kamla Devi)</span>
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600 disabled:opacity-60"
              placeholder="e.g. name@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 bg-amber-500 hover:bg-amber-400 disabled:opacity-75 text-slate-950 rounded-xl font-bold text-base shadow-sm hover:shadow transition-all border border-amber-600 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                <span>Opening Dashboard...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        <div className="border-t border-slate-100 pt-5 text-center space-y-2">
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-blue-700 underline font-bold hover:text-blue-900">
              Register here
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-semibold">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Your data is stored securely on this device.</span>
          </div>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
}
