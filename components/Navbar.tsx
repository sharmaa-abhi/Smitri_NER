"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Heart, 
  Gamepad2, 
  Bell, 
  TrendingUp, 
  ShieldAlert, 
  UserCircle,
  Stethoscope
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/", icon: Heart },
    { name: "Dashboard", href: "/dashboard", icon: UserCircle },
    { name: "Games", href: "/games", icon: Gamepad2 },
    { name: "Reminders", href: "/reminders", icon: Bell },
    { name: "Progress", href: "/progress", icon: TrendingUp },
    { name: "Caregiver", href: "/caregiver", icon: Stethoscope },
  ];

  return (
    <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 text-blue-900 hover:opacity-90 transition-opacity"
            aria-label="Smriti Home"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              स्म
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-blue-950 block">Smriti</span>
              <span className="text-xs sm:text-sm font-semibold text-teal-700 tracking-wide block uppercase">Memory & Care</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-lg transition-all ${
                    isActive 
                      ? "bg-blue-800 text-white shadow-sm" 
                      : "text-slate-700 hover:bg-slate-100 hover:text-blue-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Emergency Button + Profile */}
          <div className="flex items-center gap-3">
            <Link
              href="/emergency"
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all border-2 border-rose-700"
              aria-label="Emergency Help"
            >
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span className="hidden sm:inline">Emergency Help</span>
              <span className="sm:hidden">SOS</span>
            </Link>

            <Link
              href="/profile"
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-blue-900 transition-colors border border-slate-200"
              aria-label="User Profile"
              title="Profile & Settings"
            >
              <UserCircle className="w-7 h-7" />
            </Link>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-2 border-t border-slate-100 no-scrollbar">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${
                  isActive 
                    ? "bg-blue-800 text-white" 
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
