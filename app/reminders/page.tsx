"use client";

import { useEffect, useState } from 'react';
import { 
  Bell, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  Pill, 
  Activity, 
  Calendar, 
  Bookmark,
  Trash2,
  X,
  RotateCcw,
  Check
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import { saveReminderOffline, getOfflineReminders } from '@/lib/offlineStorage';
import { useLanguage } from '@/lib/i18n';

export default function RemindersPage() {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [category, setCategory] = useState<'MEDICINE' | 'WATER' | 'EXERCISE' | 'DOCTOR' | 'CUSTOM'>('MEDICINE');
  const [notes, setNotes] = useState('');

  const loadReminders = async () => {
    try {
      const res = await fetch('/api/reminders');
      if (res.ok) {
        const data = await res.json();
        const list = data.reminders || [];
        setReminders(list);
        setLoading(false);
        for (const item of list) {
          saveReminderOffline({
            ...item,
            synced: true,
            updatedAt: new Date().toISOString(),
          }).catch(() => {});
        }
        return;
      }
      throw new Error('Network error');
    } catch {
      const offlineList = await getOfflineReminders();
      if (offlineList.length > 0) {
        setReminders(offlineList);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddModal) {
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !currentStatus } : r))
    );

    const reminderItem = reminders.find((r) => r.id === id);

    try {
      const res = await fetch('/api/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !currentStatus }),
      });
      if (!res.ok) throw new Error('Offline');
    } catch {
      if (reminderItem) {
        await saveReminderOffline({
          ...reminderItem,
          isCompleted: !currentStatus,
          synced: false,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, time, category, notes }),
      });
      setTitle('');
      setNotes('');
      setShowAddModal(false);
      loadReminders();
    } catch (e) {
      console.error(e);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'MEDICINE':
        return <Pill className="w-6 h-6 text-[#D97706]" />;
      case 'WATER':
        return <Droplet className="w-6 h-6 text-[#0B534B]" />;
      case 'EXERCISE':
        return <Activity className="w-6 h-6 text-[#059669]" />;
      case 'DOCTOR':
        return <Calendar className="w-6 h-6 text-[#D97706]" />;
      default:
        return <Bookmark className="w-6 h-6 text-[#5A6A66]" />;
    }
  };

  const pendingList = reminders.filter((r) => !r.isCompleted);
  const completedList = reminders.filter((r) => r.isCompleted);

  const voiceSummary = `You have ${pendingList.length} pending reminders today. Next is ${
    pendingList[0]?.title || 'none'
  } at ${pendingList[0]?.time || ''}.`;

  return (
    <div className="space-y-8 pb-36 sm:pb-44 max-w-5xl mx-auto">
      {/* ─── 1. Header ─── */}
      <header className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D5DFDC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#ECFDF5] text-[#065F46] px-3 py-1 rounded-full text-xs font-bold border border-[#A7F3D0]">
            <Bell className="w-4 h-4 text-[#059669]" />
            <span>{t("Daily Routine & Reminders") || "Daily Routine Assistant"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111615] tracking-tight">
            {t("reminders_title") || "Daily Reminders & Medications"}
          </h1>
          <p className="text-[17px] sm:text-[18px] text-[#374151] font-normal leading-relaxed">
            {t("feature_reminders_desc") || "Tap the button to check off your medicines and daily wellness activities."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-shrink-0 pt-2 md:pt-0">
          <VoiceButton
            textToRead={voiceSummary}
            buttonLabel={t("Read Schedule") || "Read Schedule"}
            className="min-h-[48px] px-5 text-base font-semibold"
          />

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="min-h-[48px] flex items-center gap-2 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white px-5 py-2.5 rounded-xl font-bold text-base shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-[#0B534B]"
          >
            <Plus className="w-5 h-5" />
            <span>{t("Add Reminder") || "Add Reminder"}</span>
          </button>
        </div>
      </header>

      {/* ─── 2. Pending Reminders Section ─── */}
      <section aria-label="Pending reminders for today" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#111615] flex items-center gap-2">
            <span>{t("Pending") || "Pending Today"}</span>
            <span className="text-sm px-2.5 py-0.5 rounded-full bg-[#E6F4F1] text-[#0B534B] font-black border border-[#93CEC5]">
              {pendingList.length}
            </span>
          </h2>
        </div>

        {pendingList.length === 0 ? (
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-8 text-center space-y-2 shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto" />
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#065F46]">
              Wonderful! All scheduled activities are complete for today.
            </h3>
            <p className="text-base text-[#047857] font-medium max-w-lg mx-auto">
              You are staying on top of your medications and daily health routine.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {pendingList.map((rem) => (
              <div
                key={rem.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D5DFDC] shadow-xs flex flex-col justify-between gap-4 hover:border-[#0B534B] transition-all h-full"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                    {getCategoryIcon(rem.category)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#111615] leading-snug">
                        {rem.title}
                      </h3>
                      {rem.priority === 'HIGH' && (
                        <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                          Priority
                        </span>
                      )}
                    </div>

                    {rem.dosage && (
                      <p className="text-sm font-semibold text-[#4B5563] flex items-center gap-1.5">
                        <Pill className="w-4 h-4 text-[#0B534B]" />
                        <span>Dosage: {rem.dosage}</span>
                      </p>
                    )}

                    {rem.notes && (
                      <p className="text-sm text-[#4B5563]">
                        ℹ️ {rem.notes}
                      </p>
                    )}

                    <div className="pt-1">
                      <span className="text-sm font-bold text-[#D97706] flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {rem.time}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleComplete(rem.id, rem.isCompleted)}
                  className="w-full min-h-[48px] py-2.5 px-5 bg-[#059669] hover:bg-[#047857] active:bg-[#065F46] text-white rounded-xl font-bold text-base shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#059669]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Mark as Completed</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── 3. Completed Reminders Section ─── */}
      {completedList.length > 0 && (
        <section aria-label="Completed reminders" className="space-y-4 pt-4 border-t border-[#E5E7EB]">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#4B5563] flex items-center gap-2">
            <span>Completed Today</span>
            <span className="text-sm px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] font-bold">
              {completedList.length}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedList.map((rem) => (
              <div
                key={rem.id}
                className="bg-[#F9FAFB] rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] opacity-80 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#4B5563] line-through">
                      {rem.title}
                    </h3>
                    <span className="text-xs text-[#6B7280]">
                      Completed at {rem.time}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleComplete(rem.id, rem.isCompleted)}
                  className="min-h-[40px] px-3 py-1.5 text-xs font-bold text-[#0B534B] hover:bg-[#E6F4F1] border border-[#D5DFDC] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Undo completion"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 4. Add Reminder Modal ─── */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-[#042420]/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-modal-title"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl border-2 border-[#0B534B]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h2 id="add-modal-title" className="text-xl sm:text-2xl font-extrabold text-[#111615]">
                Add Daily Reminder
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-9 h-9 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="reminder-title" className="text-sm font-bold text-[#111615] block">
                  Activity or Medicine Name
                </label>
                <input
                  id="reminder-title"
                  type="text"
                  required
                  placeholder="e.g. Blood pressure tablet after breakfast"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-[#D5DFDC] text-base text-[#111615] focus:outline-none focus:ring-2 focus:ring-[#0B534B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="reminder-time" className="text-sm font-bold text-[#111615] block">
                    Scheduled Time
                  </label>
                  <input
                    id="reminder-time"
                    type="text"
                    required
                    placeholder="08:00 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-[#D5DFDC] text-base text-[#111615] focus:outline-none focus:ring-2 focus:ring-[#0B534B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reminder-cat" className="text-sm font-bold text-[#111615] block">
                    Category
                  </label>
                  <select
                    id="reminder-cat"
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full min-h-[48px] px-3 py-2.5 rounded-xl border border-[#D5DFDC] text-base text-[#111615] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B534B]"
                  >
                    <option value="MEDICINE">💊 Medicine</option>
                    <option value="WATER">💧 Water</option>
                    <option value="EXERCISE">🏃 Exercise</option>
                    <option value="DOCTOR">🩺 Doctor</option>
                    <option value="CUSTOM">📝 General</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reminder-notes" className="text-sm font-bold text-[#111615] block">
                  Helpful Notes / Dosage (Optional)
                </label>
                <input
                  id="reminder-notes"
                  type="text"
                  placeholder="e.g. Take with warm water"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-[#D5DFDC] text-base text-[#111615] focus:outline-none focus:ring-2 focus:ring-[#0B534B]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 min-h-[48px] py-3 rounded-xl border border-[#D5DFDC] text-base font-bold text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] py-3 rounded-xl bg-[#0B534B] hover:bg-[#08433C] text-white text-base font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#0B534B]"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── 5. Clearance Buffer for Floating SOS Control ─── */}
      <div className="h-10 sm:h-14 w-full pointer-events-none" aria-hidden="true" />
    </div>
  );
}
