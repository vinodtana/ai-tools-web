import { useEffect } from "react";
import {
  SITE_NAME,
  SITE_NAME_SHORT,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  buildCanonical,
  SITE_TAGLINE,
} from "@/lib/seo";

type JsonLdInput =
  | Record<string, unknown>
  | Array<Record<string, unknown>>
  | null
  | undefined;

const SCRIPT_ID_PREFIX = "seo-jsonld-";

function cleanupJsonLdScripts(ids: string[]): void {
  if (typeof document === "undefined") return;
  const all = Array.from(document.head.querySelectorAll<HTMLScriptElement>('script[data-seo-jsonld="true"]'));
  all.forEach((s) => {
    const owned = ids.some((id) => s.id === SCRIPT_ID_PREFIX + id);
    if (owned) s.remove();
  });
}

function insertJsonLd(
  id: string,
  data: Record<string, unknown> | Array<Record<string, unknown>>,
): void {
  if (typeof document === "undefined") return;
  const scriptId = SCRIPT_ID_PREFIX + id;
  let el = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = scriptId;
    el.type = "application/ld+json";
    el.setAttribute("data-seo-jsonld", "true");
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function JsonLd({
  id,
  data,
}: {
  id: string;
  data: JsonLdInput;
}): null {
  useEffect(() => {
    if (!data || !id) return;
    insertJsonLd(id, data as Record<string, unknown>);
    return () => {
      // No-op removal; next render overwrites. Keep deterministic cleanup on unmount.
      cleanupJsonLdScripts([id]);
    };
  }, [id, JSON.stringify(data)]);
  return null;
}

export type OrganizationLdProps = {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactEmail?: string;
  dateFounded?: string;
};

export function buildOrganizationLd({
  name = SITE_NAME,
  url = SITE_URL,
  logo = DEFAULT_OG_IMAGE,
  description = `${SITE_NAME_SHORT} - ${SITE_TAGLINE}`,
  sameAs = [],
  contactEmail,
  dateFounded,
}: OrganizationLdProps = {}): Record<string, unknown> {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    alternateName: SITE_NAME_SHORT,
    url,
    logo,
    description,
  };
  if (sameAs && sameAs.length > 0) base.sameAs = sameAs;
  if (dateFounded) base.foundingDate = dateFounded;
  if (contactEmail) {
    base.contactPoint = [
      {
        "@type": "ContactPoint",
        email: contactEmail,
        contactType: "customer support",
        availableLanguage: ["English"],
      },
    ];
  }
  return base;
}

export type WebSiteLdProps = {
  name?: string;
  url?: string;
  description?: string;
  inLanguage?: string;
  searchUrlPath?: string;
  searchParamName?: string;
};

export function buildWebSiteLd({
  name = SITE_NAME,
  url = SITE_URL,
  description = `${SITE_NAME_SHORT} - ${SITE_TAGLINE}`,
  inLanguage = "en",
  searchUrlPath = "/ai-tools",
  searchParamName = "search",
}: WebSiteLdProps = {}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    inLanguage,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}${searchUrlPath}?${searchParamName}={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export type BreadcrumbItem = { label: string; path?: string; name?: string };

export function buildBreadcrumbListLd(
  items: BreadcrumbItem[],
  { baseUrl = SITE_URL }: { baseUrl?: string } = {},
): Record<string, unknown> {
  const itemListElement = items
    .filter((i) => i)
    .map((i, idx) => {
      const name = i.label || i.name || "";
      const item = i.path ? buildCanonical(i.path) : undefined;
      const e: Record<string, unknown> = {
        "@type": "ListItem",
        position: idx + 1,
        name,
      };
      if (item) e.item = item;
      return e;
    });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

export type ItemListEntry = {
  position: number;
  name: string;
  url?: string;
  image?: string;
  description?: string;
  type?: string;
};

export function buildItemListLd(
  items: ItemListEntry[],
  opts: { itemListType?: string; name?: string; description?: string; url?: string } = {},
): Record<string, unknown> {
  const mainEntity: Record<string, unknown> = items.map((i) => {
    const entry: Record<string, unknown> = {
      "@type": i.type || "ListItem",
      position: i.position,
      name: i.name,
    };
    if (i.url) entry.url = i.url;
    if (i.image) entry.image = i.image;
    if (i.description) entry.description = i.description;
    if (i.type && i.type !== "ListItem") entry["@type"] = i.type;
    return entry;
  });
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": opts?.itemListType || "ItemList",
    mainEntity,
    numberOfItems: items.length,
  };
  if (opts?.name) ld.name = opts.name;
  if (opts?.description) ld.description = opts.description;
  if (opts?.url) ld.url = opts.url;
  return ld;
}

export type CollectionPageLdProps = {
  name: string;
  description: string;
  url: string;
  items: ItemListEntry[];
  breadcrumb?: BreadcrumbItem[];
  image?: string;
  inLanguage?: string;
  dateModified?: string;
};

export function buildCollectionPageLd({
  name,
  description,
  url,
  items,
  breadcrumb,
  image = DEFAULT_OG_IMAGE,
  inLanguage = "en",
  dateModified,
}: CollectionPageLdProps): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    image,
    inLanguage,
    ...(dateModified ? { dateModified } : {}),
    mainEntity: buildItemListLd(items, {
      itemListType: "ItemList",
      name,
      description,
      url,
    }),
    breadcrumb: breadcrumb ? buildBreadcrumbListLd(breadcrumb).itemListElement : undefined,
  };
}

export type SoftwareApplicationLdProps = {
  name: string;
  description: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price?: number | string;
    priceCurrency?: string;
    availability?: string;
  } | null;
  aggregateRating?: {
    ratingValue: number | string;
    ratingCount: number | string;
  } | null;
  image?: string | null;
  featureList?: Array<string | null | undefined>;
  keywords?: string[];
  softwareVersion?: string | null;
  dateModified?: string | null;
  inLanguage?: string;
  sameAs?: string[];
  author?: string;
};

export function buildSoftwareApplicationLd({
  name,
  description,
  url,
  applicationCategory = "AIApplication",
  operatingSystem = "Web, iOS, Android, Windows, macOS",
  offers,
  aggregateRating,
  image,
  featureList = [],
  keywords = [],
  softwareVersion,
  dateModified,
  inLanguage = "en",
  sameAs = [],
  author,
}: SoftwareApplicationLdProps): Record<string, unknown> {
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory,
    operatingSystem,
    inLanguage,
  };
  if (url) ld.url = url;
  if (image) ld.image = image;
  if (softwareVersion) ld.softwareVersion = softwareVersion;
  if (dateModified) ld.dateModified = dateModified;
  if (author) ld.author = { "@type": "Organization", name: author };
  if (featureList && featureList.filter(Boolean).length > 0) {
    ld.featureList = featureList.filter((f): f is string =>
      typeof f === "string" && f.trim().length > 0,
    );
  }
  if (keywords && keywords.length > 0) {
    ld.keywords = keywords.filter(Boolean).join(", ");
  }
  if (sameAs && sameAs.length > 0) ld.sameAs = sameAs;
  if (offers) {
    ld.offers = [
      {
        "@type": "Offer",
        priceCurrency: offers.priceCurrency || "USD",
        availability:
          offers.availability ||
          "https://schema.org/InStock",
        ...(offers.price != null && offers.price !== ""
          ? { price: String(offers.price) }
          : { price: "0" }),
      },
    ];
  }
  if (aggregateRating) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(aggregateRating.ratingValue || "0"),
      ratingCount: String(aggregateRating.ratingCount || "1"),
      bestRating: "5",
      worstRating: "1",
    };
  }
  return ld;
}

export type ArticleLdProps = {
  headline: string;
  description: string;
  url: string;
  image?: string | null;
  author?: { name: string; url?: string } | string;
  publisherName?: string;
  publisherLogo?: string;
  datePublished?: string | null;
  dateModified?: string | null;
  articleBody?: string | null;
  articleSection?: string | null;
  keywords?: string[];
  mainEntityOfPage?: boolean;
};

export function buildArticleLd({
  headline,
  description,
  url,
  image = DEFAULT_OG_IMAGE,
  author,
  publisherName = SITE_NAME,
  publisherLogo = DEFAULT_OG_IMAGE,
  datePublished,
  dateModified,
  articleBody,
  articleSection,
  keywords = [],
  mainEntityOfPage = true,
}: ArticleLdProps): Record<string, unknown> {
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: { "@type": "ImageObject", url: publisherLogo },
    },
  };
  if (mainEntityOfPage) ld.mainEntityOfPage = url;
  if (image) ld.image = Array.isArray(image) ? image : [image];
  if (author) {
    if (typeof author === "string") {
      ld.author = { "@type": "Person", name: author };
    } else {
      ld.author = {
        "@type": "Person",
        name: author.name,
        ...(author.url ? { url: author.url } : {}),
      };
    }
  }
  if (datePublished) ld.datePublished = datePublished;
  if (dateModified) ld.dateModified = dateModified;
  if (articleBody) ld.articleBody = articleBody;
  if (articleSection) ld.articleSection = articleSection;
  if (keywords && keywords.length > 0) ld.keywords = keywords.join(", ");
  return ld;
}

export default JsonLd;
