/* ============================================================
   MOCK DATA — Development fallback when Supabase isn't connected
   ============================================================ */

export const TEAMS = [
  { id: '1', name: 'Kabini Lynx', slug: 'kabini-lynx', color_hex: '#8E44AD', crest_url: null, sort_order: 1 },
  { id: '2', name: 'Ken Cheetahs', slug: 'ken-cheetahs', color_hex: '#E67E22', crest_url: null, sort_order: 2 },
  { id: '3', name: 'Shimsha Panthers', slug: 'shimsha-panthers', color_hex: '#2C3E50', crest_url: null, sort_order: 3 },
  { id: '4', name: 'Tons Tigers', slug: 'tons-tigers', color_hex: '#F39C12', crest_url: null, sort_order: 4 },
  { id: '5', name: 'Orsang Leopards', slug: 'orsang-leopards', color_hex: '#C0392B', crest_url: null, sort_order: 5 },
  { id: '6', name: 'Arkavati Lions', slug: 'arkavati-lions', color_hex: '#2980B9', crest_url: null, sort_order: 6 },
  { id: '7', name: 'Harangi Jaguars', slug: 'harangi-jaguars', color_hex: '#27AE60', crest_url: null, sort_order: 7 },
];

const PRODUCT_TYPES = ['jersey'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// Price in paise
const PRICES = {
  jersey: 40000,  // ₹400
};

// Generate placeholder products for each team
let productId = 1;
let variantId = 1;
let imageId = 1;

export const PRODUCTS = TEAMS.flatMap((team) =>
  PRODUCT_TYPES.map((type) => {
    const id = String(productId++);
    const name = `${team.name} Jersey`;
    const slug = `${team.slug}-jersey`;
    return {
      id,
      team_id: team.id,
      name,
      slug,
      type,
      price: PRICES[type],
      description: `Official HPL ${team.name} jersey. Premium quality, designed for comfort and style. Show your team pride on and off the field.`,
      is_bestseller: true,
      is_new: false,
      team: team,
    };
  })
);

// Real jersey mockup images (one per team)
const JERSEY_IMAGES = {
  'kabini-lynx':     '/images/jerseys/kabini-lynx.png',
  'ken-cheetahs':    '/images/jerseys/ken-cheetahs.png',
  'shimsha-panthers':'/images/jerseys/shimsha-panthers.png',
  'tons-tigers':     '/images/jerseys/tons-tigers.png',
  'orsang-leopards': '/images/jerseys/orsang-leopards.png',
  'arkavati-lions':  '/images/jerseys/arkavati-lions.png',
  'harangi-jaguars': '/images/jerseys/harangi-jaguars.png',
};

export const PRODUCT_IMAGES = PRODUCTS.map((product) => {
  // Use the real jersey photo for jersey-type products
  const isJersey = product.type === 'jersey';
  const url = isJersey
    ? (JERSEY_IMAGES[product.team.slug] || `https://placehold.co/600x800/${product.team.color_hex.slice(1)}/ffffff?text=${encodeURIComponent(product.name)}`)
    : `https://placehold.co/600x800/${product.team.color_hex.slice(1)}/ffffff?text=${encodeURIComponent(product.name)}`;
  return {
    id: String(imageId++),
    product_id: product.id,
    url,
    sort_order: 0,
  };
});

export const PRODUCT_VARIANTS = PRODUCTS.flatMap((product) =>
  SIZES.map((size) => ({
    id: String(variantId++),
    product_id: product.id,
    size,
    stock_qty: size === 'XXL' ? 0 : Math.floor(Math.random() * 20) + 5, // XXL out of stock for demo
  }))
);

export const DROPS = [
  {
    id: '1',
    title: 'Season 3 Drop',
    ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    is_active: true,
  },
];

// Helper to get products with images and team data
export function getProductsWithDetails(filters = {}) {
  let filtered = [...PRODUCTS];

  if (filters.teamSlug) {
    const team = TEAMS.find((t) => t.slug === filters.teamSlug);
    if (team) filtered = filtered.filter((p) => p.team_id === team.id);
  }

  if (filters.type) {
    filtered = filtered.filter((p) => p.type === filters.type);
  }

  return filtered.map((product) => ({
    ...product,
    images: PRODUCT_IMAGES.filter((img) => img.product_id === product.id),
    variants: PRODUCT_VARIANTS.filter((v) => v.product_id === product.id),
  }));
}

export function getProductBySlug(slug) {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  return {
    ...product,
    images: PRODUCT_IMAGES.filter((img) => img.product_id === product.id),
    variants: PRODUCT_VARIANTS.filter((v) => v.product_id === product.id),
  };
}

export function getTeamBySlug(slug) {
  return TEAMS.find((t) => t.slug === slug) || null;
}

export function getActiveDrop() {
  return DROPS.find((d) => d.is_active && new Date(d.ends_at) > new Date()) || null;
}

export function getBestsellers() {
  return getProductsWithDetails().filter((p) => p.is_bestseller);
}

// Format price from paise to rupees
export function formatPrice(paise) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}
