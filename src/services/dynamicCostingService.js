/**
 * POURCRAFT DYNAMIC BEVERAGE COSTING SERVICE
 * Handles automated supplier SKU cost resolution, fallback logic, scrap buffer compounding,
 * and real-time recipe gross margin recalculations.
 */

// Scrap buffer ratios by ingredient processing type
export const SCRAP_BUFFERS = {
  espresso_dial_in: 0.08, // 8% grinder dial-in purge & dose retention
  milk_steaming: 0.15,    // 15% pitcher residual steam loss
  boba_pearls: 0.18,      // 18% pot rinse & expiration scrap
  syrup_line: 0.05,       // 5% pump line & wall retention
  standard: 0.00
};

/**
 * 1. resolveIngredientUnitCost
 * Resolves the unit cost (cost per ml, g, or pcs) for any master ingredient for a given shop.
 *
 * Fallback priority:
 *  1. Shop's Preferred Supplier SKU (or custom negotiated price override)
 *  2. Lowest active verified supplier SKU in the shop's delivery zone
 *  3. Regional median / market aggregate fallback
 */
export async function resolveIngredientUnitCost(
  shopId,
  masterIngredientId,
  dbClient,
  deliveryZone = 'Metro Manila'
) {
  // If a live Postgres client/pool is provided, execute SQL queries
  if (dbClient && typeof dbClient.query === 'function') {
    // A. Check shop preferred supplier
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
    const preferredRes = await dbClient.query(preferredQuery, [shopId, masterIngredientId]);

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

    // B. Lowest regional verified supplier
    const lowestQuery = `
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
    const lowestRes = await dbClient.query(lowestQuery, [masterIngredientId, deliveryZone]);

    if (lowestRes.rows.length > 0) {
      const row = lowestRes.rows[0];
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

    // C. Median fallback
    const medianQuery = `
      SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sku.unit_cost_normalized) AS median_unit_cost
      FROM supplier_skus sku
      WHERE sku.master_ingredient_id = $1 AND sku.is_in_stock = TRUE;
    `;
    const medianRes = await dbClient.query(medianQuery, [masterIngredientId]);
    const medianCost = medianRes.rows[0]?.median_unit_cost || 0.20;

    return {
      masterIngredientId,
      unitCost: Number(parseFloat(medianCost).toFixed(6)),
      source: 'REGIONAL_MEDIAN',
      supplierName: 'Regional Market Aggregate',
      brandName: 'Standard Spec',
      isPreferred: false
    };
  }

  // Frontend / Mock In-Memory Resolver Fallback
  return {
    masterIngredientId,
    unitCost: 0.21,
    source: 'CATALOG_FALLBACK',
    supplierName: 'Gourmet Direct PH',
    brandName: 'Barista Standard',
    isPreferred: true
  };
}

/**
 * 2. recalculateRecipeMargins
 * Recalculates live recipe COGS, profit, and gross margins.
 * Sums live ingredient and packaging costs, compares against target margin %,
 * and updates cached fields in PostgreSQL.
 */
export async function recalculateRecipeMargins(recipeId, dbClient) {
  if (!dbClient || typeof dbClient.query !== 'function') {
    throw new Error('Database client must be provided for recalculateRecipeMargins.');
  }

  // 1. Fetch recipe header
  const recipeRes = await dbClient.query(
    `SELECT id, shop_id, name, retail_menu_price, target_margin_pct, include_scrap_buffers
     FROM drink_recipes WHERE id = $1;`,
    [recipeId]
  );
  if (recipeRes.rows.length === 0) {
    throw new Error(`Recipe with ID ${recipeId} not found.`);
  }
  const recipe = recipeRes.rows[0];
  const shopId = recipe.shop_id;

  // 2. Fetch recipe ingredients
  const itemsRes = await dbClient.query(
    `SELECT ri.id, ri.master_ingredient_id, ri.serving_quantity, ri.prep_scrap_rate_override,
            mi.name AS ingredient_name, mi.base_uom, mi.scrap_type
     FROM drink_recipe_items ri
     JOIN master_ingredients mi ON ri.master_ingredient_id = mi.id
     WHERE ri.recipe_id = $1
     ORDER BY ri.layer_order ASC;`,
    [recipeId]
  );

  // 3. Fetch packaging items
  const pkgRes = await dbClient.query(
    `SELECT dp.master_ingredient_id, dp.quantity_per_drink, mi.name AS packaging_name, mi.base_uom
     FROM drink_packaging_items dp
     JOIN master_ingredients mi ON dp.master_ingredient_id = mi.id
     WHERE dp.recipe_id = $1;`,
    [recipeId]
  );

  let liquidCogs = 0;
  const itemsBreakdown = [];

  // Calculate liquid ingredients with scrap buffers
  for (const item of itemsRes.rows) {
    const costResolution = await resolveIngredientUnitCost(shopId, item.master_ingredient_id, dbClient);
    
    const scrapRate = recipe.include_scrap_buffers
      ? (item.prep_scrap_rate_override !== null ? parseFloat(item.prep_scrap_rate_override) : (SCRAP_BUFFERS[item.scrap_type] || 0.00))
      : 0.00;

    const baseCost = parseFloat(item.serving_quantity) * costResolution.unitCost;
    const effectiveLineCost = baseCost * (1 + scrapRate);
    liquidCogs += effectiveLineCost;

    itemsBreakdown.push({
      ingredientName: item.ingredient_name,
      servingQuantity: parseFloat(item.serving_quantity),
      baseUom: item.base_uom,
      unitCost: costResolution.unitCost,
      effectiveScrapRate: scrapRate,
      lineCost: Number(effectiveLineCost.toFixed(2)),
      supplier: `${costResolution.supplierName} (${costResolution.brandName})`
    });
  }

  // Calculate packaging costs
  let packagingCogs = 0;
  for (const pkg of pkgRes.rows) {
    const costResolution = await resolveIngredientUnitCost(shopId, pkg.master_ingredient_id, dbClient);
    const pkgCost = parseFloat(pkg.quantity_per_drink) * costResolution.unitCost;
    packagingCogs += pkgCost;

    itemsBreakdown.push({
      ingredientName: `[Packaging] ${pkg.packaging_name}`,
      servingQuantity: parseFloat(pkg.quantity_per_drink),
      baseUom: pkg.base_uom,
      unitCost: costResolution.unitCost,
      effectiveScrapRate: 0,
      lineCost: Number(pkgCost.toFixed(2)),
      supplier: costResolution.supplierName
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

  // Update cached table fields
  await dbClient.query(
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
    items: itemsBreakdown,
    updatedAt: new Date()
  };
}
