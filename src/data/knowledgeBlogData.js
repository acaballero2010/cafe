// Knowledge Base, Beverage Blog & Barista Support Center Data for PourCraft OS

export const KNOWLEDGE_ARTICLES = [
  {
    id: 'kb-espresso-dialing',
    title: 'The Specialty Espresso Dialing Guide: Yield, Time & TDS',
    category: 'espresso',
    categoryName: 'Espresso Science',
    readTime: '4 min read',
    publishedDate: 'Sept 2026',
    author: 'Chef Marco D., Head Beverage Architect',
    summary: 'Master the 1:2 extraction ratio, target 9.0–10.5% TDS, and eliminate sour under-extraction or bitter astringency.',
    content: `
### 1. The Standard 1:2 Brew Ratio
For medium-to-light roasts commonly used in Philippine specialty cafes:
* **Dose:** 18.0g freshly ground specialty coffee in a precision 18g basket.
* **Target Yield:** 36.0g liquid espresso (1:2 brew ratio).
* **Extraction Time:** 26 to 30 seconds at 9 bars of pressure with a 3-second pre-infusion.

### 2. Diagnosing Taste Defects
* **Sour & Salty (Under-extracted):** Grind finer, increase brew temperature to 93.5°C, or extend yield from 36g to 38g.
* **Bitter, Dry & Astringent (Over-extracted):** Grind coarser, decrease yield to 34g, or reduce brew water temperature to 91.5°C.

### 3. Brix & Extraction Yield
A well-extracted espresso double shot sits around **9.0° to 10.5° Brix**, delivering maximum body and aromatic crema without oily bitterness.
    `,
    tags: ['Dialing', 'Espresso', 'Extraction', 'SOP']
  },
  {
    id: 'kb-milk-steaming-physics',
    title: 'Milk Steaming Chemistry: Why 60°C is the Sweet Spot',
    category: 'milk',
    categoryName: 'Milk & Dairy Science',
    readTime: '3 min read',
    publishedDate: 'Sept 2026',
    author: 'Aiko Tanaka, Beverage Chemist',
    summary: 'Understanding whey protein denaturation, lactose thermal sweetening, and plant-based oat milk microfoam stability.',
    content: `
### The Science of Lactose Sweetness
Natural lactose in dairy milk tastes perceived sweetest between **55°C and 65°C**.

### Why Not Go Above 70°C?
* Heating dairy beyond 70°C denatures whey proteins (specifically *beta-lactoglobulin*).
* Denatured proteins release sulfur notes (that "boiled milk" aroma) and break the microfoam surface tension, turning silky foam into dry, stiff bubbles.

### Plant-Based Oat Milk Rules
* Oat milk proteins are sensitive to high temperatures. Steam strictly to **58°C** to prevent oat oils and dipotassium phosphate stabilizers from curdling or separating.
    `,
    tags: ['Milk Chemistry', 'Microfoam', 'Latte Art', 'Oat Milk']
  },
  {
    id: 'kb-matcha-mastery',
    title: 'Ceremonial Uji Matcha: Whisking, Water Temp & Sifting',
    category: 'matcha',
    categoryName: 'Tea Mastery',
    readTime: '5 min read',
    publishedDate: 'Aug 2026',
    author: 'Kenji Ramos, Tea Sommelier',
    summary: 'How to preserve vivid chlorophyll green, extract sweet L-Theanine, and prevent catechin bitterness in cold clouds.',
    content: `
### 1. Temperature Control
* **Never use boiling 100°C water.** Water above 80°C scorches amino acids (L-Theanine) and causes harsh astringency.
* **Ideal Temperature:** 70°C to 75°C.

### 2. Sifting is Non-Negotiable
Static electricity and humidity cause ceremonial matcha powder to form tiny electrostatic clumps. Always pass 3g to 4g through an 80-mesh fine stainless sieve into your chawan.

### 3. The "W" Motion
Whisk with a 100-prong bamboo chasen in a rapid 'W' or 'M' wrist motion for 20 seconds to aerate microscopic crema on top.
    `,
    tags: ['Matcha', 'Japanese Tea', 'L-Theanine', 'Ceremonial']
  },
  {
    id: 'kb-cogs-margin-strategy',
    title: 'Commercial Beverage Costing: Achieving 75%+ Gross Margin in PH',
    category: 'costing',
    categoryName: 'Cafe Economics',
    readTime: '4 min read',
    publishedDate: 'Sept 2026',
    author: 'Bea Alcantara, Cafe Financial Consultant',
    summary: 'Accounting for waste scrap, ice displacement math, packaging costs, and GrabFood/FoodPanda 25% commission buffers.',
    content: `
### 1. The Real COGS Formula
True beverage portion cost must include:
* **Liquid raw ingredients:** Syrups, espresso beans, dairy/oat milk.
* **Prep Scrap Rate (5–8%):** Spillage, pitcher retention, purge waste.
* **Packaging & Disposables:** 16oz PET/PP cup (₱3.50), dome/flat lid (₱1.20), straw/seal (₱0.80), cup sleeve (₱0.90) = **~₱6.40**.

### 2. Ice Displacement Savings
A 16oz cup filled with 140g ice requires only **~240ml of liquid ingredients** instead of 473ml. Factoring in ice volume reduces dairy costs by over 45%!

### 3. Platform Delivery Commissions (GrabFood & FoodPanda)
Delivery platforms charge **25% merchant commission**. To maintain a 75% gross margin on delivery:
* Dine-In Price: ₱180.00 (COGS ₱42.00 = 76.6% GM)
* GrabFood Markup Price: **₱240.00** (Payout after 25% fee = ₱180.00, preserving margin).
    `,
    tags: ['COGS', 'Economics', 'GrabFood', 'Pricing']
  }
]

export const BLOG_POSTS = [
  {
    id: 'blog-pistachio-kunafa',
    title: 'The Viral Dubai Pistachio Kunafa Latte: Formulation Breakdown',
    category: 'Trends',
    date: 'Sept 2026',
    views: '3.4k reads',
    author: 'Chef Marco D.',
    image: '/beverages/caramel-macchiato.jpg',
    excerpt: 'How Manila specialty cafes are turning pure Sicilian pistachio paste and toasted kataifi pastry into ₱240 high-margin beverage sensations.',
    readTime: '3 min read'
  },
  {
    id: 'blog-sea-salt-clouds',
    title: 'The Chemistry of Long-Lasting Sea Salt Cream Clouds',
    category: 'Food Science',
    date: 'Sept 2026',
    views: '2.8k reads',
    author: 'Aiko Tanaka',
    image: '/beverages/brown-sugar-shaken.jpg',
    excerpt: 'Why 10% heavy whipping cream plus 0.5g pink Himalayan sea salt keeps cold foam suspended over iced americanos for 25+ minutes.',
    readTime: '4 min read'
  },
  {
    id: 'blog-shopee-lazada-sourcing',
    title: 'Top Wholesale Ingredient Suppliers on Shopee & Lazada for PH Cafes',
    category: 'Sourcing & Supply',
    date: 'Sept 2026',
    views: '4.1k reads',
    author: 'Gourmet Direct Sourcing Team',
    image: '/beverages/takeaway-iced-cup.jpg',
    excerpt: 'Comparing Oatside vs Oatly case prices, Uji Ceremonial matcha tins, and Torani syrups with affiliate rebate links.',
    readTime: '5 min read'
  }
]

export const TROUBLESHOOTING_FAQS = [
  {
    id: 'faq-layers-mixing',
    category: 'Physics & Layering',
    question: 'Why are my drink layers mixing immediately instead of floating cleanly?',
    answer: 'Layers separate due to Brix density differences. The bottom layer must have a higher Brix (°Bx) than the top layer (e.g. 60°Bx syrup at bottom, 12°Bx milk in middle, 9°Bx espresso on top). Always pour hot espresso slowly over dense ice cubes or down the back of an inverted bar spoon to minimize liquid kinetic turbulence.'
  },
  {
    id: 'faq-citrus-curdling',
    category: 'Food Chemistry',
    question: 'Why does my milk curdle when making Yuzu or Lemon Espresso Tonics?',
    answer: 'Citrus juice has a low pH (2.2 to 2.8). When acid comes into contact with dairy casein proteins at room temperature, it causes rapid coagulation (curdling). For citrus tonics, use sparkling water, tonic, or oat milk rather than whole dairy milk, or separate the citrus base with dense ice.'
  },
  {
    id: 'faq-cold-foam-deflating',
    category: 'Foam Stabilization',
    question: 'My cold foam collapses and dissolves into the iced drink within 3 minutes. How to fix?',
    answer: 'Cold foam requires chilled dairy fats (3.5–4.0°C) and a blend of 60% fresh whole milk and 40% heavy whipping cream. Adding 10ml of condensed milk or vanilla syrup provides structural viscosity that traps micro-bubbles for 20+ minutes.'
  },
  {
    id: 'faq-affiliate-links',
    category: 'Platform & Sourcing',
    question: 'How do the Shopee & Lazada affiliate store links work in PourCraft OS?',
    answer: 'When viewing any ingredient layer in the Studio or Wholesale Marketplace, tapping "🛒 Compare Stores & Buy" generates verified affiliate checkout links with your affiliate partner ID attached. Baristas and cafes get price transparency, and operators earn affiliate commissions on ingredient restocks.'
  },
  {
    id: 'faq-cogs-tax',
    category: 'Costing & Accounting',
    question: 'Does the live COGS calculator include 12% PH VAT and packaging?',
    answer: 'Yes! The costing engine accounts for unit net prices, optional scrap waste percentage (5%), and packaging items (PET cup, dome lid, straw, seal, sleeve). You can toggle waste scrap on or off in the Studio settings.'
  }
]
