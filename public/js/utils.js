/* ========================================
   UTILS.JS — Golden Motif
   Reusable helper functions
   ======================================== */

/**
 * Get a query parameter value from the URL
 * @param {string} key - Parameter name
 * @returns {string|null}
 */
function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Create a URL-friendly slug from a string
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Debounce a function call
 * @param {Function} fn
 * @param {number} delay - ms
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Create a DOM element with attributes and children
 * @param {string} tag
 * @param {Object} attrs
 * @param  {...(Node|string)} children
 * @returns {HTMLElement}
 */
function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === "className") {
      el.className = val;
    } else if (key === "dataset") {
      for (const [dk, dv] of Object.entries(val)) {
        el.dataset[dk] = dv;
      }
    } else if (key.startsWith("on") && typeof val === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else if (key === "innerHTML") {
      el.innerHTML = val;
    } else {
      el.setAttribute(key, val);
    }
  }
  children.forEach((child) => {
    if (typeof child === "string") {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });
  return el;
}

/**
 * Format an ISO date string
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Initialize lazy-load images using IntersectionObserver
 */
function initLazyImages() {
  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
            img.classList.add("loaded");
            obs.unobserve(img);
          }
        });
      },
      { rootMargin: "100px" },
    );
    lazyImgs.forEach((img) => obs.observe(img));
  } else {
    // fallback
    lazyImgs.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      img.classList.add("loaded");
    });
  }
}

/**
 * Initialize scroll-reveal animations
 */
function initRevealAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    reveals.forEach((el) => obs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }
}

/**
 * Smooth scroll to a target element
 * @param {string} selector
 */
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
