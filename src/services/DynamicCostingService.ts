import { Pool } from 'pg';

export interface UnitCostResolution {
  masterIngredientId: string;
  unitCost: number;
  source: 'SHOP_PREFERRED' | 'REGIONAL_LOWEST' | 'REGIONAL_MEDIAN' | 'CATALOG_FALLBACK';
  supplierName: string;
  brandName: string;
  skuId?: string;
  isPreferred: boolean;
}

export interface RecipeItemCostSummary {
  ingredientName: string;
  servingQuantity: number;
  baseUom: string;
  unitCost: number;
  effectiveScrapRate: number;
  lineCost: number;
  supplier: string;
}

export interface RecipeMarginSummary {
  recipeId: string;
  recipeName: string;
  retailPrice: number;
  targetMarginPct: number;
  totalCogs: number;
  liquidCogs: number;
  packagingCogs: number;
  grossProfit: number;
  grossMarginPct: number;
  isMarginCompromised: boolean;
  marginDeficitPct: number;
  suggestedMenuPrice: number;
  items: RecipeItemCostSummary[];
  updatedAt: Date;
}

export class DynamicCostingService {
  private db: Pool;

  constructor(dbPool: Pool) {
    this.db = dbPool;
  }

  async resolveIngredientUnitCost(
    shopId: string,
    masterIngredientId: string,
    deliveryZone: string = 'Metro Manila'
  ): Promise<UnitCostResolution> {
    const preferredQuery = `
      SELECT 
        sps.custom_cost_override,
        sku.id AS sku_id,
        sku.brand_name,
        sku.unit_cost_normalized,
        sup.business_name AS supplier_name
      FROM shop_preferred_suppliers sps
      JOIN supplier_skus sku ON sps.supplier_sku_id = sku.id
      JOIN suppliers sup ON sku.supplier_id = sup.id
      WHERE sps.shop_id = $1 
        AND sps.master_ingredient_id = $2
        AND sku.is_in_stock = TRUE;
    `;
    const preferredRes = await this.db.query(preferredQuery, [shopId, masterIngredientId]);

    if (preferredRes.rows.length > 0) {
      const row = preferredRes.rows[0];
      const effectiveCost = row.custom_cost_override !== null 
        ? parseFloat(row.custom_cost_override) 
        : parseFloat(row.unit_cost_normalized);

      return {
        masterIngredientId,
        unitCost: Number(effectiveCost.toFixed(6)),
        source: 'SHOP_PREFERRED',
        supplierName: row.supplier_name,
        brandName: row.brand_name,
        skuId: row.sku_id,
        isPreferred: true
      };
    }

    const fallbackQuery = `
      SELECT 
        sku.id AS sku_id,
        sku.brand_name,
        sku.unit_cost_normalized,
        sup.business_name AS supplier_name
      FROM supplier_skus sku
      JOIN suppliers sup ON sku.supplier_id = sup.id
      WHERE sku.master_ingredient_id = $1
        AND sku.is_in_stock = TRUE
        AND sup.is_verified = TRUE
        AND $2 = ANY(sup.delivery_zones)
      ORDER BY sku.unit_cost_normalized ASC
      LIMIT 1;
    `;
    const fallbackRes = await this.db.query(fallbackQuery, [masterIngredientId, deliveryZone]);

    if (fallbackRes.rows.length > 0) {
      const row = fallbackRes.rows[0];
      return {
        masterIngredientId,
        unitCost: Number(parseFloat(row.unit_cost_normalized).toFixed(6)),
        source: 'REGIONAL_LOWEST',
        supplierName: row.supplier_name,
        brandName: row.brand_name,
        skuId: row.sku_id,
        isPreferred: false
      };
    }

    const medianQuery = `
      SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sku.unit_cost_normalized) AS median_unit_cost
      FROM supplier_skus sku
      WHERE sku.master_ingredient_id = $1 AND sku.is_in_stock = TRUE;
    `;
    const medianRes = await this.db.query(medianQuery, [masterIngredientId]);
    const medianCost = medianRes.rows[0]?.median_unit_cost || 0.15;

    return {
      masterIngredientId,
      unitCost: Number(parseFloat(medianCost).toFixed(6)),
      source: 'REGIONAL_MEDIAN',
      supplierName: 'Regional Market Aggregate',
      brandName: 'Standard Spec',
      isPreferred: false
    };
  }

  async recalculateRecipeMargins(recipeId: string): Promise<RecipeMarginSummary> {
    const recipeQuery = `
      SELECT 
        r.id, r.shop_id, r.name, r.retail_menu_price, 
        r.target_margin_pct, r.include_scrap_buffers
      FROM drink_recipes r
      WHERE r.id = $1;
    `;
    const recipeRes = await this.db.query(recipeQuery, [recipeId]);
    if (recipeRes.rows.length === 0) {
      throw new Error(`Recipe with ID ${recipeId} not found.`);
    }
    const recipe = recipeRes.rows[0];
    const shopId = recipe.shop_id;

    const itemsQuery = `
      SELECT 
        ri.id,
        ri.master_ingredient_id,
        ri.serving_quantity,
        ri.prep_scrap_rate_override,
        mi.name AS ingredient_name,
        mi.base_uom,
        mi.scrap_type
      FROM drink_recipe_items ri
      JOIN master_ingredients mi ON ri.master_ingredient_id = mi.id
      WHERE ri.recipe_id = $1
      ORDER BY ri.layer_order ASC;
    `;
    const itemsRes = await this.db.query(itemsQuery, [recipeId]);

    const packagingQuery = `
      SELECT 
        dp.master_ingredient_id,
        dp.quantity_per_drink,
        mi.name AS packaging_name,
        mi.base_uom
      FROM drink_packaging_items dp
      JOIN master_ingredients mi ON dp.master_ingredient_id = mi.id
      WHERE dp.recipe_id = $1;
    `;
    const packagingRes = await this.db.query(packagingQuery, [recipeId]);

    const SCRAP_BUFFERS: Record<string, number> = {
      espresso_dial_in: 0.08,
      milk_steaming: 0.15,
      boba_pearls: 0.18,
      syrup_line: 0.05,
      standard: 0.00
    };

    let liquidCogs = 0;
    const itemSummaries: RecipeItemCostSummary[] = [];

    for (const item of itemsRes.rows) {
      const unitCostInfo = await this.resolveIngredientUnitCost(shopId, item.master_ingredient_id);
      
      const scrapRate = recipe.include_scrap_buffers
        ? (item.prep_scrap_rate_override !== null ? parseFloat(item.prep_scrap_rate_override) : (SCRAP_BUFFERS[item.scrap_type] || 0.00))
        : 0.00;

      const baseCost = parseFloat(item.serving_quantity) * unitCostInfo.unitCost;
      const effectiveLineCost = baseCost * (1 + scrapRate);
      liquidCogs += effectiveLineCost;

      itemSummaries.push({
        ingredientName: item.ingredient_name,
        servingQuantity: parseFloat(item.serving_quantity),
        baseUom: item.base_uom,
        unitCost: unitCostInfo.unitCost,
        effectiveScrapRate: scrapRate,
        lineCost: Number(effectiveLineCost.toFixed(2)),
        supplier: `${unitCostInfo.supplierName} (${unitCostInfo.brandName})`
      });
    }

    let packagingCogs = 0;
    for (const pkg of packagingRes.rows) {
      const unitCostInfo = await this.resolveIngredientUnitCost(shopId, pkg.master_ingredient_id);
      const pkgCost = parseFloat(pkg.quantity_per_drink) * unitCostInfo.unitCost;
      packagingCogs += pkgCost;

      itemSummaries.push({
        ingredientName: `[Packaging] ${pkg.packaging_name}`,
        servingQuantity: parseFloat(pkg.quantity_per_drink),
        baseUom: pkg.base_uom,
        unitCost: unitCostInfo.unitCost,
        effectiveScrapRate: 0,
        lineCost: Number(pkgCost.toFixed(2)),
        supplier: unitCostInfo.supplierName
      });
    }

    const totalCogs = Number((liquidCogs + packagingCogs).toFixed(2));
    const retailPrice = parseFloat(recipe.retail_menu_price);
    const targetMarginPct = parseFloat(recipe.target_margin_pct);

    const grossProfit = Number((retailPrice - totalCogs).toFixed(2));
    const grossMarginPct = retailPrice > 0 ? Number(((grossProfit / retailPrice) * 100).toFixed(1)) : 0;
    
    const isMarginCompromised = grossMarginPct < targetMarginPct;
    const marginDeficitPct = isMarginCompromised ? Number((targetMarginPct - grossMarginPct).toFixed(1)) : 0;
    
    const targetMarginRatio = targetMarginPct / 100;
    const suggestedMenuPrice = targetMarginRatio < 1 ? Number((totalCogs / (1 - targetMarginRatio)).toFixed(2)) : retailPrice;

    await this.db.query(
      `UPDATE drink_recipes
       SET calculated_cogs = $1,
           calculated_gross_margin_pct = $2,
           is_margin_compromised = $3,
           updated_at = NOW()
       WHERE id = $4;`,
      [totalCogs, grossMarginPct, isMarginCompromised, recipeId]
    );

    return {
      recipeId,
      recipeName: recipe.name,
      retailPrice,
      targetMarginPct,
      totalCogs,
      liquidCogs: Number(liquidCogs.toFixed(2)),
      packagingCogs: Number(packagingCogs.toFixed(2)),
      grossProfit,
      grossMarginPct,
      isMarginCompromised,
      marginDeficitPct,
      suggestedMenuPrice,
      items: itemSummaries,
      updatedAt: new Date()
    };
  }
}
