"use client";

import { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Bell, 
  Save, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: 'Kamla Devi',
    age: 68,
    email: 'kamla.devi@example.com',
    emergencyName: 'Rahul (Son / Caregiver)',
    emergencyPhone: '+91 98765 43210',
    preferredLanguage: 'English / Hindi',
    difficultyLevel: 1,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setFormData(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const audioSummary = `Profile settings for ${formData.name}. Age: ${formData.age}. Caregiver contact: ${formData.emergencyName}. Tap Save Changes after editing.`;

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6 pb-16">
      {/* Header */}
      <ScrollReveal direction="down">
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Profile & Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Manage your personal preferences and caregiver contacts.
            </p>
          </div>

          <VoiceButton
            textToRead={audioSummary}
            buttonLabel="Read Profile"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={100}>
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-lg space-y-5">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 68 })}
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Preferred Language</label>
              <input
                type="text"
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600"
            />
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-3">
            <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider">Emergency & Caregiver Contact</h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Caregiver Name</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Caregiver Phone Number</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 border border-blue-900 mt-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Profile Settings</span>
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center text-slate-500 font-medium text-xs flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Your data is stored securely on this device.</span>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
}
