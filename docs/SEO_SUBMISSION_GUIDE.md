# TopAITools.ai — SEO Submission & Ownership Verification Guide

Purpose: Step-by-step manual actions for property ownership verification (Google, Bing), sitemap submission, Rich Results testing, Lighthouse performance audits, IndexNow submission, and ongoing SEO health monitoring.

Do not execute these steps against production until:
- §9 deployment in `SEO_IMPLEMENTATION_REPORT.md` is complete.
- CDN redirects are active (http → https, non-www → www → https://www.topaitools.ai).
- URLs `https://www.topaitools.ai/robots.txt`, `https://www.topaitools.ai/sitemap.xml`, `https://www.topaitools.ai/llms.txt` return HTTP 200 with correct Content-Type.

---

## 1. Prerequisites

| Requirement | Where to check |
|-------------|----------------|
| Canonical domain is live | `curl -I https://www.topaitools.ai/` → HTTP 200 |
| Redirects are correct | `curl -I http://www.topaitools.ai/` → **301** → https://www; `curl -I https://topaitools.ai/` → **301** → https://www.topaitools.ai/ |
| 404 works for unknown paths | `curl -I https://www.topaitools.ai/this-does-not-exist-xyz123` → HTTP 404 (not 200) |
| robots.txt accessible | `curl -I https://www.topaitools.ai/robots.txt` → 200 text/plain; content includes `Sitemap: https://www.topaitools.ai/sitemap.xml` |
| Sitemap index accessible | `curl -I https://www.topaitools.ai/sitemap.xml` → 200 application/xml; content contains `<sitemapindex>` |
| All sub-sitemaps resolvable | Visit each sub-sitemap URL in browser, verify XML, check no private paths leaked |
| llms.txt accessible | `curl https://www.topaitools.ai/llms.txt` → includes "Canonical: https://www.topaitools.ai" |
| No secrets exposed | View-source `https://www.topaitools.ai/`. No API keys, tokens, Mixpanel/GA ids are OK (public). |

---

## 2. Google Search Console (GSC) — ownership verification

Preferred: **DNS TXT verification** (survives re-deploys, applies to entire domain + all subdomains + all protocols).

### 2.1 Domain-level DNS TXT verification

1. Login to GSC: https://search.google.com/search-console/ → top left property picker → Add property.
2. Choose the **Domain** card (not URL-prefix).
3. Enter: `topaitools.ai` (no https://, no www.).
4. Copy the generated **DNS TXT record** value: looks like `google-site-verification=xxxxxxxxxxxxxxxxxxxxx`.
5. Login to the **DNS provider for topaitools.ai** (Namecheap / GoDaddy / Cloudflare / Route53).
6. Create a new **TXT record**:
   - Host/Name: `@` (root)
   - Type: `TXT`
   - Value: (paste the full `google-site-verification=…` string)
   - TTL: 300s (short during verification, later 3600s).
7. Wait 2–15 minutes for DNS propagation. Check in terminal: `dig TXT topaitools.ai` → verify the TXT line appears.
8. Return to GSC → **Verify**. Success.

### 2.2 (Backup) URL-prefix + HTML meta tag (only if DNS not possible)

Use the HTML meta verification path provided by GSC:
1. GSC → Add property → URL-prefix → `https://www.topaitools.ai`.
2. Select "HTML tag" method.
3. Copy `<meta name="google-site-verification" content="XXXXX" />`.
4. Inject it into `index.html` `<head>` using an env var (never commit the literal value to public repo).
   - Option A: In Vite build pipeline use `import.meta.env.VITE_GOOGLE_SITE_VERIFICATION` + template placeholder. Or use `sed` in CI just before deploy on built `dist/index.html`.
   - Option B: Upload `googleXXXXXXX.html` verification file into `public/`.

5. Deploy → Verify in GSC.

### 2.3 Submit sitemap to GSC

1. GSC → `topaitools.ai` property → **Sitemaps** (left menu).
2. Under "Add a new sitemap" → enter full URL: `https://www.topaitools.ai/sitemap.xml`
3. Click **Submit**.
4. Wait 5–10 minutes. GSC shows `Couldn't fetch` immediately, then after 1st successful fetch → `Success`.
5. Inspect each sub-sitemap by clicking into the Sitemaps list → verify "URLs discovered per sitemap" numbers look realistic (tools should be largest, static.xml ~size of categories + ~10 public routes).
6. Troubleshooting a fetch error:
   - Open sitemap URL directly in browser (200 OK, xml content-type, valid xmlns).
   - Ensure S3/CDN does **not** block Googlebot IPs.
   - Run `URL Inspection` on sitemap URL → Test Live URL → confirm Googlebot can fetch.
7. Repeat submission only if you regenerate sitemap.xml format (new submissions are optional since Google re-fetches on schedule).

### 2.4 GSC inspections you should run immediately

| Task | Why |
|------|-----|
| **Sitemaps** → check statuses | Confirm sitemap index processed, sub-sitemaps show URLs discovered |
| **Pages → Indexed, not submitted** | Surprises mean internal links crawled pages not in sitemap. Check for leaks. |
| **Pages → Crawled – currently not indexed** | Review. Common early cause: canonical pointing to wrong page or noindex tags. Our SeoHead + validator should have prevented. Investigate any flagged. |
| **Settings → Crawling stats → "Open report"** | Googlebot fetch timings, responses (2xx/3xx/4xx/5xx), file types, host utilization. |
| **URL Inspection → Home URL** → Test live URL → View tested page → HTML rendered title matches new one. | Confirms rendering path. |
| **URL Inspection → 1 tool detail, 1 article, 1 category** | Confirm structured data is found in "Detected structured data" (after indexing, not live test). |

### 2.5 (Optional) Google Indexing API for fast article/news indexing

Requires GCP service account, JSON key, Owner permission in GSC, billing enabled.
- Guide: https://developers.google.com/search/apis/indexing-api/v3/quickstart
- Endpoint: `POST https://indexing.googleapis.com/v3/urlNotifications:publish`
- Batch job: submit `URL_UPDATED` for each new article/news URL (max 200 URLs/day / 20K/month free tier; paid tier higher).
- Keep service account JSON key out of repo (AWS Secrets Manager / GCP Secrets).
- Not required, but speeds up AI articles/news turnaround in index from weeks → hours.

---

## 3. Bing Webmaster Tools — ownership + sitemap

### 3.1 Ownership verification

Option A (fastest, recommended): **Import from Google Search Console** → BWT account → "Import sites from GSC". This skips manual verification.

Option B (manual):
1. https://www.bing.com/webmasters → Add site.
2. Enter: `https://www.topaitools.ai`
3. Choose one:
   - **XML file upload**: Download `BingSiteAuth.xml` from BWT → drop into `public/` (check `.gitignore` not committing if it contains machine id; safe to commit because it's a public ownership file). Deploy → Verify.
   - **Meta tag**: `<meta name="msvalidate.01" content="XXXX…">`. Same strategy as Google meta → env var + CI replacement.
   - **CNAME DNS** record: Most durable for enterprise.

### 3.2 Submit sitemap to BWT

1. BWT → `https://www.topaitools.ai` property → **Sitemaps** (left nav).
2. Click **Submit sitemap** → URL: `https://www.topaitools.ai/sitemap.xml`
3. Submit. BWT shows "Processing" → after some minutes → "Success (discovered X URLs, submitted Y)".

### 3.3 Submit IndexNow (Bing/Yandex/Seznam/Naver/Yep instant push)

Bing IndexNow allows instant single-URL ping on new/updated content. You need a 128-bit key file hosted.
1. Generate a strong random key: `openssl rand -hex 16` → save as `<hexkey>.txt` in `public/`, content inside is `<hexkey>` (single line).
2. Deployed URL will be `https://www.topaitools.ai/<hexkey>.txt`.
3. Ping API: `POST https://www.bing.com/indexnow` with JSON body:
   ```json
   {
     "host": "www.topaitools.ai",
     "key": "<hexkey>",
     "keyLocation": "https://www.topaitools.ai/<hexkey>.txt",
     "urlList": [
       "https://www.topaitools.ai/ai-news/new-article-slug/1234",
       "… up to 10,000 URLs per ping"
     ]
   }
   ```
4. Or simple GET for 1 URL: `https://www.bing.com/indexnow?url=<urlencoded>&key=<hexkey>`
5. Hook this into the backend workflow whenever new tools/articles/prompts/news published.

---

## 4. Submit sitemap to DuckDuckGo / Yandex / Baidu (optional)

- DuckDuckGo does not have a public webmaster console, but it reads sitemaps from robots.txt automatically.
- Yandex Webmaster (https://webmaster.yandex.com):
  - Verify ownership → Submitting sitemap in Yandex.Webmaster → paste `https://www.topaitools.ai/sitemap.xml`
- Baidu Ziyuan (https://ziyuan.baidu.com):
  - Only relevant if the site has CN traffic. Heavyweight verification process.

---

## 5. Rich Results / Schema validation (MANDATORY)

Run 5 URLs through Google Rich Results Test: https://search.google.com/test/rich-results

**Recommended test URLs (sample, pick live after deploy):**

1. `https://www.topaitools.ai/` → Organization, WebSite, ItemList.
2. `https://www.topaitools.ai/ai-tools` → BreadcrumbList, CollectionPage.
3. A tool with rating >0 → `SoftwareApplication`, `AggregateRating`.
4. Long-form article → `Article` with headline, author, dates, publisher logo.
5. `https://www.topaitools.ai/categories` → BreadcrumbList, CollectionPage.

**For each URL:**
- Click **Test code** → wait ~15s → Detected items → drill into each.
- Resolve any **Errors** (red) — fix JsonLd builder file + redeploy + re-test.
- **Warnings** (yellow) are OK if they correspond to missing data (e.g. no AggregateRating when rating not present).
- Also run Schema.org Validator: https://validator.schema.org → paste HTML view-source (or URL) — checks JSON-LD strict compliance against vocabulary definitions.
- Report top 5 errors back into the repo as tickets (do not guess at schema — update JsonLd builders only when vendor schema docs confirm).

---

## 6. Lighthouse + PageSpeed + Core Web Vitals audit

Goal: Mobile: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 100. Desktop ≥ 95.

### 6.1 Lighthouse via Chrome DevTools

1. Incognito window → https://www.topaitools.ai → F12 → Lighthouse → Mode: Navigation → Categories: Performance, Accessibility, Best Practices, SEO. Device: Mobile.
2. Run 3 times → take median run (network noise reduction).
3. Save JSON + HTML reports → attach to GSC "Performance → Core Web Vitals" findings.
4. Repeat on: Home, /ai-tools, /ai-tools/<known-tool>/<id>, /ai-articles, /ai-articles/<article>/<id>, /categories/<category>/<id>.

### 6.2 Google PageSpeed Insights (public, lab+field)

- Navigate to: https://pagespeed.web.dev/
- Input home, ai-tools, 1 tool detail, 1 article, 1 category.
- Under "Origin Summary" section if you see real-user Core Web Vitals (CWV from CrUX), pay most attention there; it reflects what Google actually ranks on.
- Green thresholds (2024–2026):
  - LCP ≤ 2.5s, INP ≤ 200ms (2026 INP replaces FID), CLS ≤ 0.1.
- Prioritize: any failing LCP > 4s. LCP image should be in preconnect list, use `loading=eager fetchpriority=high` for the hero.
- Document any regressions in a tickets list. Send Lighthouse report JSONs to Frontend engineer queue to address LCP/INP >250ms / >0.1 CLS.

### 6.3 GSC → Experience → Core Web Vitals

After ~1 week you get field data (CrUX dataset). Separate reports for Mobile and Desktop. Open "Poor URLs group" and fix per URL. Monitor weekly.

---

## 7. Google Analytics 4 / GA4 SEO tracking (already installed)

Already installed in `index.html`: `G-BVM96Q9EY4`.

### Recommended GA4 Admin setup:

1. GA4 → Admin → Property Settings → **Search Console Linking** → "Link" → choose the GSC property you verified. This lets you see query/URL GSC metrics combined with GA4 landing pages.
2. Custom dimensions (GA4 → Admin → Custom definitions → Create custom dimensions):
   | Dimension name               | Scope    | Event Parameter / User Prop | Description                                  |
   |------------------------------|----------|------------------------------|----------------------------------------------|
   | `tool_id`                    | Event    | `tool_id`                    | Which tool pages were viewed / clicked       |
   | `ai_category`                | Event    | `ai_category`                | Category context for landing/category pages  |
   | `outbound_tool_domain`       | Event    | `outbound_tool_domain`       | For official tool link click-outs            |
   | `is_logged_in`               | User     | (via user-scoped custom def) | Compare anonymous vs signed-in behavior      |
3. Recommended **GA4 events** to instrument (already have Mixpanel page_view; map to GA4):
   - `view_ai_tool` (on AIToolDetail mount) → params: `tool_id`, `tool_title`, `tool_category`, `tool_pricing_tier`
   - `click_official_tool_website` (on "Visit Site" button) → params + `outbound_tool_domain`
   - `view_category` (Categories + CategoryDetail) → `category_id`, `category_name`
   - `search_query` (on submit click in AITools) → `search_term`, `result_count`, `page`
   - `view_article` / `read_article_complete` (scroll 90% threshold)
   - `ai_newsletter_subscribe` (Newsletter success)

### How to detect AI referral traffic in GA4

Most AI services (ChatGPT, Perplexity, Claude, etc.) send users without a traditional `Referer` header (they are not click-through links in the same sense as a website link; or the referer is `chat.openai.com` for ChatGPT Browse). To detect:

- **GA4 → Acquisition → Traffic acquisition → Default channel grouping**: look for channel:
  - `Organic Search` (Google/Bing) → actual web search.
  - `Referral` → `chat.openai.com`, `perplexity.ai`, `claude.ai` if they pass Referer headers.
- **UTM tagging campaigns** for content you share inside communities (LinkedIn, X, newsletters, etc.). Use:
  ```
  ?utm_source=chatgpt&utm_medium=ai-citation&utm_campaign=llm-search-discovery
  ```
  when you *intentionally* submit to AI answer engines or feature URLs there. But do not add UTM tokens to canonical URLs inside sitemap or internal links.
- Build a quick Looker Studio (Data Studio) dashboard: Sessions over time, split by Source/Medium, filter for source contains "chatgpt|perplexity|claude|you.com|brave|kagi".
- Correlate Mixpanel events with GA4: `page_view` Mixpanel event already fires on every route change (Layout useLocation hook). Add a dimension: `referrer_host = document.referrer ? new URL(document.referrer).hostname : '(direct)'`.

---

## 8. Scheduled SEO health monitoring (quarterly)

| Frequency | Action |
|-----------|--------|
| Weekly | GSC Sitemaps → check for new errors. Coverage → Pages → new "Crawled - currently not indexed" blips. |
| Weekly | GSC Performance → Search results → Queries: new keywords driving impressions. |
| Weekly | Core Web Vitals dashboard → alerts on failing URLs. |
| Monthly | Full Lighthouse run on 10 representative URLs → trendline doc. |
| Monthly | Run `node scripts/validate-sitemap.mjs --http` on prod → any new 4xx/5xx sitemap URLs → fix. |
| Monthly | Schema validator on 5 URLs → ensure schema not regressed after release. |
| Quarterly | Re-run this entire audit against `docs/SEO_AUDIT.md` checklist → fill in Implementation status column. |
| Quarterly | GA4 + Mixpanel: AI referral + AI conversion events, set baselines. |
| Quarterly | Backlink audit: Ahrefs/Semrush/Majestic (optional paid tool) → toxic backlink disavow if negative SEO attack detected. |

---

## 9. Checklist — go / no-go for launch submission

### Before pressing "Submit" in GSC/BWT

- [ ] CDN redirects active (http → https, non-www → www, 301)
- [ ] Unknown paths return real 404, not 200
- [ ] `https://www.topaitools.ai/robots.txt` returns 200, Sitemap line present
- [ ] `https://www.topaitools.ai/sitemap.xml` valid xml, sub-sitemaps all downloadable with correct counts
- [ ] `https://www.topaitools.ai/llms.txt` 200 OK, canonical URL correct
- [ ] Run production `npm run seo:build` → validate script → exit 0
- [ ] Homepage live title tag inspected via `curl https://www.topaitools.ai/ | grep '<title>'` matches expected
- [ ] 1 tool detail page → inspect `<link rel=canonical>` → returns correct unique `/ai-tools/slug/id` URL (NOT `/`)
- [ ] Robots meta on /login → noindex,nofollow confirmed (View-source or Inspect Element after route nav)
- [ ] CDN Bot Control / WAF rules reviewed:
  - [ ] Googlebot family allowed
  - [ ] Bingbot allowed
  - [ ] OAI-SearchBot allowed
  - [ ] PerplexityBot allowed
  - [ ] Claude-SearchBot allowed
  - [ ] GPTBot / Google-Extended blocked if desired (training only)
  - [ ] CCBot blocked (training only)
  - [ ] Bytespider blocked (scrapers)
- [ ] Security headers on (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, base CSP).
- [ ] Security audit: no creds in built js, no env vars exposed.
- [ ] `docs/SEO_AUDIT.md` reviewed post-deploy, all CRITICAL/HIGH items DONE.

After marking each, proceed to §2, §3 sitemap submissions, §5 structured data validations, §6 Lighthouse.
