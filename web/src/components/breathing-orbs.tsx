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
    "rgba(124, 92, 255, 0.12)",   // accent purple
    "rgba(139, 92, 246, 0.08)",   // tag goal purple
    "rgba(124, 92, 255, 0.06)",   // softer purple
    "rgba(60, 50, 120, 0.10)",    // deep violet
    "rgba(45, 40, 90, 0.14)",     // deep blue-purple
    "rgba(80, 60, 140, 0.09)",    // muted purple
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 200 + Math.random() * 400,
    color: colors[i % colors.length],
    duration: 20 + Math.random() * 25,
    delay: Math.random() * 10,
    driftX: (Math.random() - 0.5) * 40,
    driftY: (Math.random() - 0.5) * 30,
  }));
}

export function BreathingOrbs() {
  const [mounted, setMounted] = useState(false);
  const orbs = useMemo(() => generateOrbs(8), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
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
            filter: "blur(60px)",
          }}
          initial={{
            scale: 0.8,
            x: 0,
            y: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0.8, 1.15, 0.9, 1.1, 0.85],
            x: [0, orb.driftX, -orb.driftX * 0.5, orb.driftX * 0.3, 0],
            y: [0, -orb.driftY, orb.driftY * 0.7, -orb.driftY * 0.4, 0],
            opacity: [0, 1, 0.7, 1, 0.6],
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
