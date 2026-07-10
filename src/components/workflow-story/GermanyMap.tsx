import type { StoryMapPin } from "@/lib/content";

interface GermanyMapProps {
  pins: StoryMapPin[];
  className?: string;
}

// Stylized (deliberately simplified) outline of Germany in a 240×320 box —
// recognizable silhouette, not a geographic dataset.
const GERMANY_PATH =
  "M96,10 L118,14 L126,28 L150,26 L182,34 L186,60 L196,86 L188,112 L196,140 " +
  "L178,158 L186,178 L168,196 L178,224 L164,244 L172,266 L148,282 L120,290 " +
  "L86,284 L70,258 L78,232 L60,210 L50,186 L34,170 L42,146 L28,124 L40,100 " +
  "L34,76 L52,58 L48,36 L70,30 L78,16 Z";

/**
 * Premium dark map of Germany for the scan scene: soft-glowing outline with
 * business pins that pop in (ws-pin) while the scene is active. The radar
 * sweep is layered on top by the scene itself.
 */
export default function GermanyMap({ pins, className }: GermanyMapProps) {
  return (
    <svg viewBox="0 0 240 320" fill="none" aria-hidden="true" className={className}>
      <path
        d={GERMANY_PATH}
        className="fill-brand-surface/80 stroke-brand-accent/40"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d={GERMANY_PATH}
        className="stroke-brand-accent/15"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {pins.map((pin, index) => (
        <g
          key={`${pin.x}-${pin.y}`}
          className="ws-pin"
          style={{ animationDelay: `${200 + index * 160}ms` }}
        >
          <circle cx={pin.x} cy={pin.y} r="7" className="fill-brand-accent/20" />
          <circle cx={pin.x} cy={pin.y} r="2.5" className="fill-brand-accent-2" />
        </g>
      ))}
    </svg>
  );
}
