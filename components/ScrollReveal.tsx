"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Immediate visibility fallback for above-the-fold or non-supporting environments
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    const currentElem = domRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, []);

  const getDirectionClasses = () => {
    if (isVisible) return "opacity-100 translate-x-0 translate-y-0 scale-100";

    switch (direction) {
      case "up":
        return "opacity-0 translate-y-8";
      case "down":
        return "opacity-0 -translate-y-8";
      case "left":
        return "opacity-0 translate-x-8";
      case "right":
        return "opacity-0 -translate-x-8";
      case "none":
        return "opacity-0 scale-95";
      default:
        return "opacity-0 translate-y-8";
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ${getDirectionClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
