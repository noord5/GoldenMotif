/* Build-time price formatting. Mirrors public/js/currency.js so the static HTML
   shows the same text the browser would show for the default currency. */
export const DEFAULT_CURRENCY = "EUR";

function presentation(currency) {
  switch (currency) {
    case "USD": return { prefix: "$", separator: "", isCodePrefix: false };
    case "EUR": return { prefix: "€", separator: "", isCodePrefix: false };
    case "CAD": return { prefix: "CAD", separator: " ", isCodePrefix: true };
    default: return { prefix: currency, separator: " ", isCodePrefix: true };
  }
}

const num = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(Number(n) || 0));

export function priceParts(product, currency = DEFAULT_CURRENCY) {
  const note = product?.pricing?.note || "Wholesale Price on request";
  const amount = product?.pricing?.[currency];
  const p = presentation(currency);
  const hasAmount = typeof amount === "number";
  return {
    hasAmount,
    noteText: note,
    isCodePrefix: p.isCodePrefix,
    symbolText: p.isCodePrefix ? `${p.prefix} ` : p.prefix,
    valueText: hasAmount ? num(amount) : "",
    amountText: hasAmount ? `${p.prefix}${p.separator}${num(amount)}` : "",
  };
}

export function priceText(product, currency = DEFAULT_CURRENCY) {
  const parts = priceParts(product, currency);
  return parts.hasAmount ? parts.amountText : parts.noteText;
}
