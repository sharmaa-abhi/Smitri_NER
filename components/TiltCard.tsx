"use client";

import React, { useRef, useState, useEffect } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
    background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)",
  });
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(media.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = x / rect.width;
    const normalizedY = y / rect.height;

    const tiltX = (0.5 - normalizedY) * (maxTilt * 2);
    const tiltY = (normalizedX - 0.5) * (maxTilt * 2);

    setStyle({
      transform: `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    });

    if (glare) {
      setGlareStyle({
        opacity: 0.6,
        background: `radial-gradient(circle at ${(normalizedX * 100).toFixed(1)}% ${(normalizedY * 100).toFixed(1)}%, rgba(255,255,255,0.35) 0%, transparent 65%)`,
        transition: "opacity 0.2s ease-out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (prefersReduced) return;

    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
    });

    if (glare) {
      setGlareStyle((prev) => ({
        ...prev,
        opacity: 0,
        transition: "opacity 0.4s ease-out",
      }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={prefersReduced ? undefined : style}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {glare && !prefersReduced && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={glareStyle}
        />
      )}
    </div>
  );
}
