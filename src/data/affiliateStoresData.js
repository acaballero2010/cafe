/**
 * Multi-Store Affiliate & Sourcing Catalog for Philippine Beverage Ingredients
 * Includes Shopee Mall, Lazada Flagship, TikTok Shop, and Direct Wholesale Suppliers.
 */

export const AFFILIATE_CONFIG = {
  shopeeAffiliateId: 'pourcraft_ph_shopee',
  lazadaAffiliateId: 'pourcraft_ph_lazada',
  tiktokAffiliateId: 'pourcraft_ph_tiktok',
  defaultCommissionRatePct: 6.5
}

export function generateAffiliateLink(platform, rawUrl, affiliateId) {
  if (!rawUrl) return '#'
  const id = affiliateId || (platform === 'Shopee' ? AFFILIATE_CONFIG.shopeeAffiliateId : AFFILIATE_CONFIG.lazadaAffiliateId)
  const separator = rawUrl.includes('?') ? '&' : '?'
  return `${rawUrl}${separator}aff_id=${id}&utm_source=pourcraft_os&utm_medium=recipe_builder`
}

export const INGREDIENT_STORE_OFFERS = {
  'oatly-barista': [
    {
      id: 'offer-oatly-shopee-official',
      platform: 'Shopee Mall',
      sellerName: 'Oatly Official Store PH',
      isOfficialMall: true,
      packSize: '1 Liter',
      pricePhp: 210.00,
      unitCostPerMl: 0.210,
      rating: 4.9,
      reviewCount: 3840,
      deliveryEta: 'Tomorrow • Metro Manila Express',
      shippingFee: 0,
      badge: '⚡ Official Mall • Free Shipping',
      affiliateUrl: 'https://shopee.ph/Oatly-Barista-Edition-Oat-Milk-1L-i.1029384.9281749',
      inStock: true
    },
    {
      id: 'offer-oatly-lazada-flagship',
      platform: 'Lazada Flagship',
      sellerName: 'Oatly Philippines Flagship',
      isOfficialMall: true,
      packSize: 'Case of 6 x 1L (₱205/L)',
      pricePhp: 1230.00,
      unitCostPerMl: 0.205,
      rating: 4.9,
      reviewCount: 1920,
      deliveryEta: '2-3 Days Nationwide',
      shippingFee: 0,
      badge: '🏷️ Lowest Price / Bulk',
      affiliateUrl: 'https://www.lazada.com.ph/products/oatly-barista-edition-case-of-6-i892174-s19284.html',
      inStock: true
    },
    {
      id: 'offer-oatly-gourmet-direct',
      platform: 'Wholesale Direct',
      sellerName: 'Gourmet Direct PH (B2B)',
      isOfficialMall: false,
      packSize: 'Case of 6 x 1L (Wholesale)',
      pricePhp: 1260.00,
      unitCostPerMl: 0.210,
      rating: 5.0,
      reviewCount: 540,
      deliveryEta: 'Next-Day Commercial Dispatch (Net-30)',
      shippingFee: 150,
      badge: '🏬 Wholesale Net-30 Terms',
      affiliateUrl: 'https://gourmetdirect.ph/products/oatly-barista-case',
      inStock: true
    }
  ],

  'ethiopia-espresso': [
    {
      id: 'offer-ethiopia-shopee',
      platform: 'Shopee Mall',
      sellerName: 'Yardstick Specialty Coffee Roasters',
      isOfficialMall: true,
      packSize: '1kg Specialty Whole Bean',
      pricePhp: 1450.00,
      unitCostPerMl: 0.725,
      rating: 5.0,
      reviewCount: 890,
      deliveryEta: 'Fresh Roast • Ships within 24h',
      shippingFee: 0,
      badge: '🏆 Roaster Fresh • Top Rated',
      affiliateUrl: 'https://shopee.ph/Yardstick-Ethiopia-Guji-Heirloom-1kg-i.883921.39201',
      inStock: true
    },
    {
      id: 'offer-ethiopia-lazada',
      platform: 'Lazada Flagship',
      sellerName: 'Barista Depot Manila',
      isOfficialMall: true,
      packSize: '1kg Nitrogen Sealed Bag',
      pricePhp: 1420.00,
      unitCostPerMl: 0.710,
      rating: 4.8,
      reviewCount: 420,
      deliveryEta: '2 Days Delivery',
      shippingFee: 45,
      badge: '🏷️ Best Price',
      affiliateUrl: 'https://www.lazada.com.ph/products/ethiopia-guji-single-origin-1kg-i910293.html',
      inStock: true
    }
  ],

  'colombia-espresso': [
    {
      id: 'offer-benguet-shopee',
      platform: 'Shopee',
      sellerName: 'Kalsada Coffee Origin PH',
      isOfficialMall: true,
      packSize: '1kg Benguet Arabica',
      pricePhp: 1100.00,
      unitCostPerMl: 0.550,
      rating: 4.9,
      reviewCount: 1450,
      deliveryEta: '1-2 Days Metro Manila',
      shippingFee: 0,
      badge: '🇵🇭 Local PH Single Origin',
      affiliateUrl: 'https://shopee.ph/Kalsada-Coffee-Benguet-Specialty-1kg-i.192039.2910',
      inStock: true
    },
    {
      id: 'offer-benguet-lazada',
      platform: 'Lazada Flagship',
      sellerName: 'Origin Coffee Hub Manila',
      isOfficialMall: true,
      packSize: '1kg Medium Roast Bean',
      pricePhp: 1080.00,
      unitCostPerMl: 0.540,
      rating: 4.8,
      reviewCount: 680,
      deliveryEta: '2 Days Nationwide',
      shippingFee: 40,
      badge: '🏷️ Value Roaster Pack',
      affiliateUrl: 'https://www.lazada.com.ph/products/benguet-arabica-whole-bean-1kg-i392019.html',
      inStock: true
    }
  ],

  'ceremonial-matcha': [
    {
      id: 'offer-matcha-shopee-uji',
      platform: 'Shopee Mall',
      sellerName: 'Kyoto Uji Botanicals Official',
      isOfficialMall: true,
      packSize: '100g Ceremonial Grade Tin',
      pricePhp: 850.00,
      unitCostPerMl: 0.425,
      rating: 5.0,
      reviewCount: 2310,
      deliveryEta: 'Direct Kyoto Import • Ready Stock',
      shippingFee: 0,
      badge: '🍵 100% Ceremonial Uji Grade',
      affiliateUrl: 'https://shopee.ph/Kyoto-Uji-First-Harvest-Ceremonial-Matcha-100g-i.83921.29102',
      inStock: true
    },
    {
      id: 'offer-matcha-lazada',
      platform: 'Lazada Flagship',
      sellerName: 'Matcha Lab Philippines',
      isOfficialMall: true,
      packSize: '500g Commercial Barista Pouch',
      pricePhp: 2850.00,
      unitCostPerMl: 0.285,
      rating: 4.9,
      reviewCount: 1120,
      deliveryEta: '2-3 Days Metro Manila',
      shippingFee: 0,
      badge: '💰 Commercial Bulk Savings',
      affiliateUrl: 'https://www.lazada.com.ph/products/ceremonial-matcha-500g-bulk-pouch-i892019.html',
      inStock: true
    }
  ],

  'salted-caramel-syrup': [
    {
      id: 'offer-monin-caramel-shopee',
      platform: 'Shopee Mall',
      sellerName: 'Monin Official Store Philippines',
      isOfficialMall: true,
      packSize: '700ml Glass Bottle',
      pricePhp: 480.00,
      unitCostPerMl: 0.685,
      rating: 4.9,
      reviewCount: 5400,
      deliveryEta: 'Next-Day Delivery',
      shippingFee: 0,
      badge: '⚡ Official Monin PH',
      affiliateUrl: 'https://shopee.ph/Monin-Salted-Caramel-Syrup-700ml-i.291029.39102',
      inStock: true
    },
    {
      id: 'offer-monin-caramel-lazada',
      platform: 'Lazada Flagship',
      sellerName: 'Allegro Beverage Official Store',
      isOfficialMall: true,
      packSize: '700ml Glass Bottle',
      pricePhp: 465.00,
      unitCostPerMl: 0.664,
      rating: 4.9,
      reviewCount: 3100,
      deliveryEta: '2 Days Delivery',
      shippingFee: 35,
      badge: '🏷️ Lowest Price',
      affiliateUrl: 'https://www.lazada.com.ph/products/monin-salted-caramel-syrup-700ml-i901928.html',
      inStock: true
    }
  ],

  'brown-sugar-syrup': [
    {
      id: 'offer-brownsugar-shopee',
      platform: 'Shopee Mall',
      sellerName: 'Top Creamery Official Store',
      isOfficialMall: true,
      packSize: '2.5kg Commercial Jug',
      pricePhp: 450.00,
      unitCostPerMl: 0.180,
      rating: 4.8,
      reviewCount: 8900,
      deliveryEta: '1-2 Days Metro Manila',
      shippingFee: 0,
      badge: '🧋 Commercial Boba Standard',
      affiliateUrl: 'https://shopee.ph/Top-Creamery-Okinawa-Brown-Sugar-Syrup-2.5kg-i.91029.39102',
      inStock: true
    },
    {
      id: 'offer-brownsugar-lazada',
      platform: 'Lazada Flagship',
      sellerName: 'Boba King Wholesale PH',
      isOfficialMall: true,
      packSize: '2.5kg Heavy Bottle',
      pricePhp: 440.00,
      unitCostPerMl: 0.176,
      rating: 4.7,
      reviewCount: 4200,
      deliveryEta: '2 Days Nationwide',
      shippingFee: 50,
      badge: '🏷️ Lowest Price',
      affiliateUrl: 'https://www.lazada.com.ph/products/taiwan-tiger-brown-sugar-syrup-2-5kg-i89102.html',
      inStock: true
    }
  ],

  'tapioca-pearls': [
    {
      id: 'offer-boba-shopee',
      platform: 'Shopee Mall',
      sellerName: 'Top Creamery Official Store',
      isOfficialMall: true,
      packSize: '1kg Vacuum Pack',
      pricePhp: 120.00,
      unitCostPerMl: 0.120,
      rating: 4.8,
      reviewCount: 12400,
      deliveryEta: 'Tomorrow • Metro Manila',
      shippingFee: 0,
      badge: '🔥 #1 Best Seller',
      affiliateUrl: 'https://shopee.ph/Top-Creamery-Black-Tapioca-Pearls-1kg-i.91029.82910',
      inStock: true
    },
    {
      id: 'offer-boba-lazada',
      platform: 'Lazada Flagship',
      sellerName: 'Boba Supply Warehouse PH',
      isOfficialMall: true,
      packSize: 'Case of 6 x 1kg (₱105/kg)',
      pricePhp: 630.00,
      unitCostPerMl: 0.105,
      rating: 4.8,
      reviewCount: 3900,
      deliveryEta: '2 Days Nationwide',
      shippingFee: 0,
      badge: '💰 Wholesale Bulk Pack',
      affiliateUrl: 'https://www.lazada.com.ph/products/black-pearls-case-of-6-i901928.html',
      inStock: true
    }
  ],

  'vanilla-syrup': [
    {
      id: 'offer-vanilla-shopee',
      platform: 'Shopee Mall',
      sellerName: 'Monin Official Store PH',
      isOfficialMall: true,
      packSize: '700ml Glass Bottle',
      pricePhp: 480.00,
      unitCostPerMl: 0.685,
      rating: 4.9,
      reviewCount: 4100,
      deliveryEta: 'Tomorrow Delivery',
      shippingFee: 0,
      badge: '⚡ Official Monin PH',
      affiliateUrl: 'https://shopee.ph/Monin-Vanilla-Syrup-700ml-i.291029.99182',
      inStock: true
    },
    {
      id: 'offer-vanilla-lazada',
      platform: 'Lazada Flagship',
      sellerName: 'Torani Philippines Store',
      isOfficialMall: true,
      packSize: '750ml PET Bottle',
      pricePhp: 460.00,
      unitCostPerMl: 0.613,
      rating: 4.8,
      reviewCount: 2800,
      deliveryEta: '2-3 Days Nationwide',
      shippingFee: 40,
      badge: '🏷️ Best Value',
      affiliateUrl: 'https://www.lazada.com.ph/products/torani-vanilla-syrup-750ml-i889102.html',
      inStock: true
    }
  ]
}

/**
 * Fallback generator for items without custom manually curated offers
 */
export function getOffersForIngredient(ingredient) {
  if (!ingredient) return []
  const id = ingredient.id || ''
  const name = ingredient.name || ''

  if (INGREDIENT_STORE_OFFERS[id]) {
    return INGREDIENT_STORE_OFFERS[id]
  }

  // Key search matching
  const lower = name.toLowerCase()
  if (lower.includes('oat') || lower.includes('oatly')) return INGREDIENT_STORE_OFFERS['oatly-barista']
  if (lower.includes('matcha')) return INGREDIENT_STORE_OFFERS['ceremonial-matcha']
  if (lower.includes('caramel')) return INGREDIENT_STORE_OFFERS['salted-caramel-syrup']
  if (lower.includes('brown sugar')) return INGREDIENT_STORE_OFFERS['brown-sugar-syrup']
  if (lower.includes('pearl') || lower.includes('boba')) return INGREDIENT_STORE_OFFERS['tapioca-pearls']
  if (lower.includes('vanilla')) return INGREDIENT_STORE_OFFERS['vanilla-syrup']
  if (lower.includes('ethiopia') || lower.includes('espresso')) return INGREDIENT_STORE_OFFERS['ethiopia-espresso']

  // Generic generated multi-store comparison
  const unitCost = ingredient.unitCostPerMl || 0.25
  const estPackPrice = Math.round(unitCost * (ingredient.unitYieldMl || 1000)) || 250

  return [
    {
      id: `gen-shopee-${id}`,
      platform: 'Shopee Mall',
      sellerName: 'Shopee Verified Barista Supply',
      isOfficialMall: true,
      packSize: ingredient.packSize || 'Commercial Standard Pack',
      pricePhp: estPackPrice,
      unitCostPerMl: unitCost,
      rating: 4.9,
      reviewCount: 820,
      deliveryEta: '1-2 Days • Metro Manila',
      shippingFee: 0,
      badge: '⚡ Verified Seller • Free Shipping',
      affiliateUrl: `https://shopee.ph/search?keyword=${encodeURIComponent(name)}`,
      inStock: true
    },
    {
      id: `gen-lazada-${id}`,
      platform: 'Lazada Flagship',
      sellerName: 'Lazada Beverage Mall',
      isOfficialMall: true,
      packSize: ingredient.packSize || 'Commercial Standard Pack',
      pricePhp: Math.round(estPackPrice * 0.96),
      unitCostPerMl: Number((unitCost * 0.96).toFixed(3)),
      rating: 4.8,
      reviewCount: 540,
      deliveryEta: '2-3 Days Nationwide',
      shippingFee: 40,
      badge: '🏷️ Lowest Online Price',
      affiliateUrl: `https://www.lazada.com.ph/catalog/?q=${encodeURIComponent(name)}`,
      inStock: true
    },
    {
      id: `gen-wholesale-${id}`,
      platform: 'Wholesale Direct',
      sellerName: ingredient.supplier || 'Gourmet Direct PH',
      isOfficialMall: false,
      packSize: 'Wholesale Case / Bulk Box',
      pricePhp: Math.round(estPackPrice * 0.92),
      unitCostPerMl: Number((unitCost * 0.92).toFixed(3)),
      rating: 5.0,
      reviewCount: 290,
      deliveryEta: 'Next-Day Commercial Dispatch',
      shippingFee: 150,
      badge: '🏬 Net-30 Wholesale Terms',
      affiliateUrl: `https://gourmetdirect.ph/search?q=${encodeURIComponent(name)}`,
      inStock: true
    }
  ]
}
