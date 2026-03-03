/* ========================================
   CURRENCY.JS - Golden Motif
   Fixed multi-currency display with:
   - USD default fallback
   - Geo-based auto currency (US/CA/EUR region)
   - Manual override with persistence
   ======================================== */

const CurrencyService = (() => {
  const SUPPORTED = ["USD", "EUR", "CAD"];
  const DEFAULT_CURRENCY = "USD";
  const STORAGE_KEY = "gm_currency";
  const GEO_IP_URL = "https://ipapi.co/json/";

  function getCurrencyPresentation(currency) {
    switch (currency) {
      case "USD":
        return { prefix: "$", separator: "", isCodePrefix: false };
      case "EUR":
        return { prefix: "€", separator: "", isCodePrefix: false };
      case "CAD":
        return { prefix: "CAD", separator: " ", isCodePrefix: true };
      default:
        return { prefix: currency, separator: " ", isCodePrefix: true };
    }
  }

  const EURO_COUNTRIES = new Set([
    "AD", "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR",
    "HR", "IE", "IT", "LT", "LU", "LV", "MC", "MT", "NL", "PT",
    "SI", "SK", "SM", "VA",
  ]);

  let currentCurrency = DEFAULT_CURRENCY;
  let initPromise = null;

  function isSupported(currency) {
    return SUPPORTED.includes(String(currency || "").toUpperCase());
  }

  function normalizeCurrency(currency) {
    const code = String(currency || "").toUpperCase();
    return isSupported(code) ? code : DEFAULT_CURRENCY;
  }

  function mapCountryToCurrency(countryCode) {
    const country = String(countryCode || "").toUpperCase();
    if (country === "US") return "USD";
    if (country === "CA") return "CAD";
    if (EURO_COUNTRIES.has(country)) return "EUR";
    return DEFAULT_CURRENCY;
  }

  function getStoredCurrency() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return isSupported(stored) ? stored : null;
    } catch {
      return null;
    }
  }

  function storeCurrency(currency) {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      // Ignore storage errors in private mode / strict browsers.
    }
  }

  function getRegionFromLocale() {
    try {
      const locale =
        Intl.DateTimeFormat().resolvedOptions().locale ||
        navigator.languages?.[0] ||
        navigator.language;
      if (!locale) return null;
      const region = new Intl.Locale(locale).region;
      return region || null;
    } catch {
      return null;
    }
  }

  async function getCountryFromIp() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);

    try {
      const resp = await fetch(GEO_IP_URL, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });
      if (!resp.ok) return null;
      const data = await resp.json();
      return data.country_code || data.country || null;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function detectCurrency() {
    const ipCountry = await getCountryFromIp();
    if (ipCountry) return mapCountryToCurrency(ipCountry);

    const localeCountry = getRegionFromLocale();
    if (localeCountry) return mapCountryToCurrency(localeCountry);

    return DEFAULT_CURRENCY;
  }

  function syncSelectors() {
    document.querySelectorAll("[data-currency-select]").forEach((select) => {
      if (select.value !== currentCurrency) {
        select.value = currentCurrency;
      }
    });
  }

  function emitCurrencyChange(source = "manual") {
    window.dispatchEvent(
      new CustomEvent("currencychange", {
        detail: { currency: currentCurrency, source },
      }),
    );
  }

  function setCurrency(currency, options = {}) {
    const { persist = true, source = "manual" } = options;
    const next = normalizeCurrency(currency);
    const changed = next !== currentCurrency;

    currentCurrency = next;
    syncSelectors();
    if (persist) storeCurrency(currentCurrency);
    if (changed) emitCurrencyChange(source);

    return currentCurrency;
  }

  function bindCurrencySelectors() {
    document.querySelectorAll("[data-currency-select]").forEach((select) => {
      if (select.dataset.boundCurrency === "true") return;
      select.dataset.boundCurrency = "true";
      select.value = currentCurrency;
      select.addEventListener("change", (e) => {
        setCurrency(e.target.value, { persist: true, source: "manual" });
      });
    });
  }

  async function init() {
    if (initPromise) return initPromise;

    initPromise = (async () => {
      bindCurrencySelectors();

      const stored = getStoredCurrency();
      if (stored) {
        setCurrency(stored, { persist: false, source: "stored" });
        return currentCurrency;
      }

      const detected = await detectCurrency();
      setCurrency(detected, { persist: true, source: "geo" });
      return currentCurrency;
    })();

    return initPromise;
  }

  function getCurrentCurrency() {
    return currentCurrency;
  }

  function getNumericPrice(product, currency = currentCurrency) {
    if (!product || !product.pricing) return null;
    const value = product.pricing[currency];
    return typeof value === "number" ? value : null;
  }

  function formatAmount(amount, currency = currentCurrency) {
    const normalized = normalizeCurrency(currency);
    const rounded = Math.round(Number(amount) || 0);
    const number = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(rounded);

    const presentation = getCurrencyPresentation(normalized);
    return `${presentation.prefix}${presentation.separator}${number}`;
  }

  function formatNumberOnly(amount) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(Math.round(Number(amount) || 0));
  }

  function getDisplayPriceParts(product) {
    const note = product?.pricing?.note || "Wholesale Price on request";
    const amount = getNumericPrice(product, currentCurrency);
    const normalized = normalizeCurrency(currentCurrency);
    const presentation = getCurrencyPresentation(normalized);
    const symbolText = presentation.isCodePrefix
      ? `${presentation.prefix} `
      : presentation.prefix;
    const valueText = typeof amount === "number" ? formatNumberOnly(amount) : "";
    const amountText =
      typeof amount === "number"
        ? `${presentation.prefix}${presentation.separator}${valueText}`
        : "";

    return {
      amount,
      currency: normalized,
      symbolText,
      valueText,
      amountText,
      isCodePrefix: presentation.isCodePrefix,
      noteText: note,
      hasAmount: typeof amount === "number",
    };
  }

  function getDisplayPrice(product, options = {}) {
    const includeNote = Boolean(options.includeNote);
    const parts = getDisplayPriceParts(product);

    if (!parts.hasAmount) {
      return parts.noteText;
    }

    if (includeNote && parts.noteText) {
      return `${parts.amountText} · ${parts.noteText}`;
    }

    return parts.amountText;
  }

  return {
    init,
    setCurrency,
    getCurrentCurrency,
    getDisplayPrice,
    getDisplayPriceParts,
    getNumericPrice,
    formatAmount,
    supportedCurrencies: [...SUPPORTED],
    defaultCurrency: DEFAULT_CURRENCY,
  };
})();

// Expose to window so other scripts can consume it reliably.
if (typeof window !== "undefined") {
  window.CurrencyService = CurrencyService;
}
