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
 * Flat paper map of Germany for the scan scene: white cut-out with a thick
 * charcoal outline (like a sticker on the page) and business pins that pop
 * in (ws-pin) while the scene is active. The radar sweep is layered on top
 * by the scene itself.
 */
export default function GermanyMap({ pins, className }: GermanyMapProps) {
  return (
    <svg viewBox="0 0 240 320" fill="none" aria-hidden="true" className={className}>
      {/* Hard offset "shadow" copy behind the map — physical depth, no blur. */}
      <path
        d={GERMANY_PATH}
        transform="translate(5 5)"
        className="fill-brand-ink/20"
        strokeLinejoin="round"
      />
      <path
        d={GERMANY_PATH}
        className="fill-brand-card stroke-brand-ink"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {pins.map((pin, index) => (
        <g
          key={`${pin.x}-${pin.y}`}
          className="ws-pin"
          style={{ animationDelay: `${200 + index * 160}ms` }}
        >
          <circle cx={pin.x} cy={pin.y} r="7" className="fill-brand-accent/25" />
          <circle cx={pin.x} cy={pin.y} r="3" className="fill-brand-accent stroke-brand-ink" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}
