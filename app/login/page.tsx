"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, UserCheck, Shield } from 'lucide-react';

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
    }, 600);
  };

  const handleQuickDemo = () => {
    router.push('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border-4 border-slate-200 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Welcome Back</h1>
          <p className="text-lg text-slate-600 font-medium">
            Please log in to continue your memory wellness journey.
          </p>
        </div>

        {/* Demo One-Click Login Callout */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 space-y-3 text-center">
          <p className="text-base font-bold text-blue-950">
            Quick Prototype Demo Access:
          </p>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-4 px-6 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-black text-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="w-6 h-6" />
            <span>Enter as Demo User (Kamla Devi)</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xl font-bold text-slate-900">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-xl px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
              placeholder="e.g. name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-bold text-slate-900">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-xl px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-2xl shadow-lg hover:shadow-xl transition-all border-2 border-amber-600"
          >
            {loading ? "Opening Dashboard..." : "Log In"}
          </button>
        </form>

        <div className="border-t-2 border-slate-100 pt-6 text-center space-y-3">
          <p className="text-lg text-slate-700 font-medium">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-blue-800 underline font-bold hover:text-blue-950">
              Register here
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-semibold">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Your data is stored securely on this device.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
