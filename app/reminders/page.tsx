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
  RotateCcw
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';
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
        // Cache to IndexedDB for offline access
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
      // Offline fallback: load from IndexedDB
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
    // Optimistic UI update
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
      // Save offline to IndexedDB
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
        return <Pill className="w-7 h-7 text-[#D97706]" />;
      case 'WATER':
        return <Droplet className="w-7 h-7 text-[#0B534B]" />;
      case 'EXERCISE':
        return <Activity className="w-7 h-7 text-[#10B981]" />;
      case 'DOCTOR':
        return <Calendar className="w-7 h-7 text-[#D97706]" />;
      default:
        return <Bookmark className="w-7 h-7 text-[#5A6A66]" />;
    }
  };

  const pendingList = reminders.filter((r) => !r.isCompleted);
  const completedList = reminders.filter((r) => r.isCompleted);

  const voiceSummary = `You have ${pendingList.length} pending reminders today. Next is ${
    pendingList[0]?.title || 'none'
  } at ${pendingList[0]?.time || ''}.`;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <ScrollReveal direction="down">
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#D5DFDC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-[#E6F4F1] text-[#0B534B] px-3 py-1 rounded-full text-xs font-bold border border-[#0B534B]/20">
              <Bell className="w-3.5 h-3.5 text-[#0B534B]" />
              <span>{t("Daily Routine & Reminders") || "Daily Routine Assistant"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111615] tracking-tight">
              {t("reminders_title") || "Daily Reminders"}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6A66] font-medium">
              {t("feature_reminders_desc") || "Tap the circular button to check off your medicines and activities."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <VoiceButton
              textToRead={voiceSummary}
              buttonLabel={t("Read Schedule") || "Read Schedule"}
            />

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t("Add Reminder") || "Add Reminder"}</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Pending Reminders Section */}
      <div className="space-y-3.5">
        <ScrollReveal direction="up" delay={50}>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#111615] flex items-center gap-2">
            <span>{t("Pending") || "Pending Today"} ({pendingList.length})</span>
          </h2>
        </ScrollReveal>

        {pendingList.length === 0 ? (
          <ScrollReveal direction="up" delay={100}>
            <div className="bg-[#ECFDF5] border border-[#10B981]/40 rounded-2xl p-6 sm:p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto" />
              <h3 className="text-lg sm:text-xl font-bold text-[#065F46]">
                Wonderful! All reminders for now are complete.
              </h3>
              <p className="text-xs sm:text-sm text-[#047857] font-medium">
                You are staying on top of your daily health routine.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingList.map((rem, idx) => (
              <ScrollReveal key={rem.id} direction="up" delay={60 + idx * 50}>
                <div
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D5DFDC] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#0B534B] transition-all h-full"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="p-2.5 bg-[#F6F8F7] rounded-xl border border-[#D5DFDC] flex-shrink-0">
                      {getCategoryIcon(rem.category)}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#111615]">
                        {rem.title}
                      </h3>
                      <div className="flex items-center gap-2.5 mt-0.5">
                        <span className="text-xs sm:text-sm font-semibold text-[#D97706] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {rem.time}
                        </span>
                        {rem.notes && (
                          <span className="text-xs sm:text-sm text-[#5A6A66] font-medium">
                            • {rem.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleComplete(rem.id, rem.isCompleted)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      {/* Completed Reminders Section */}
      {completedList.length > 0 && (
        <ScrollReveal direction="up" delay={150}>
          <div className="space-y-3.5 pt-4 border-t border-[#D5DFDC]">
            <h2 className="text-base sm:text-lg font-bold text-[#5A6A66]">
              Completed Today ({completedList.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedList.map((rem) => (
                <div
                  key={rem.id}
                  className="bg-[#F6F8F7] rounded-xl p-3.5 border border-[#D5DFDC] flex items-center justify-between gap-3 opacity-80"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    <span className="text-sm sm:text-base font-semibold line-through text-[#5A6A66]">
                      {rem.title}
                    </span>
                    <span className="text-xs text-[#5A6A66]">
                      ({rem.time})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleComplete(rem.id, rem.isCompleted)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#0B534B] hover:text-[#08433C] bg-white hover:bg-[#E6F4F1] border border-[#93CEC5] transition-all min-h-[44px] min-w-[76px] focus-visible:ring-2 focus-visible:ring-[#0B534B] shadow-2xs"
                    aria-label={`Undo completed reminder: ${rem.title}`}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#0B534B]" />
                    <span>Undo</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-[#042420]/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-reminder-heading"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#D5DFDC] shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EBF0EE]">
              <h2 id="add-reminder-heading" className="text-xl font-black text-[#111615]">
                Add New Reminder
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#5A6A66] hover:text-[#111615] hover:bg-[#EBF0EE] transition-colors focus-visible:ring-2 focus-visible:ring-[#0B534B]"
                aria-label="Close add reminder dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="reminder-title-input" className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                  Title
                </label>
                <input
                  id="reminder-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Afternoon Water Glass"
                  className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus-visible:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="reminder-time-input" className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                    Time
                  </label>
                  <input
                    id="reminder-time-input"
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    required
                    className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus-visible:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reminder-category-select" className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    id="reminder-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus-visible:outline-none bg-[#F6F8F7] text-[#111615] cursor-pointer"
                  >
                    <option value="MEDICINE">Medicine</option>
                    <option value="WATER">Water / Hydration</option>
                    <option value="EXERCISE">Exercise / Walk</option>
                    <option value="DOCTOR">Doctor Appointment</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reminder-notes-input" className="block text-xs font-bold text-[#5A6A66] uppercase tracking-wider">
                  Notes (Optional)
                </label>
                <input
                  id="reminder-notes-input"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. With warm water after food"
                  className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-[#D5DFDC] focus:border-[#0B534B] focus:ring-2 focus:ring-[#0B534B]/20 focus-visible:outline-none bg-[#F6F8F7] text-[#111615] placeholder:text-[#5A6A66]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 min-h-[44px] py-3 bg-[#F6F8F7] hover:bg-[#E6F4F1] text-[#5A6A66] hover:text-[#111615] rounded-xl font-bold text-sm transition-colors border border-[#D5DFDC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] py-3 bg-[#0B534B] hover:bg-[#08433C] active:bg-[#06342E] text-white rounded-xl font-bold text-sm shadow-sm transition-all"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
