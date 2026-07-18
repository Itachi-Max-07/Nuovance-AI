"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import type { HeroWorkflowNode } from "@/lib/content";
import ConnectionLine, { type ConnectionGeometry } from "./ConnectionLine";
import Particle from "./Particle";
import WorkflowNode from "./WorkflowNode";
import {
  CANVAS_DELAY,
  connectionDrawDelay,
  flowStart,
  nodeEntranceDelay,
  nodeVariants,
} from "./Animations";

interface WorkflowCanvasProps {
  nodes: HeroWorkflowNode[];
  caption: string;
  captionStatus: string;
  ariaLabel: string;
}

/* ---- Stage geometry (design coordinates; the stage scales as one unit) ---- */

const STAGE_W = 580;
const STAGE_H = 806;
const NODE_W = 236;
const NODE_W_HIGHLIGHT = 252;

/** Hand-tuned staggered layout — an editorial zigzag, not a dashboard grid. */
const NODE_LAYOUT: { x: number; y: number }[] = [
  { x: 16, y: 0 }, // Apollo.io
  { x: 330, y: 96 }, // NeverBounce
  { x: 20, y: 214 }, // Clay
  { x: 312, y: 330 }, // GPT-5.5
  { x: 16, y: 452 }, // Smartlead
  { x: 330, y: 568 }, // HubSpot
  { x: 64, y: 688 }, // Slack
];

/** Ports sit on the cards' side edges at fixed offsets from the card top,
    so connection geometry stays correct regardless of exact card heights. */
const PORT_OUT_Y = 78;
const PORT_IN_Y = 34;
const CURVE_REACH = 48;

/** Below this wrapper width the scaled stage becomes unreadable — switch to
    the stacked mobile flow instead. */
const COMPACT_BREAKPOINT = 480;

function nodeWidth(node: HeroWorkflowNode): number {
  return node.highlight ? NODE_W_HIGHLIGHT : NODE_W;
}

function buildConnections(nodes: HeroWorkflowNode[]): ConnectionGeometry[] {
  const connections: ConnectionGeometry[] = [];
  for (let i = 0; i < Math.min(nodes.length, NODE_LAYOUT.length) - 1; i += 1) {
    const source = NODE_LAYOUT[i];
    const target = NODE_LAYOUT[i + 1];
    const targetIsRight = target.x > source.x;
    const from = {
      x: targetIsRight ? source.x + nodeWidth(nodes[i]) : source.x,
      y: source.y + PORT_OUT_Y,
    };
    const to = {
      x: targetIsRight ? target.x : target.x + nodeWidth(nodes[i + 1]),
      y: target.y + PORT_IN_Y,
    };
    const c1x = from.x + (targetIsRight ? CURVE_REACH : -CURVE_REACH);
    const c2x = to.x + (targetIsRight ? -CURVE_REACH : CURVE_REACH);
    connections.push({
      d: `M ${from.x} ${from.y} C ${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x} ${to.y}`,
      from,
      to,
    });
  }
  return connections;
}

/**
 * The hero visual: a floating n8n-style workflow running in real time.
 * Fixed design coordinates scaled as a single GPU layer, so curves, ports
 * and cards stay pixel-aligned at every viewport size.
 */
export default function WorkflowCanvas({
  nodes,
  caption,
  captionStatus,
  ariaLabel,
}: WorkflowCanvasProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const finePointer = useRef(false);

  // Subtle mouse parallax: spring-smoothed so it has momentum, never snaps.
  const parallaxX = useSpring(0, { stiffness: 50, damping: 16 });
  const parallaxY = useSpring(0, { stiffness: 50, damping: 16 });

  useEffect(() => {
    finePointer.current = window.matchMedia("(pointer: fine)").matches;
    const element = wrapperRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      setWrapperWidth(entries[0].contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!finePointer.current || shouldReduceMotion) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    parallaxX.set(((event.clientX - rect.left) / rect.width - 0.5) * 14);
    parallaxY.set(((event.clientY - rect.top) / rect.height - 0.5) * 10);
  };

  const handlePointerLeave = () => {
    parallaxX.set(0);
    parallaxY.set(0);
  };

  const connections = buildConnections(nodes);
  const particleStart = flowStart(nodes.length);
  const scale = wrapperWidth ? Math.min(wrapperWidth / STAGE_W, 1.04) : 1;
  const isCompact = wrapperWidth !== null && wrapperWidth < COMPACT_BREAKPOINT;

  return (
    <div
      ref={wrapperRef}
      role="group"
      aria-label={ariaLabel}
      className="relative w-full"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {wrapperWidth === null ? (
        // Reserve the stage footprint until the first measurement lands.
        <div style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }} />
      ) : isCompact ? (
        <div className="flex flex-col items-center">
          {nodes.map((node, index) => (
            <Fragment key={node.id}>
              {index > 0 && (
                <div
                  aria-hidden="true"
                  className="relative h-7 w-px bg-brand-accent/25"
                >
                  {!shouldReduceMotion && (
                    <span
                      className="hero-flow-y absolute -left-0.5 top-0 h-[5px] w-[5px] rounded-full bg-brand-accent"
                      style={{ animationDelay: `${(index % 4) * 0.45}s` }}
                    />
                  )}
                </div>
              )}
              <WorkflowNode
                node={node}
                index={index}
                entranceDelay={0.1}
                reducedMotion={shouldReduceMotion}
                className="w-full max-w-xs"
              />
            </Fragment>
          ))}
        </div>
      ) : (
        <div
          className="relative mx-auto"
          style={{ width: STAGE_W * scale, height: STAGE_H * scale }}
        >
          <motion.div style={{ x: parallaxX, y: parallaxY }}>
            <div
              className="relative"
              style={{
                width: STAGE_W,
                height: STAGE_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <svg
                aria-hidden="true"
                className="absolute inset-0"
                width={STAGE_W}
                height={STAGE_H}
                viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
                fill="none"
              >
                {connections.map((connection, index) => (
                  <ConnectionLine
                    key={index}
                    connection={connection}
                    drawDelay={connectionDrawDelay(index)}
                    active={hoveredIndex === index || hoveredIndex === index + 1}
                    reducedMotion={shouldReduceMotion}
                  />
                ))}
                {!shouldReduceMotion &&
                  connections.map((connection, index) => (
                    <Fragment key={index}>
                      <Particle
                        path={connection.d}
                        beginSeconds={particleStart + index * 0.3}
                        durationSeconds={2.2}
                      />
                      <Particle
                        path={connection.d}
                        beginSeconds={particleStart + index * 0.3 + 1.1}
                        durationSeconds={2.2}
                      />
                    </Fragment>
                  ))}
              </svg>

              {nodes.map((node, index) => {
                const layout = NODE_LAYOUT[index];
                if (!layout) return null;
                return (
                  <WorkflowNode
                    key={node.id}
                    node={node}
                    index={index}
                    entranceDelay={nodeEntranceDelay(index)}
                    reducedMotion={shouldReduceMotion}
                    floating
                    onHoverChange={setHoveredIndex}
                    className="absolute"
                    style={{
                      left: layout.x,
                      top: layout.y,
                      width: nodeWidth(node),
                    }}
                  />
                );
              })}

              {/* Floating caption chip — names the story the canvas tells. */}
              <motion.div
                className="absolute right-0 top-2"
                variants={nodeVariants(shouldReduceMotion)}
                custom={CANVAS_DELAY - 0.2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="flex items-center gap-2 rounded-full border-2 border-brand-ink bg-brand-card px-3.5 py-1.5 shadow-brutal-sm">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="hero-pulse-ring absolute inline-flex h-full w-full rounded-full bg-brand-green" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-green" />
                  </span>
                  <span className="text-2xs font-medium text-brand-body">
                    {caption}
                  </span>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-brand-green">
                    {captionStatus}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
