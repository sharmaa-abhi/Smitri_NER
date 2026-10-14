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
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, isLoggedIn, isLoaded, logout } = useAuth();

  // Guest/Visitor navigation links (Clean & focused)
  const guestNav = [
    { name: t("nav_home") || "Home", href: "/" },
    { name: t("nav_features") || "Features", href: "/features" },
    { name: t("nav_games") || "Games", href: "/games" },
    { name: t("nav_blog") || "Blog", href: "/blog" },
  ];

  // Logged-in navigation links (Elderly & Caregiver App features)
  const authNav = [
    { name: t("nav_dashboard") || "Dashboard", href: "/dashboard" },
    { name: t("nav_games") || "Games", href: "/games" },
    { name: t("nav_reminders") || "Reminders", href: "/reminders" },
    { name: t("nav_caregiver") || "Caregiver", href: "/caregiver" },
    { name: t("nav_progress") || "Progress", href: "/progress" },
  ];

  const currentNav = isLoaded && isLoggedIn ? authNav : guestNav;

  return (
    <header className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 lg:px-8 xl:px-10 w-full max-w-[1536px] 2xl:max-w-[1720px] mx-auto mb-4 sm:mb-6 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-2 motion-reduce:animate-none">
      <div className="relative">
        {/* Subtle Ambient Gradient Aura behind Floating Navbar */}
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
            {/* Small creative lavender/pink accent on right */}
            <div className="absolute right-6 top-1 w-44 h-12 rounded-full bg-gradient-to-r from-[#C084FC]/12 to-[#F472B6]/10" />
          </div>
        </div>

        {/* Micro-sparkle decorative accents floating behind navbar */}
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

        {/* DESKTOP UNIFIED PREMIUM GLASSMORPHISM NAVBAR (>= lg: 1024px) */}
        <div className="hidden lg:flex items-center justify-between w-full px-4 xl:px-6 py-2.5 rounded-full bg-white/92 backdrop-blur-2xl border border-white/80 shadow-[0_4px_24px_-2px_rgba(11,83,75,0.08),0_1px_3px_rgba(0,0,0,0.02)] pointer-events-auto transition-all">
          
          {/* Brand Logo & Tag */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group flex-shrink-0 cursor-pointer hover:opacity-95 transition-opacity"
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

          {/* Center Navigation Links - Dynamic per Auth State */}
          <nav 
            className="flex items-center gap-1 xl:gap-2 px-2 py-1 rounded-full bg-[#F6F8F7]/80 border border-[#E6ECEB]"
            aria-label="Main Navigation"
          >
            {currentNav.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href) && item.href !== "/";
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3.5 xl:px-4 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#0B534B] to-[#0E685E] text-white shadow-[0_2px_8px_rgba(11,83,75,0.25)] font-bold"
                      : "text-[#5A6A66] hover:text-[#0B534B] hover:bg-white hover:shadow-2xs"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions Cluster */}
          <div className="flex items-center gap-2 xl:gap-2.5 flex-shrink-0">
            {/* Language Selector */}
            <LanguageSelector buttonVariant="translucent" />

            {/* Clerk Authentication Controls */}
            <div className="flex items-center gap-1.5 xl:gap-2">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0B534B] hover:text-[#083D37] bg-[#F6F8F7] hover:bg-[#E6F4F1] border border-[#0B534B]/30 hover:border-[#0B534B]/60 shadow-2xs transition-all duration-200 min-h-[38px] cursor-pointer flex-shrink-0"
                    aria-label="Sign In"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#0B534B]" />
                    <span>Sign In</span>
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="relative group inline-flex items-center gap-1.5 px-4 xl:px-5 py-2 rounded-full text-xs xl:text-sm font-black text-white bg-gradient-to-r from-[#0B534B] via-[#0E685E] to-[#10B981] shadow-[0_4px_14px_rgba(11,83,75,0.28)] hover:shadow-[0_6px_22px_rgba(11,83,75,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden min-h-[38px] flex-shrink-0 cursor-pointer"
                    aria-label="Sign Up"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                {/* Emergency SOS Quick Button */}
                <Link
                  href="/emergency"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100/90 border border-red-200/90 shadow-2xs transition-all duration-200 min-h-[38px] cursor-pointer"
                  title={t("nav_emergency") || "Emergency SOS"}
                  aria-label={t("nav_emergency") || "Emergency SOS"}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                  <span className="font-extrabold tracking-wide">SOS</span>
                </Link>

                {/* Profile Shortcut */}
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center p-2 rounded-full text-[#5A6A66] hover:text-[#0B534B] bg-[#F6F8F7] hover:bg-[#E6F4F1] border border-[#D5DFDC] transition-all min-h-[38px] min-w-[38px] cursor-pointer"
                  title={t("nav_profile") || "Profile"}
                  aria-label={t("nav_profile") || "Profile"}
                >
                  <UserCircle className="w-4 h-4 text-[#0B534B]" />
                </Link>

                {/* Clerk User Button */}
                <div className="flex items-center justify-center min-h-[38px] px-1">
                  <UserButton />
                </div>
              </Show>
            </div>

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

            {/* Emergency SOS quick pill on mobile */}
            <Link
              href="/emergency"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 min-h-[38px] cursor-pointer"
              title={t("nav_emergency") || "Emergency SOS"}
              aria-label={t("nav_emergency") || "Emergency SOS"}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>SOS</span>
            </Link>

            <Show when="signed-in">
              <div className="flex items-center justify-center min-h-[38px]">
                <UserButton />
              </div>
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#0B534B] to-[#10B981] shadow-[0_2px_10px_rgba(11,83,75,0.25)] min-h-[38px] cursor-pointer"
                >
                  <span>Sign In</span>
                </button>
              </SignInButton>
            </Show>


            {/* Accessible Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center p-2 rounded-full border border-[#D5DFDC] bg-white/80 hover:bg-[#E6F4F1] transition-colors cursor-pointer"
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
            <div className="pb-2">
              <Show when="signed-in">
                <div className="bg-[#E6F4F1]/80 rounded-2xl p-3 border border-[#0B534B]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserButton />
                    <span className="text-xs font-bold text-[#111615]">Account Profile</span>
                  </div>
                  <Link
                    href="/emergency"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 border border-red-200 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                    <span>SOS</span>
                  </Link>
                </div>
              </Show>
              <Show when="signed-out">
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold text-[#0B534B] bg-[#E6F4F1] hover:bg-[#d4ede7] border border-[#0B534B]/20 text-center cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0B534B] to-[#10B981] shadow-xs text-center cursor-pointer"
                    >
                      <span>Sign Up →</span>
                    </button>
                  </SignUpButton>
                </div>
              </Show>
            </div>


            {/* Dynamic Navigation links */}
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-[#5A6A66]">
                {t("nav_navigation") || "Navigation"}
              </span>
              <div className="space-y-0.5 pt-1">
                {currentNav.map((item) => {
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

            {/* Quick Actions (Emergency SOS + Profile) */}
            <div className="border-t border-[#EBF0EE] pt-3 grid grid-cols-2 gap-2">
              <Link
                href="/emergency"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center min-h-[44px] gap-2 px-3 py-2 rounded-xl text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
                <span>{t("nav_emergency") || "Emergency SOS"}</span>
              </Link>

              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center min-h-[44px] gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-[#0B534B] bg-[#E6F4F1] hover:bg-[#d4ede7] border border-[#0B534B]/20 transition-colors cursor-pointer"
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
