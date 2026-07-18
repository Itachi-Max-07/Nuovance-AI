import { ImageResponse } from "next/og";
import { hero } from "@/lib/content";

// Social share preview card (1200×630). Rendered by next/og at build time.
export const runtime = "edge";
export const alt = `${hero.eyebrow} — ${hero.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens — Soft Brutalism light / Hero palette. Inline styles are
// REQUIRED by next/og's renderer (satori); the site's no-inline-style rule
// does not apply to this image generator.
const PAPER = "#F7F6F3";
const CARD = "#FFFFFF";
const INK = "#1C1C1C";
const BODY = "#474742";
const FAINT = "#65655E";
const ACCENT = "#2563EB";

export default function OpengraphImage() {
  const idx = hero.headline.indexOf(hero.headlineAccent);
  const headBefore = idx > -1 ? hero.headline.slice(0, idx).trimEnd() : hero.headline;
  const headAccent = idx > -1 ? hero.headlineAccent : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: PAPER,
          padding: 56,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "space-between",
            backgroundColor: CARD,
            border: `3px solid ${INK}`,
            borderRadius: 24,
            boxShadow: `14px 14px 0 ${INK}`,
            padding: 64,
          }}
        >
          {/* Wordmark + orbit/dot motif */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="54" height="54" viewBox="0 0 54 54">
              <circle cx="27" cy="27" r="22" fill="none" stroke={INK} strokeWidth="3" />
              <circle cx="45" cy="18" r="6.5" fill={ACCENT} />
            </svg>
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 6, color: INK }}>
              NUOVANCE AI
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", fontSize: 66, fontWeight: 800, lineHeight: 1.08 }}>
            <span style={{ color: INK }}>{headBefore}</span>
            {headAccent && <span style={{ color: ACCENT }}>{headAccent}</span>}
          </div>

          {/* Positioning + footer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <span style={{ fontSize: 29, color: BODY, lineHeight: 1.3 }}>{hero.positioning}</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 23, color: FAINT, letterSpacing: 1 }}>
                {hero.disciplines.slice(0, 4).join("   ·   ")}
              </span>
              <span style={{ fontSize: 23, fontWeight: 600, color: ACCENT }}>{hero.website}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
