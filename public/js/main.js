/* ========================================
   MAIN.JS — Golden Motif
   Shared: mobile menu, FAQ accordion,
   scroll animations (header/footer are static HTML)
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  initCurrencyExperience();
  initMobileMenu();
  initStickyNavbar();
  initAccordions();
  initRevealAnimations();
  initLazyImages();
  initSmoothLinks();
  initImageErrorHandling();
});

function initCurrencyExperience() {
  if (!window.CurrencyService || typeof CurrencyService.init !== "function") {
    return;
  }
  CurrencyService.init();
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
