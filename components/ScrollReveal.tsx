"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

/**
 * ScrollReveal Component
 * Senior-friendly: ensures content is immediately accessible and visible,
 * with subtle graceful transition if supported, never trapping content in opacity-0.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "none",
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(true);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user's motion preferences
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }
    setIsVisible(true);
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-100'} ${className}`}
    >
      {children}
    </div>
  );
}
