/* ========================================
   PRODUCTS.JS — Golden Motif
   Fetch, cache, and query product data.
   Includes inline fallback data so the site
   works when opened via file:// protocol.
   ======================================== */

/* ── Inline product data (fallback for file:// access) ── */
const _INLINE_PRODUCTS = [
  {
    "id": 1, "slug": "voyager-duffle-bag", "name": "Traveler Leather Duffle",
    "category": "Duffles", "priceLabel": "Price on request",
    "description": "Built for the discerning traveler, this full-grain leather duffle features reinforced handles, a detachable shoulder strap, and a generous interior with a shoe compartment.",
    "images": ["ASSESTS/Duffle bag_8/1.png","ASSESTS/Duffle bag_8/2.png","ASSESTS/Duffle bag_8/3.png","ASSESTS/Duffle bag_8/4.png"],
    "material": "Full-Grain Buffalo Leather", "sku": "GM-DF-001", "featured": true,
    "availability": "Available", "tags": ["duffle","travel","premium","unisex"], "createdAt": "2025-09-10T00:00:00Z"
  },
  {
    "id": 2, "slug": "leather-apron", "name": "Leather Apron",
    "category": "Aprons", "priceLabel": "Price on request",
    "description": "Designed for craftspeople and culinary artists, this heavy-duty leather apron features adjustable cross-back straps and riveted tool pockets.",
    "images": ["ASSESTS/Aprons/1.png","ASSESTS/Aprons/2.png","ASSESTS/Aprons/3.png","ASSESTS/Aprons/4.png"],
    "material": "Oiled Pull-Up Leather", "sku": "GM-AP-001", "featured": true,
    "availability": "Available", "tags": ["apron","leather","artisan","unisex"], "createdAt": "2026-01-20T00:00:00Z"
  },
  {
    "id": 3, "slug": "heritage-travel-bag", "name": "Leather Backpack (Unisex)",
    "category": "Travel Bags", "priceLabel": "Price on request",
    "description": "A substantial travel companion in rich, full-grain leather. Features multiple external pockets, an internal laptop sleeve, and hand-burnished edges.",
    "images": ["ASSESTS/Travel bag_9/1.png","ASSESTS/Travel bag_9/2.png","ASSESTS/Travel bag_9/3.png","ASSESTS/Travel bag_9/4.png"],
    "material": "Saddle-Stitched Cowhide", "sku": "GM-TB-001", "featured": true,
    "availability": "Available", "tags": ["travel","heritage","laptop","unisex"], "createdAt": "2025-11-28T00:00:00Z"
  },
  {
    "id": 4, "slug": "classic-leather-handbag", "name": "Leather Convertible Shoulder Bag & Backpack",
    "category": "Handbags", "priceLabel": "Price on request",
    "description": "A timeless leather handbag crafted from full-grain cowhide, featuring hand-stitched seams and polished brass hardware. The spacious interior accommodates daily essentials with elegance.",
    "images": ["ASSESTS/Lady's handbag_11/1.png","ASSESTS/Lady's handbag_11/2.png","ASSESTS/Lady's handbag_11/3.png","ASSESTS/Lady's handbag_11/4.png"],
    "material": "Full-Grain Cowhide Leather", "sku": "GM-HB-001", "featured": true,
    "availability": "Available", "tags": ["handbag","classic","leather","women"], "createdAt": "2025-11-15T00:00:00Z"
  },
  {
    "id": 5, "slug": "wallet-clutch-for-ladies", "name": "Wallet Clutch for Ladies",
    "category": "Clutches", "priceLabel": "Price on request", "imageFit": "contain",
    "description": "An elegant wallet clutch designed for the modern woman. Features a spacious interior with card slots, a zip compartment, and a detachable wrist strap for versatile styling.",
    "images": ["ASSESTS/Lady's clutch_11/1.png","ASSESTS/Lady's clutch_11/2.png","ASSESTS/Lady's clutch_11/3.png","ASSESTS/Lady's clutch_11/4.png"],
    "material": "Embossed Calfskin", "sku": "GM-CL-001", "featured": true,
    "availability": "Available", "tags": ["clutch","evening","women","embossed"], "createdAt": "2026-01-12T00:00:00Z"
  },
  {
    "id": 6, "slug": "evening-clutch", "name": "Ladies Evening Bag",
    "category": "Clutches", "priceLabel": "Price on request",
    "description": "An exquisite clutch for evening occasions, featuring hand-embossed detailing and a satin-lined interior. Includes a slim chain strap for hands-free elegance.",
    "images": ["ASSESTS/Lady's purse green_7/1.png","ASSESTS/Lady's purse green_7/2.png","ASSESTS/Lady's purse green_7/3.png","ASSESTS/Lady's purse green_7/4.png"],
    "material": "Smooth Calfskin Leather", "sku": "GM-CL-002", "featured": false,
    "availability": "Available", "tags": ["clutch","wallet","ladies","women"], "createdAt": "2025-10-01T00:00:00Z"
  },
  {
    "id": 7, "slug": "urban-crossbody-bag", "name": "Crossbody Bag (Unisex)",
    "category": "Crossbody", "priceLabel": "Price on request",
    "description": "A compact crossbody designed for the modern urbanite. Adjustable strap, secure magnetic closure, and multiple interior pockets keep everything organized.",
    "images": ["ASSESTS/Crossbody bag_8/1.png","ASSESTS/Crossbody bag_8/2.png","ASSESTS/Crossbody bag_8/3.png","ASSESTS/Crossbody bag_8/4.png"],
    "material": "Pebbled Calfskin Leather", "sku": "GM-CB-001", "featured": true,
    "availability": "Available", "tags": ["crossbody","urban","compact","unisex"], "createdAt": "2025-10-20T00:00:00Z"
  },
  {
    "id": 8, "slug": "premium-shaving-kit", "name": "Luxury Toiletries Pouch - Large",
    "category": "Travel Bags", "priceLabel": "Price on request",
    "description": "A waterproof-lined leather toiletry case with a wide-mouth opening, interior mesh pockets, and a sturdy carry handle. Ideal for the well-traveled gentleman.",
    "images": ["ASSESTS/Shaving Kit large_9/1.png","ASSESTS/Shaving Kit large_9/2.png","ASSESTS/Shaving Kit large_9/3.png","ASSESTS/Shaving Kit large_9/4.png"],
    "material": "Waxed Canvas & Leather", "sku": "GM-SK-001", "featured": false,
    "availability": "Available", "tags": ["shaving-kit","toiletry","travel","men"], "createdAt": "2025-08-20T00:00:00Z"
  },
  {
    "id": 9, "slug": "compact-toiletry-case", "name": "Luxury Toiletries Pouch - Medium",
    "category": "Travel Bags", "priceLabel": "Price on request",
    "description": "A compact and lightweight version of our signature toiletry case, perfect for weekend getaways. Lined with water-resistant fabric and secured with a YKK brass zipper.",
    "images": ["ASSESTS/Shaving Kit medium_6/1.png","ASSESTS/Shaving Kit medium_6/2.png","ASSESTS/Shaving Kit medium_6/3.png","ASSESTS/Shaving Kit medium_6/4.png"],
    "material": "Top-Grain Leather", "sku": "GM-SK-002", "featured": false,
    "availability": "Available", "tags": ["toiletry","compact","travel","unisex"], "createdAt": "2025-09-05T00:00:00Z"
  },
  {
    "id": 10, "slug": "heritage-leather-jacket", "name": "Men's Leather Jacket",
    "category": "Jackets", "priceLabel": "Price on request",
    "description": "A timeless moto-inspired jacket crafted from supple lambskin leather with satin lining. Features antique copper hardware and an adjustable hem for a perfect fit.",
    "images": ["ASSESTS/Jacket_5/1.png","ASSESTS/Jacket_5/2.png","ASSESTS/Jacket_5/3.png","ASSESTS/Jacket_5/4.png"],
    "material": "Lambskin Leather", "sku": "GM-JK-001", "featured": false,
    "availability": "Made to order", "tags": ["jacket","moto","heritage","unisex"], "createdAt": "2025-08-01T00:00:00Z"
  },
  {
    "id": 11, "slug": "executive-bifold-wallet", "name": "Men's Leather Wallet - Brown",
    "category": "Wallets", "priceLabel": "Price on request",
    "description": "Slim bifold wallet with RFID-blocking lining, six card slots, and a full-length bill compartment. Precision-cut from a single hide for seamless quality.",
    "images": ["ASSESTS/Wallets_7/1.png","ASSESTS/Wallets_7/2.png","ASSESTS/Wallets_7/3.png","ASSESTS/Wallets_7/4.png"],
    "material": "Nappa Leather", "sku": "GM-WL-001", "featured": true,
    "availability": "Available", "tags": ["wallet","bifold","executive","men"], "createdAt": "2026-01-05T00:00:00Z"
  },
  {
    "id": 12, "slug": "mens-leather-wallet-black", "name": "Men's Leather Wallet - Black",
    "category": "Wallets", "priceLabel": "Price on request",
    "description": "A sleek black leather wallet crafted from premium full-grain leather with a refined finish. Features multiple card slots, a bill compartment, and RFID-blocking technology for everyday sophistication.",
    "images": ["ASSESTS/Wallets_7/2.png"],
    "material": "Full-Grain Leather", "sku": "GM-WL-002", "featured": false,
    "availability": "Available", "tags": ["wallet","black","leather","men"], "createdAt": "2026-02-17T00:00:00Z"
  },
  {
    "id": 13, "slug": "mens-leather-belt", "name": "Men's Leather Belt",
    "category": "Belts", "priceLabel": "Price on request",
    "description": "A refined belt handcrafted from full-grain leather with a solid brass buckle. The raw edge finish showcases the natural leather character.",
    "images": ["ASSESTS/Waist belts_9/1.png","ASSESTS/Waist belts_9/2.png","ASSESTS/Waist belts_9/3.png","ASSESTS/Waist belts_9/4.png"],
    "material": "Bridle Leather", "sku": "GM-BT-001", "featured": false,
    "availability": "Available", "tags": ["belt","leather","brass","men"], "createdAt": "2025-12-15T00:00:00Z"
  }
];

const ProductStore = (() => {
  let _products = null;
  let _loading = false;
  let _callbacks = [];

  /**
   * Load products — tries fetch first (works on HTTP server),
   * falls back to inline data (works on file:// protocol)
   */
  async function loadProducts() {
    if (_products) return _products;
    if (_loading) {
      return new Promise(resolve => _callbacks.push(resolve));
    }
    _loading = true;
    try {
      const resp = await fetch('data/products.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      _products = await resp.json();
    } catch (err) {
      console.info('[Golden Motif] Using inline product data (file:// mode).');
      _products = _INLINE_PRODUCTS;
    } finally {
      _loading = false;
      _callbacks.forEach(cb => cb(_products));
      _callbacks = [];
    }
    return _products;
  }

  async function getAll() { return await loadProducts(); }

  async function getBySlug(slug) {
    const products = await loadProducts();
    return products.find(p => p.slug === slug) || null;
  }

  async function getByCategory(category) {
    const products = await loadProducts();
    if (!category || category === 'All') return products;
    return products.filter(p => p.category === category);
  }

  async function getFeatured() {
    const products = await loadProducts();
    return products.filter(p => p.featured);
  }

  async function getCategories() {
    const products = await loadProducts();
    return [...new Set(products.map(p => p.category))].sort();
  }

  function search(query, products) {
    if (!query) return products;
    const q = query.toLowerCase().trim();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  function sort(products, sortKey = 'featured') {
    const sorted = [...products];
    switch (sortKey) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'name-az':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }

  async function getRelated(product, limit = 4) {
    const products = await loadProducts();
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  }

  return { getAll, getBySlug, getByCategory, getFeatured, getCategories, getRelated, search, sort };
})();
