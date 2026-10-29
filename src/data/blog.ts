import { decodeHTML } from "entities";
import sanitizeHtml from "sanitize-html";
import { normalizeBlogCategory } from "./blog-pillars";

export const ARTICLE_PLACEHOLDER = "/images/article-placeholder.svg";
const ARTICLES_API = "https://api.drinkregen.com/api/v1/articles";
interface ApiArticle {
  id?: number;
  link?: string;
  slug: string;
  status: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  faqs?: { question: string; answer: string }[];
  class_list?: string[];
  _links?: { "wp:featuredmedia"?: { href: string }[] };
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text?: string }[];
    "wp:term"?: { taxonomy: string; name: string }[][];
  };
}
const plainText = (html: string) => decodeHTML(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })).replace(/\s+/g, " ").trim();
const imageUrl = (value?: string) => {
  if (!value) return ARTICLE_PLACEHOLDER;
  try {
    const url = new URL(value, ARTICLES_API);
    return ["https:", "http:"].includes(url.protocol) ? url.href : ARTICLE_PLACEHOLDER;
  } catch { return ARTICLE_PLACEHOLDER; }
};
function createArticleLinkResolver(articles: ApiArticle[]) {
  const byId = new Map(articles.filter(article => article.id != null).map(article => [String(article.id), article.slug]));
  const byPath = new Map<string, string>();
  for (const article of articles) {
    byPath.set(`/${article.slug}`, article.slug);
    byPath.set(`/blog/${article.slug}`, article.slug);
    if (article.link) {
      try {
        const url = new URL(article.link);
        if (url.hostname === "cms.drinkregen.com" && url.pathname !== "/") {
          byPath.set(url.pathname.replace(/\/$/, ""), article.slug);
        }
      } catch { /* Ignore malformed CMS permalinks. */ }
    }
  }
  return (href: string) => {
    try {
      // Fragment-only and existing frontend-relative links already work as authored.
      if (!/^(?:https?:)?\/\//i.test(href)) return href;
      const url = new URL(href, "https://cms.drinkregen.com");
      if (url.hostname !== "cms.drinkregen.com") return href;
      const id = url.searchParams.get("p");
      const slug = id !== null ? byId.get(id) : byPath.get(url.pathname.replace(/\/$/, ""));
      // Only rewrite published articles that have a generated frontend page.
      if (!slug) return href;
      url.searchParams.delete("p");
      return `/blog/${slug}${url.search}${url.hash}`;
    } catch { return href; }
  };
}
async function mapArticle(article: ApiArticle, resolveArticleLink: (href: string) => string) {
  let media = article._embedded?.["wp:featuredmedia"]?.[0];
  const mediaLink = article._links?.["wp:featuredmedia"]?.[0]?.href;
  if (!media && article.featured_media && mediaLink) {
    try {
      const url = new URL(mediaLink);
      if (url.origin === "https://cms.drinkregen.com") {
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (response.ok) media = await response.json();
      }
    } catch { /* Keep articles readable when their media is unavailable. */ }
  }
  const categorySlug = article.class_list?.find(value => value.startsWith("category-"))?.slice(9);
  const category = article._embedded?.["wp:term"]?.flat().find(term => term.taxonomy === "category")?.name
    || categorySlug?.replace(/-/g, " ").replace(/\b\w/g, letter => letter.toUpperCase()) || "Cerita REGEN";
  return {
    slug: article.slug,
    title: plainText(article.title.rendered),
    excerpt: plainText(article.excerpt.rendered),
    category: normalizeBlogCategory(plainText(category)),
    image: imageUrl(media?.source_url),
    imageAlt: media?.alt_text || plainText(article.title.rendered),
    faqs: Array.isArray(article.faqs) ? article.faqs
      .filter(item => typeof item?.question === "string" && typeof item?.answer === "string")
      .map(item => ({ question: plainText(item.question), answer: plainText(item.answer) }))
      .filter(item => item.question && item.answer) : [],
    content: sanitizeHtml(article.content.rendered, {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
      allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ["src", "alt", "width", "height", "loading"] },
      transformTags: {
        a: (tagName, attribs) => ({
          tagName,
          attribs: attribs.href ? { ...attribs, href: resolveArticleLink(attribs.href) } : attribs,
        }),
      },
    }),
    minutes: Math.max(1, Math.ceil(plainText(article.content.rendered).split(/\s+/).length / 180)),
  };
}
// Share the API snapshot between the index and generated detail pages.
let articlesPromise: Promise<Awaited<ReturnType<typeof mapArticle>>[]> | undefined;
export function getPosts() { return articlesPromise ??= fetchArticles(); }
async function fetchArticles() {
  const response = await fetch(ARTICLES_API, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Article API returned ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload.data)) throw new Error("Article API returned an invalid article list");
  const articles = (payload.data as ApiArticle[]).filter(article => article.status === "publish");
  const resolveArticleLink = createArticleLinkResolver(articles);
  return Promise.all(articles.map(article => mapArticle(article, resolveArticleLink)));
}
export const readingTime = (post: Awaited<ReturnType<typeof mapArticle>>) => post.minutes;
