"use client";

import { useEffect, useRef } from "react";

interface Fragment {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  blur: number;
  maxLife: number;
  life: number;
}

const FRAGMENTS = [
  "fix: resolve memory leak",
  "TODO: refactor auth",
  "PR #2847",
  "meeting at 3pm",
  "deploy failed",
  "slack: @channel",
  "bug: null pointer",
  "review requested",
  "standup in 5min",
  "merge conflict",
  "CI/CD pipeline",
  "JIRA-4821",
  "npm install",
  "docker build",
  "code review",
  "git push origin",
  "stuck on this",
  "should refactor",
  "need coffee",
  "11 unread emails",
  "error: timeout",
  "rebase -i HEAD~3",
  "console.log(???)",
  "// FIXME: hack",
  "lint: trailing comma",
];

export function FloatingFragments() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fragmentsRef = useRef<Fragment[]>([]);
  const frameRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createFragment = (): Fragment => {
      const text = FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
      const side = Math.random() > 0.5 ? "left" : "right";
      const x = side === "left"
        ? -100 - Math.random() * 100
        : canvas.width + 100 + Math.random() * 100;
      const y = 80 + Math.random() * (canvas.height - 200);
      const speed = 0.15 + Math.random() * 0.2;

      return {
        text,
        x,
        y,
        vx: side === "left" ? speed : -speed,
        vy: (Math.random() - 0.5) * 0.05,
        opacity: 0,
        size: 11 + Math.random() * 4,
        blur: 1 + Math.random() * 2,
        maxLife: 400 + Math.random() * 300,
        life: 0,
      };
    };

    // Pre-populate some fragments
    for (let i = 0; i < 8; i++) {
      const f = createFragment();
      f.x = Math.random() * canvas.width;
      f.life = Math.random() * f.maxLife;
      f.opacity = 0.03 + Math.random() * 0.04;
      fragmentsRef.current.push(f);
    }

    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime < 33) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Spawn new fragments occasionally
      spawnTimerRef.current++;
      if (spawnTimerRef.current > 80 && fragmentsRef.current.length < 14) {
        spawnTimerRef.current = 0;
        fragmentsRef.current.push(createFragment());
      }

      const fragments = fragmentsRef.current;
      for (let i = fragments.length - 1; i >= 0; i--) {
        const f = fragments[i];
        f.life++;

        // Fade in / out
        const fadeInEnd = 60;
        const fadeOutStart = f.maxLife - 80;
        if (f.life < fadeInEnd) {
          f.opacity = (f.life / fadeInEnd) * 0.06;
        } else if (f.life > fadeOutStart) {
          f.opacity = ((f.maxLife - f.life) / (f.maxLife - fadeOutStart)) * 0.06;
        } else {
          f.opacity = 0.06;
        }

        // Move
        f.x += f.vx;
        f.y += f.vy + Math.sin(f.life * 0.01) * 0.1;

        // Draw
        ctx.save();
        ctx.font = `${f.size}px 'JetBrains Mono', ui-monospace, monospace`;
        ctx.fillStyle = `rgba(152, 162, 179, ${f.opacity})`;
        ctx.filter = `blur(${f.blur}px)`;
        ctx.fillText(f.text, f.x, f.y);
        ctx.restore();

        // Remove dead fragments
        if (f.life >= f.maxLife || f.x < -300 || f.x > w + 300) {
          fragments.splice(i, 1);
        }
      }

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
      style={{ zIndex: 1 }}
    />
  );
}
