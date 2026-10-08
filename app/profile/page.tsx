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
import { useLanguage, isLanguageSupported, I18N_CONFIG, LanguageCode } from '@/lib/i18n';

export default function ProfilePage() {
  const { language, changeLanguage, activeLanguages, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: 'Kamla Devi',
    age: 68,
    email: 'kamla.devi@example.com',
    emergencyName: 'Rahul (Son / Caregiver)',
    emergencyPhone: '+91 98765 43210',
    preferredLanguage: language,
    difficultyLevel: 1,
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          const userLang = isLanguageSupported(data.user.preferredLanguage)
            ? data.user.preferredLanguage
            : language;
          setFormData({
            ...data.user,
            preferredLanguage: userLang,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (formData.preferredLanguage && isLanguageSupported(formData.preferredLanguage)) {
        await changeLanguage(formData.preferredLanguage);
      }

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
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#D5DFDC] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#111615] tracking-tight">
              Profile & Settings
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
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
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D5DFDC] shadow-sm space-y-5">
        {saved && (
          <div className="bg-[#ECFDF5] border border-[#10B981]/30 p-3.5 rounded-xl flex items-center gap-2.5 text-[#065F46] font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="profile-fullname" className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
              Full Name
            </label>
            <input
              id="profile-fullname"
              type="text"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus-visible:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="profile-age" className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                Age
              </label>
              <input
                id="profile-age"
                type="number"
                name="age"
                autoComplete="off"
                min={45}
                max={120}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 68 })}
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus-visible:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-language" className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                Preferred Language / ভাষা
              </label>
              <select
                id="profile-language"
                name="preferredLanguage"
                value={formData.preferredLanguage || language}
                onChange={(e) => {
                  const newLang = e.target.value as LanguageCode;
                  setFormData({ ...formData, preferredLanguage: newLang });
                }}
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus-visible:outline-none bg-[#F6F8F7] text-[#111615] font-semibold cursor-pointer"
              >
                {activeLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name}) — {lang.region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="profile-email" className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="profile-email"
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus-visible:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
            />
          </div>

          <div className="border-t border-[#D5DFDC] pt-4 space-y-4">
            <h2 className="text-sm font-bold text-[#D97706] uppercase tracking-wider">
              Emergency &amp; Caregiver Contact
            </h2>

            <div className="space-y-1.5">
              <label htmlFor="profile-caregiver-name" className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                Caregiver Name
              </label>
              <input
                id="profile-caregiver-name"
                type="text"
                name="emergencyName"
                autoComplete="name"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus-visible:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-caregiver-phone" className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                Caregiver Phone Number
              </label>
              <input
                id="profile-caregiver-phone"
                type="tel"
                name="emergencyPhone"
                autoComplete="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus-visible:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] py-3.5 px-5 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-bold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 border border-[#08433C] mt-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0B534B] focus-visible:ring-offset-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Profile Settings</span>
          </button>
        </form>

        <div className="border-t border-[#D5DFDC]/60 pt-4 text-center text-[#5A6A66] font-medium text-xs flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#0B534B]" />
          <span>Your data is stored securely on this device.</span>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
}
