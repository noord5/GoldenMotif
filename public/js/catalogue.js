/* ========================================
   CATALOGUE.JS — Golden Motif
   Progressive enhancement for the static
   product grid: search + sort. Category
   filtering is handled by real links to
   /catalogue/<category>/ pages.
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("catalogue-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll("[data-product-card]"));
  const searchInput = document.getElementById("catalogue-search");
  const sortSelect = document.getElementById("catalogue-sort");
  const countEl = document.getElementById("catalogue-count");
  const emptyEl = document.getElementById("catalogue-empty");

  let query = "";
  let sortKey = "featured";

  const original = new Map(cards.map((c, i) => [c, i]));

  function matches(card) {
    if (!query) return true;
    const q = query.toLowerCase().trim();
    return (
      card.dataset.name.toLowerCase().includes(q) ||
      card.dataset.category.toLowerCase().includes(q) ||
      card.dataset.tags.toLowerCase().includes(q)
    );
  }

  function sorted(list) {
    const out = [...list];
    if (sortKey === "newest") {
      out.sort((a, b) => new Date(b.dataset.created) - new Date(a.dataset.created));
    } else if (sortKey === "name-az") {
      out.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    } else {
      out.sort((a, b) => {
        const f = Number(b.dataset.featured) - Number(a.dataset.featured);
        return f !== 0 ? f : original.get(a) - original.get(b);
      });
    }
    return out;
  }

  function apply() {
    const visible = sorted(cards.filter(matches));
    cards.forEach((c) => (c.hidden = true));
    visible.forEach((c) => {
      c.hidden = false;
      grid.appendChild(c);
    });
    if (countEl) {
      countEl.textContent = `${visible.length} product${visible.length !== 1 ? "s" : ""}`;
    }
    if (emptyEl) emptyEl.hidden = visible.length !== 0;
  }

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce((e) => {
        query = e.target.value;
        apply();
      }, 200),
    );
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortKey = e.target.value;
      apply();
    });
  }
});
