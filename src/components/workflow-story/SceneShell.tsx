import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SceneState = "past" | "active" | "future";

interface SceneShellProps {
  state: SceneState;
  children: ReactNode;
}

/**
 * Positions a scene inside the pinned stage and drives the crossfade/morph
 * between steps via the ws-scene classes. Hidden scenes stay mounted (opacity
 * 0, animations paused) so scrubbing backwards re-enters smoothly.
 */
export default function SceneShell({ state, children }: SceneShellProps) {
  return (
    <div
      aria-hidden={state !== "active"}
      className={cn(
        "ws-scene",
        state === "active" && "ws-scene-active",
        state === "past" && "ws-scene-past",
      )}
    >
      {children}
    </div>
  );
}
