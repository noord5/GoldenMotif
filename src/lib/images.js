import { getImage } from "astro:assets";

const files = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

/** Look up an imported asset from a path like "ASSESTS/Duffle bag_8/1.png". */
export function asset(path) {
  const found = files["/src/assets/" + path];
  if (!found) throw new Error(`Image not found in src/assets: ${path}`);
  return found;
}

/** Optimised WebP URL for a given asset path and width. */
export async function imageUrl(path, width) {
  const out = await getImage({ src: asset(path), width, format: "webp" });
  return out.src;
}

/** Keep only image paths that exist in src/assets (warns about the rest). */
export function validImages(list = []) {
  return list.filter((p) => {
    const ok = Boolean(files["/src/assets/" + p]);
    if (!ok) console.warn(`[images] missing asset skipped: ${p}`);
    return ok;
  });
}
