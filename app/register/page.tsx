"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Shield } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

import { useAuth } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('68');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      name: name || 'Elderly Member',
      age: parseInt(age) || 68,
      email,
      emergencyName: emergencyName || 'Caregiver',
      emergencyPhone: emergencyPhone || '+91 98765 43210',
    };

    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      login(userData);
      router.push('/dashboard');
    } catch {
      login(userData);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ScrollReveal direction="up">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#D5DFDC] shadow-sm space-y-8">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-[#E6F4F1] text-[#0B534B] rounded-xl flex items-center justify-center mx-auto mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#111615] tracking-tight">Create Your Profile</h1>
          <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
            Simple setup so your loved ones and caregivers can support you.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Kamla Devi"
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. kamla@example.com"
              className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
            />
          </div>

          <div className="border-t border-[#D5DFDC] pt-4 space-y-3">
            <h3 className="text-sm font-bold text-[#D97706] uppercase tracking-wider">Emergency & Caregiver Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">Caregiver Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Rahul (Son)"
                  className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">Caregiver Phone</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-bold text-base shadow-sm hover:shadow transition-all border border-[#08433C] mt-2"
          >
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>
        </form>

        <div className="border-t border-[#D5DFDC] pt-5 text-center space-y-2">
          <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
            Already registered?{" "}
            <Link href="/login" className="text-[#0B534B] underline font-bold hover:text-[#08433C]">
              Log in here
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
