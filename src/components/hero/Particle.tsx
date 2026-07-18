interface ParticleProps {
  /** SVG path data the particle travels along. */
  path: string;
  /** Seconds before this particle's first run. */
  beginSeconds: number;
  /** Seconds for one full trip along the path. */
  durationSeconds: number;
}

/**
 * A glowing data packet that travels a connection path forever.
 * Uses SMIL `animateMotion` — declarative, loops without any per-frame JS.
 * Hidden until its first run so it never flashes at the SVG origin.
 */
export default function Particle({
  path,
  beginSeconds,
  durationSeconds,
}: ParticleProps) {
  return (
    <g visibility="hidden">
      <set
        attributeName="visibility"
        to="visible"
        begin={`${beginSeconds}s`}
        fill="freeze"
      />
      {/* Soft halo + bright core reads as a glow without filter cost. */}
      <circle r={5} fill="rgb(var(--color-accent))" opacity={0.18} />
      <circle r={2.1} fill="rgb(var(--color-accent))" opacity={0.95} />
      <animateMotion
        begin={`${beginSeconds}s`}
        dur={`${durationSeconds}s`}
        repeatCount="indefinite"
        path={path}
      />
    </g>
  );
}
