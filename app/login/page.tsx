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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042420]/70 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-[#D5DFDC] flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#E6F4F1] flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-[#0B534B] animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-[#0B534B] border-t-transparent animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#111615]">Logging you in...</h3>
              <p className="text-xs text-[#5A6A66] font-medium">Preparing your personalized memory dashboard</p>
            </div>
            <div className="w-full bg-[#F6F8F7] h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#0B534B] to-[#10B981] h-full rounded-full animate-pulse w-full" />
            </div>
          </div>
        </div>
      )}

      <ScrollReveal direction="up">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#D5DFDC] shadow-sm space-y-8 relative">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-[#E6F4F1] text-[#0B534B] rounded-xl flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111615] tracking-tight">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
            Please log in to continue your memory wellness journey.
          </p>
        </div>

        {/* Demo One-Click Login Callout */}
        <div className="bg-[#E6F4F1] border border-[#0B534B]/20 rounded-2xl p-4 space-y-2.5 text-center">
          <p className="text-xs sm:text-sm font-bold text-[#111615]">
            Quick Prototype Demo Access:
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={handleQuickDemo}
            className="w-full py-3 px-4 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] disabled:opacity-75 text-white rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
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
            <label className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66] disabled:opacity-60"
              placeholder="e.g. name@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66] disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-75 text-white rounded-xl font-bold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Opening Dashboard...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        <div className="border-t border-[#D5DFDC] pt-5 text-center space-y-2">
          <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-[#0B534B] underline font-bold hover:text-[#08433C]">
              Register here
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[#5A6A66] font-semibold">
            <Shield className="w-4 h-4 text-[#0B534B]" />
            <span>Your data is stored securely on this device.</span>
          </div>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
}
