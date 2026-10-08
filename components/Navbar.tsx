"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Brain, 
  LogIn, 
  LogOut, 
  ShieldAlert, 
  UserCircle,
  ArrowRight
} from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, isLoggedIn, isLoaded, logout } = useAuth();

  // Primary navigation links preserving exact labels and routes
  const mainNav = [
    { name: t("nav_home") || "Home", href: "/" },
    { name: t("nav_games") || "Games", href: "/games" },
    { name: t("nav_features") || "Features", href: "/features" },
    { name: t("nav_how_it_works") || "How It Works", href: "/#how-it-works" },
    { name: t("nav_about") || "About", href: "/#about" },
    { name: t("nav_blog") || "Blog", href: "/#blog" },
    { name: t("nav_contact") || "Contact", href: "/#contact" },
  ];

  // Application links available inside mobile drawer
  const appNav = [
    { name: t("nav_dashboard") || "Dashboard", href: "/dashboard" },
    { name: t("nav_games") || "Games", href: "/games" },
    { name: t("nav_reminders") || "Reminders", href: "/reminders" },
    { name: t("nav_progress") || "Progress", href: "/progress" },
    { name: t("nav_caregiver") || "Caregiver", href: "/caregiver" },
  ];

  return (
    <header className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto mb-4 sm:mb-6 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-2 motion-reduce:animate-none">
      <div className="relative">
        {/* Subtle Gen-Z Ambient Gradient Aura & Micro-decorations behind Floating Navbar */}
        <div 
          className="absolute -inset-x-4 -top-3 h-20 -z-10 pointer-events-none overflow-hidden blur-2xl opacity-65 transition-opacity"
          aria-hidden="true"
        >
          <div className="w-full h-full relative">
            {/* Primary Smitri deep teal glow on the left */}
            <div className="absolute left-4 top-1 w-48 h-12 rounded-full bg-[#0B534B]/15" />
            {/* Soft mint aura across the center-left */}
            <div className="absolute left-1/4 top-0 w-72 h-14 rounded-full bg-[#10B981]/18" />
            {/* Very subtle cyan glow in center */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1 w-64 h-12 rounded-full bg-[#67E8F9]/15" />
            {/* Small creative lavender/pink accent on right (5% creative accent) */}
            <div className="absolute right-6 top-1 w-44 h-12 rounded-full bg-gradient-to-r from-[#C084FC]/12 to-[#F472B6]/10" />
          </div>
        </div>

        {/* Micro-sparkle decorative accents floating behind capsules */}
        <svg 
          className="absolute -top-1.5 right-16 w-3.5 h-3.5 text-[#10B981]/50 animate-pulse pointer-events-none -z-10 hidden sm:block" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        <svg 
          className="absolute -bottom-1.5 left-24 w-2.5 h-2.5 text-[#C084FC]/40 pointer-events-none -z-10 hidden sm:block" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>

        {/* DESKTOP ASYMMETRIC FLOATING 3-ISLAND NAVBAR (>= lg: 1024px) */}
        <div className="hidden lg:flex items-center justify-between gap-3 xl:gap-4 pointer-events-auto">
          
          {/* Island 1: Logo Floating Capsule */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 px-3.5 py-2 xl:px-4 xl:py-2.5 rounded-[22px] bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_-2px_rgba(11,83,75,0.08),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_-4px_rgba(16,185,129,0.20)] hover:-translate-y-0.5 transition-all duration-200 group flex-shrink-0 cursor-pointer"
            aria-label="Smitri_NER Home"
          >
            <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-xl bg-gradient-to-br from-[#0B534B] via-[#0E685E] to-[#10B981] text-white flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:rotate-1 transition-transform">
              <Brain className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg xl:text-xl font-black tracking-tight text-[#0B534B] group-hover:text-[#083D37] transition-colors">
                Smitri
              </span>
              <span className="text-[10px] xl:text-xs font-black px-1.5 py-0.5 rounded-md bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5]/60 shadow-2xs">
                NER
              </span>
            </div>
          </Link>

          {/* Island 2: Navigation Center Floating Capsule */}
          <nav 
            className="flex items-center gap-1 xl:gap-1.5 px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-full bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_-2px_rgba(11,83,75,0.07),0_1px_3px_rgba(0,0,0,0.02)]"
            aria-label="Main Navigation"
          >
            {mainNav.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href) && item.href !== "/";
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#0B534B] to-[#0E685E] text-white shadow-[0_2px_8px_rgba(11,83,75,0.25)] font-bold"
                      : "text-[#5A6A66] hover:text-[#0B534B] hover:bg-[#E6F4F1]/80 hover:shadow-2xs"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <span 
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.8)]" 
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Island 3: Right Actions Floating Cluster */}
          <div className="flex items-center gap-2 xl:gap-2.5 p-1.5 xl:p-2 rounded-[22px] xl:rounded-full bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_-2px_rgba(11,83,75,0.08),0_1px_3px_rgba(0,0,0,0.02)] flex-shrink-0">
            
            {/* Language Selector: Compact translucent floating pill */}
            <LanguageSelector buttonVariant="translucent" />

            {/* Dynamic Auth Action Buttons */}
            {isLoaded && isLoggedIn ? (
              <div className="flex items-center gap-1.5 xl:gap-2">
                {/* Primary CTA: Dashboard → */}
                <Link
                  href="/dashboard"
                  className="relative group inline-flex items-center gap-1.5 px-4 xl:px-5 py-2 rounded-full text-xs xl:text-sm font-black text-white bg-gradient-to-r from-[#0B534B] via-[#0E685E] to-[#10B981] shadow-[0_4px_14px_rgba(11,83,75,0.28)] hover:shadow-[0_6px_22px_rgba(11,83,75,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden min-h-[40px] flex-shrink-0 cursor-pointer"
                  aria-label={t("nav_dashboard") || "Go to Dashboard"}
                >
                  {/* Subtle shimmer gradient highlight */}
                  <span 
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" 
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{t("nav_dashboard") || "Dashboard"}</span>
                  <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>

                {/* Secondary Action: Log Out */}
                <button
                  type="button"
                  onClick={logout}
                  className="group inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[#5A6A66] hover:text-red-700 bg-white/70 hover:bg-red-50/80 border border-[#D5DFDC] hover:border-red-200 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 min-h-[40px] cursor-pointer flex-shrink-0"
                  title={t("nav_logout") || "Log Out"}
                  aria-label={t("nav_logout") || "Log Out"}
                >
                  <LogOut className="w-3.5 h-3.5 text-[#7A8D88] group-hover:text-red-600 transition-colors" />
                  <span className="hidden xl:inline">{t("nav_logout") || "Log Out"}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 xl:gap-2">
                {/* Secondary Action: Log In */}
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0B534B] hover:text-[#083D37] bg-white/70 hover:bg-[#E6F4F1] border border-[#0B534B]/30 hover:border-[#0B534B]/60 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 min-h-[40px] cursor-pointer flex-shrink-0"
                  aria-label={t("nav_login") || "Log In to Account"}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#0B534B]" />
                  <span>{t("nav_login") || "Log In"}</span>
                </Link>

                {/* Primary CTA: Dashboard → */}
                <Link
                  href="/dashboard"
                  className="relative group inline-flex items-center gap-1.5 px-4 xl:px-5 py-2 rounded-full text-xs xl:text-sm font-black text-white bg-gradient-to-r from-[#0B534B] via-[#0E685E] to-[#10B981] shadow-[0_4px_14px_rgba(11,83,75,0.28)] hover:shadow-[0_6px_22px_rgba(11,83,75,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden min-h-[40px] flex-shrink-0 cursor-pointer"
                  aria-label={t("nav_dashboard") || "Go to Dashboard"}
                >
                  <span 
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" 
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{t("nav_dashboard") || "Dashboard"}</span>
                  <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE & TABLET FLOATING CAPSULE (< lg: 1024px) */}
        <div className="lg:hidden flex items-center justify-between gap-2 p-2 sm:px-4 sm:py-2.5 rounded-[24px] bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_-2px_rgba(11,83,75,0.08),0_1px_3px_rgba(0,0,0,0.02)] pointer-events-auto">
          
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group flex-shrink-0 cursor-pointer"
            aria-label="Smitri_NER Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B534B] via-[#0E685E] to-[#10B981] text-white flex items-center justify-center shadow-xs">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#0B534B]">Smitri</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5]/60">NER</span>
            </div>
          </Link>

          {/* Right Mobile Actions: Language + Dashboard CTA + Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:block">
              <LanguageSelector buttonVariant="translucent" />
            </div>

            {/* Primary CTA on mobile: Dashboard → */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#0B534B] to-[#10B981] shadow-[0_2px_10px_rgba(11,83,75,0.25)] hover:shadow-[0_4px_14px_rgba(11,83,75,0.35)] min-h-[40px] cursor-pointer"
              aria-label={t("nav_dashboard") || "Go to Dashboard"}
            >
              <span>Dashboard</span>
              <span className="text-[11px]">→</span>
            </Link>

            {/* Accessible Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full border border-[#D5DFDC] bg-white/80 hover:bg-[#E6F4F1] transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#111615]" /> : <Menu className="w-5 h-5 text-[#111615]" />}
            </button>
          </div>
        </div>

        {/* MOBILE GLASSMORPHIC DRAWER SHEET */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-[28px] p-5 sm:p-6 shadow-[0_20px_60px_rgba(11,83,75,0.18)] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
            
            {/* Regional Dialect Selector Row */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EBF0EE]">
              <span className="text-xs font-black tracking-wider text-[#111615] uppercase">
                {t("select_language_title") || "Select Dialect / ভাষা"}
              </span>
              <LanguageSelector buttonVariant="translucent" />
            </div>

            {/* Auth Session State inside Drawer */}
            {isLoggedIn ? (
              <div className="bg-[#E6F4F1]/80 rounded-2xl p-3.5 border border-[#0B534B]/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0B534B] text-white flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111615] leading-tight">{user?.name || "Elderly Member"}</p>
                    <p className="text-[10px] text-[#0B534B] font-semibold">Active Session</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t("nav_logout") || "Log Out"}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold text-[#0B534B] bg-[#E6F4F1] hover:bg-[#d4ede7] border border-[#0B534B]/20 text-center cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t("nav_login") || "Log In"}</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0B534B] to-[#10B981] shadow-xs text-center cursor-pointer"
                >
                  <span>Dashboard →</span>
                </Link>
              </div>
            )}

            {/* Main Navigation links */}
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-[#5A6A66]">
                {t("nav_navigation") || "Navigation"}
              </span>
              <div className="space-y-0.5 pt-1">
                {mainNav.map((item) => {
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href) && item.href !== "/";
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#0B534B] text-white font-bold"
                          : "text-[#5A6A66] hover:text-[#0B534B] hover:bg-[#E6F4F1]"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{item.name}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-[#10B981]" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Elderly & Caregiver quick feature links */}
            <div className="border-t border-[#EBF0EE] pt-3 space-y-1">
              <span className="text-xs font-bold tracking-wider text-[#5A6A66]">
                {t("nav_care_features") || "Elderly & Caregiver Features"}
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {appNav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center min-h-[44px] px-3 py-2 rounded-xl text-sm font-bold bg-[#F6F8F7] text-[#111615] hover:bg-[#E6F4F1] hover:text-[#0B534B] text-center transition-colors cursor-pointer"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Emergency and Profile links */}
            <div className="border-t border-[#EBF0EE] pt-3 flex items-center justify-between gap-2">
              <Link
                href="/emergency"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center min-h-[44px] gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{t("nav_emergency") || "Emergency Help"}</span>
              </Link>

              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center min-h-[44px] gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-[#5A6A66] bg-[#F6F8F7] hover:bg-[#E6F4F1] hover:text-[#0B534B] transition-colors cursor-pointer"
              >
                <UserCircle className="w-4 h-4" />
                <span>{t("nav_profile") || "Profile"}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
