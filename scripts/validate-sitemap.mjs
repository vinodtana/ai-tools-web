// scripts/validate-sitemap.mjs
// ============================================================
// Sitemap + SEO validation helper. Validates:
// 1. sitemap.xml exists and parses as a sitemap index
// 2. Every sub-sitemap loads, parses, and has <loc> entries
// 3. URL entries match preferred canonical host: HTTPS www.topaitools.ai
// 4. No private routes (/login, /profile, /settings) leaked
// 5. No duplicate <loc> entries within a sitemap
// 6. Query-parameter URLs (tracked duplicates) are excluded
// 7. Robots.txt exists and has Sitemap declaration + core crawlers
// 8. llms.txt exists and references canonical host
//
// Does NOT hit network: use `node scripts/validate-sitemap.mjs --http` to do
// a HEAD check on each sampled URL (adds time, optional).
// ============================================================

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HTTP_CHECK = process.argv.includes("--http");

const PREFERRED_HOST = "https://www.topaitools.ai";
const PRIVATE_PATTERNS = [
  /^\/login(\/|$)/,
  /^\/profile(\/|$)/,
  /^\/settings(\/|$)/,
  /^\/api(\/|$)/,
];
const BAD_QUERY = ["utm_", "gclid=", "fbclid=", "msclkid=", "s=", "ref=", "filter=", "sort="];

const issues = [];
const warnings = [];
const infos = [];

function addIssue(msg, level = "ERROR") {
  const line = `[${level}] ${msg}`;
  if (level === "ERROR") issues.push(line);
  else if (level === "WARN") warnings.push(line);
  else infos.push(line);
  console.log(line);
}

function readText(abs) {
  try {
    return fs.readFileSync(abs, "utf8");
  } catch (err) {
    return null;
  }
}

function extractLocEntries(xml) {
  if (!xml) return [];
  const re = /<loc>([^<]+)<\/loc>/g;
  const out = [];
  let m;
  while ((m = re.exec(xml)) != null) out.push(m[1]);
  return out;
}

function validateUrl(u) {
  const errs = [];
  if (!u.startsWith(PREFERRED_HOST)) {
    errs.push(`not canonical host (expected ${PREFERRED_HOST})`);
  }
  try {
    const parsed = new URL(u);
    const p = parsed.pathname;
    for (const pat of PRIVATE_PATTERNS) {
      if (pat.test(p)) errs.push(`private route leaked: ${p}`);
    }
    const q = (parsed.search || "").toLowerCase();
    for (const token of BAD_QUERY) {
      if (q.includes(token.toLowerCase())) {
        errs.push(`disallowed query token: ${token}`);
      }
    }
    if (/\s/.test(u)) errs.push("whitespace in URL");
    if (!/^https:\/\//i.test(u)) errs.push("not HTTPS");
  } catch (err) {
    errs.push(`invalid URL: ${String(err.message || err)}`);
  }
  return errs;
}

async function headCheck(url, timeout = 3000) {
  if (!HTTP_CHECK) return { ok: true, skipped: true };
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), timeout);
    const res = await fetch(url, { method: "HEAD", signal: ctrl.signal, redirect: "manual" });
    clearTimeout(to);
    const code = res.status;
    if (code >= 400) return { ok: false, code };
    // 2xx, 3xx accepted
    return { ok: true, code };
  } catch (err) {
    return { ok: false, err: String(err?.message || err) };
  }
}

function checkRobotsTxt(dir) {
  const p = path.join(dir, "robots.txt");
  const t = readText(p);
  if (!t) return addIssue("robots.txt MISSING in " + dir);
  addIssue("robots.txt found", "INFO");
  if (!/Sitemap:\s*https:\/\/www\.topaitools\.ai\/sitemap\.xml/i.test(t)) {
    addIssue("robots.txt missing Sitemap: https://www.topaitools.ai/sitemap.xml", "WARN");
  }
  if (!/User-agent:\s*Googlebot/i.test(t)) addIssue("Googlebot not explicitly declared", "WARN");
  if (!/User-agent:\s*Bingbot/i.test(t)) addIssue("Bingbot not explicitly declared", "WARN");
  if (!/User-agent:\s*OAI-SearchBot/i.test(t)) addIssue("OAI-SearchBot (ChatGPT Search) not declared", "WARN");
  if (!/User-agent:\s*PerplexityBot/i.test(t)) addIssue("PerplexityBot not declared", "WARN");
  const claude = /User-agent:\s*Claude-SearchBot[\s\S]{0,500}Allow:\s*\//i.test(t) ||
    /User-agent:\s*Claude-User[\s\S]{0,500}Allow:\s*\//i.test(t);
  if (!claude) addIssue("Claude-SearchBot/Claude-User not declared (AI answer citing)", "WARN");
}

function checkLlmsTxt(dir) {
  const p = path.join(dir, "llms.txt");
  const t = readText(p);
  if (!t) return addIssue("llms.txt missing (optional but recommended)", "WARN");
  addIssue("llms.txt found", "INFO");
  if (!t.includes("https://www.topaitools.ai")) {
    addIssue("llms.txt does not reference canonical https://www.topaitools.ai", "WARN");
  }
  if (!/sitemap\.xml/i.test(t)) {
    addIssue("llms.txt missing reference to sitemap.xml (useful for LLM discovery)", "INFO");
  }
}

async function run() {
  // Check both public/ and dist/ if they exist
  const candidates = [
    path.join(ROOT, "public"),
    path.join(ROOT, "dist"),
  ];
  let sitemapFound = false;
  for (const dir of candidates) {
    if (!fs.existsSync(dir)) continue;
    console.log(`\n=== checking ${path.relative(ROOT, dir) || "./"} ===`);
    checkRobotsTxt(dir);
    checkLlmsTxt(dir);
    const idxPath = path.join(dir, "sitemap.xml");
    const idx = readText(idxPath);
    if (!idx) {
      addIssue(`sitemap.xml missing in ${path.relative(ROOT, dir)}`, "WARN");
      continue;
    }
    sitemapFound = true;
    addIssue("sitemap.xml found", "INFO");
    const sitemapLocs = extractLocEntries(idx);
    if (!sitemapLocs.length) {
      addIssue("sitemap.xml has zero sitemap entries", "ERROR");
      continue;
    }
    addIssue(`sitemap index declares ${sitemapLocs.length} sub-sitemaps`, "INFO");
    const baseDir = dir;
    const sitemapDirs = [path.join(baseDir, "sitemaps")];
    const allUrls = [];
    let urlPerSitemap = 0;
    for (const sl of sitemapLocs) {
      // find local file for this sitemap
      let sub = null;
      for (const d of sitemapDirs) {
        const candidate = path.join(d, sl.split("/").pop());
        const t = readText(candidate);
        if (t) {
          sub = { path: candidate, text: t };
          break;
        }
      }
      const urls = sub ? extractLocEntries(sub.text) : [];
      urlPerSitemap = urls.length;
      addIssue(`${sl.split("/").pop()}: ${urls.length} URLs`, "INFO");
      const seen = new Set();
      for (const u of urls) {
        const errs = validateUrl(u);
        if (errs.length) {
          addIssue(`${u}: ${errs.join("; ")}`, "WARN");
        }
        if (seen.has(u)) addIssue(`duplicate loc: ${u}`, "WARN");
        seen.add(u);
        allUrls.push(u);
      }
      // optional http head spot-check first 5
      if (HTTP_CHECK) {
        for (const u of urls.slice(0, 5)) {
          const r = await headCheck(u);
          if (!r.ok) addIssue(`HEAD fail ${u}: ${r.code || r.err}`, "WARN");
        }
      }
    }
    addIssue(`total URL count across sub-sitemaps: ${allUrls.length}`, "INFO");
    if (!allUrls.length) addIssue("zero URLs discovered across sitemap files", "ERROR");
  }

  // Page templates: ensure core listing routes exist in App.tsx
  const appPath = path.join(ROOT, "src", "App.tsx");
  const appT = readText(appPath);
  if (appT) {
    addIssue("App.tsx route file found", "INFO");
    const required = [
      'path="/"',
      'path="/ai-tools"',
      'path="/ai-tools/:id"',
      'path="/categories"',
      'path="/chatgpt-prompts"',
      'path="/ai-articles"',
      'path="/ai-news"',
      'path="/ai-influencers"',
    ];
    for (const r of required) {
      if (!appT.includes(r)) addIssue(`App.tsx missing route ${r}`, "WARN");
    }
  }

  // SeoHead + JsonLd components exist
  const headP = path.join(ROOT, "src", "components", "SeoHead.tsx");
  if (fs.existsSync(headP)) addIssue("SeoHead.tsx exists (page metadata injector)", "INFO");
  else addIssue("SeoHead.tsx missing", "ERROR");
  const jsonldP = path.join(ROOT, "src", "components", "JsonLd.tsx");
  if (fs.existsSync(jsonldP)) addIssue("JsonLd.tsx exists (structured data)", "INFO");
  else addIssue("JsonLd.tsx missing", "ERROR");

  // Summary
  console.log("\n=== VALIDATION SUMMARY ===");
  console.log(`Errors:   ${issues.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Infos:    ${infos.length}`);
  if (issues.length > 0) process.exit(1);
  process.exit(0);
}

run().catch((err) => {
  console.error("FATAL", err);
  process.exit(2);
});
