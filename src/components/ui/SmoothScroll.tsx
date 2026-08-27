"use client";

import { useEffect } from "react";
import { startScrollEngine } from "@/lib/scroll-engine";

/**
 * Behaviour-only component (renders nothing). Mounted once in the root
 * layout, it installs the shared scroll engine (@/lib/scroll-engine) that
 * eases the wheel, the keyboard, and in-page anchor jumps onto one curve.
 * Disables itself entirely under `prefers-reduced-motion: reduce`, live-
 * toggling if the user flips the OS setting mid-session.
 */
export default function SmoothScroll(): null {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let detach: (() => void) | null = null;

    const sync = (): void => {
      detach?.();
      detach = query.matches ? null : startScrollEngine();
    };

    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      detach?.();
    };
  }, []);

  return null;
}
