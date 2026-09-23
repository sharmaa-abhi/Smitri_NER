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
  Trash2
} from 'lucide-react';
import VoiceButton from '@/components/VoiceButton';
import ScrollReveal from '@/components/ScrollReveal';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [category, setCategory] = useState<'MEDICINE' | 'WATER' | 'EXERCISE' | 'DOCTOR' | 'CUSTOM'>('MEDICINE');
  const [notes, setNotes] = useState('');

  const loadReminders = () => {
    fetch('/api/reminders')
      .then((res) => res.json())
      .then((data) => {
        setReminders(data.reminders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      await fetch('/api/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !currentStatus }),
      });
      loadReminders();
    } catch (e) {
      console.error(e);
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
        return <Pill className="w-7 h-7 text-rose-600" />;
      case 'WATER':
        return <Droplet className="w-7 h-7 text-blue-600" />;
      case 'EXERCISE':
        return <Activity className="w-7 h-7 text-emerald-600" />;
      case 'DOCTOR':
        return <Calendar className="w-7 h-7 text-amber-600" />;
      default:
        return <Bookmark className="w-7 h-7 text-purple-600" />;
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
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-xs font-bold border border-teal-200">
              <Bell className="w-3.5 h-3.5 text-teal-700" />
              <span>Daily Routine Assistant</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Daily Reminders
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Tap the circular button to check off your medicines and activities.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <VoiceButton
              textToRead={voiceSummary}
              buttonLabel="Read Schedule"
            />

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reminder</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Pending Reminders Section */}
      <div className="space-y-3.5">
        <ScrollReveal direction="up" delay={50}>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Pending Today ({pendingList.length})</span>
          </h2>
        </ScrollReveal>

        {pendingList.length === 0 ? (
          <ScrollReveal direction="up" delay={100}>
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 sm:p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-lg sm:text-xl font-bold text-emerald-950">
                Wonderful! All reminders for now are complete.
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                You are staying on top of your daily health routine.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {pendingList.map((rem, idx) => (
              <ScrollReveal key={rem.id} direction="up" delay={60 + idx * 50}>
                <div
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 flex-shrink-0">
                      {getCategoryIcon(rem.category)}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {rem.title}
                      </h3>
                      <div className="flex items-center gap-2.5 mt-0.5">
                        <span className="text-xs sm:text-sm font-semibold text-amber-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {rem.time}
                        </span>
                        {rem.notes && (
                          <span className="text-xs sm:text-sm text-slate-600 font-medium">
                            • {rem.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleComplete(rem.id, rem.isCompleted)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
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
          <div className="space-y-3.5 pt-4 border-t border-slate-200">
            <h2 className="text-base sm:text-lg font-bold text-slate-700">
              Completed Today ({completedList.length})
            </h2>

            <div className="grid grid-cols-1 gap-2.5">
              {completedList.map((rem) => (
                <div
                  key={rem.id}
                  className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between gap-3 opacity-80"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm sm:text-base font-semibold line-through text-slate-600">
                      {rem.title}
                    </span>
                    <span className="text-xs text-slate-600">
                      ({rem.time})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleComplete(rem.id, rem.isCompleted)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-800 underline"
                  >
                    Undo
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">Add New Reminder</h2>

            <form onSubmit={handleAddReminder} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Afternoon Water Glass"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    required
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
                  >
                    <option value="MEDICINE">Medicine</option>
                    <option value="WATER">Water / Hydration</option>
                    <option value="EXERCISE">Exercise / Walk</option>
                    <option value="DOCTOR">Doctor Appointment</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. With warm water after food"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-600"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
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
