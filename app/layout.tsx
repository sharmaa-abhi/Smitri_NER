import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { PWAProvider } from "@/components/PWAProvider";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smitri_NER - AI-Powered Cognitive Care & Memory Assistance for Seniors",
  description: "Smitri_NER is an AI-powered platform designed to support elderly users with cognitive games, memory assistance, personalized activities, and caregiver support in the North Eastern Region and beyond.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Smitri_NER",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B534B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("scroll-smooth", inter.variable, "font-sans")} suppressHydrationWarning>
      <body className="min-h-screen bg-[#F6F8F7] text-[#111615] font-sans flex flex-col antialiased selection:bg-[#C2E5DF] selection:text-[#042420]" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <PWAProvider>
              <ScrollProgressBar />
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6">
                {children}
              </main>
            </PWAProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
