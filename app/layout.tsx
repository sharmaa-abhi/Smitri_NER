import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#FAFCFD] text-[#0A192F] flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
