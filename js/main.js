/* ========================================
   MAIN.JS — Golden Motif
   Shared: header/footer injection, mobile
   menu, FAQ accordion, scroll animations
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  injectHeader();
  injectFooter();
  processIconPlaceholders(); // inject SVG icons into data-icon elements
  initMobileMenu();
  initStickyNavbar();
  initAccordions();
  initRevealAnimations();
  initLazyImages();
  highlightActiveNav();
  initSmoothLinks();
  initImageErrorHandling();
});

/* ─────────────────────────────────────
   ICON INJECTION
   Replaces <span data-icon="name"></span>
   with corresponding SVG from Icons object
   ───────────────────────────────────── */
function processIconPlaceholders() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.getAttribute("data-icon");
    if (Icons[name]) {
      el.innerHTML = Icons[name];
    } else {
      console.warn(`[Golden Motif] Unknown icon: "${name}"`);
    }
  });
}

/* ─────────────────────────────────────
   HEADER INJECTION
   ───────────────────────────────────── */
function injectHeader() {
  const headerPlaceholder = document.getElementById("site-header");
  if (!headerPlaceholder) return;

  headerPlaceholder.innerHTML = `
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="navbar__inner">
        <a href="index.html" class="navbar__logo" aria-label="Golden Motif Home">
          <img src="ASSESTS/Logo-GoldenMotif.png" alt="Golden Motif Logo" class="navbar__logo-img" width="40" height="40">
          <span class="navbar__logo-text">Golden <span>Motif</span></span>
        </a>

        <div class="navbar__links" role="menubar">
          <a href="index.html" class="navbar__link" role="menuitem">Home</a>
          <a href="catalogue.html" class="navbar__link" role="menuitem">Catalogue</a>
          <a href="about.html" class="navbar__link" role="menuitem">About</a>
          <a href="contact.html" class="navbar__link" role="menuitem">Contact</a>
        </div>

        <div class="navbar__actions">

          <a href="contact.html" class="btn btn--primary btn--sm">PARTNER WITH US</a>
          <button class="navbar__menu-btn" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>

    <div class="mobile-nav" role="dialog" aria-label="Mobile navigation" aria-hidden="true">
      <a href="index.html" class="mobile-nav__link">Home</a>
      <a href="catalogue.html" class="mobile-nav__link">Catalogue</a>
      <a href="about.html" class="mobile-nav__link">About</a>
      <a href="contact.html" class="mobile-nav__link">Contact</a>
      <a href="contact.html" class="btn btn--primary mt-lg">PARTNER WITH US</a>
    </div>
  `;
}

/* ─────────────────────────────────────
   FOOTER INJECTION
   ───────────────────────────────────── */
function injectFooter() {
  const footerPlaceholder = document.getElementById("site-footer");
  if (!footerPlaceholder) return;

  footerPlaceholder.innerHTML = `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__grid">
          <div>
            <a href="index.html" class="navbar__logo" aria-label="Golden Motif Home">
              <span class="navbar__logo-text" style="color: var(--clr-text-inverse);">Golden <span>Motif</span></span>
            </a>
            <p class="footer__brand-text">Crafting timeless leather goods since our founding. Every piece tells a story of artisanship, quality, and enduring style.</p>
            <div class="footer__socials">
              <a href="#" class="footer__social-link" aria-label="Instagram">${Icons.instagram}</a>
              <a href="#" class="footer__social-link" aria-label="Facebook">${Icons.facebook}</a>
              <a href="#" class="footer__social-link" aria-label="Twitter">${Icons.twitter}</a>
              <a href="#" class="footer__social-link" aria-label="LinkedIn">${Icons.linkedin}</a>
            </div>
          </div>

          <div>
            <h4 class="footer__heading">Navigate</h4>
            <a href="index.html" class="footer__link">Home</a>
            <a href="catalogue.html" class="footer__link">Catalogue</a>
            <a href="about.html" class="footer__link">About Us</a>
            <a href="contact.html" class="footer__link">Contact</a>
          </div>

          <div>
            <h4 class="footer__heading">Collections</h4>
            <a href="catalogue.html?cat=Handbags" class="footer__link">Handbags</a>
            <a href="catalogue.html?cat=Crossbody" class="footer__link">Crossbody</a>
            <a href="catalogue.html?cat=Duffles" class="footer__link">Duffles</a>
            <a href="catalogue.html?cat=Wallets" class="footer__link">Wallets</a>
            <a href="catalogue.html?cat=Travel Bags" class="footer__link">Travel Bags</a>
            <a href="catalogue.html?cat=Belts" class="footer__link">Belts</a>
          </div>

          <div>
            <h4 class="footer__heading">Contact</h4>
            <div class="footer__contact-item">
              ${Icons.mail}
              <span>info@GoldenMotif.com</span>
            </div>
            <div class="footer__contact-item">
              ${Icons.phone}
              <span>+39 352 095 8384</span>
            </div>
            <div class="footer__contact-item">
              ${Icons.mapPin}
              <span>Milan, Italy</span>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          <p>&copy; ${new Date().getFullYear()} Golden Motif. All rights reserved.</p>
          <div class="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

/* ─────────────────────────────────────
   MOBILE MENU
   ───────────────────────────────────── */
function initMobileMenu() {
  document.addEventListener("click", (e) => {
    const menuBtn = e.target.closest(".navbar__menu-btn");
    if (!menuBtn) return;

    const isActive = menuBtn.classList.toggle("active");
    const mobileNav = document.querySelector(".mobile-nav");
    if (mobileNav) {
      mobileNav.classList.toggle("open", isActive);
      mobileNav.setAttribute("aria-hidden", !isActive);
      menuBtn.setAttribute("aria-expanded", isActive);
      document.body.style.overflow = isActive ? "hidden" : "";
    }
  });
}

/* ─────────────────────────────────────
   STICKY NAVBAR
   ───────────────────────────────────── */
function initStickyNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ─────────────────────────────────────
   ACCORDION
   ───────────────────────────────────── */
function initAccordions() {
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".accordion__trigger");
    if (!trigger) return;

    const item = trigger.closest(".accordion__item");
    const content = item.querySelector(".accordion__content");
    const isOpen = item.classList.contains("active");

    // Close all siblings in the same accordion
    const accordion = item.closest(".accordion");
    if (accordion) {
      accordion
        .querySelectorAll(".accordion__item.active")
        .forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove("active");
            const openContent = openItem.querySelector(".accordion__content");
            if (openContent) openContent.style.maxHeight = null;
          }
        });
    }

    // Toggle current
    item.classList.toggle("active", !isOpen);
    if (content) {
      content.style.maxHeight = isOpen ? null : content.scrollHeight + "px";
    }

    // Update aria
    trigger.setAttribute("aria-expanded", !isOpen);
  });
}

/* ─────────────────────────────────────
   ACTIVE NAV HIGHLIGHTING
   ───────────────────────────────────── */
function highlightActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar__link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ─────────────────────────────────────
   SMOOTH SCROLL LINKS
   ───────────────────────────────────── */
function initSmoothLinks() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = link.getAttribute("href");
    if (target && target.length > 1) {
      e.preventDefault();
      smoothScrollTo(target);
    }
  });
}

/* ─────────────────────────────────────
   IMAGE ERROR HANDLING
   ───────────────────────────────────── */
function initImageErrorHandling() {
  document.addEventListener(
    "error",
    (e) => {
      if (e.target.tagName === "IMG") {
        e.target.style.background = "var(--clr-bg-alt)";
        e.target.alt = "Image unavailable";
      }
    },
    true,
  );

  // Mark already loaded images as loaded for the CSS transition
  document.querySelectorAll("img").forEach((img) => {
    if (img.complete) img.classList.add("loaded");
    else img.addEventListener("load", () => img.classList.add("loaded"));
  });
}
