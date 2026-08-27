/* ---------- Unified scroll engine ----------
   One motion curve for every way the page moves: wheel notches, keyboard
   paging, in-page anchor jumps, and the workflow story's step rail. Without
   it each input path rides a different curve — hard native wheel steps, the
   browser's built-in smooth-scroll tween, a GSAP snap — and the page reads as
   several animations stitched together rather than one weighted surface.

   It scrolls the REAL window, never a transformed wrapper, so the sticky
   Navbar, `position: sticky` sections, and the GSAP ScrollTrigger pin in
   WorkflowStory keep working untouched. Touch scrolling is left entirely to
   the OS, which already does this better than any JS loop can.

   IMPORTANT: `html { scroll-behavior: smooth }` must stay OUT of globals.css.
   GSAP writes the viewport scroll through the two-argument
   `window.scrollTo(x, y)`, which obeys that property — so with it set, every
   frame of a ScrollTrigger snap starts a competing native animation and the
   snap rubber-bands. This engine owns anchor easing instead. */

/** Exponential smoothing rate (1/s) for a mouse wheel: weighted and floaty. */
const WHEEL_LAMBDA = 7.5;
/** Trackpads already emit a smooth stream — ease just enough to de-step it. */
const PRECISION_LAMBDA = 18;
/** Keyboard paging sits between the two: deliberate, but never floaty. */
const KEY_LAMBDA = 11;
/** Pixels per wheel "line" for deltaMode 1 (Firefox). Matches Lenis. */
const LINE_HEIGHT = 100 / 3;
/** Below this gap we land exactly on target and shut the loop down. */
const SETTLE_EPSILON = 0.4;
/** Scroll drift (px) that means something other than us moved the page. */
const EXTERNAL_TOLERANCE = 2;
/** Frame delta ceiling, so a backgrounded tab can't teleport the scroll. */
const MAX_FRAME_DELTA = 0.05;
/** Quiet time (ms) that ends one wheel gesture and starts the next. */
const GESTURE_GAP = 120;
/** |delta| under this reads as a trackpad rather than a wheel notch. */
const PRECISION_DELTA = 50;
/** Arrow-key step. Larger than the native ~40px so it glides, not twitches. */
const ARROW_STEP = 90;
/** Page/space keys move this fraction of the viewport, keeping context. */
const PAGE_FACTOR = 0.9;
/** Anchor tween timing: a floor, a per-pixel ramp, and a ceiling (seconds). */
const TWEEN_BASE = 0.28;
const TWEEN_PER_PX = 1 / 3600;
const TWEEN_MIN = 0.45;
const TWEEN_MAX = 1;

type TakeoverListener = () => void;

/* Anything else that drives window scroll (the GSAP snap in WorkflowStory)
   subscribes here, so a fresh user gesture always wins instead of the two
   writers fighting over the scroll position for the rest of a tween. */
const takeoverListeners = new Set<TakeoverListener>();

export function onScrollTakeover(listener: TakeoverListener): () => void {
  takeoverListeners.add(listener);
  return () => {
    takeoverListeners.delete(listener);
  };
}

function announceTakeover(): void {
  takeoverListeners.forEach((listener) => listener());
}

interface Tween {
  from: number;
  elapsed: number;
  duration: number;
}

let attached = false;
let target = 0;
let current = 0;
/** Last position WE wrote, or -1 while idle. */
let applied = -1;
let frameId = 0;
let lastTime = 0;
let lambda = WHEEL_LAMBDA;
/** Non-null while a point-to-point jump owns the loop instead of inertia. */
let tween: Tween | null = null;
let gestureLambda = WHEEL_LAMBDA;
let lastWheelTime = 0;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const maxScroll = (): number =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

/** Calm, symmetric ease for point-to-point jumps (anchors, the step rail). */
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** The Navbar clearance already declared as `scroll-padding-top` in CSS, so
    engine-driven and native anchor jumps land on the same line. */
function anchorOffset(): number {
  const raw = window.getComputedStyle(document.documentElement).scrollPaddingTop;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : 0;
}

/**
 * True when the pointer or focus sits inside a pane that can still scroll
 * itself in this direction (code blocks, overflow tables, the mobile nav
 * sheet) — those keep native scrolling. The cheap scrollHeight test rejects
 * almost every ancestor before the costlier computed-style read.
 */
function ownsScroll(node: EventTarget | null, delta: number): boolean {
  let element = node instanceof Element ? node : null;

  while (element && element !== document.body && element !== document.documentElement) {
    if (element.scrollHeight > element.clientHeight + 1) {
      const overflowY = window.getComputedStyle(element).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        const remaining =
          delta > 0
            ? element.scrollHeight - element.clientHeight - element.scrollTop
            : element.scrollTop;
        if (remaining > 1) return true;
      }
    }
    element = element.parentElement;
  }

  return false;
}

/** Text entry owns its own arrow/space/page keys — never scroll the page. */
function isTypingTarget(node: EventTarget | null): boolean {
  const element = node instanceof Element ? node : null;
  return (
    element?.closest(
      "input, textarea, select, [contenteditable]:not([contenteditable=\"false\"])"
    ) != null
  );
}

function stop(): void {
  if (frameId) cancelAnimationFrame(frameId);
  frameId = 0;
  applied = -1;
  tween = null;
}

function frame(now: number): void {
  const delta = Math.min((now - lastTime) / 1000, MAX_FRAME_DELTA);
  lastTime = now;

  // An unhandled jump, a GSAP tween, or a scrollbar drag has taken over —
  // bow out rather than fight it for the scroll position.
  if (applied >= 0 && Math.abs(window.scrollY - applied) > EXTERNAL_TOLERANCE) {
    stop();
    return;
  }

  // Re-clamp every frame: entrance animations and the GSAP pin spacer change
  // the document height underneath us mid-glide.
  target = clamp(target, 0, maxScroll());

  if (tween) {
    tween.elapsed += delta;
    const t = Math.min(1, tween.elapsed / tween.duration);
    current = tween.from + (target - tween.from) * easeInOutCubic(t);
    if (t >= 1) current = target;
  } else {
    // Frame-rate independent easing: identical feel at 60Hz and 144Hz.
    current += (target - current) * (1 - Math.exp(-lambda * delta));
    if (Math.abs(target - current) < SETTLE_EPSILON) current = target;
  }

  // `instant` cancels any native smooth scroll still in flight.
  window.scrollTo({ top: current, behavior: "instant" });
  applied = current;

  if (current === target) {
    stop();
    return;
  }
  frameId = requestAnimationFrame(frame);
}

/** Adds `delta` px to the live target, easing at `rate`. */
function glideBy(delta: number, rate: number): void {
  announceTakeover();

  // Starting cold, or stealing the page back from an anchor tween: adopt
  // wherever the page actually sits so the glide never jumps. Mid-glide we
  // stack onto the existing target instead, so a fast flick accumulates its
  // full distance rather than restarting from wherever the last frame landed.
  if (!frameId || tween) {
    stop();
    current = window.scrollY;
    target = current;
    lastTime = performance.now();
  }

  lambda = rate;
  target = clamp(target + delta, 0, maxScroll());
  if (!frameId) frameId = requestAnimationFrame(frame);
}

/**
 * Eases the window to an absolute offset on the shared curve. Used by anchor
 * links and the workflow story's step rail so every point-to-point jump on
 * the site moves alike. Falls back to an instant jump while the engine is off
 * (reduced motion), which is the correct behaviour there.
 */
export function smoothScrollTo(top: number): void {
  if (!attached) {
    window.scrollTo({ top, behavior: "auto" });
    return;
  }

  announceTakeover();
  stop();

  current = window.scrollY;
  target = clamp(top, 0, maxScroll());
  const distance = Math.abs(target - current);
  if (distance < 1) return;

  tween = {
    from: current,
    elapsed: 0,
    duration: clamp(TWEEN_BASE + distance * TWEEN_PER_PX, TWEEN_MIN, TWEEN_MAX),
  };
  lastTime = performance.now();
  frameId = requestAnimationFrame(frame);
}

function onWheel(event: WheelEvent): void {
  // ctrlKey = pinch-zoom gesture; leave zooming to the browser.
  if (event.defaultPrevented || event.ctrlKey) return;
  if (ownsScroll(event.target, event.deltaY)) return;

  const delta =
    event.deltaMode === 1
      ? event.deltaY * LINE_HEIGHT
      : event.deltaMode === 2
        ? event.deltaY * window.innerHeight
        : event.deltaY;

  event.preventDefault();

  // Classify once per gesture. A trackpad's opening delta is small and often
  // fractional; a wheel notch arrives as one big integer jump. Holding the
  // verdict for the whole gesture stops a fast trackpad swipe — whose later
  // deltas grow wheel-sized — from switching curves mid-flight.
  const now = performance.now();
  if (now - lastWheelTime > GESTURE_GAP) {
    const precise =
      event.deltaMode === 0 &&
      (Math.abs(delta) < PRECISION_DELTA || !Number.isInteger(event.deltaY));
    gestureLambda = precise ? PRECISION_LAMBDA : WHEEL_LAMBDA;
  }
  lastWheelTime = now;

  glideBy(delta, gestureLambda);
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  // Shift pairs with the wheel for horizontal scroll and with keys for text
  // selection; only Shift+Space is ours.
  if (event.shiftKey && event.key !== " ") return;
  if (isTypingTarget(event.target)) return;

  const page = window.innerHeight * PAGE_FACTOR;
  let delta = 0;
  let absolute: number | null = null;

  switch (event.key) {
    case "ArrowDown":
      delta = ARROW_STEP;
      break;
    case "ArrowUp":
      delta = -ARROW_STEP;
      break;
    case "PageDown":
      delta = page;
      break;
    case "PageUp":
      delta = -page;
      break;
    case "Home":
      absolute = 0;
      break;
    case "End":
      absolute = maxScroll();
      break;
    case " ":
      // Space activates a focused button or checkbox first; it only pages the
      // document when nothing focusable owns it.
      if (document.activeElement && document.activeElement !== document.body) return;
      delta = event.shiftKey ? -page : page;
      break;
    default:
      return;
  }

  const direction = absolute === null ? delta : absolute === 0 ? -1 : 1;
  if (ownsScroll(document.activeElement, direction)) return;

  event.preventDefault();
  if (absolute !== null) {
    smoothScrollTo(absolute);
    return;
  }
  glideBy(delta, KEY_LAMBDA);
}

/**
 * Same-page hash links, eased on the shared curve. Runs in the capture phase
 * so `preventDefault` lands before next/link's own handler, which bails on an
 * already-defaulted event — leaving the URL and focus for us to update.
 */
function onClick(event: MouseEvent): void {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const node = event.target instanceof Element ? event.target : null;
  const link = node?.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;
  if (link.hasAttribute("download")) return;
  if (link.target && link.target !== "_self") return;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  if (url.pathname !== window.location.pathname || url.search !== window.location.search) return;
  if (!url.hash || url.hash === "#") return;

  const id = decodeURIComponent(url.hash.slice(1));
  const destination = document.getElementById(id) ?? document.getElementsByName(id)[0];
  if (!destination) return;

  event.preventDefault();
  smoothScrollTo(destination.getBoundingClientRect().top + window.scrollY - anchorOffset());

  // Keep the address bar and keyboard focus in step with the jump the browser
  // would otherwise have made for us.
  window.history.pushState(null, "", url.hash);
  if (!destination.hasAttribute("tabindex")) destination.setAttribute("tabindex", "-1");
  destination.focus({ preventScroll: true });
}

/** Installs the engine; returns the teardown. */
export function startScrollEngine(): () => void {
  attached = true;
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeyDown, { passive: false });
  document.addEventListener("click", onClick, true);

  return () => {
    attached = false;
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("click", onClick, true);
    stop();
  };
}
