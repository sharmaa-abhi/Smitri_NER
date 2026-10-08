"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  ArrowRight, 
  Brain, 
  LogIn, 
  LogOut, 
  ShieldAlert, 
  UserCircle 
} from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, isLoggedIn, isLoaded, logout } = useAuth();

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
      <div className="bg-white/95 backdrop-blur-md border border-[#D5DFDC] rounded-full px-4 py-2 sm:px-6 sm:py-2.5 shadow-[0_4px_20px_rgba(11,83,75,0.06)] flex items-center justify-between transition-all gap-2 sm:gap-4">
        {/* Left: Brand Logo + Name */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-[#111615] group flex-shrink-0"
          aria-label="Smitri_NER Home"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#0B534B] to-[#10B981] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#0B534B]">Smitri</span>
            <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-md bg-[#E6F4F1] text-[#0B534B] border border-[#93CEC5]">NER</span>
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
                    ? "bg-[#0B534B] text-white shadow-xs font-bold"
                    : "text-[#5A6A66] hover:text-[#0B534B] hover:bg-[#E6F4F1]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Regional Language Selector + Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          {/* Dynamic Auth Action Buttons */}
          {isLoaded && isLoggedIn ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/dashboard"
                className="btn-primary btn-sm text-xs sm:text-sm flex items-center gap-1.5 min-h-[44px] px-3.5"
                aria-label={t("nav_dashboard") || "Go to Dashboard"}
              >
                <span>{t("nav_dashboard") || "Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full text-xs font-bold text-[#5A6A66] hover:text-red-700 hover:bg-red-50 border border-[#D5DFDC] hover:border-red-200 transition-all min-h-[44px] min-w-[44px]"
                title={t("nav_logout") || "Log Out"}
                aria-label={t("nav_logout") || "Log Out"}
              >
                <LogOut className="w-4 h-4 text-gray-500" />
                <span className="hidden lg:inline">{t("nav_logout") || "Log Out"}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Login Button with Icon */}
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#0B534B] hover:text-[#08433C] hover:bg-[#E6F4F1] border border-[#0B534B]/30 transition-all shadow-xs min-h-[44px]"
                aria-label={t("nav_login") || "Log In to Account"}
              >
                <LogIn className="w-4 h-4 text-[#0B534B]" />
                <span>{t("nav_login") || "Log In"}</span>
              </Link>

              {/* Get Started Button (Register / Onboarding) */}
              <Link
                href="/register"
                className="btn-primary btn-sm text-xs sm:text-sm hidden sm:inline-flex min-h-[44px] px-3.5"
                aria-label={t("nav_get_started") || "Get Started"}
              >
                <span>{t("nav_get_started") || "Get Started"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full border border-[#D5DFDC] hover:bg-[#E6F4F1]"
            aria-label={mobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#111615]" /> : <Menu className="w-6 h-6 text-[#111615]" />}
          </button>
        </div>
      </div>

      {/* Mobile / Compact Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 bg-white border border-[#D5DFDC] rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBF0EE]">
            <span className="text-xs font-black tracking-wider text-[#111615] uppercase">{t("select_language_title") || "Select Dialect / ভাষা"}</span>
            <LanguageSelector />
          </div>

          {/* Auth Card inside mobile drawer */}
          {isLoggedIn ? (
            <div className="bg-[#E6F4F1] rounded-2xl p-3.5 border border-[#0B534B]/20 flex items-center justify-between">
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
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
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
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold text-[#0B534B] bg-[#E6F4F1] hover:bg-[#d4ede7] border border-[#0B534B]/20 text-center"
              >
                <LogIn className="w-4 h-4" />
                <span>{t("nav_login") || "Log In"}</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold text-white bg-[#0B534B] hover:bg-[#08433C] text-center"
              >
                <span>{t("nav_get_started") || "Get Started"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-xs font-bold tracking-wider text-[#5A6A66]">{t("nav_navigation") || "Navigation"}</span>
            {mainNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center min-h-[44px] px-4 py-2.5 rounded-xl text-base font-semibold text-[#5A6A66] hover:text-[#0B534B] hover:bg-[#E6F4F1] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-[#EBF0EE] pt-3 space-y-1">
            <span className="text-xs font-bold tracking-wider text-[#5A6A66]">{t("nav_care_features") || "Elderly & Caregiver Features"}</span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {appNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center min-h-[44px] px-3 py-2 rounded-xl text-sm font-bold bg-[#F6F8F7] text-[#111615] hover:bg-[#E6F4F1] hover:text-[#0B534B] text-center transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-[#EBF0EE] pt-3 flex items-center justify-between gap-2">
            <Link
              href="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center min-h-[44px] gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t("nav_emergency") || "Emergency Help"}</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center min-h-[44px] gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-[#5A6A66] bg-[#F6F8F7] hover:bg-[#E6F4F1] hover:text-[#0B534B] transition-colors"
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
