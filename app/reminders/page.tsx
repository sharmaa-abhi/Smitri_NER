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
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-900 px-3.5 py-1 rounded-full text-sm font-bold">
            <Bell className="w-4 h-4 text-teal-700" />
            <span>Daily Routine Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
            Daily Reminders
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Tap the circular button to check off your medicines and activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <VoiceButton
            textToRead={voiceSummary}
            buttonLabel="Read Schedule"
          />

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-2xl font-black text-lg shadow-md transition-all"
          >
            <Plus className="w-6 h-6" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      {/* Pending Reminders Section */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
          <span>Pending Today ({pendingList.length})</span>
        </h2>

        {pendingList.length === 0 ? (
          <div className="bg-emerald-50 border-3 border-emerald-300 rounded-3xl p-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-black text-emerald-950">
              Wonderful! All reminders for now are complete.
            </h3>
            <p className="text-lg text-emerald-800 font-medium">
              You are staying on top of your daily health routine.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingList.map((rem) => (
              <div
                key={rem.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border-3 border-slate-200 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-blue-400 transition-all"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 flex-shrink-0">
                    {getCategoryIcon(rem.category)}
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {rem.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg font-bold text-amber-700 flex items-center gap-1.5">
                        <Clock className="w-5 h-5" /> {rem.time}
                      </span>
                      {rem.notes && (
                        <span className="text-base text-slate-600 font-medium">
                          • {rem.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleComplete(rem.id, rem.isCompleted)}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Mark as Completed</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Reminders Section */}
      {completedList.length > 0 && (
        <div className="space-y-4 pt-6 border-t-2 border-slate-200">
          <h2 className="text-2xl font-black text-slate-700">
            Completed Today ({completedList.length})
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {completedList.map((rem) => (
              <div
                key={rem.id}
                className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200 flex items-center justify-between gap-4 opacity-75"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  <span className="text-xl font-bold line-through text-slate-600">
                    {rem.title}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    ({rem.time})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleComplete(rem.id, rem.isCompleted)}
                  className="text-sm font-bold text-slate-500 hover:text-slate-800 underline"
                >
                  Undo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border-4 border-slate-200 shadow-2xl space-y-6">
            <h2 className="text-3xl font-black text-slate-900">Add New Reminder</h2>

            <form onSubmit={handleAddReminder} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-lg font-bold text-slate-900">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Afternoon Water Glass"
                  className="w-full text-lg px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-lg font-bold text-slate-900">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    required
                    className="w-full text-lg px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-lg font-bold text-slate-900">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-lg px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
                  >
                    <option value="MEDICINE">Medicine</option>
                    <option value="WATER">Water / Hydration</option>
                    <option value="EXERCISE">Exercise / Walk</option>
                    <option value="DOCTOR">Doctor Appointment</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-bold text-slate-900">Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. With warm water after food"
                  className="w-full text-lg px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 text-slate-900"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-black text-lg shadow-md"
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
