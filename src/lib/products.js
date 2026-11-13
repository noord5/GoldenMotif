import raw from "../data/products.json";

export const SITE = "https://www.goldenmotif.com";

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** All products, with a lowercase URL slug (the original slug is kept as legacySlug). */
export const products = raw.map((p) => ({
  ...p,
  legacySlug: p.slug,
  slug: p.slug.toLowerCase(),
}));

export const categories = [...new Set(products.map((p) => p.category))].sort();

export const categoryInfo = categories.map((name) => ({
  name,
  slug: slugify(name),
  count: products.filter((p) => p.category === name).length,
}));

export function productUrl(p) {
  return `/products/${p.slug}/`;
}

export function categoryUrl(name) {
  return `/catalogue/${slugify(name)}/`;
}

export function getRelated(product, limit = 4) {
  const same = products.filter((p) => p.category === product.category && p.id !== product.id);
  if (same.length >= limit) return same.slice(0, limit);
  // Top up with other products so every page links to related items.
  const others = products.filter((p) => p.category !== product.category);
  return [...same, ...others].slice(0, limit);
}

export function stripHtml(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text, max = 158) {
  const t = stripHtml(text);
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}
