"use client";

import {
  CalendarCheck,
  Clock,
  EnvelopeSimple,
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  Phone,
  WhatsappLogo,
  XLogo,
  YoutubeLogo,
  type Icon,
} from "@phosphor-icons/react";
import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";
import Button from "@/components/ui/Button";
import OrbitMotif from "@/components/ui/OrbitMotif";
import { bookingHref, contact } from "@/lib/content";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const emailLabels: Record<keyof typeof contact.emails, string> = {
  general: "General Inquiries",
  sales: "Sales",
  support: "Support",
  partnerships: "Partnerships",
  careers: "Careers",
};

const socialIcons: Record<string, Icon> = {
  LinkedIn: LinkedinLogo,
  Facebook: FacebookLogo,
  Instagram: InstagramLogo,
  X: XLogo,
  YouTube: YoutubeLogo,
  GitHub: GithubLogo,
};

const isRealBookingLink = /^https?:\/\//.test(contact.bookingUrl);

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      };

  const accentAnimate = shouldReduceMotion
    ? { opacity: 0.12 }
    : { opacity: 0.12, rotate: 360 };

  const accentTransition: Transition = shouldReduceMotion
    ? { duration: 1, ease: "easeOut" }
    : {
        opacity: { duration: 1, ease: "easeOut" },
        rotate: { duration: 90, repeat: Infinity, ease: "linear" },
      };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-brand-line bg-brand-dark py-20 sm:py-24 md:py-28 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 text-brand-accent sm:h-28 sm:w-28 lg:h-32 lg:w-32"
      >
        <motion.div
          className="h-full w-full"
          initial={{ opacity: 0, rotate: 0 }}
          animate={accentAnimate}
          transition={accentTransition}
        >
          <OrbitMotif className="h-full w-full" />
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <OrbitMotif className="h-4 w-4 text-brand-accent-2" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent-2 sm:text-sm">
            Contact
          </span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="mt-6 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-brand-offwhite sm:text-4xl lg:text-5xl"
        >
          {contact.headline}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-2xl text-base leading-relaxed text-brand-slate sm:text-lg"
        >
          {contact.intro}
        </motion.p>

        {/* Dominant booking CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-start gap-4 rounded-card bg-brand-surface p-6 shadow-card ring-1 ring-brand-accent/25 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-accent/15"
            >
              <CalendarCheck size={22} weight="bold" className="text-brand-accent" />
            </span>
            <div>
              <p className="text-base font-bold text-brand-offwhite sm:text-lg">
                Ready to talk strategy?
              </p>
              {!isRealBookingLink && (
                <p className="mt-1 text-xs text-brand-muted">
                  Booking link coming soon — reach us directly below in the meantime.
                </p>
              )}
            </div>
          </div>
          <Button
            href={bookingHref}
            className="w-full justify-center px-8 py-4 text-base sm:w-auto"
          >
            {contact.bookingCtaLabel}
          </Button>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Emails */}
          <motion.div
            variants={itemVariants}
            className="rounded-card bg-brand-surface p-6 ring-1 ring-brand-line sm:p-7"
          >
            <div className="flex items-center gap-2">
              <EnvelopeSimple size={18} className="text-brand-accent" />
              <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-brand-offwhite">
                Email
              </h3>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {(Object.keys(contact.emails) as Array<keyof typeof contact.emails>).map((key) => (
                <li key={key} className="flex flex-col">
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-brand-muted">
                    {emailLabels[key]}
                  </span>
                  <a
                    href={`mailto:${contact.emails[key]}`}
                    className="text-sm font-medium text-brand-slate transition-colors duration-200 hover:text-brand-offwhite"
                  >
                    {contact.emails[key]}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Phone / office */}
          <motion.div
            variants={itemVariants}
            className="rounded-card bg-brand-surface p-6 ring-1 ring-brand-line sm:p-7"
          >
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-brand-accent" />
              <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-brand-offwhite">
                Phone &amp; Office
              </h3>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-brand-muted">
                    Phone
                  </span>
                  <span className="rounded-full border border-brand-accent/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
                    Placeholder
                  </span>
                </div>
                <p className="text-sm font-medium text-brand-slate">{contact.phone}</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <WhatsappLogo size={14} className="text-brand-muted" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-brand-muted">
                    WhatsApp
                  </span>
                  <span className="rounded-full border border-brand-accent/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
                    Placeholder
                  </span>
                </div>
                <p className="text-sm font-medium text-brand-slate">{contact.whatsapp}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-muted" />
                <p className="text-sm font-medium text-brand-slate">{contact.office}</p>
              </div>
            </div>
          </motion.div>

          {/* Business hours */}
          <motion.div
            variants={itemVariants}
            className="rounded-card bg-brand-surface p-6 ring-1 ring-brand-line sm:p-7"
          >
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-brand-accent" />
              <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-brand-offwhite">
                Business Hours
              </h3>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {contact.businessHours.map((line) => (
                <li key={line} className="text-sm leading-relaxed text-brand-slate">
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            variants={itemVariants}
            className="rounded-card bg-brand-surface p-6 ring-1 ring-brand-line sm:p-7"
          >
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-brand-offwhite">
              {contact.social.handle}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {contact.social.platforms.map((platform) => {
                const PlatformIcon = socialIcons[platform];
                return (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-line px-3 py-1 text-xs font-medium text-brand-slate"
                  >
                    {PlatformIcon && <PlatformIcon size={14} aria-hidden="true" />}
                    {platform}
                  </span>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
