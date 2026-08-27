// scripts/build-knowledge.mjs
//
// Build-time knowledge extraction for the chat widget.
//
// Walks the App Router tree, works out which copy each route actually renders,
// and writes content/knowledge.ts as a single default-exported string.
//
// This site keeps ZERO literal copy in its page files — every page is a thin
// frame over two sources:
//   1. src/lib/content.ts  — ~40 exported consts of pure literal data
//   2. content/**/*.mdx    — blog, case studies, legal
// So we import both directly rather than regex-stripping JSX: lossless, and it
// survives markup changes. The JSX tag-stripper below is only a fallback for a
// future page that hardcodes copy inline.
//
// content.ts is TypeScript and this file is .mjs, so we transpile it with the
// `typescript` package that's already a devDependency — no new loader needed.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const APP_DIR = ["src/app", "app"]
  .map((dir) => path.join(ROOT, dir))
  .find((dir) => fs.existsSync(dir));

const CONTENT_TS = ["src/lib/content.ts", "lib/content.ts"]
  .map((file) => path.join(ROOT, file))
  .find((file) => fs.existsSync(file));

const MDX_ROOT = path.join(ROOT, "content");
const OUT_FILE = path.join(MDX_ROOT, "knowledge.ts");
const CACHE_DIR = path.join(ROOT, "node_modules", ".cache", "nuovance-knowledge");

/* ------------------------------------------------------------------ *
 * 0. Exclusions — what never reaches the knowledge base
 * ------------------------------------------------------------------ */

// Legal copy is deliberately omitted. It is long (the privacy policy alone is
// ~47k chars, several times the rest of the site combined), it ships on EVERY
// chat request, and a paraphrased answer about data handling is worse than no
// answer — the route handler's system prompt tells the assistant to point at
// the page instead. Add a route here to drop that page's copy.
const EXCLUDED_ROUTES = new Set([
  "/privacy",
  "/terms",
  "/cookies",
]);

// content/<type>/*.mdx collections dropped wholesale, wherever they surface —
// so a new legal document is out by default, not out only if someone
// remembers to add its route above.
const EXCLUDED_MDX_TYPES = new Set(["legal"]);

/* ------------------------------------------------------------------ *
 * 1. Route discovery
 * ------------------------------------------------------------------ */

// api/ has no copy, _private dirs are conventionally excluded from routing,
// and (groups) don't contribute a URL segment.
const isRouteGroup = (name) => name.startsWith("(") && name.endsWith(")");
const isSkippedDir = (name) => name === "api" || name.startsWith("_");

/** Every page.tsx / page.mdx under the app dir, with its URL path. */
function findRoutes(dir, segments = []) {
  const routes = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (isSkippedDir(entry.name)) continue;
      const nextSegments = isRouteGroup(entry.name)
        ? segments
        : [...segments, entry.name];
      routes.push(...findRoutes(path.join(dir, entry.name), nextSegments));
      continue;
    }

    if (/^page\.(tsx|jsx|ts|js|mdx)$/.test(entry.name)) {
      routes.push({
        route: `/${segments.join("/")}`.replace(/\/+$/, "") || "/",
        file: path.join(dir, entry.name),
        segments,
      });
    }
  }

  return routes;
}

/** Layouts wrapping a page, outermost first — their copy renders on the route too. */
function ancestorLayouts(pageFile) {
  const layouts = [];
  let dir = path.dirname(pageFile);

  while (dir.startsWith(APP_DIR)) {
    for (const name of ["layout.tsx", "layout.jsx", "layout.ts", "layout.js"]) {
      const candidate = path.join(dir, name);
      if (fs.existsSync(candidate)) layouts.unshift(candidate);
    }
    if (dir === APP_DIR) break;
    dir = path.dirname(dir);
  }

  return layouts;
}

/* ------------------------------------------------------------------ *
 * 2. Import graph — which content.ts exports does a route really render?
 * ------------------------------------------------------------------ */

const IMPORT_RE = /import\s+(?:type\s+)?([^;'"]*?)\s*from\s*["']([^"']+)["']/g;
const RESOLVE_EXTS = [".tsx", ".ts", ".jsx", ".js", ".mdx"];

function resolveLocal(spec, fromFile) {
  let base;
  if (spec.startsWith("@/")) base = path.join(ROOT, "src", spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return null; // bare package — not ours to walk

  for (const ext of RESOLVE_EXTS) {
    if (fs.existsSync(base + ext)) return base + ext;
  }
  for (const ext of RESOLVE_EXTS) {
    const indexed = path.join(base, `index${ext}`);
    if (fs.existsSync(indexed)) return indexed;
  }
  return fs.existsSync(base) && fs.statSync(base).isFile() ? base : null;
}

/** Named bindings out of an import clause: `A, { b, c as d }` -> ["b", "c"]. */
function namedBindings(clause) {
  const braces = clause.match(/\{([\s\S]*)\}/);
  if (!braces) return [];
  return braces[1]
    .split(",")
    .map((part) => part.trim().split(/\s+as\s+/)[0].trim())
    .filter(Boolean);
}

const CONTENT_SPECIFIERS = new Set(["@/lib/content", "@/lib/content.ts"]);

/**
 * Breadth-first walk of a route's module tree. Returns the content.ts exports
 * it pulls in, the MDX content types it loads, and the files visited (so the
 * JSX fallback knows what to scrape).
 */
function analyzeRoute(entryFiles) {
  const contentExports = new Set();
  const mdxTypes = new Set();
  const visited = new Set();
  const queue = [...entryFiles];

  while (queue.length) {
    const file = queue.shift();
    if (!file || visited.has(file)) continue;
    visited.add(file);

    const source = fs.readFileSync(file, "utf8");

    // getPost("blog", …) / getAllPosts("case-studies") tell us which MDX
    // collection this route renders.
    for (const match of source.matchAll(
      /\b(?:getPost|getAllPosts|getSlugs|getPublishedSlugs)\(\s*["']([a-z-]+)["']/g,
    )) {
      mdxTypes.add(match[1]);
    }

    for (const match of source.matchAll(IMPORT_RE)) {
      const [, clause, spec] = match;

      if (CONTENT_SPECIFIERS.has(spec)) {
        for (const name of namedBindings(clause)) contentExports.add(name);
        continue;
      }

      const resolved = resolveLocal(spec, file);
      if (resolved && !visited.has(resolved)) queue.push(resolved);
    }
  }

  return { contentExports, mdxTypes, visited };
}

/* ------------------------------------------------------------------ *
 * 3. Load content.ts for real (transpile -> dynamic import)
 * ------------------------------------------------------------------ */

async function loadContentModule() {
  if (!CONTENT_TS) return {};

  const js = ts.transpileModule(fs.readFileSync(CONTENT_TS, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      isolatedModules: true,
    },
  }).outputText;

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const cached = path.join(CACHE_DIR, "content.mjs");
  fs.writeFileSync(cached, js, "utf8");

  // Cache-bust so repeated runs in one process pick up edits.
  return import(`${pathToFileURL(cached).href}?v=${Date.now()}`);
}

/* ------------------------------------------------------------------ *
 * 4. Turn content values into readable lines
 * ------------------------------------------------------------------ */

// Keys holding assets, routing, or render hints rather than prose.
const SKIP_KEYS = new Set([
  "src", "href", "url", "logo", "photo", "icon", "className",
  "id", "x", "y", "variable", "cover", "tone", "color", "delay",
]);

// Asset paths, links, and hex colours — never prose. Emails and plain text stay.
const SKIP_VALUE = /^(?:https?:\/\/|\/|\.\/|mailto:|tel:|#[0-9a-fA-F]{3,8}$|data:)/;

const label = (key) =>
  key ? key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase() : "";

function flatten(value, lines, key = "", depth = 0) {
  if (value === null || value === undefined) return;
  if (depth > 6) return;

  if (typeof value === "string") {
    const text = value.trim();
    if (!text || SKIP_VALUE.test(text)) return;
    lines.push(key ? `${label(key)}: ${text}` : `- ${text}`);
    return;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    if (key) lines.push(`${label(key)}: ${value}`);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) flatten(item, lines, "", depth + 1);
    return;
  }

  if (typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      if (SKIP_KEYS.has(childKey)) continue;
      flatten(childValue, lines, childKey, depth + 1);
    }
  }
}

// The assistant's own chrome (button labels, placeholder, canned suggestions)
// is UI, not site copy — feeding it back to the bot is noise.
const EXCLUDED_EXPORTS = new Set(["chatWidget"]);

function renderExport(name, value) {
  if (EXCLUDED_EXPORTS.has(name)) return null;
  const lines = [];
  flatten(value, lines);
  if (!lines.length) return null;
  return `### ${label(name)}\n${lines.join("\n")}`;
}

/* ------------------------------------------------------------------ *
 * 5. MDX -> plain text
 * ------------------------------------------------------------------ */

// The knowledge base ships on EVERY chat request, so one long document can
// dominate the prompt. Bodies used to be truncated at 6k chars, but the only
// document that ever hit that ceiling was the privacy policy, and that is now
// excluded outright — so documents ship whole and the build warns rather than
// cutting silently. If the warning fires, exclude the route or split the doc.
const OVERSIZE_DOC_CHARS = 6000;

function mdxToText(body) {
  return body
    .replace(/```[\s\S]*?```/g, "")            // fenced code
    .replace(/^\s*(?:import|export)\s+[^\n]*$/gm, "") // MDX module scope
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")      // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")   // links -> label
    .replace(/<[^>]+>/g, "")                   // JSX / HTML tags
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")        // heading markers
    .replace(/^\s{0,3}>\s?/gm, "")             // blockquotes
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")        // horizontal rules
    .replace(/(\*\*|__|\*|_|`)/g, "")          // emphasis / inline code
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function readMdxDocs(type) {
  const dir = path.join(MDX_ROOT, type);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return { slug, meta: data ?? {}, text: mdxToText(content) };
    })
    .filter((doc) => doc.text.length > 0);
}

function renderMdxDoc(doc) {
  const lines = [];
  const { meta } = doc;

  if (meta.title) lines.push(`title: ${meta.title}`);
  if (meta.description) lines.push(`description: ${meta.description}`);
  if (meta.client) lines.push(`client: ${meta.client}`);
  if (meta.industry) lines.push(`industry: ${meta.industry}`);
  if (Array.isArray(meta.services) && meta.services.length) {
    lines.push(`services: ${meta.services.join(", ")}`);
  }
  if (Array.isArray(meta.tags) && meta.tags.length) {
    lines.push(`tags: ${meta.tags.join(", ")}`);
  }
  if (Array.isArray(meta.results)) {
    for (const result of meta.results) {
      if (result?.label && result?.value) lines.push(`${result.label}: ${result.value}`);
    }
  }

  return `${lines.join("\n")}\n\n${doc.text}`.trim();
}

/* ------------------------------------------------------------------ *
 * 6. Fallback: strip inline JSX
 * ------------------------------------------------------------------ *
 * Only used when a route's module tree yields no content.ts exports and no
 * MDX — i.e. someone hardcoded copy into a page. Attribute VALUES for
 * className/href/src/alt are removed before tags, so utility classes never
 * leak into the knowledge base.
 */
function stripJsx(source) {
  const returned = source.match(/return\s*\(([\s\S]*)\);?\s*}\s*$/);
  let jsx = returned ? returned[1] : source;

  jsx = jsx
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")                       // JSX comments
    .replace(/\b(?:className|href|src|alt)\s*=\s*\{[^}]*\}/g, "") // attr values first
    .replace(/\b(?:className|href|src|alt)\s*=\s*"[^"]*"/g, "")
    .replace(/\b(?:className|href|src|alt)\s*=\s*'[^']*'/g, "")
    .replace(/<[^>]*>/g, "\n")                                   // then tags
    .replace(/\{[^{}]*\}/g, "")                                  // leftover expressions
    .replace(/&nbsp;|&amp;|&mdash;/g, " ");

  return jsx
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 1 && /[a-zA-Z]/.test(line))
    .join("\n")
    .trim();
}

/* ------------------------------------------------------------------ *
 * 7. Build
 * ------------------------------------------------------------------ */

async function build() {
  if (!APP_DIR) throw new Error("No app/ or src/app/ directory found.");

  const contentModule = await loadContentModule();
  const routes = findRoutes(APP_DIR);

  // Shallow routes first so "/" claims the shared layout + section copy, and
  // deeper routes only contribute what's genuinely theirs.
  routes.sort(
    (a, b) => a.segments.length - b.segments.length || a.route.localeCompare(b.route),
  );

  const analyses = routes.map((route) => ({
    ...route,
    ...analyzeRoute([...ancestorLayouts(route.file), route.file]),
    dynamic: route.segments.some((s) => s.startsWith("[")),
  }));

  // A dynamic route renders one MDX doc per slug, so it owns that collection —
  // its index route must not repeat every body.
  const typesOwnedByDynamicRoutes = new Set(
    analyses.filter((a) => a.dynamic).flatMap((a) => [...a.mdxTypes]),
  );

  // Chunks carry an `excluded` flag instead of being dropped where they are
  // built, so the build can report what the exclusion lists actually cost.
  const chunks = [];
  const claimedExports = new Set(); // first route to render an export wins
  const oversize = []; // shipped whole, but past OVERSIZE_DOC_CHARS — warn

  const noteSize = (route, text) => {
    if (text.length > OVERSIZE_DOC_CHARS) oversize.push({ route, chars: text.length });
  };

  for (const analysis of analyses) {
    const { route, contentExports, mdxTypes, visited, dynamic } = analysis;
    const routeExcluded = EXCLUDED_ROUTES.has(route);

    if (dynamic) {
      // Expand [slug] into a chunk per document.
      for (const type of mdxTypes) {
        for (const doc of readMdxDocs(type)) {
          const docRoute = route.replace(/\[[^\]]+\]/, doc.slug);
          const excluded =
            routeExcluded ||
            EXCLUDED_ROUTES.has(docRoute) ||
            EXCLUDED_MDX_TYPES.has(type);
          const body = renderMdxDoc(doc);
          if (!excluded) noteSize(docRoute, body);
          chunks.push({ route: docRoute, body, excluded });
        }
      }
      continue;
    }

    const sections = [];

    for (const name of contentExports) {
      if (claimedExports.has(name)) continue;
      const rendered = renderExport(name, contentModule[name]);
      if (!rendered) continue;
      // An excluded route reads but never claims: a shared export it happens
      // to import has to stay available to the routes that do ship.
      if (!routeExcluded) claimedExports.add(name);
      sections.push(rendered);
    }

    for (const type of mdxTypes) {
      if (typesOwnedByDynamicRoutes.has(type)) continue;
      for (const doc of readMdxDocs(type)) {
        const body = renderMdxDoc(doc);
        // A dropped collection surfacing on a route that otherwise ships
        // becomes its own excluded chunk, so its cost is still reported.
        if (!routeExcluded && EXCLUDED_MDX_TYPES.has(type)) {
          chunks.push({ route: `${route} (${type}/${doc.slug})`, body, excluded: true });
          continue;
        }
        if (!routeExcluded) noteSize(route, body);
        sections.push(body);
      }
    }

    // Nothing structured here — this page must hold its copy inline.
    if (!sections.length) {
      const inline = stripJsx(fs.readFileSync(analysis.file, "utf8"));
      if (inline) sections.push(inline);
      void visited;
    }

    if (sections.length) {
      chunks.push({ route, body: sections.join("\n\n"), excluded: routeExcluded });
    }
  }

  const serialize = (list) =>
    list.map((chunk) => `## Route: ${chunk.route}\n${chunk.body}`).join("\n\n---\n\n");

  const kept = chunks.filter((chunk) => !chunk.excluded);
  const dropped = chunks.filter((chunk) => chunk.excluded);

  const knowledge = serialize(kept);
  const beforeChars = serialize(chunks).length; // what shipping everything would cost

  fs.mkdirSync(MDX_ROOT, { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    [
      "// AUTO-GENERATED by scripts/build-knowledge.mjs — do not edit.",
      "// Regenerated on every dev/build via the predev/prebuild hooks.",
      "// Gitignored: rebuild with `node scripts/build-knowledge.mjs`.",
      "",
      // A template literal rather than JSON.stringify: the newlines survive
      // into the file, so the extraction stays reviewable in a diff.
      "const knowledge = `" +
        knowledge
          .replace(/\\/g, "\\\\")
          .replace(/`/g, "\\`")
          .replace(/\$\{/g, "\\${") +
        "`;",
      "",
      "export default knowledge;",
      "",
    ].join("\n"),
    "utf8",
  );

  const size = (chars) =>
    `${chars.toLocaleString()} chars · ~${Math.round(chars / 4).toLocaleString()} tokens`;

  for (const { route, chars } of oversize) {
    console.warn(
      `[knowledge] WARNING ${route} is ${chars.toLocaleString()} chars, over the ` +
        `${OVERSIZE_DOC_CHARS.toLocaleString()}-char guideline, and ships whole on every ` +
        `chat request — exclude the route or split the document.`,
    );
  }

  for (const chunk of dropped) {
    console.log(`[knowledge] excluded ${chunk.route} · ${size(chunk.body.length)}`);
  }

  console.log(`[knowledge] before exclusion · ${size(beforeChars)}`);
  console.log(`[knowledge] after  exclusion · ${size(knowledge.length)}`);
  console.log(
    `[knowledge] ${kept.length} chunks from ${routes.length} routes · ` +
      `${size(knowledge.length)}`,
  );
  console.log(`[knowledge] routes: ${kept.map((chunk) => chunk.route).join(", ")}`);
  console.log(`[knowledge] wrote ${path.relative(ROOT, OUT_FILE)}`);
}

build().catch((error) => {
  console.error("[knowledge] extraction failed:", error);
  process.exit(1);
});
