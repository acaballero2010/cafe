/**
 * Master Supplier Catalog & Sample Wholesale Pricelists
 */

export const MASTER_SUPPLIERS = [
  {
    id: 'sup-gourmet-ph',
    name: 'Gourmet Direct PH',
    category: 'Specialty Dairy & Oat Milk',
    rating: 4.9,
    terms: 'Net-30',
    minOrderPhp: 5000,
    leadTimeDays: 1,
    contact: 'orders@gourmetdirect.ph | +63 917 888 1234',
    region: 'Metro Manila & Luzon',
    status: 'verified',
    skuCount: 42
  },
  {
    id: 'sup-hacienda-dairy',
    name: 'Hacienda Fresh Dairy Co.',
    category: 'Fresh Farm Milk & Heavy Cream',
    rating: 4.8,
    terms: 'Net-15',
    minOrderPhp: 3500,
    leadTimeDays: 1,
    contact: 'wholesale@haciendadairy.com.ph | +63 918 555 9876',
    region: 'Metro Manila & Calabarzon',
    status: 'verified',
    skuCount: 18
  },
  {
    id: 'sup-kyoto-uji',
    name: 'Kyoto Uji Botanicals PH',
    category: 'Ceremonial Matcha & Hojicha Powder',
    rating: 5.0,
    terms: 'Net-30',
    minOrderPhp: 8000,
    leadTimeDays: 2,
    contact: 'imports@kyotouji.ph | +63 920 333 4455',
    region: 'Nationwide (Air Express)',
    status: 'verified',
    skuCount: 26
  },
  {
    id: 'sup-boba-king',
    name: 'Boba King Wholesale Supply',
    category: 'Tapioca Pearls, Syrups & Toppings',
    rating: 4.7,
    terms: 'COD / GCash',
    minOrderPhp: 2500,
    leadTimeDays: 1,
    contact: 'sales@bobakingph.com | +63 917 222 7788',
    region: 'Metro Manila & Cebu',
    status: 'verified',
    skuCount: 84
  },
  {
    id: 'sup-sweet-syrup',
    name: 'SweetSyrup Labs Artisanal',
    category: 'Craft Caramel, Vanilla & Fruit Purees',
    rating: 4.9,
    terms: 'Net-30',
    minOrderPhp: 4000,
    leadTimeDays: 2,
    contact: 'craft@sweetsyruplabs.ph | +63 919 111 2233',
    region: 'Nationwide',
    status: 'verified',
    skuCount: 35
  },
  {
    id: 'sup-ecopack',
    name: 'EcoPack Direct PH',
    category: 'PLA Clear Cups, Hot Paper Cups & Straws',
    rating: 4.8,
    terms: 'Net-30',
    minOrderPhp: 6000,
    leadTimeDays: 2,
    contact: 'orders@ecopackdirect.ph | +63 917 999 0011',
    region: 'Nationwide',
    status: 'verified',
    skuCount: 52
  }
]

export const SAMPLE_PRICELISTS = {
  'sup-gourmet-ph': [
    { skuId: 'oatly-barista', name: 'Oatly Barista Edition (1L)', category: 'Dairy & Plant', oldPrice: 210.00, newPrice: 235.00, uom: 'ml', packSize: 1000, unitCost: 0.235, moq: 6, effectiveDate: '2026-10-01' },
    { skuId: 'califia-almond', name: 'Califia Farms Barista Almond Milk (1L)', category: 'Dairy & Plant', oldPrice: 195.00, newPrice: 210.00, uom: 'ml', packSize: 1000, unitCost: 0.210, moq: 6, effectiveDate: '2026-10-01' },
    { skuId: 'minor-figures-oat', name: 'Minor Figures Barista Oat (1L)', category: 'Dairy & Plant', oldPrice: 200.00, newPrice: 200.00, uom: 'ml', packSize: 1000, unitCost: 0.200, moq: 6, effectiveDate: '2026-10-01' }
  ],
  'sup-hacienda-dairy': [
    { skuId: 'fresh-dairy-milk', name: 'Hacienda Fresh Whole Milk (1L)', category: 'Dairy & Plant', oldPrice: 95.00, newPrice: 110.00, uom: 'ml', packSize: 1000, unitCost: 0.110, moq: 12, effectiveDate: '2026-10-01' },
    { skuId: 'heavy-cream-fresh', name: 'Hacienda Barista Heavy Cream 35% (1L)', category: 'Dairy & Plant', oldPrice: 280.00, newPrice: 310.00, uom: 'ml', packSize: 1000, unitCost: 0.310, moq: 4, effectiveDate: '2026-10-01' },
    { skuId: 'condensed-milk-pure', name: 'Farm-Fresh Sweetened Condensed Milk (1kg)', category: 'Dairy & Plant', oldPrice: 130.00, newPrice: 145.00, uom: 'g', packSize: 1000, unitCost: 0.145, moq: 6, effectiveDate: '2026-10-01' }
  ],
  'sup-kyoto-uji': [
    { skuId: 'ceremonial-uji-matcha', name: 'Ceremonial Grade Uji Matcha (100g Tin)', category: 'Powders & Tea', oldPrice: 850.00, newPrice: 920.00, uom: 'g', packSize: 100, unitCost: 9.20, moq: 2, effectiveDate: '2026-10-01' },
    { skuId: 'culinary-matcha-powder', name: 'Organic Barista Culinary Matcha (500g)', category: 'Powders & Tea', oldPrice: 1450.00, newPrice: 1450.00, uom: 'g', packSize: 500, unitCost: 2.90, moq: 1, effectiveDate: '2026-10-01' },
    { skuId: 'roasted-hojicha-powder', name: 'Kyoto Micro-Ground Hojicha (250g)', category: 'Powders & Tea', oldPrice: 950.00, newPrice: 980.00, uom: 'g', packSize: 250, unitCost: 3.92, moq: 2, effectiveDate: '2026-10-01' }
  ]
}
