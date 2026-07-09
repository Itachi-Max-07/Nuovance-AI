import Link from "next/link";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { hero, closing, contact } from "@/lib/content";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Experience", href: "#experience" },
  { label: "Industries", href: "#industries" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-line bg-brand-dark text-brand-slate">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-brand-offwhite">
              <OrbitMotif className="h-7 w-7 text-brand-accent" />
              <span className="text-lg font-semibold tracking-wide">{hero.eyebrow}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-muted">{closing.tagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-offwhite">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-brand-offwhite"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-offwhite">
              Connect
            </h3>
            <p className="mt-4 text-sm">
              <a
                href={`mailto:${contact.emails.general}`}
                className="transition-colors duration-200 hover:text-brand-offwhite"
              >
                {contact.emails.general}
              </a>
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-brand-muted">
              {contact.social.platforms.map((platform) => (
                <li key={platform}>{platform}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-brand-line pt-8 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {hero.eyebrow}. All rights reserved.
          </p>
          <p>{closing.motto}</p>
        </div>
      </div>
    </footer>
  );
}
