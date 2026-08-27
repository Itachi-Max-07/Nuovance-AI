"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";
import { bookingHref, brand, contact } from "@/lib/content";

interface NavLink {
  label: string;
  href: string;
  /** Home-page section this link scrolls to; absent for standalone routes. */
  sectionId?: string;
}

// Section links are route-absolute ("/#about", not "#about") so they still
// work from /blog and /case-studies, where those sections don't exist.
const navLinks: NavLink[] = [
  { label: "About", href: "/#about", sectionId: "about" },
  { label: "Capabilities", href: "/#capabilities", sectionId: "capabilities" },
  { label: "Experience", href: "/#experience", sectionId: "experience" },
  { label: "Industries", href: "/#industries", sectionId: "industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];

// Underline reveal + Electric Blue shift shared by desktop and mobile links.
// The bar is an ::after pseudo so it never affects layout.
const linkBaseStyles =
  "relative font-bold transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-accent after:transition-transform after:duration-300 after:ease-out-strong hover:text-brand-accent hover:after:scale-x-100";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();

  // Scroll-spy: the section crossing the upper-middle band of the viewport
  // owns the accent state. IntersectionObserver (not offset math) so the
  // GSAP pin-spacer around the workflow story can't skew measurements.
  // Only the home page has these sections; elsewhere `targets` is empty and
  // the route links below own the active state instead.
  useEffect(() => {
    const targets = navLinks
      .map((link) => (link.sectionId ? document.getElementById(link.sectionId) : null))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const isLinkActive = (link: NavLink): boolean =>
    link.sectionId
      ? pathname === "/" && activeSection === link.sectionId
      : pathname.startsWith(link.href);

  return (
    // theme-dark puts the Navbar's brand tokens on the dark system, so text,
    // accent, and the booking CTA style themselves like the sections below.
    <header className="theme-dark sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="nav-gloss mx-auto max-w-7xl overflow-hidden">
        <nav className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src={brand.logo.src}
              alt={brand.logo.alt}
              width={40}
              height={40}
              priority
              className="h-10 w-10"
            />
            <span
              aria-hidden="true"
              className="hidden font-heading text-lg font-bold uppercase tracking-widest text-brand-ink sm:inline"
            >
              {brand.wordmark}{" "}
              <span className="text-brand-accent-deep">{brand.wordmarkAccent}</span>
            </span>
          </Link>

          {/* Full link row only from xl: seven links plus the wordmark and
              booking CTA no longer clear 1024px, and overflowing the pill
              would force horizontal page scroll. */}
          <div className="hidden items-center gap-7 xl:flex">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`${linkBaseStyles} text-sm ${
                    isActive ? "text-brand-accent after:scale-x-100" : "text-brand-ink/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Button
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              {contact.bookingCtaLabel}
            </Button>

            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded border-2 border-brand-ink/15 bg-brand-ink/5 text-brand-ink transition-press duration-160 ease-spring hover:bg-brand-ink/10 active:translate-y-0.5 active:scale-95 xl:hidden"
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
            </button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden border-t border-brand-ink/10 xl:hidden"
            >
              <div className="flex flex-col gap-4 px-6 pb-6 pt-4">
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? "true" : undefined}
                      className={`${linkBaseStyles} self-start text-base ${
                        isActive ? "text-brand-accent after:scale-x-100" : "text-brand-ink/80"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <Button
                  href={bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 w-full sm:hidden"
                >
                  {contact.bookingCtaLabel}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
