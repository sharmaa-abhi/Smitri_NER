"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Shield } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
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

    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Elderly Member',
          age: parseInt(age) || 68,
          email,
          emergencyName: emergencyName || 'Caregiver',
          emergencyPhone: emergencyPhone || '+91 98765 43210',
        }),
      });
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border-4 border-slate-200 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-teal-100 text-teal-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Create Your Profile</h1>
          <p className="text-lg text-slate-600 font-medium">
            Simple setup so your loved ones and caregivers can support you.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xl font-bold text-slate-900">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Kamla Devi"
                className="w-full text-xl px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xl font-bold text-slate-900">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="w-full text-xl px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-bold text-slate-900">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. kamla@example.com"
              className="w-full text-xl px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-bold text-slate-900">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-xl px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
            />
          </div>

          <div className="border-t-2 border-slate-200 pt-6 space-y-4">
            <h3 className="text-xl font-black text-rose-900">Emergency & Caregiver Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-lg font-bold text-slate-900">Caregiver Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Rahul (Son)"
                  className="w-full text-lg px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-bold text-slate-900">Caregiver Phone</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full text-lg px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-2xl shadow-lg hover:shadow-xl transition-all border-2 border-teal-700 mt-4"
          >
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>
        </form>

        <div className="border-t-2 border-slate-100 pt-6 text-center space-y-3">
          <p className="text-lg text-slate-700 font-medium">
            Already registered?{" "}
            <Link href="/login" className="text-blue-800 underline font-bold hover:text-blue-950">
              Log in here
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
