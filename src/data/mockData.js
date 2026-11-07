/* ============================================================
/* ============================================================
   MOCK DATA — Development fallback when Supabase isn't connected
   ============================================================ */

export const TEAMS = [
  { id: '1', name: 'Kabini Lynx', slug: 'kabini-lynx', color_hex: '#8E44AD', crest_url: '/images/logos/lynx.png', sort_order: 1 },
  { id: '2', name: 'Ken Cheetahs', slug: 'ken-cheetahs', color_hex: '#E67E22', crest_url: '/images/logos/cheetahs.png', sort_order: 2 },
  { id: '3', name: 'Shimsha Panthers', slug: 'shimsha-panthers', color_hex: '#2C3E50', crest_url: '/images/logos/panthers.png', sort_order: 3 },
  { id: '4', name: 'Tons Tigers', slug: 'tons-tigers', color_hex: '#F39C12', crest_url: '/images/logos/tiger.png', sort_order: 4 },
  { id: '5', name: 'Orsang Leopards', slug: 'orsang-leopards', color_hex: '#C0392B', crest_url: '/images/logos/leopards.png', sort_order: 5 },
  { id: '6', name: 'Arkavati Lions', slug: 'arkavati-lions', color_hex: '#2980B9', crest_url: '/images/logos/lions.png', sort_order: 6 },
  { id: '7', name: 'Harangi Jaguars', slug: 'harangi-jaguars', color_hex: '#27AE60', crest_url: '/images/logos/jaguars.png', sort_order: 7 },
];

export const JERSEY_STYLES = [
  {
    id: 'cricket',
    number: 1,
    numberStr: '01',
    name: 'Collared Jersey',
    fullName: '01 · Collared Jersey',
    shortName: 'Collared (Polo)',
    subtitle: 'CLASSIC POLO STYLE',
    collar: 'Classic Polo Collar',
    sleeves: 'Half Sleeve',
    tag: 'Classic Polo',
    badge: 'Popular',
    isPopular: true,
    sport: 'Cricket / Polo',
    sportEmoji: '🏏',
    description: 'Classic polo-style collar with a button placket. A timeless athletic look with a comfortable fit.',
  },
  {
    id: 'football',
    number: 2,
    numberStr: '02',
    name: 'Round-Neck Jersey',
    fullName: '02 · Round-Neck Jersey',
    shortName: 'Round-Neck (Crew)',
    subtitle: 'COLLARLESS DESIGN',
    collar: 'Clean Crew Neck',
    sleeves: 'Half Sleeve',
    tag: 'Collarless',
    badge: 'Collarless',
    isPopular: false,
    sport: 'Football / Crew',
    sportEmoji: '⚽',
    description: 'Clean crew-neck design without a collar, offering lightweight comfort and unrestricted movement.',
  },
  {
    id: 'basketball',
    number: 3,
    numberStr: '03',
    name: 'Sleeveless Jersey',
    fullName: '03 · Sleeveless Jersey',
    shortName: 'Sleeveless (Vest)',
    subtitle: 'MAXIMUM MOBILITY',
    collar: 'Athletic Scoop Neck',
    sleeves: 'Sleeveless Cut',
    tag: 'Sleeveless',
    badge: 'High Mobility',
    isPopular: false,
    sport: 'Basketball / Vest',
    sportEmoji: '🏀',
    description: 'Sleeveless athletic design for maximum arm movement, breathability and comfort during intense activities.',
  },
];


const PRODUCT_TYPES = ['jersey'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];


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

// Real jersey mockup images (front and back per team)
const JERSEY_IMAGES = {
  'kabini-lynx': {
    front: '/images/jerseys/kabini-lynx.png',
    back: '/images/jerseys/kabini-lynx-back.jpeg',
  },
  'ken-cheetahs': {
    front: '/images/jerseys/ken-cheetahs.png',
    back: '/images/jerseys/ken-cheetahs-back.jpeg',
  },
  'shimsha-panthers': {
    front: '/images/jerseys/shimsha-panthers.png',
    back: '/images/jerseys/shimsha-panthers-back.jpeg',
  },
  'tons-tigers': {
    front: '/images/jerseys/tons-tigers.png',
    back: '/images/jerseys/tons-tigers-back.jpeg',
  },
  'orsang-leopards': {
    front: '/images/jerseys/orsang-leopards.png',
    back: '/images/jerseys/orsang-leopards-back.jpeg',
  },
  'arkavati-lions': {
    front: '/images/jerseys/arkavati-lions.png',
    back: '/images/jerseys/arkavati-lions-back.jpeg',
  },
  'harangi-jaguars': {
    front: '/images/jerseys/harangi-jaguars.png',
    back: '/images/jerseys/harangi-jaguars-back.jpeg',
  },
};

export const PRODUCT_IMAGES = PRODUCTS.flatMap((product) => {
  const isJersey = product.type === 'jersey';
  const jerseyImg = JERSEY_IMAGES[product.team.slug];

  if (isJersey && jerseyImg) {
    const list = [
      {
        id: String(imageId++),
        product_id: product.id,
        url: jerseyImg.front,
        label: 'Front View',
        sort_order: 0,
      },
    ];

    if (jerseyImg.back) {
      list.push({
        id: String(imageId++),
        product_id: product.id,
        url: jerseyImg.back,
        label: 'Back View',
        sort_order: 1,
      });
    }

    return list;
  }

  return [
    {
      id: String(imageId++),
      product_id: product.id,
      url: `https://placehold.co/600x800/${product.team.color_hex.slice(1)}/ffffff?text=${encodeURIComponent(product.name)}`,
      label: 'Front View',
      sort_order: 0,
    },
  ];
});

export const PRODUCT_VARIANTS = PRODUCTS.flatMap((product) =>
  SIZES.map((size) => ({
    id: String(variantId++),
    product_id: product.id,
    size,
    stock_qty: Math.floor(Math.random() * 20) + 5,
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
