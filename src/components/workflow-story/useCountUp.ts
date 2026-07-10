"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpOptions {
  duration?: number;
  decimals?: number;
  /** Skip the tween and jump straight to the target (reduced motion). */
  reduce?: boolean;
}

/**
 * Eased count-up that runs each time `active` flips to true (re-entering a
 * scene while scrubbing backwards restarts it — the section itself never
 * loops). Returns the formatted value with locale separators.
 */
export default function useCountUp(
  active: boolean,
  target: number,
  { duration = 1400, decimals = 0, reduce = false }: CountUpOptions = {},
): string {
  const [value, setValue] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    if (reduce) {
      setValue(target);
      return undefined;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, target, duration, reduce]);

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
