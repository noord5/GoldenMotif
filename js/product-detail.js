/* ========================================
   PRODUCT-DETAIL.JS — Golden Motif
   Single product view: gallery, info,
   accordions, related products
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  initProductDetail();
});

async function initProductDetail() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const slug = getQueryParam("slug");
  if (!slug) {
    renderNotFound(container);
    return;
  }

  const product = await ProductStore.getBySlug(slug);
  if (!product) {
    renderNotFound(container);
    return;
  }

  // Update page title & meta
  document.title = `${product.name} — Golden Motif`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = product.description;

  renderProduct(container, product);
  initGallery();

  // Related products
  const related = await ProductStore.getRelated(product, 4);
  renderRelated(related);

  initRevealAnimations();
  initLazyImages();
}

/**
 * Render the full product detail
 */
function renderProduct(container, product) {
  const mainImage =
    product.images && product.images[0] ? product.images[0] : "";

  const fitClass = product.imageFit === "contain" ? "object-contain" : "";

  container.innerHTML = `
    <div class="container">
      <div class="product-detail__grid">
        <!-- Gallery -->
        <div class="product-gallery">
          <div class="product-gallery__main-outer">
            <button class="product-gallery__main-nav prev" id="main-prev" aria-label="Previous image">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div class="product-gallery__main ${fitClass}">
              <img src="${mainImage}" alt="${product.name}" id="gallery-main-img">
            </div>
            <button class="product-gallery__main-nav next" id="main-next" aria-label="Next image">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
          
          <div class="product-gallery__thumbs" id="gallery-thumbs">
            ${(product.images || [])
              .map(
                (img, i) => `
              <button class="product-gallery__thumb ${i === 0 ? "active" : ""}" data-img="${img}" data-index="${i}" aria-label="View image ${i + 1}">
                <img src="${img}" alt="${product.name} view ${i + 1}" loading="lazy">
              </button>
            `,
              )
              .join("")}
          </div>
        </div>

        <!-- Info -->
        <div class="product-info">
          <nav class="product-info__breadcrumb" aria-label="Breadcrumb">
            <a href="index.html">Home</a>
            <span>›</span>
            <a href="catalogue.html">Catalogue</a>
            <span>›</span>
            <a href="catalogue.html?cat=${encodeURIComponent(product.category)}">${product.category}</a>
            <span>›</span>
            <span>${product.name}</span>
          </nav>

          <span class="product-info__category">${product.category}</span>
          <h1 class="product-info__name">
            ${product.name}
            ${product.subName ? `<span class="product-info__subtitle">${product.subName}</span>` : ""}
          </h1>
          <span class="product-info__price">${product.priceLabel}</span>
          <p class="product-info__desc">${product.description}</p>

          <div class="product-info__meta">
            <div class="product-info__meta-row">
              <span class="product-info__meta-label">Material</span>
              <span class="product-info__meta-value">${product.material}</span>
            </div>
            <div class="product-info__meta-row">
              <span class="product-info__meta-label">SKU</span>
              <span class="product-info__meta-value">${product.sku}</span>
            </div>
            <div class="product-info__meta-row">
              <span class="product-info__meta-label">Availability</span>
              <span class="product-info__availability">${product.availability || "Available"}</span>
            </div>
          </div>

          <div class="product-info__buttons">
            <a href="contact.html" class="btn btn--primary">
              ${Icons.mail} REQUEST WHOLESALE PRICE
            </a>
          </div>

          <!-- Accordions -->
          <div class="accordion mt-xl">
            <div class="accordion__item">
              <button class="accordion__trigger" aria-expanded="false">
                Product Information
                <span class="accordion__icon"></span>
              </button>
              <div class="accordion__content">
                <div class="accordion__content-inner">
                  ${
                    product.productInfo ||
                    `
                    <p>${product.description}</p>
                    <p style="margin-top: 0.75rem;">Each piece is individually inspected for quality and ships with a certificate of authenticity. Our artisans take pride in every stitch, ensuring that your Golden Motif product will age gracefully and become a trusted companion for years to come.</p>
                  `
                  }
                </div>
              </div>
            </div>

            <div class="accordion__item">
              <button class="accordion__trigger" aria-expanded="false">
                Materials &amp; Care
                <span class="accordion__icon"></span>
              </button>
              <div class="accordion__content">
                <div class="accordion__content-inner">
                  ${product.materialInfo || `<p><strong>Material:</strong> ${product.material}</p>`}
                  ${product.careInfo || `<p style="margin-top: 0.75rem;"><strong>Care:</strong> To preserve the natural beauty of your leather, keep it away from prolonged moisture and direct sunlight. Clean with a soft, dry cloth. We recommend conditioning with a quality leather balm every 3–6 months depending on use.</p>`}
                </div>
              </div>
            </div>

            <div class="accordion__item">
              <button class="accordion__trigger" aria-expanded="false">
                Shipping &amp; Lead Time
                <span class="accordion__icon"></span>
              </button>
              <div class="accordion__content">
                <div class="accordion__content-inner">
                  <p>Standard orders ship within 15–20 business days. Made-to-order items require 3–4 weeks for crafting. We ship worldwide via insured courier. Contact us for bulk or custom orders with specific delivery requirements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize gallery thumbnail switching and scrolling
 */
function initGallery() {
  const thumbsContainer = document.getElementById("gallery-thumbs");
  const mainImg = document.getElementById("gallery-main-img");
  const mainPrev = document.getElementById("main-prev");
  const mainNext = document.getElementById("main-next");

  if (!thumbsContainer || !mainImg) return;

  const thumbs = Array.from(
    thumbsContainer.querySelectorAll(".product-gallery__thumb"),
  );
  let currentIndex = 0;

  const updateGallery = (index) => {
    currentIndex = index;
    const thumb = thumbs[currentIndex];
    if (!thumb) return;

    const imgSrc = thumb.dataset.img;

    // Update main image with fade
    mainImg.style.opacity = "0";
    setTimeout(() => {
      mainImg.src = imgSrc;
      mainImg.style.opacity = "1";
    }, 200);

    // Update active thumb
    thumbs.forEach((t) => t.classList.remove("active"));
    thumb.classList.add("active");

    // Smooth scroll thumbnail into view if needed
    thumb.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  // Thumbnail Click
  thumbsContainer.addEventListener("click", (e) => {
    const thumb = e.target.closest(".product-gallery__thumb");
    if (!thumb) return;
    const index = thumbs.indexOf(thumb);
    if (index !== -1) updateGallery(index);
  });

  // Main Nav Arrows
  if (mainPrev) {
    mainPrev.addEventListener("click", () => {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = thumbs.length - 1;
      updateGallery(newIndex);
    });
  }

  if (mainNext) {
    mainNext.addEventListener("click", () => {
      let newIndex = currentIndex + 1;
      if (newIndex >= thumbs.length) newIndex = 0;
      updateGallery(newIndex);
    });
  }
}

/**
 * Render related products section
 */
function renderRelated(products) {
  const section = document.getElementById("related-products");
  if (!section || !products.length) return;

  const grid = section.querySelector(".collections-grid");
  if (!grid) return;

  products.forEach((product, i) => {
    grid.appendChild(createProductCard(product, i));
  });

  section.style.display = "block";
}

/**
 * Render not-found state
 */
function renderNotFound(container) {
  container.innerHTML = `
    <div class="container" style="padding-top: calc(80px + 4rem);">
      <div class="empty-state">
        <div class="empty-state__icon">${Icons.search}</div>
        <h2 class="empty-state__title">Product Not Found</h2>
        <p class="empty-state__text">The product you're looking for doesn't exist or may have been removed.</p>
        <a href="catalogue.html" class="btn btn--primary mt-xl">Browse Catalogue</a>
      </div>
    </div>
  `;
}
