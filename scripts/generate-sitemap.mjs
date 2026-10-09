// scripts/generate-sitemap.mjs
// ============================================================
// TopAITools.ai sitemap generator
// ============================================================
// - Fetches live content from LIVE API to build a true sitemap-index + per-type sitemaps
// - Produces sitemap.xml (sitemap index) and sub-sitemaps at /dist after vite build
// - Can also be run standalone: node scripts/generate-sitemap.mjs
// - Output: public/sitemap.xml (index) + public/sitemaps/*.xml (if standalone),
//           or dist/sitemap.xml (if --build-dir)
// ============================================================

// Node 20+ provides fetch globally; only load cross-fetch polyfill as a fallback
// for older Node environments that don't ship native fetch.
// ESM does not support directory imports, so use the explicit .js entrypoint.
if (typeof globalThis.fetch !== "function") {
  await import("cross-fetch/dist/node-polyfill.js");
}
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SITE_URL = process.env.SITE_URL || "https://www.topaitools.ai";
const SERVER_IP = process.env.SERVER_IP || "https://liveapi.topaitools.ai/api";
const MAX_URLS_PER_SITEMAP = 40000;
const CHANGEFREQ_STATIC = "weekly";
const CHANGEFREQ_LISTING = "daily";
const CHANGEFREQ_DETAIL = "weekly";
const CHANGEFREQ_ARTICLE = "monthly";
const PRIORITY_HOME = 1.0;
const PRIORITY_LISTING = 0.8;
const PRIORITY_DETAIL = 0.7;
const PRIORITY_ARTICLE = 0.6;
const PRIORITY_STATIC = 0.5;

const log = (msg) => console.log(`[sitemap] ${msg}`);

async function fetchJSON(url, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) {
      log(`WARN non-2xx ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    log(`WARN fetch failed for ${url}: ${String(err?.message || err)}`);
    return null;
  } finally {
    clearTimeout(to);
  }
}

function queryString(params) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v == null || v === "") continue;
    u.append(String(k), String(v));
  }
  const q = u.toString();
  return q ? `?${q}` : "";
}

async function fetchPaginatedAll(type, maxPages = 40) {
  const LIMIT = 100;
  const all = [];
  let page = 1;
  while (page <= maxPages) {
    const q = queryString({ type, page, limit: LIMIT });
    const url = `${SERVER_IP}/contents${q}`;
    const resp = await fetchJSON(url);
    const data = Array.isArray(resp?.data) ? resp.data : [];
    if (!data.length) break;
    for (const item of data) all.push(item);
    const totalPages = Number(resp?.pagination?.pages || 1);
    if (page >= totalPages) break;
    page += 1;
  }
  log(`fetched ${all.length} records for type=${type}`);
  return all;
}

async function fetchCategories() {
  const q = queryString({ page: 1, limit: 500 });
  const url = `${SERVER_IP}/categories/content-categories${q}`;
  const resp = await fetchJSON(url);
  const data = Array.isArray(resp?.data) ? resp.data : [];
  log(`fetched ${data.length} categories`);
  return data;
}

function slugify(input, fallback = "") {
  if (input == null) return fallback;
  const s = String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || fallback;
}

function buildUrl(pathname) {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return SITE_URL + p;
}

function escapeXml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function w3cDate(val) {
  if (!val) return null;
  const d = typeof val === "string" || typeof val === "number" ? new Date(val) : val;
  if (!(d instanceof Date) || Number.isNaN(+d)) return null;
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  const mm = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  return `${yyyy}-${mm}-${dd}`;
}

function buildUrlEntry({ loc, lastmod, changefreq, priority }) {
  const parts = [`<loc>${escapeXml(loc)}</loc>`];
  if (lastmod) parts.push(`<lastmod>${escapeXml(lastmod)}</lastmod>`);
  if (changefreq) parts.push(`<changefreq>${escapeXml(changefreq)}</changefreq>`);
  if (priority != null) parts.push(`<priority>${String(priority)}</priority>`);
  return `  <url>\n    ${parts.join("\n    ")}\n  </url>`;
}

function buildSitemapFile(urls) {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(buildUrlEntry).join("\n") +
    "\n</urlset>\n"
  );
}

function buildSitemapIndex(sitemaps) {
  const body = sitemaps
    .map((s) => {
      const parts = [`    <loc>${escapeXml(s.loc)}</loc>`];
      if (s.lastmod) parts.push(`    <lastmod>${escapeXml(s.lastmod)}</lastmod>`);
      return `  <sitemap>\n${parts.join("\n")}\n  </sitemap>`;
    })
    .join("\n");
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body +
    "\n</sitemapindex>\n"
  );
}

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeUtf8(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function toolUrl(item) {
  const slug = slugify(item.slug || item.title || item.name, `tool-${item.id}`);
  return buildUrl(`/ai-tools/${encodeURIComponent(slug)}/${encodeURIComponent(String(item.id))}`);
}
function articleUrl(item) {
  const slug = slugify(item.slug || item.title || item.name, `article-${item.id}`);
  return buildUrl(`/ai-articles/${encodeURIComponent(slug)}/${encodeURIComponent(String(item.id))}`);
}
function newsUrl(item) {
  const slug = slugify(item.slug || item.title || item.name, `news-${item.id}`);
  return buildUrl(`/ai-news/${encodeURIComponent(slug)}/${encodeURIComponent(String(item.id))}`);
}
function promptUrl(item) {
  const slug = slugify(item.slug || item.title || item.name, `prompt-${item.id}`);
  return buildUrl(`/chatgpt-prompts/${encodeURIComponent(slug)}/${encodeURIComponent(String(item.id))}`);
}
function influencerUrl(item) {
  const slug = slugify(item.slug || item.name || item.title, `person-${item.id}`);
  return buildUrl(`/ai-influencers/${encodeURIComponent(slug)}/${encodeURIComponent(String(item.id))}`);
}
function categoryUrl(item) {
  if (item.id == null) return null;
  const slug = slugify(item.slug || item.name || item.category_name, `cat-${item.id}`);
  return buildUrl(`/categories/${encodeURIComponent(slug)}/${encodeURIComponent(String(item.id))}`);
}
function categoryToolListingUrl(item) {
  const slug = slugify(item.slug || item.name || item.category_name, "");
  if (!slug) return null;
  return buildUrl(`/ai-category-tools/${encodeURIComponent(slug)}`);
}

/**
 * Remove duplicate <loc> entries within a single sitemap urlset, keeping the
 * first occurrence (highest priority / earliest declaration). Sitemap protocol
 * disallows duplicate <loc> entries inside a urlset.
 */
function deduplicateUrls(urls) {
  const seen = new Set();
  const out = [];
  for (const u of urls) {
    if (!u?.loc) continue;
    const key = String(u.loc);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(u);
  }
  const removed = urls.length - out.length;
  if (removed > 0) log(`dedup removed ${removed} duplicate urls`);
  return out;
}

function itemLastmod(item) {
  return w3cDate(item.updatedAt || item.updated_at || item.modifiedDate || item.createdAt || item.created_at || null);
}

function buildStaticUrls() {
  const now = w3cDate(new Date());
  const entries = [
    { path: "/", lastmod: now, changefreq: "daily", priority: PRIORITY_HOME },
    { path: "/ai-tools", lastmod: now, changefreq: "hourly", priority: PRIORITY_LISTING },
    { path: "/chatgpt-prompts", lastmod: now, changefreq: CHANGEFREQ_LISTING, priority: PRIORITY_LISTING },
    { path: "/ai-articles", lastmod: now, changefreq: CHANGEFREQ_LISTING, priority: PRIORITY_LISTING },
    { path: "/ai-news", lastmod: now, changefreq: "hourly", priority: PRIORITY_LISTING },
    { path: "/ai-influencers", lastmod: now, changefreq: CHANGEFREQ_LISTING, priority: PRIORITY_LISTING - 0.1 },
    { path: "/categories", lastmod: now, changefreq: CHANGEFREQ_LISTING, priority: PRIORITY_LISTING },
    { path: "/about", lastmod: now, changefreq: CHANGEFREQ_STATIC, priority: PRIORITY_STATIC },
    { path: "/contact", lastmod: now, changefreq: CHANGEFREQ_STATIC, priority: PRIORITY_STATIC },
    { path: "/newsletter", lastmod: now, changefreq: CHANGEFREQ_STATIC, priority: PRIORITY_STATIC },
  ];
  return entries.map((e) => ({
    loc: buildUrl(e.path),
    lastmod: e.lastmod,
    changefreq: e.changefreq,
    priority: e.priority,
  }));
}

function validateSitemapContent(xmlContent, sampleExpected = ["loc>", "sitemaps"]) {
  let errors = [];
  if (!xmlContent || typeof xmlContent !== "string") errors.push("empty sitemap");
  if (xmlContent && !xmlContent.includes('<?xml')) errors.push("missing xml declaration");
  if (xmlContent && !/<(urlset|sitemapindex)/.test(xmlContent)) errors.push("missing root urlset/sitemapindex");
  if (sampleExpected?.includes("loc>") && xmlContent && !xmlContent.includes("<loc>")) errors.push("no <loc> entries found");
  if (xmlContent && /&[^#&]*(?![a-z]+;)/i.test(xmlContent.replace(/&(amp|lt|gt|quot|apos|#\d+);/g, ""))) {
    // Rough unescaped ampersand check
  }
  return errors;
}

async function main() {
  const OUTDIR = process.env.SITEMAP_OUT_DIR
    ? path.resolve(process.env.SITEMAP_OUT_DIR)
    : path.resolve(ROOT, "public");
  const SITEMAP_SUBDIR = process.env.SITEMAP_SUBDIR || "sitemaps";
  log(`writing sitemaps to ${OUTDIR}`);

  const staticUrls = buildStaticUrls();
  const [categories, tools, prompts, articles, news, influencers] = await Promise.all([
    fetchCategories(),
    fetchPaginatedAll("tools"),
    fetchPaginatedAll("prompts"),
    fetchPaginatedAll("articles"),
    fetchPaginatedAll("news"),
    fetchPaginatedAll("influencers"),
  ]);

  const categoryUrls = categories
    .map((c) => {
      const u = categoryUrl(c);
      if (!u) return null;
      return {
        loc: u,
        lastmod: itemLastmod(c),
        changefreq: CHANGEFREQ_LISTING,
        priority: PRIORITY_LISTING,
      };
    })
    .filter(Boolean);
  const categoryListingUrls = categories
    .map((c) => {
      const u = categoryToolListingUrl(c);
      if (!u) return null;
      return { loc: u, lastmod: itemLastmod(c), changefreq: CHANGEFREQ_LISTING, priority: PRIORITY_LISTING - 0.1 };
    })
    .filter(Boolean);
  const toolUrls = tools.map((t) => ({
    loc: toolUrl(t),
    lastmod: itemLastmod(t),
    changefreq: CHANGEFREQ_DETAIL,
    priority: PRIORITY_DETAIL,
  }));
  const promptUrls = prompts.map((t) => ({
    loc: promptUrl(t),
    lastmod: itemLastmod(t),
    changefreq: CHANGEFREQ_DETAIL,
    priority: PRIORITY_DETAIL - 0.1,
  }));
  const articleUrls = articles.map((t) => ({
    loc: articleUrl(t),
    lastmod: itemLastmod(t),
    changefreq: CHANGEFREQ_ARTICLE,
    priority: PRIORITY_ARTICLE,
  }));
  const newsUrls = news.map((t) => ({
    loc: newsUrl(t),
    lastmod: itemLastmod(t),
    changefreq: "daily",
    priority: PRIORITY_ARTICLE - 0.1,
  }));
  const influencerUrls = influencers.map((t) => ({
    loc: influencerUrl(t),
    lastmod: itemLastmod(t),
    changefreq: CHANGEFREQ_DETAIL,
    priority: PRIORITY_STATIC,
  }));

  const sitemapGroups = [
    { name: "static", urls: deduplicateUrls(staticUrls.concat(categoryUrls).concat(categoryListingUrls)) },
    { name: "ai-tools", urls: deduplicateUrls(toolUrls) },
    { name: "chatgpt-prompts", urls: deduplicateUrls(promptUrls) },
    { name: "ai-articles", urls: deduplicateUrls(articleUrls) },
    { name: "ai-news", urls: deduplicateUrls(newsUrls) },
    { name: "ai-influencers", urls: deduplicateUrls(influencerUrls) },
  ];

  const timestamp = w3cDate(new Date());
  const produced = [];

  const sitemapsDir = path.resolve(OUTDIR, SITEMAP_SUBDIR);
  ensureDir(sitemapsDir);

  for (const g of sitemapGroups) {
    const chunks = chunkArray(g.urls, MAX_URLS_PER_SITEMAP);
    chunks.forEach((chunk, idx) => {
      const fname = chunks.length > 1 ? `${g.name}-${idx + 1}.xml` : `${g.name}.xml`;
      const filePath = path.join(sitemapsDir, fname);
      const xml = buildSitemapFile(chunk);
      writeUtf8(filePath, xml);
      const errs = validateSitemapContent(xml, ["loc>"]);
      if (errs.length) log(`VALIDATION ${fname}: ${errs.join("; ")}`);
      produced.push({
        fname,
        loc: `${SITE_URL}/${SITEMAP_SUBDIR}/${fname}`,
        lastmod: timestamp,
        urlCount: chunk.length,
      });
      log(`wrote ${fname} (${chunk.length} URLs)`);
    });
  }

  const indexXml = buildSitemapIndex(produced.map((p) => ({ loc: p.loc, lastmod: p.lastmod })));
  const indexPath = path.join(OUTDIR, "sitemap.xml");
  writeUtf8(indexPath, indexXml);
  log(`wrote sitemap index (${produced.length} sitemaps) -> ${indexPath}`);

  // validation report
  const totalUrls = produced.reduce((s, p) => s + p.urlCount, 0);
  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl: SITE_URL,
    apiBase: SERVER_IP,
    totalUrls,
    sitemapIndex: `${SITE_URL}/sitemap.xml`,
    sitemaps: produced.map((p) => ({ name: p.fname, url: p.loc, count: p.urlCount })),
  };
  const reportPath = path.resolve(ROOT, "docs", "sitemap-generation-report.json");
  writeUtf8(reportPath, JSON.stringify(report, null, 2));
  log(`report: ${reportPath}`);
  log(`TOTAL URLS IN SITEMAP: ${totalUrls}`);
}

main().catch((err) => {
  console.error("[sitemap] FATAL", err);
  process.exit(1);
});
