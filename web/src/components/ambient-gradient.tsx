"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: [number, number, number];
}

export function AmbientGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors: [number, number, number][] = [
      [55, 40, 120],   // deep purple
      [30, 25, 80],    // deep blue
      [20, 22, 35],    // near black
      [45, 35, 100],   // muted violet
      [25, 30, 60],    // slate blue
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize blob points
    const pointCount = 5;
    pointsRef.current = Array.from({ length: pointCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: 300 + Math.random() * 250,
      color: colors[i % colors.length],
    }));

    let lastTime = 0;
    const animate = (time: number) => {
      // Throttle to ~30fps for calm feel
      if (time - lastTime < 33) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;

      const points = pointsRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Clear with base color
      ctx.fillStyle = "#0B0D10";
      ctx.fillRect(0, 0, w, h);

      // Update positions (very slow drift)
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Gentle bounce off edges
        if (p.x < -p.radius) p.vx = Math.abs(p.vx);
        if (p.x > w + p.radius) p.vx = -Math.abs(p.vx);
        if (p.y < -p.radius) p.vy = Math.abs(p.vy);
        if (p.y > h + p.radius) p.vy = -Math.abs(p.vy);
      });

      // Draw each blob as a radial gradient
      points.forEach((p) => {
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius
        );
        gradient.addColorStop(0, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.08)`);
        gradient.addColorStop(0.5, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.03)`);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
