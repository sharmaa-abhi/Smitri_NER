"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  ArrowRight, 
  Brain, 
  ShieldAlert, 
  UserCircle 
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clean primary landing links matching reference navigation
  const mainNav = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About", href: "/#about" },
    { name: "Blog", href: "/#blog" },
    { name: "Contact", href: "/#contact" },
  ];

  // Application links available inside drawer / mobile menu
  const appNav = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Games", href: "/games" },
    { name: "Reminders", href: "/reminders" },
    { name: "Progress", href: "/progress" },
    { name: "Caregiver", href: "/caregiver" },
  ];

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 w-full max-w-6xl mx-auto mb-6">
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-full px-5 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center justify-between transition-all gap-4">
        {/* Left: Brand Logo + Name */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-slate-900 group flex-shrink-0"
          aria-label="Smitri_NER Home"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-black tracking-tight text-slate-900">Smitri</span>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">NER</span>
          </div>
        </Link>

        {/* Center: Clean Desktop Navigation (No extra pills breaking the pill circle) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {mainNav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Clean Action Button (Perfect pill fit without overflow) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / Compact Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-wider text-slate-600">Navigation</span>
            {mainNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            <span className="text-xs font-bold tracking-wider text-slate-600">Elderly & Caregiver Features</span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {appNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 text-slate-900 hover:bg-slate-100 text-center"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <Link
              href="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency Help</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-100"
            >
              <UserCircle className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
