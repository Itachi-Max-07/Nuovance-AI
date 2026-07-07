"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";
import { bookingHref, contact, hero } from "@/lib/content";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Experience", href: "#experience" },
  { label: "Industries", href: "#industries" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-dark/95 backdrop-blur supports-[backdrop-filter]:bg-brand-dark/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="relative h-9 w-9 shrink-0"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src="/logo/nuovance-inverted.png"
            alt={hero.eyebrow}
            fill
            priority
            className="object-contain"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-light-blue transition-colors duration-200 hover:text-brand-offwhite"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button href={bookingHref} className="hidden sm:inline-flex">
            {contact.bookingCtaLabel}
          </Button>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-offwhite transition-colors duration-200 hover:bg-white/10 md:hidden"
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
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 pb-6 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-brand-light-blue transition-colors duration-200 hover:text-brand-offwhite"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                href={bookingHref}
                onClick={() => setIsOpen(false)}
                className="mt-2 w-full sm:hidden"
              >
                {contact.bookingCtaLabel}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
