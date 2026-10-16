"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Shield, Sparkles } from 'lucide-react';
import { SignIn, useUser } from '@clerk/nextjs';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const { isLoggedIn, isLoaded: isAuthLoaded, login } = useAuth();

  useEffect(() => {
    if ((isClerkLoaded && isSignedIn) || (isAuthLoaded && isLoggedIn)) {
      router.push('/dashboard');
    }
  }, [isClerkLoaded, isSignedIn, isAuthLoaded, isLoggedIn, router]);

  const handleQuickDemo = () => {
    login({
      name: 'Kamla Devi',
      email: 'kamla.devi@example.com',
      age: 68,
      emergencyName: 'Rahul (Son / Caregiver)',
      emergencyPhone: '+91 98765 43210',
    });
    router.push('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto py-8 pb-36 sm:pb-44 px-4 flex flex-col items-center justify-center space-y-6">
      {/* Clerk Official Sign In Component */}
      <div className="w-full flex justify-center">
        <SignIn routing="hash" signUpUrl="/register" fallbackRedirectUrl="/dashboard" />
      </div>

      {/* Demo Prototype Access */}
      <div className="w-full max-w-[400px] bg-white border border-[#D5DFDC] rounded-2xl p-4 text-center space-y-3 shadow-xs">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#0B534B]" />
          <span>Quick Prototype Access</span>
        </div>
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-2.5 px-4 bg-[#E6F4F1] hover:bg-[#d5ede8] text-[#0B534B] border border-[#0B534B]/30 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Enter as Demo User (Kamla Devi)</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-[#5A6A66] font-semibold">
        <Shield className="w-4 h-4 text-[#0B534B]" />
        <span>Secured by Clerk Authentication & Smitri_NER</span>
      </div>

      {/* Trailing clearance spacer so floating SOS dock never covers content */}
      <div className="h-10 sm:h-14 w-full pointer-events-none" />
    </div>
  );
}
