"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignUp, useUser } from '@clerk/nextjs';
import { useAuth } from '@/lib/auth';
import { Shield } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const { isLoggedIn, isLoaded: isAuthLoaded } = useAuth();

  useEffect(() => {
    if ((isClerkLoaded && isSignedIn) || (isAuthLoaded && isLoggedIn)) {
      router.push('/dashboard');
    }
  }, [isClerkLoaded, isSignedIn, isAuthLoaded, isLoggedIn, router]);

  return (
    <div className="max-w-xl mx-auto py-8 pb-36 sm:pb-44 px-4 flex flex-col items-center justify-center space-y-6">
      {/* Clerk Official Sign Up Component */}
      <div className="w-full flex justify-center">
        <SignUp routing="hash" signInUrl="/login" fallbackRedirectUrl="/dashboard" />
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
