"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftX1: number;
  driftY1: number;
  driftX2: number;
  driftY2: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 15,
    driftX1: (Math.random() - 0.5) * 100,
    driftY1: (Math.random() - 0.5) * 60,
    driftX2: (Math.random() - 0.5) * 80,
    driftY2: (Math.random() - 0.5) * 90,
  }));
}

export function DriftingParticles() {
  const [mounted, setMounted] = useState(false);
  const particles = useMemo(() => generateParticles(30), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            x: [0, p.driftX1, p.driftX2, 0],
            y: [0, p.driftY1, p.driftY2, 0],
            opacity: [0.1, 0.4, 0.15, 0.35, 0.1],
            scale: [1, 1.3, 0.9, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
