/* ========================================
   CATALOGUE.JS — Golden Motif
   Grid rendering, filtering, sorting,
   search, load-more pagination
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCatalogue();
});

async function initCatalogue() {
  const grid = document.getElementById('catalogue-grid');
  if (!grid) return;

  const ITEMS_PER_PAGE = 8;
  let currentPage = 1;
  let filteredProducts = [];
  let currentCategory = 'All';
  let currentSearch = '';
  let currentSort = 'featured';

  // Check for category from URL param
  const urlCat = getQueryParam('cat');
  if (urlCat) currentCategory = urlCat;

  const allProducts = await ProductStore.getAll();
  if (!allProducts.length) {
    grid.innerHTML = renderEmptyState();
    return;
  }

  // Build filter chips
  const categories = await ProductStore.getCategories();
  renderFilterChips(categories);

  // If URL had a category, activate that chip
  if (urlCat) {
    document.querySelectorAll('.chip[data-category]').forEach(c => {
      c.classList.toggle('active', c.dataset.category === urlCat);
    });
  }

  // Initial render
  applyFilters();

  // ── Event: Category chips ──
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip[data-category]');
    if (!chip) return;
    document.querySelectorAll('.chip[data-category]').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentCategory = chip.dataset.category;
    currentPage = 1;
    applyFilters();
  });

  // ── Event: Search ──
  const searchInput = document.getElementById('catalogue-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      currentSearch = e.target.value;
      currentPage = 1;
      applyFilters();
    }, 250));
  }

  // ── Event: Sort ──
  const sortSelect = document.getElementById('catalogue-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      currentPage = 1;
      applyFilters();
    });
  }

  // ── Event: Load more ──
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      renderGrid(false);
    });
  }

  /**
   * Apply current filters and re-render
   */
  function applyFilters() {
    let products = [...allProducts];

    // Category filter
    if (currentCategory && currentCategory !== 'All') {
      products = products.filter(p => p.category === currentCategory);
    }

    // Search filter
    if (currentSearch) {
      products = ProductStore.search(currentSearch, products);
    }

    // Sort
    products = ProductStore.sort(products, currentSort);

    filteredProducts = products;
    renderGrid(true);
    updateCount();
  }

  /**
   * Render product grid
   * @param {boolean} reset - Clear & re-render from page 1
   */
  function renderGrid(reset = true) {
    if (reset) grid.innerHTML = '';

    const start = reset ? 0 : (currentPage - 1) * ITEMS_PER_PAGE;
    const end = currentPage * ITEMS_PER_PAGE;
    const visibleProducts = filteredProducts.slice(start, end);

    if (filteredProducts.length === 0) {
      grid.innerHTML = renderEmptyState();
      toggleLoadMore(false);
      return;
    }

    visibleProducts.forEach((product, i) => {
      const card = createProductCard(product, i);
      grid.appendChild(card);
    });

    toggleLoadMore(end < filteredProducts.length);
    initRevealAnimations();
    initLazyImages();
  }

  /**
   * Update result count display
   */
  function updateCount() {
    const countEl = document.getElementById('catalogue-count');
    if (countEl) {
      countEl.textContent = `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Toggle load more button visibility
   */
  function toggleLoadMore(show) {
    const wrap = document.querySelector('.load-more-wrap');
    if (wrap) wrap.style.display = show ? 'block' : 'none';
  }

  /**
   * Render category filter chips
   */
  function renderFilterChips(categories) {
    const container = document.getElementById('filter-chips');
    if (!container) return;

    const allChip = createElement('button', {
      className: `chip ${currentCategory === 'All' ? 'active' : ''}`,
      dataset: { category: 'All' }
    }, 'All');
    container.appendChild(allChip);

    categories.forEach(cat => {
      const chip = createElement('button', {
        className: `chip ${currentCategory === cat ? 'active' : ''}`,
        dataset: { category: cat }
      }, cat);
      container.appendChild(chip);
    });
  }
}

/**
 * Create a product card element
 */
function createProductCard(product, index = 0) {
  const delay = index % 4;
  const card = createElement('a', {
    className: `product-card reveal reveal-delay-${delay + 1}`,
    href: `product.html?slug=${product.slug}`
  });

  const imgSrc = product.images && product.images[0] ? product.images[0] : '';

  card.innerHTML = `
    <div class="product-card__image-wrap">
      <img
        src="${imgSrc}"
        alt="${product.name}"
        class="product-card__image"
        loading="lazy"
        width="600"
        height="700"
      >
      ${product.featured ? '<span class="product-card__badge">Featured</span>' : ''}
      <div class="product-card__actions">
        <button class="product-card__action-btn" aria-label="Add to wishlist" onclick="event.preventDefault();">${Icons.heart}</button>
        <button class="product-card__action-btn" aria-label="Quick view" onclick="event.preventDefault();">${Icons.eye}</button>
      </div>
    </div>
    <div class="product-card__body">
      <span class="product-card__category">${product.category}</span>
      <h3 class="product-card__name">${product.name}</h3>
      <span class="product-card__price">${product.priceLabel}</span>
    </div>
  `;
  return card;
}

/**
 * Render empty state when no products match
 */
function renderEmptyState() {
  return `
    <div class="empty-state" style="grid-column: 1 / -1;">
      <div class="empty-state__icon">${Icons.search}</div>
      <h3 class="empty-state__title">No products found</h3>
      <p class="empty-state__text">Try adjusting your filters or search term to discover our collection.</p>
    </div>
  `;
}
