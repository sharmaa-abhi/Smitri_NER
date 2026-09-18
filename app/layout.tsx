import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Smriti - Cognitive Wellness & Memory Assistance for Seniors",
  description: "An easy-to-use cognitive wellness platform designed to support elderly users through simple games, reminders and progress tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
