"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  ArrowRight, 
  Brain, 
  Gamepad2,
  ShieldAlert, 
  UserCircle 
} from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  // Clean primary landing links with Games included
  const mainNav = [
    { name: t("nav_home") || "Home", href: "/" },
    { name: t("nav_games") || "Games", href: "/games" },
    { name: t("nav_features") || "Features", href: "/features" },
    { name: t("nav_how_it_works") || "How It Works", href: "/#how-it-works" },
    { name: t("nav_about") || "About", href: "/#about" },
    { name: t("nav_blog") || "Blog", href: "/#blog" },
    { name: t("nav_contact") || "Contact", href: "/#contact" },
  ];

  // Application links available inside drawer / mobile menu
  const appNav = [
    { name: t("nav_dashboard") || "Dashboard", href: "/dashboard" },
    { name: t("nav_games") || "Games", href: "/games" },
    { name: t("nav_reminders") || "Reminders", href: "/reminders" },
    { name: t("nav_progress") || "Progress", href: "/progress" },
    { name: t("nav_caregiver") || "Caregiver", href: "/caregiver" },
  ];

  return (
    <header className="sticky top-3.5 z-50 px-3 sm:px-6 w-full max-w-6xl mx-auto mb-5">
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-4 py-2 sm:px-6 sm:py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between transition-all gap-2 sm:gap-4">
        {/* Left: Brand Logo + Name */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-slate-900 group flex-shrink-0"
          aria-label="Smitri_NER Home"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">Smitri</span>
            <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">NER</span>
          </div>
        </Link>

        {/* Center: Clean Desktop Navigation with Games */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {mainNav.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Regional Language Selector + Action Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <LanguageSelector />

          <Link
            href="/dashboard"
            className="btn-primary btn-sm text-xs sm:text-sm"
          >
            <span>{t("nav_get_started") || "Get Started"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon md:hidden !p-2"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile / Compact Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-black tracking-wider text-slate-700 uppercase">{t("select_language_title") || "Select Dialect / ভাষা"}</span>
            <LanguageSelector />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold tracking-wider text-slate-600">{t("nav_navigation") || "Navigation"}</span>
            {mainNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            <span className="text-xs font-bold tracking-wider text-slate-600">{t("nav_care_features") || "Elderly & Caregiver Features"}</span>
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
              <span>{t("nav_emergency") || "Emergency Help"}</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-100"
            >
              <UserCircle className="w-4 h-4" />
              <span>{t("nav_profile") || "Profile"}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
