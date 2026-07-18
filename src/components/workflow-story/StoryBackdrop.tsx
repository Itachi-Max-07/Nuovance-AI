interface ParticleSpec {
  top: string;
  left: string;
  delay: string;
  duration: string;
}

// Deterministic scatter — no randomness so SSR and client markup match.
const PARTICLES: ParticleSpec[] = [
  { top: "12%", left: "8%", delay: "0s", duration: "15s" },
  { top: "22%", left: "82%", delay: "-3s", duration: "18s" },
  { top: "34%", left: "16%", delay: "-6s", duration: "14s" },
  { top: "45%", left: "91%", delay: "-9s", duration: "17s" },
  { top: "58%", left: "5%", delay: "-2s", duration: "16s" },
  { top: "66%", left: "74%", delay: "-11s", duration: "15s" },
  { top: "74%", left: "28%", delay: "-5s", duration: "19s" },
  { top: "83%", left: "62%", delay: "-8s", duration: "14s" },
];

/**
 * Ambient background for the workflow story: a faint drifting charcoal
 * blueprint grid plus a handful of floating cobalt specks — flat and
 * geometric, no glows. Purely decorative — every layer is aria-hidden and
 * pointer-events-none; all motion lives in ws-* CSS animations.
 */
export default function StoryBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="ws-grid" />
      {PARTICLES.map((particle) => (
        <span
          key={`${particle.top}-${particle.left}`}
          className="ws-particle"
          style={{
            top: particle.top,
            left: particle.left,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}
