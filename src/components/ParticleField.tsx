import { useMemo } from "react";

export default function ParticleField() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: `${Math.random() * 8 + 6}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[120px] animate-float-slow" />
      
      {/* Particle dots */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
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
