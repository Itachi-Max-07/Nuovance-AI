import Link from "next/link";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { hero, closing, contact } from "@/lib/content";

// Route-absolute so the section anchors still resolve from /blog and
// /case-studies, where those sections aren't on the page.
const footerLinks = [
  { label: "About", href: "/#about" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Experience", href: "/#experience" },
  { label: "Industries", href: "/#industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

// Kept out of Quick Links so the legal row reads as its own group in the
// bottom bar, which is where reviewers and users look for it.
const legalLinks = [{ label: "Privacy Policy", href: "/privacy" }];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    // The terminal slab of the all-black system: same near-black base as the
    // sections above, separated by a thick visible hairline — brutalist seam.
    <footer className="theme-dark border-t-2 border-brand-ink/20 bg-brand-paper text-brand-body">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-brand-ink">
              <OrbitMotif className="h-7 w-7 text-brand-accent" />
              <span className="text-lg font-bold tracking-wide">{hero.eyebrow}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-faint">{closing.tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-ink">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium transition-colors duration-200 hover:text-brand-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-ink">
              Connect
            </h3>
            <p className="mt-4 text-sm">
              <a
                href={`mailto:${contact.emails.sales}`}
                className="font-medium transition-colors duration-200 hover:text-brand-ink"
              >
                {contact.emails.sales}
              </a>
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-brand-faint">
              {contact.social.platforms.map((platform) => (
                <li key={platform.name}>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform.name}
                    className="transition-colors duration-200 hover:text-brand-ink"
                  >
                    {platform.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t-2 border-brand-ink/20 pt-8 text-xs text-brand-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {hero.eyebrow}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium transition-colors duration-200 hover:text-brand-ink"
              >
                {link.label}
              </Link>
            ))}
            <span aria-hidden="true">·</span>
            <p>{closing.motto}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
