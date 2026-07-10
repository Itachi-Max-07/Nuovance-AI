"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterState {
  text: string;
  done: boolean;
}

/**
 * Reveals `fullText` character-by-character while `active` is true.
 * Restarts from the beginning when the scene is re-entered; renders the
 * complete text instantly under reduced motion.
 */
export default function useTypewriter(
  active: boolean,
  fullText: string,
  reduce = false,
  charsPerSecond = 55,
): TypewriterState {
  const [count, setCount] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    if (reduce) {
      setCount(fullText.length);
      return undefined;
    }

    setCount(0);
    const start = performance.now();
    const tick = (now: number) => {
      const revealed = Math.min(
        fullText.length,
        Math.floor(((now - start) / 1000) * charsPerSecond),
      );
      setCount(revealed);
      if (revealed < fullText.length) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active, fullText, reduce, charsPerSecond]);

  return { text: fullText.slice(0, count), done: count >= fullText.length };
}
