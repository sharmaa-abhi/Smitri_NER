import Link from 'next/link';
import { 
  Gamepad2, 
  Bell, 
  TrendingUp, 
  HeartHandshake, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-4 border-blue-800 text-center sm:text-left relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-800/80 text-blue-200 px-4 py-1.5 rounded-full text-base font-bold tracking-wide border border-blue-600">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Gentle Cognitive Wellness Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Care. Play. Remember.
          </h1>

          <p className="text-xl sm:text-2xl text-blue-100 font-medium leading-relaxed">
            An easy-to-use cognitive wellness platform designed to support elderly users through simple games, daily reminders, and caring progress tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 px-8 py-4 rounded-2xl font-black text-xl shadow-lg hover:shadow-xl transition-all border-2 border-amber-500"
            >
              <span>Get Started</span>
              <ArrowRight className="w-6 h-6" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-800/80 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-xl border-2 border-blue-600 transition-all"
            >
              <span>Login / Demo Account</span>
            </Link>
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Senior-Friendly Core Pillars */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Designed Specially for Seniors
          </h2>
          <p className="text-xl text-slate-600 font-semibold max-w-2xl mx-auto">
            Everything is built with high contrast, large buttons, and zero complicated menus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-7 rounded-2xl border-3 border-slate-200 shadow-md hover:border-blue-500 transition-colors space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Gamepad2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Cognitive Games</h3>
            <p className="text-lg text-slate-700 font-medium">
              Calm memory matching, color sequences, and pattern puzzles that adjust to your comfort level.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-7 rounded-2xl border-3 border-slate-200 shadow-md hover:border-teal-500 transition-colors space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Bell className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Daily Reminders</h3>
            <p className="text-lg text-slate-700 font-medium">
              Big, friendly reminders for medicines, hydration, and doctor visits with voice reading.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-7 rounded-2xl border-3 border-slate-200 shadow-md hover:border-amber-500 transition-colors space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Progress Tracking</h3>
            <p className="text-lg text-slate-700 font-medium">
              Clear visual charts to celebrate your daily rhythm and mental exercises without pressure.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-7 rounded-2xl border-3 border-slate-200 shadow-md hover:border-rose-500 transition-colors space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <HeartHandshake className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Caregiver Support</h3>
            <p className="text-lg text-slate-700 font-medium">
              Keeps family informed and detects any changes in rhythm so you always have loving support.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Non-Medical Disclaimer Banner */}
      <section className="bg-slate-100 border-2 border-slate-300 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-slate-800">
        <ShieldCheck className="w-10 h-10 text-teal-700 flex-shrink-0" />
        <div className="space-y-1">
          <p className="text-lg font-bold text-slate-900">
            Prototype Cognitive Performance Score Notice
          </p>
          <p className="text-base text-slate-600 font-medium">
            This platform is an assistive cognitive stimulation prototype. It does not provide medical diagnosis, clinical evaluations, or detect dementia. Your data is stored locally and securely.
          </p>
        </div>
      </section>
    </div>
  );
}
