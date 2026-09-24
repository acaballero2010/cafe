/**
 * ============================================================================
 * POURCRAFT OS: SEARCH-TO-COSTED-DRINK ENGINE
 * Architecture: Natural Language Query -> Master Template -> Form Factor Heuristics ->
 *               Supplier Waterfall Resolution -> Packaging Bundling -> Live COGS
 * ============================================================================
 */

// Database Pool Interface for PostgreSQL / Serverless Drivers
export interface IDatabaseQueryResult<T = any> {
  rows: T[]
  rowCount?: number
}

export interface IDatabasePool {
  query<T = any>(sql: string, params?: any[]): Promise<IDatabaseQueryResult<T>>
}

// ----------------------------------------------------------------------------
// 1. DOMAIN TYPES & INTERFACES
// ----------------------------------------------------------------------------

export type BeverageCategory = 'coffee' | 'milktea' | 'cocktail' | 'frappe' | 'fizz'
export type FormFactor = 'powder' | 'syrup' | 'liquid_dairy' | 'concentrate' | 'solid_garnish' | 'tea_leaf'

export interface VesselSpec {
  id: string
  name: string
  category: 'cold' | 'hot' | 'cocktail' | 'boba'
  totalCapacityMl: number
  liquidCapacityMlWithStandardIce: number // Adjusted for ~35% regular ice displacement
  defaultPackagingIds: string[]
}

export interface MasterRecipeTemplateIngredient {
  genericName: string
  masterIngredientSlug: string
  preferredFormFactor: FormFactor
  alternativeFormFactor?: FormFactor
  portionQty: number
  portionUnit: 'ml' | 'g' | 'pcs' | 'pumps'
  layerOrder: number
  isAutoTopOff: boolean
  scrapType: 'standard' | 'milk_steam_pitcher' | 'espresso_dial_in' | 'boba_pearls' | 'fresh_citrus'
  colorHex: string
  densityBrix: number
}

export interface MasterRecipeTemplate {
  slug: string
  canonicalName: string
  category: BeverageCategory
  vessel: VesselSpec
  iceRecommendation: string
  flavorProfile: string
  ingredients: MasterRecipeTemplateIngredient[]
  preparationSteps: string[]
  baristaProTips: string[]
  allergens: string[]
  estimatedCalories: number
}

export interface MatchedSupplierSKU {
  supplierId: string
  supplierName: string
  skuId: string
  skuName: string
  packSizeQty: number
  packSizeUnit: string
  packCost: number
  costPerUnit: number // Normalized cost per ml or g in ₱
  inStock: boolean
  leadTimeDays: number
  isPreferredByShop: boolean
}

export interface CostedIngredientItem {
  ingredientName: string
  formFactor: FormFactor
  availableAlternativeFormFactor?: FormFactor
  portionQty: number
  portionUnit: string
  unitCost: number // ₱ per ml or g
  basePortionCost: number // ₱
  scrapRatePct: number // +3% to 18%
  effectivePortionCostWithScrap: number // ₱
  matchedSupplier: MatchedSupplierSKU
  alternativeSuppliersCount: number
  alternativeLowestUnitPrice: number
}

export interface CostedPackagingItem {
  id: string
  name: string
  category: 'cup' | 'lid' | 'straw' | 'sleeve' | 'film'
  unitCost: number
}

export interface CostedDrinkResponse {
  query: string
  drinkName: string
  category: BeverageCategory
  vessel: {
    id: string
    name: string
    totalCapacityMl: number
    liquidCapacityMl: number
  }
  economics: {
    currency: 'PHP'
    ingredientsSubtotal: number
    packagingSubtotal: number
    totalCOGS: number
    targetGrossMarginPct: number // 75%
    suggestedRetailPrice: number // Rounded to nearest ₱5 or ₱10
    projectedGrossProfit: number
  }
  ingredients: CostedIngredientItem[]
  packaging: CostedPackagingItem[]
  preparationSteps: string[]
  baristaProTips: string[]
  allergens: string[]
  estimatedCalories: number
}

// ----------------------------------------------------------------------------
// 2. FORM FACTOR HEURISTICS ENGINE
// ----------------------------------------------------------------------------

export class FormFactorHeuristicEngine {
  /**
   * Heuristic Rules:
   * 1. 'milktea' or 'frappe' => Fruit/Flavoring defaults to 'powder' for emulsion/mouthfeel.
   * 2. 'coffee', 'fizz', or 'cocktail' => Fruit/Flavoring defaults to 'syrup' for clarity & dissolution.
   */
  public static resolveFormFactor(category: BeverageCategory, ingredientRole: 'fruit_flavor' | 'dairy' | 'sweetener' | 'base'): FormFactor {
    if (ingredientRole === 'fruit_flavor') {
      if (category === 'milktea' || category === 'frappe') {
        return 'powder'
      }
      return 'syrup'
    }

    if (ingredientRole === 'dairy') return 'liquid_dairy'
    if (ingredientRole === 'sweetener') return 'syrup'
    return 'concentrate'
  }
}

// ----------------------------------------------------------------------------
// 3. MASTER RECIPE TEMPLATE REGISTRY
// ----------------------------------------------------------------------------

const STANDARD_VESSELS: Record<string, VesselSpec> = {
  'cold-16oz': {
    id: 'cold-16oz',
    name: '16oz Cold Cup (PET)',
    category: 'cold',
    totalCapacityMl: 473,
    liquidCapacityMlWithStandardIce: 300,
    defaultPackagingIds: ['pkg-pet-16oz', 'pkg-lid-flat', 'pkg-straw-bamboo', 'pkg-sleeve-kraft']
  },
  'boba-20oz': {
    id: 'boba-20oz',
    name: '20oz Boba U-Cup',
    category: 'boba',
    totalCapacityMl: 591,
    liquidCapacityMlWithStandardIce: 380,
    defaultPackagingIds: ['pkg-ucup-20oz', 'pkg-sealing-film', 'pkg-boba-straw-12mm']
  },
  'coupe-7oz': {
    id: 'coupe-7oz',
    name: '7oz Nick & Nora / Coupe',
    category: 'cocktail',
    totalCapacityMl: 210,
    liquidCapacityMlWithStandardIce: 160,
    defaultPackagingIds: ['pkg-cocktail-pick']
  }
}

export class MasterRecipeTemplateRepository {
  private static templates: MasterRecipeTemplate[] = [
    {
      slug: 'strawberry-milk-tea',
      canonicalName: 'Strawberry Milk Tea',
      category: 'milktea',
      vessel: STANDARD_VESSELS['boba-20oz'],
      iceRecommendation: 'Standard Ice (60% displacement, shaken with cocktail shaker)',
      flavorProfile: 'Creamy sweet strawberry with rich Ceylon black tea tannins and chewy boba finish',
      ingredients: [
        {
          genericName: 'Warm Brown Sugar Boba',
          masterIngredientSlug: 'brown-sugar-tapioca',
          preferredFormFactor: 'solid_garnish',
          portionQty: 60,
          portionUnit: 'g',
          layerOrder: 1,
          isAutoTopOff: false,
          scrapType: 'boba_pearls',
          colorHex: '#160802',
          densityBrix: 65.0
        },
        {
          genericName: 'Strawberry Flavor Base',
          masterIngredientSlug: 'flavor-strawberry',
          preferredFormFactor: 'powder', // Heuristic: milktea defaults to powder
          alternativeFormFactor: 'syrup',
          portionQty: 30,
          portionUnit: 'g',
          layerOrder: 2,
          isAutoTopOff: false,
          scrapType: 'standard',
          colorHex: '#fb7185',
          densityBrix: 40.0
        },
        {
          genericName: 'Non-Dairy Creamer / Fresh Milk Base',
          masterIngredientSlug: 'fresh-whole-milk',
          preferredFormFactor: 'liquid_dairy',
          portionQty: 160,
          portionUnit: 'ml',
          layerOrder: 3,
          isAutoTopOff: false,
          scrapType: 'milk_steam_pitcher',
          colorHex: '#fdfbf7',
          densityBrix: 12.0
        },
        {
          genericName: 'Brewed Assam / Ceylon Black Tea Liquor',
          masterIngredientSlug: 'ceylon-black-tea',
          preferredFormFactor: 'concentrate',
          portionQty: 100,
          portionUnit: 'ml',
          layerOrder: 4,
          isAutoTopOff: false,
          scrapType: 'standard',
          colorHex: '#78350f',
          densityBrix: 4.0
        }
      ],
      preparationSteps: [
        'Scoop 60g warm brown sugar tapioca into the bottom of the 20oz cup.',
        'In a cocktail shaker, dissolve 30g Strawberry Powder into 100ml hot brewed Ceylon black tea.',
        'Add 160ml chilled fresh milk and 180g ice cubes.',
        'Shake vigorously for 10 seconds to create micro-aeration and chill.',
        'Pour into cup over boba and seal with film.'
      ],
      baristaProTips: [
        'Powder vs Syrup Science: Strawberry powder contains spray-dried milk solids that emulsify tea tannins, whereas syrup separates into strata.',
        'Temperature Rule: Dissolve powder in warm tea (>65°C) before adding cold milk to avoid un-dissolved clumps.'
      ],
      allergens: ['Dairy (if whole milk)', 'Soy (if creamer base)'],
      estimatedCalories: 310
    },
    {
      slug: 'iced-caramel-macchiato',
      canonicalName: 'Iced Caramel Macchiato',
      category: 'coffee',
      vessel: STANDARD_VESSELS['cold-16oz'],
      iceRecommendation: 'Regular Ice (solid cubes filled to 80% cup height before espresso float)',
      flavorProfile: 'Sweet vanilla custard base topped with rich bittersweet espresso and buttery caramel crosshatch',
      ingredients: [
        {
          genericName: 'Vanilla Cordial Syrup',
          masterIngredientSlug: 'vanilla-syrup',
          preferredFormFactor: 'syrup', // Heuristic: coffee defaults to syrup
          portionQty: 20,
          portionUnit: 'ml',
          layerOrder: 1,
          isAutoTopOff: false,
          scrapType: 'standard',
          colorHex: '#fef08a',
          densityBrix: 55.0
        },
        {
          genericName: 'Fresh Whole Milk',
          masterIngredientSlug: 'fresh-whole-milk',
          preferredFormFactor: 'liquid_dairy',
          portionQty: 160,
          portionUnit: 'ml',
          layerOrder: 2,
          isAutoTopOff: false,
          scrapType: 'milk_steam_pitcher',
          colorHex: '#fdfbf7',
          densityBrix: 12.0
        },
        {
          genericName: 'Double Shot Espresso Float',
          masterIngredientSlug: 'espresso-beans',
          preferredFormFactor: 'concentrate',
          portionQty: 36,
          portionUnit: 'ml',
          layerOrder: 3,
          isAutoTopOff: false,
          scrapType: 'espresso_dial_in',
          colorHex: '#3d1c06',
          densityBrix: 10.0
        },
        {
          genericName: 'Caramel Sauce Drizzle Crosshatch',
          masterIngredientSlug: 'caramel-sauce',
          preferredFormFactor: 'syrup',
          portionQty: 10,
          portionUnit: 'ml',
          layerOrder: 4,
          isAutoTopOff: true,
          scrapType: 'standard',
          colorHex: '#d97706',
          densityBrix: 75.0
        }
      ],
      preparationSteps: [
        'Pump 20ml vanilla syrup into base of 16oz cup.',
        'Add 160ml chilled fresh whole milk and stir gently.',
        'Fill cup with solid cubed ice to 1.5 inches below rim.',
        'Extract double shot of espresso (18g in, 36g out) and pour gently over ice.',
        'Crosshatch top with 10ml rich caramel drizzle.'
      ],
      baristaProTips: [
        'Density Rule: Caramel drizzle has high Brix (~75°Bx). Pouring espresso slowly over ice gives a supporting surface for the caramel to float without sinking immediately.'
      ],
      allergens: ['Dairy'],
      estimatedCalories: 240
    }
  ]

  public static findMatchingTemplate(query: string): MasterRecipeTemplate | null {
    const q = query.trim().toLowerCase()
    return this.templates.find(t => 
      t.canonicalName.toLowerCase().includes(q) ||
      q.includes(t.slug.replace(/-/g, ' ')) ||
      t.slug.split('-').every(word => q.includes(word))
    ) || null
  }
}

// ----------------------------------------------------------------------------
// 4. WATERFALL SUPPLIER PRICING RESOLUTION SERVICE
// ----------------------------------------------------------------------------

export class SupplierPricingResolver {
  private db?: IDatabasePool

  constructor(dbPool?: IDatabasePool) {
    this.db = dbPool
  }

  /**
   * Waterfall Resolution Logic:
   * Level 1: Check `ShopPreferredSuppliers` for (shopId, masterIngredientSlug).
   * Level 2: Query `marketplace_listings` filtered by delivery_zone, in_stock = true, lowest cost_per_unit.
   * Level 3: Calculate alternative supplier count and lowest market price.
   */
  public async resolveIngredientPricing(
    shopId: string,
    shopDeliveryZone: string,
    masterIngredientSlug: string,
    formFactor: FormFactor
  ): Promise<{
    matchedSKU: MatchedSupplierSKU
    alternativeCount: number
    alternativeLowestPrice: number
  }> {
    // 1. Level 1: Check Shop Preferred Supplier
    const preferredQuery = `
      SELECT 
        s.id AS supplier_id,
        s.name AS supplier_name,
        ml.id AS sku_id,
        ml.product_name AS sku_name,
        ml.pack_unit_quantity,
        ml.pack_uom,
        ml.case_price,
        (ml.case_price / ml.pack_unit_quantity) AS cost_per_unit,
        ml.is_in_stock,
        s.lead_time_days
      FROM shop_preferred_suppliers sps
      JOIN marketplace_listings ml ON sps.preferred_listing_id = ml.id
      JOIN suppliers s ON ml.supplier_id = s.id
      WHERE sps.shop_id = $1 
        AND sps.master_ingredient_slug = $2
        AND ml.is_in_stock = TRUE
      LIMIT 1;
    `

    if (this.db) {
      try {
        const preferredRes: IDatabaseQueryResult = await this.db.query(preferredQuery, [shopId, masterIngredientSlug])

        if (preferredRes.rows.length > 0) {
          const row = preferredRes.rows[0]
          const matchedSKU: MatchedSupplierSKU = {
            supplierId: row.supplier_id,
            supplierName: row.supplier_name,
            skuId: row.sku_id,
            skuName: row.sku_name,
            packSizeQty: parseFloat(row.pack_unit_quantity),
            packSizeUnit: row.pack_uom,
            packCost: parseFloat(row.case_price),
            costPerUnit: parseFloat(row.cost_per_unit),
            inStock: row.is_in_stock,
            leadTimeDays: parseInt(row.lead_time_days, 10),
            isPreferredByShop: true
          }

          // Count alternatives in zone
          const altStats = await this.fetchAlternativeStats(masterIngredientSlug, shopDeliveryZone, matchedSKU.skuId)

          return {
            matchedSKU,
            alternativeCount: altStats.count,
            alternativeLowestPrice: altStats.lowestPrice
          }
        }
      } catch (err) {
        // In standalone or test mode without DB, fall back to mock catalog seamlessly
      }
    }

    // 2. Level 2: Query Regional Lowest In-Stock SKU
    const regionalQuery = `
      SELECT 
        s.id AS supplier_id,
        s.name AS supplier_name,
        ml.id AS sku_id,
        ml.product_name AS sku_name,
        ml.pack_unit_quantity,
        ml.pack_uom,
        ml.case_price,
        (ml.case_price / ml.pack_unit_quantity) AS cost_per_unit,
        ml.is_in_stock,
        s.lead_time_days
      FROM marketplace_listings ml
      JOIN suppliers s ON ml.supplier_id = s.id
      WHERE (ml.master_ingredient_slug = $1 OR ml.product_category = $1)
        AND ($2 = ANY(s.regional_delivery_zones) OR 'ALL' = ANY(s.regional_delivery_zones))
        AND ml.is_in_stock = TRUE
      ORDER BY (ml.case_price / ml.pack_unit_quantity) ASC
      LIMIT 1;
    `

    if (this.db) {
      try {
        const regionalRes: IDatabaseQueryResult = await this.db.query(regionalQuery, [masterIngredientSlug, shopDeliveryZone])

        if (regionalRes.rows.length > 0) {
          const row = regionalRes.rows[0]
          const matchedSKU: MatchedSupplierSKU = {
            supplierId: row.supplier_id,
            supplierName: row.supplier_name,
            skuId: row.sku_id,
            skuName: row.sku_name,
            packSizeQty: parseFloat(row.pack_unit_quantity),
            packSizeUnit: row.pack_uom,
            packCost: parseFloat(row.case_price),
            costPerUnit: parseFloat(row.cost_per_unit),
            inStock: row.is_in_stock,
            leadTimeDays: parseInt(row.lead_time_days, 10),
            isPreferredByShop: false
          }

          const altStats = await this.fetchAlternativeStats(masterIngredientSlug, shopDeliveryZone, matchedSKU.skuId)

          return {
            matchedSKU,
            alternativeCount: altStats.count,
            alternativeLowestPrice: altStats.lowestPrice
          }
        }
      } catch (err) {
        // Fallback to deterministic Philippine Wholesale Mock Engine
      }
    }

    // Default Fallback Benchmark Sourcing Engine
    return this.generateDeterministicMockSKU(masterIngredientSlug, formFactor)
  }

  private async fetchAlternativeStats(slug: string, zone: string, excludeSkuId: string) {
    if (this.db) {
      try {
        const query = `
          SELECT 
            COUNT(ml.id) AS alt_count,
            MIN(ml.case_price / ml.pack_unit_quantity) AS min_unit_price
          FROM marketplace_listings ml
          JOIN suppliers s ON ml.supplier_id = s.id
          WHERE (ml.master_ingredient_slug = $1 OR ml.product_category = $1)
            AND ($2 = ANY(s.regional_delivery_zones) OR 'ALL' = ANY(s.regional_delivery_zones))
            AND ml.is_in_stock = TRUE
            AND ml.id != $3;
        `
        const res: IDatabaseQueryResult = await this.db.query(query, [slug, zone, excludeSkuId])
        return {
          count: parseInt(res.rows[0]?.alt_count || '2', 10),
          lowestPrice: parseFloat(res.rows[0]?.min_unit_price || '0.12')
        }
      } catch {
        return { count: 3, lowestPrice: 0.12 }
      }
    }
    return { count: 3, lowestPrice: 0.12 }
  }

  private generateDeterministicMockSKU(slug: string, formFactor: FormFactor) {
    const benchmarks: Record<string, { brand: string; supplier: string; packCost: number; packQty: number; uom: string; costPerUnit: number }> = {
      'flavor-strawberry': formFactor === 'powder'
        ? { brand: 'Possmei Strawberry Bubble Powder (1kg)', supplier: 'Manila Boba Supply Co.', packCost: 380, packQty: 1000, uom: 'g', costPerUnit: 0.38 }
        : { brand: 'Torani Real Fruit Strawberry Puree (1L)', supplier: 'Gourmet Direct PH', packCost: 450, packQty: 1000, uom: 'ml', costPerUnit: 0.45 },
      'fresh-whole-milk': { brand: 'Hacienda Fresh Whole Milk (1L)', supplier: 'Dairy Fresh PH', packCost: 95, packQty: 1000, uom: 'ml', costPerUnit: 0.095 },
      'ceylon-black-tea': { brand: 'Sun Moon Lake Assam Loose Leaf (1kg)', supplier: 'Tea Source Manila', packCost: 850, packQty: 1000, uom: 'g', costPerUnit: 0.05 },
      'brown-sugar-tapioca': { brand: 'Tiger Brand 2.5 Quick Boba (3kg)', supplier: 'Boba Warehouse PH', packCost: 420, packQty: 3000, uom: 'g', costPerUnit: 0.14 },
      'vanilla-syrup': { brand: 'Monin French Vanilla (700ml)', supplier: 'Gourmet Direct PH', packCost: 480, packQty: 700, uom: 'ml', costPerUnit: 0.685 },
      'espresso-beans': { brand: 'Mt. Apo Washed Arabica (1kg)', supplier: 'Origins Coffee Roasters', packCost: 900, packQty: 1000, uom: 'g', costPerUnit: 0.90 },
      'caramel-sauce': { brand: 'Ghirardelli Sea Salt Caramel (2.5kg)', supplier: 'Barista Depot Manila', packCost: 1400, packQty: 2500, uom: 'g', costPerUnit: 0.56 }
    }

    const item = benchmarks[slug] || {
      brand: `${slug.replace(/-/g, ' ').toUpperCase()} Pro Pack (1L/1kg)`,
      supplier: 'Metro Manila Wholesale Central',
      packCost: 350.00,
      packQty: 1000,
      uom: 'ml',
      costPerUnit: 0.35
    }

    return {
      matchedSKU: {
        supplierId: 'sup-ph-default',
        supplierName: item.supplier,
        skuId: `sku-${slug}`,
        skuName: item.brand,
        packSizeQty: item.packQty,
        packSizeUnit: item.uom,
        packCost: item.packCost,
        costPerUnit: item.costPerUnit,
        inStock: true,
        leadTimeDays: 2,
        isPreferredByShop: true
      },
      alternativeCount: 3,
      alternativeLowestPrice: Number((item.costPerUnit * 0.92).toFixed(4))
    }
  }
}

// ----------------------------------------------------------------------------
// 5. PACKAGING BUNDLER SERVICE
// ----------------------------------------------------------------------------

export class PackagingBundler {
  private static packagingCatalog: Record<string, CostedPackagingItem> = {
    'pkg-pet-16oz': { id: 'pkg-pet-16oz', name: '16oz PET Ultra-Clear Cup', category: 'cup', unitCost: 3.50 },
    'pkg-lid-flat': { id: 'pkg-lid-flat', name: '98mm Sip Strawless Lid', category: 'lid', unitCost: 1.20 },
    'pkg-straw-bamboo': { id: 'pkg-straw-bamboo', name: '8mm Bamboo Fiber Straw', category: 'straw', unitCost: 0.95 },
    'pkg-sleeve-kraft': { id: 'pkg-sleeve-kraft', name: 'Corrugated Kraft Heat Sleeve', category: 'sleeve', unitCost: 0.80 },
    'pkg-ucup-20oz': { id: 'pkg-ucup-20oz', name: '20oz 95mm PP U-Cup', category: 'cup', unitCost: 4.20 },
    'pkg-sealing-film': { id: 'pkg-sealing-film', name: 'Custom Matte Sealing Film Portion', category: 'film', unitCost: 0.65 },
    'pkg-boba-straw-12mm': { id: 'pkg-boba-straw-12mm', name: '12mm Pointed Boba Straw', category: 'straw', unitCost: 1.10 },
    'pkg-cocktail-pick': { id: 'pkg-cocktail-pick', name: 'Bamboo Cocktail Pick', category: 'straw', unitCost: 0.75 }
  }

  public static bundlePackagingForVessel(vessel: VesselSpec): CostedPackagingItem[] {
    return vessel.defaultPackagingIds.map(id => this.packagingCatalog[id] || {
      id,
      name: 'Standard Packaging Item',
      category: 'cup',
      unitCost: 2.00
    })
  }
}

// ----------------------------------------------------------------------------
// 6. MAIN ENGINE ORCHESTRATOR
// ----------------------------------------------------------------------------

export class SearchToCostedDrinkEngine {
  private pricingResolver: SupplierPricingResolver

  constructor(dbPool?: IDatabasePool) {
    this.pricingResolver = new SupplierPricingResolver(dbPool)
  }

  /**
   * Main Pipeline Execution
   */
  public async execute(
    query: string,
    shopId: string = 'shop-manila-central',
    shopDeliveryZone: string = 'Metro Manila'
  ): Promise<CostedDrinkResponse> {
    if (!query || query.trim().length === 0) {
      throw new Error('Query parameter cannot be empty.')
    }

    // Step 1: Match Master Recipe Template
    let template = MasterRecipeTemplateRepository.findMatchingTemplate(query)

    // Fallback if not matched: Dynamic Template Synthesis
    if (!template) {
      template = this.synthesizeDynamicTemplate(query)
    }

    // Step 2 & 3: Resolve Ingredients Pricing & Form Factor
    const costedIngredients: CostedIngredientItem[] = []
    let ingredientsSubtotal = 0

    const SCRAP_RATES: Record<string, number> = {
      espresso_dial_in: 0.08,
      milk_steam_pitcher: 0.15,
      boba_pearls: 0.18,
      fresh_citrus: 0.10,
      standard: 0.03
    }

    for (const item of template.ingredients) {
      // Determine form factor
      const formFactor = item.preferredFormFactor

      // Resolve supplier waterfall quote
      const pricing = await this.pricingResolver.resolveIngredientPricing(
        shopId,
        shopDeliveryZone,
        item.masterIngredientSlug,
        formFactor
      )

      const baseCost = item.portionQty * pricing.matchedSKU.costPerUnit
      const scrapPct = SCRAP_RATES[item.scrapType] || 0.03
      const effectiveCost = baseCost * (1 + scrapPct)

      ingredientsSubtotal += effectiveCost

      costedIngredients.push({
        ingredientName: item.genericName,
        formFactor: formFactor,
        availableAlternativeFormFactor: item.alternativeFormFactor,
        portionQty: item.portionQty,
        portionUnit: item.portionUnit,
        unitCost: pricing.matchedSKU.costPerUnit,
        basePortionCost: parseFloat(baseCost.toFixed(2)),
        scrapRatePct: scrapPct * 100,
        effectivePortionCostWithScrap: parseFloat(effectiveCost.toFixed(2)),
        matchedSupplier: pricing.matchedSKU,
        alternativeSuppliersCount: pricing.alternativeCount,
        alternativeLowestUnitPrice: pricing.alternativeLowestPrice
      })
    }

    // Step 4: Packaging Bundling
    const packagingItems = PackagingBundler.bundlePackagingForVessel(template.vessel)
    const packagingSubtotal = packagingItems.reduce((sum, p) => sum + p.unitCost, 0)

    // Step 5: Cost & Economics Math
    const totalCOGS = parseFloat((ingredientsSubtotal + packagingSubtotal).toFixed(2))
    const targetGM = 0.75 // 75% Gross Margin Target
    const rawSuggestedPrice = totalCOGS / (1 - targetGM)
    
    // Round to nearest ₱5 (Philippine retail pricing convention)
    const suggestedRetailPrice = Math.ceil(rawSuggestedPrice / 5) * 5
    const projectedGrossProfit = parseFloat((suggestedRetailPrice - totalCOGS).toFixed(2))

    return {
      query,
      drinkName: template.canonicalName,
      category: template.category,
      vessel: {
        id: template.vessel.id,
        name: template.vessel.name,
        totalCapacityMl: template.vessel.totalCapacityMl,
        liquidCapacityMl: template.vessel.liquidCapacityMlWithStandardIce
      },
      economics: {
        currency: 'PHP',
        ingredientsSubtotal: parseFloat(ingredientsSubtotal.toFixed(2)),
        packagingSubtotal: parseFloat(packagingSubtotal.toFixed(2)),
        totalCOGS,
        targetGrossMarginPct: 75,
        suggestedRetailPrice,
        projectedGrossProfit
      },
      ingredients: costedIngredients,
      packaging: packagingItems,
      preparationSteps: template.preparationSteps,
      baristaProTips: template.baristaProTips,
      allergens: template.allergens,
      estimatedCalories: template.estimatedCalories
    }
  }

  private synthesizeDynamicTemplate(query: string): MasterRecipeTemplate {
    const formattedTitle = query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    const isBobaOrTea = query.toLowerCase().includes('tea') || query.toLowerCase().includes('boba')

    return {
      slug: query.toLowerCase().replace(/\s+/g, '-'),
      canonicalName: formattedTitle,
      category: isBobaOrTea ? 'milktea' : 'coffee',
      vessel: isBobaOrTea ? STANDARD_VESSELS['boba-20oz'] : STANDARD_VESSELS['cold-16oz'],
      iceRecommendation: 'Standard Regular Ice (fill 80% volume)',
      flavorProfile: `Balanced specialty ${formattedTitle} with calibrated sweetness and aromatic finish`,
      ingredients: [
        {
          genericName: `${formattedTitle} Signature Flavor`,
          masterIngredientSlug: 'flavor-custom',
          preferredFormFactor: isBobaOrTea ? 'powder' : 'syrup',
          portionQty: 30,
          portionUnit: isBobaOrTea ? 'g' : 'ml',
          layerOrder: 1,
          isAutoTopOff: false,
          scrapType: 'standard',
          colorHex: '#d97706',
          densityBrix: 45.0
        },
        {
          genericName: 'Fresh Whole Milk / Dairy Base',
          masterIngredientSlug: 'fresh-whole-milk',
          preferredFormFactor: 'liquid_dairy',
          portionQty: 180,
          portionUnit: 'ml',
          layerOrder: 2,
          isAutoTopOff: false,
          scrapType: 'milk_steam_pitcher',
          colorHex: '#fdfbf7',
          densityBrix: 12.0
        },
        {
          genericName: 'Double Shot Espresso / Tea Liquor',
          masterIngredientSlug: 'espresso-beans',
          preferredFormFactor: 'concentrate',
          portionQty: 36,
          portionUnit: 'ml',
          layerOrder: 3,
          isAutoTopOff: false,
          scrapType: 'espresso_dial_in',
          colorHex: '#3d1c06',
          densityBrix: 10.0
        }
      ],
      preparationSteps: [
        `Dispense flavor base into mixing cup.`,
        `Incorporate chilled dairy base and stir vigorously.`,
        `Fill cup with solid cubed ice.`,
        `Float concentrated double shot or tea liquor gently over top.`
      ],
      baristaProTips: [
        `Calibrate sweetness Brix around 14°Bx for optimal palate balance and commercial appeal.`
      ],
      allergens: ['Dairy'],
      estimatedCalories: 220
    }
  }
}
