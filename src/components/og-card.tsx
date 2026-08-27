/* Shared social card for /blog/[slug] and /case-studies/[slug].
   Rendered by next/og (satori), which supports only inline styles and needs an
   explicit `display: flex` on every multi-child container — the site's
   no-inline-style rule does not apply to image generators. Palette mirrors the
   root opengraph-image so all three cards read as one family. */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Soft Brutalism light tokens (globals.css :root), inlined for satori.
const PAPER = "#F7F6F3";
const CARD = "#FFFFFF";
const INK = "#1C1C1C";
const BODY = "#474742";
const FAINT = "#65655E";
const ACCENT = "#2563EB";

export interface OgCardProps {
  /** Small label above the title, e.g. "Insights" or "Case Study". */
  eyebrow: string;
  title: string;
  /** Bottom-left detail — date, reading time, or client. */
  footerLeft: string;
  /** Bottom-right detail — usually the site domain. */
  footerRight: string;
}

// Satori doesn't reflow overlong headlines, so the size steps down with length.
function titleFontSize(title: string): number {
  if (title.length <= 45) return 62;
  if (title.length <= 80) return 52;
  return 42;
}

export default function OgCard({ eyebrow, title, footerLeft, footerRight }: OgCardProps) {
  return (
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

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            {eyebrow}
          </span>
          <span
            style={{
              fontSize: titleFontSize(title),
              fontWeight: 800,
              lineHeight: 1.1,
              color: INK,
            }}
          >
            {title}
          </span>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <span style={{ fontSize: 23, color: BODY }}>{footerLeft}</span>
          <span style={{ fontSize: 23, fontWeight: 600, color: FAINT }}>{footerRight}</span>
        </div>
      </div>
    </div>
  );
}
