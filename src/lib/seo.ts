export const SITE_URL = "https://www.topaitools.ai";
export const SITE_NAME = "TopAITools.ai";
export const SITE_NAME_SHORT = "TopAI Tools";
export const DEFAULT_OG_IMAGE =
  "https://topaitools-images.s3.ap-south-1.amazonaws.com/1756730968109_topaitoolspng";
export const DEFAULT_TWITTER_IMAGE =
  "https://topaitools-images.s3.ap-south-1.amazonaws.com/1756730968109_topaitoolspng";
export const DEFAULT_AUTHOR = "TopAITools.ai Team";
export const DEFAULT_KEYWORDS =
  "AI tools, AI directory, best AI tools, AI software, AI apps, ChatGPT prompts, AI news, AI articles, AI influencers, artificial intelligence resources, AI productivity tools, free AI tools, AI comparison";
export const DEFAULT_LOCALE = "en_US";
export const SITE_DESCRIPTION =
  "Discover 3000+ curated AI tools, ChatGPT prompts, AI news, expert articles, and influencer insights. Compare features, pricing, and alternatives across every AI category. Trusted by 50K+ AI enthusiasts and professionals.";
export const SITE_TAGLINE = "Discover the Best AI Tools for Every Task";

export function buildCanonical(path: string): string {
  const clean =
    path && typeof path === "string"
      ? path.startsWith("/")
        ? path
        : "/" + path
      : "/";
  return SITE_URL + clean;
}

export function buildAbsoluteUrl(path: string): string {
  return buildCanonical(path);
}

export function truncate(str: string, len: number): string {
  if (!str || typeof str !== "string") return "";
  const clean = str.replace(/\s+/g, " ").trim();
  if (clean.length <= len) return clean;
  return clean.slice(0, len - 1).trimEnd() + "…";
}

export function titleCase(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function slugToLabel(slug: string): string {
  if (!slug) return "";
  return titleCase(String(slug));
}

export function buildTitle(
  titleSegment: string | null | undefined,
  opts?: { includeSite?: boolean; suffix?: string },
): string {
  const include = opts?.includeSite ?? true;
  const suffix = opts?.suffix ?? SITE_TAGLINE;
  const core =
    titleSegment && typeof titleSegment === "string" && titleSegment.trim().length > 0
      ? titleSegment.replace(/\s+/g, " ").trim()
      : "";
  if (!core) return `${SITE_NAME_SHORT} – ${suffix}`;
  return include ? `${core} | ${SITE_NAME}` : core;
}

export function stripHtml(s: string): string {
  if (!s || typeof s !== "string") return "";
  return s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#?[a-z0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function toMetaKeywords(items: Array<string | null | undefined>): string {
  return Array.from(
    new Set(
      items
        .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
        .map((x) => x.trim())
        .filter(Boolean),
    ),
  ).join(", ");
}

export function extractTextFromNode(
  input: unknown,
  fallback = "",
): string {
  if (input == null) return fallback;
  if (typeof input === "string") return stripHtml(input) || fallback;
  if (typeof input === "number" || typeof input === "boolean") return String(input);
  return fallback;
}

export type PricingTier =
  | "Free"
  | "Freemium"
  | "Paid"
  | "Subscription"
  | "Contact for Pricing"
  | "Unknown";

export function classifyPricing(p: unknown): PricingTier {
  if (p == null) return "Unknown";
  const s = String(p).toLowerCase().trim();
  if (!s) return "Unknown";
  if (/free\s*(trial)?\s*only/.test(s) || s === "free") return "Free";
  if (/freemium|free.*paid|has.*free|free.*plan/.test(s)) return "Freemium";
  if (/contact|quote|custom|enterprise/.test(s)) return "Contact for Pricing";
  if (/subscription|monthly|per.*month|per.*seat|saas/.test(s))
    return "Subscription";
  if (/paid|one.?time|purchase|lifetime/.test(s)) return "Paid";
  return "Paid";
}

export function hasFreePlan(p: unknown): boolean {
  const tier = classifyPricing(p);
  return tier === "Free" || tier === "Freemium";
}
