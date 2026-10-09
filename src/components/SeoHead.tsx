import { useEffect } from "react";
import {
  buildCanonical,
  buildTitle,
  DEFAULT_AUTHOR,
  DEFAULT_KEYWORDS,
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_IMAGE,
  SITE_NAME,
  stripHtml,
  toMetaKeywords,
  truncate,
} from "@/lib/seo";

export type SeoHeadProps = {
  title?: string | null;
  description?: string | null;
  keywords?: Array<string | null | undefined> | string;
  canonicalPath?: string;
  image?: string | null;
  imageAlt?: string | null;
  type?: "website" | "article" | "profile" | "product";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string | null;
  section?: string | null;
  tags?: Array<string | null | undefined>;
  noindex?: boolean;
  nofollow?: boolean;
  includeSiteInTitle?: boolean;
  twitterHandle?: string | null;
};

type MetaEntry = {
  selector: string;
  attr?: Record<string, string>;
  content?: string | null;
  create?: HTMLElement | null;
};

function upsertMetaTag(
  head: HTMLHeadElement,
  selector: string,
  attrs: Record<string, string>,
  content: string | null | undefined,
  elName = "meta",
): void {
  if (content == null) return;
  const trimmed = String(content).trim();
  if (!trimmed) return;
  let el: Element | null = head.querySelector(selector);
  if (!el) {
    el = document.createElement(elName);
    for (const [k, v] of Object.entries(attrs)) {
      if (v != null) el.setAttribute(k, v);
    }
    head.appendChild(el);
  }
  if (elName === "link" && (attrs as { href?: string }).href == null) {
    el.setAttribute("href", trimmed);
  }
  el.setAttribute("content", trimmed);
}

function upsertLink(
  head: HTMLHeadElement,
  rel: string,
  href: string,
  attrs: Record<string, string> = {},
): void {
  const selector = `link[rel="${rel}"]`;
  let el: Element | null = head.querySelector(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    head.appendChild(el);
  }
  el.setAttribute("href", href);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

export function SeoHead({
  title,
  description,
  keywords,
  canonicalPath,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  noindex = false,
  nofollow = false,
  includeSiteInTitle = true,
  twitterHandle,
}: SeoHeadProps): null {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const head = document.head;

    const finalTitle = buildTitle(title, { includeSite: includeSiteInTitle });
    document.title = finalTitle;

    const desc = truncate(
      stripHtml(description) ||
        "Discover 3000+ curated AI tools, ChatGPT prompts, AI news, expert articles, and AI influencer insights. Compare features and pricing to find the best AI tools for your use case.",
      160,
    );
    const kw = Array.isArray(keywords)
      ? toMetaKeywords([...keywords, DEFAULT_KEYWORDS.split(",")[0]])
      : typeof keywords === "string"
        ? keywords
        : DEFAULT_KEYWORDS;

    const canonical = buildCanonical(
      canonicalPath != null ? canonicalPath : window.location.pathname,
    );

    const ogImage = image && String(image).length > 0 ? image : DEFAULT_OG_IMAGE;
    const twitterImage =
      image && String(image).length > 0 ? image : DEFAULT_TWITTER_IMAGE;
    const ogImageAlt =
      imageAlt && stripHtml(imageAlt).length > 0
        ? stripHtml(imageAlt)
        : `${SITE_NAME} - ${finalTitle}`;

    const robotsDirectives: string[] = [];
    if (noindex) robotsDirectives.push("noindex");
    else robotsDirectives.push("index");
    if (nofollow) robotsDirectives.push("nofollow");
    else robotsDirectives.push("follow");
    robotsDirectives.push("max-snippet:-1", "max-image-preview:large", "max-video-preview:-1");

    const metas: MetaEntry[] = [
      {
        selector: 'meta[name="description"]',
        attr: { name: "description" },
        content: desc,
      },
      {
        selector: 'meta[name="keywords"]',
        attr: { name: "keywords" },
        content: kw,
      },
      {
        selector: 'meta[name="author"]',
        attr: { name: "author" },
        content: author || DEFAULT_AUTHOR,
      },
      {
        selector: 'meta[name="robots"]',
        attr: { name: "robots" },
        content: robotsDirectives.join(", "),
      },
      {
        selector: 'meta[name="googlebot"]',
        attr: { name: "googlebot" },
        content: `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`,
      },
      {
        selector: 'meta[name="bingbot"]',
        attr: { name: "bingbot" },
        content: `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`,
      },
      {
        selector: 'meta[property="og:title"]',
        attr: { property: "og:title" },
        content: finalTitle,
      },
      {
        selector: 'meta[property="og:description"]',
        attr: { property: "og:description" },
        content: desc,
      },
      {
        selector: 'meta[property="og:type"]',
        attr: { property: "og:type" },
        content: type,
      },
      {
        selector: 'meta[property="og:url"]',
        attr: { property: "og:url" },
        content: canonical,
      },
      {
        selector: 'meta[property="og:site_name"]',
        attr: { property: "og:site_name" },
        content: SITE_NAME,
      },
      {
        selector: 'meta[property="og:locale"]',
        attr: { property: "og:locale" },
        content: DEFAULT_LOCALE,
      },
      {
        selector: 'meta[property="og:image"]',
        attr: { property: "og:image" },
        content: ogImage,
      },
      {
        selector: 'meta[property="og:image:alt"]',
        attr: { property: "og:image:alt" },
        content: ogImageAlt,
      },
      {
        selector: 'meta[property="og:image:secure_url"]',
        attr: { property: "og:image:secure_url" },
        content: ogImage,
      },
      {
        selector: 'meta[name="twitter:card"]',
        attr: { name: "twitter:card" },
        content: "summary_large_image",
      },
      {
        selector: 'meta[name="twitter:title"]',
        attr: { name: "twitter:title" },
        content: finalTitle,
      },
      {
        selector: 'meta[name="twitter:description"]',
        attr: { name: "twitter:description" },
        content: desc,
      },
      {
        selector: 'meta[name="twitter:image"]',
        attr: { name: "twitter:image" },
        content: twitterImage,
      },
      {
        selector: 'meta[name="twitter:image:alt"]',
        attr: { name: "twitter:image:alt" },
        content: ogImageAlt,
      },
    ];

    if (twitterHandle) {
      metas.push({
        selector: 'meta[name="twitter:site"]',
        attr: { name: "twitter:site" },
        content: twitterHandle.startsWith("@")
          ? twitterHandle
          : `@${twitterHandle}`,
      });
    }

    if (publishedTime) {
      metas.push({
        selector: 'meta[property="article:published_time"]',
        attr: { property: "article:published_time" },
        content: publishedTime,
      });
    }
    if (modifiedTime) {
      metas.push({
        selector: 'meta[property="article:modified_time"]',
        attr: { property: "article:modified_time" },
        content: modifiedTime,
      });
    }
    if (author) {
      metas.push({
        selector: 'meta[property="article:author"]',
        attr: { property: "article:author" },
        content: author,
      });
    }
    if (section) {
      metas.push({
        selector: 'meta[property="article:section"]',
        attr: { property: "article:section" },
        content: section,
      });
    }
    if (tags && tags.length > 0) {
      const seen = new Set<string>();
      const existingTagEls = Array.from(
        head.querySelectorAll('meta[property="article:tag"]'),
      );
      existingTagEls.forEach((el) => el.remove());
      tags.forEach((t) => {
        if (!t) return;
        const tag = String(t).trim();
        if (!tag || seen.has(tag)) return;
        seen.add(tag);
        const el = document.createElement("meta");
        el.setAttribute("property", "article:tag");
        el.setAttribute("content", tag);
        head.appendChild(el);
      });
    }

    metas.forEach((m) => {
      if (!m.attr || !m.content) return;
      const attrsWithContent = { ...m.attr };
      if (!(attrsWithContent as { name?: string }).name && (attrsWithContent as { property?: string }).property) {
        // keep as-is (OpenGraph uses property)
      }
      upsertMetaTag(head, m.selector, attrsWithContent, m.content);
    });

    upsertLink(head, "canonical", canonical);
    upsertLink(head, "alternate", canonical, { hreflang: "en" });

    return () => {
      // On route change we leave the tags in place because the next SeoHead render
      // on the new route will overwrite them via selectors. Removing on unmount
      // causes a brief flash to empty/default tags before the next render.
    };
  }, [
    title,
    description,
    keywords,
    canonicalPath,
    image,
    imageAlt,
    type,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags?.join(","),
    noindex,
    nofollow,
    includeSiteInTitle,
    twitterHandle,
  ]);

  return null;
}

export default SeoHead;
