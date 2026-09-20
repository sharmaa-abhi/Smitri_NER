import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smitri_NER - AI-Powered Cognitive Care & Memory Assistance for Seniors",
  description: "Smitri_NER is an AI-powered platform designed to support elderly users with cognitive games, memory assistance, personalized activities, and caregiver support in the North Eastern Region and beyond.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className="min-h-screen bg-[#FAFCFD] text-[#0A192F] font-sans flex flex-col antialiased">
        <ScrollProgressBar />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
