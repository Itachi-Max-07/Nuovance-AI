interface ParticleSpec {
  top: string;
  left: string;
  delay: string;
  duration: string;
}

interface StreakSpec {
  top: string;
  delay: string;
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
  { top: "18%", left: "45%", delay: "-13s", duration: "16s" },
  { top: "88%", left: "12%", delay: "-4s", duration: "18s" },
  { top: "40%", left: "55%", delay: "-10s", duration: "15s" },
  { top: "70%", left: "88%", delay: "-7s", duration: "17s" },
];

const STREAKS: StreakSpec[] = [
  { top: "24%", delay: "0s" },
  { top: "62%", delay: "-8s" },
];

/**
 * Ambient background for the workflow story: continued indigo glow from the
 * About section, a faint drifting blueprint grid, floating particles, and
 * slow light streaks. Purely decorative — every layer is aria-hidden and
 * pointer-events-none; all motion lives in ws-* CSS animations.
 */
export default function StoryBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="ws-glow-a absolute inset-x-0 top-0 h-2/3" />
      <div className="ws-glow-b absolute inset-0" />
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
      {STREAKS.map((streak) => (
        <span
          key={streak.top}
          className="ws-streak"
          style={{ top: streak.top, animationDelay: streak.delay }}
        />
      ))}
    </div>
  );
}
