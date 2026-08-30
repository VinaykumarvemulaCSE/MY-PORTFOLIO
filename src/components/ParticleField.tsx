"use client";

import { useMemo, useState, useEffect } from "react";

// Deterministic pseudo-random function so server and client match identically
function seededRandom(i: number, seed: number): number {
  const x = Math.sin(i * 9999 + seed) * 10000;
  return x - Math.floor(x);
}

export default function ParticleField() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(seededRandom(i, 1) * 100).toFixed(2)}%`,
      top: `${(seededRandom(i, 2) * 100).toFixed(2)}%`,
      size: (seededRandom(i, 3) * 3 + 1).toFixed(2),
      duration: `${(seededRandom(i, 4) * 8 + 6).toFixed(2)}s`,
      delay: `${(seededRandom(i, 5) * 5).toFixed(2)}s`,
      opacity: (seededRandom(i, 6) * 0.4 + 0.1).toFixed(2),
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[120px] animate-float-slow" />
      
      {/* Particle dots */}
      {mounted && particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary particle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: Number(p.opacity),
            ["--duration" as string]: p.duration,
            ["--delay" as string]: p.delay,
          }}
        />
      ))}

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
