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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Profile & Settings
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Manage your personal preferences and caregiver contacts.
          </p>
        </div>

        <VoiceButton
          textToRead={audioSummary}
          buttonLabel="Read Profile"
        />
      </div>

      <div className="bg-white rounded-3xl p-8 border-4 border-slate-200 shadow-xl space-y-6">
        {saved && (
          <div className="bg-emerald-100 border-2 border-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-emerald-900 font-bold text-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xl font-bold text-slate-900">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xl px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xl font-bold text-slate-900">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 68 })}
                className="w-full text-xl px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xl font-bold text-slate-900">Preferred Language</label>
              <input
                type="text"
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full text-xl px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-bold text-slate-900">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xl px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
            />
          </div>

          <div className="border-t-2 border-slate-200 pt-6 space-y-4">
            <h3 className="text-2xl font-black text-rose-900">Emergency & Caregiver Contact</h3>

            <div className="space-y-2">
              <label className="block text-lg font-bold text-slate-900">Caregiver Name</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                className="w-full text-lg px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-bold text-slate-900">Caregiver Phone Number</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full text-lg px-5 py-4 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 px-6 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-black text-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border-2 border-blue-900 mt-4"
          >
            <Save className="w-6 h-6" />
            <span>Save Profile Settings</span>
          </button>
        </form>

        <div className="border-t-2 border-slate-100 pt-6 text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <span>Your data is stored securely on this device.</span>
        </div>
      </div>
    </div>
  );
}
