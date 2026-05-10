"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

function generateOrbs(count: number): Orb[] {
  const colors = [
    "rgba(124, 92, 255, 0.10)",
    "rgba(139, 92, 246, 0.06)",
    "rgba(60, 50, 120, 0.08)",
    "rgba(45, 40, 90, 0.10)",
    "rgba(80, 60, 140, 0.07)",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + (i * 18) % 80,
    y: 10 + (i * 23) % 80,
    size: 250 + (i % 3) * 150,
    color: colors[i % colors.length],
    duration: 25 + (i % 3) * 10,
    delay: i * 2,
    driftX: (i % 2 === 0 ? 1 : -1) * (15 + i * 5),
    driftY: (i % 2 === 0 ? -1 : 1) * (10 + i * 3),
  }));
}

export function BreathingOrbs() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const orbs = useMemo(() => generateOrbs(5), []);

  useEffect(() => {
    setMounted(true);

    // Detect touch/mobile device
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsMobile(isTouchDevice || window.innerWidth < 768);

    // Detect reduced motion preference
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mql.addEventListener("change", handleChange);

    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, []);

  if (!mounted) return null;

  // Mobile / reduced motion: static gradient fallback
  if (isMobile || prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(124,92,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(60,50,120,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 50%, rgba(45,40,90,0.05) 0%, transparent 60%)",
          }}
        />
      </div>
    );
  }

  // Desktop: gentle breathing orbs
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            marginLeft: -orb.size / 2,
            marginTop: -orb.size / 2,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          initial={{
            scale: 0.9,
            x: 0,
            y: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0.9, 1.1, 0.95, 1.05, 0.9],
            x: [0, orb.driftX, -orb.driftX * 0.5, orb.driftX * 0.3, 0],
            y: [0, -orb.driftY, orb.driftY * 0.7, -orb.driftY * 0.4, 0],
            opacity: [0, 0.8, 0.6, 0.8, 0.5],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
