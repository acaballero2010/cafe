-- ============================================================================
-- POURCRAFT OS: CORE RELATIONAL DATABASE SCHEMA (PostgreSQL 15+)
-- Domain: Beverage Recipe Costing, Physical Strata, Yields & B2B Marketplace
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ----------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE venue_category AS ENUM ('coffee', 'milktea', 'cocktail', 'juice_smoothie', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE unit_of_measure AS ENUM ('ml', 'g', 'oz_fl', 'oz_wt', 'unit', 'pump', 'drop', 'dash');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE packaging_category AS ENUM ('cup', 'lid', 'straw', 'sealing_film', 'sleeve', 'carrier', 'label', 'pick');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_component_type AS ENUM ('raw_ingredient', 'sub_recipe');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ice_level_preset AS ENUM ('no_ice', 'light_20', 'standard_35', 'extra_50', 'craft_cube_55', 'crushed_45');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_term_type AS ENUM ('cod', 'prepaid_card', 'net_7', 'net_15', 'net_30', 'net_60');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. SUPPLIERS & LOGISTICS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_entity_name VARCHAR(255),
    contact_email citext NOT NULL,
    contact_phone VARCHAR(50),
    regional_delivery_zones TEXT[] NOT NULL DEFAULT '{"ALL"}',
    default_payment_terms payment_term_type NOT NULL DEFAULT 'net_30',
    lead_time_days SMALLINT NOT NULL DEFAULT 2 CHECK (lead_time_days >= 0),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    sku_code VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100) NOT NULL,
    package_description VARCHAR(255) NOT NULL,
    pack_unit_quantity NUMERIC(12, 4) NOT NULL CHECK (pack_unit_quantity > 0),
    pack_uom unit_of_measure NOT NULL,
    case_price NUMERIC(10, 2) NOT NULL CHECK (case_price >= 0),
    minimum_order_qty SMALLINT NOT NULL DEFAULT 1 CHECK (minimum_order_qty >= 1),
    tier_discount_threshold SMALLINT,
    tier_discount_rate NUMERIC(5, 4) DEFAULT 0.0000 CHECK (tier_discount_rate BETWEEN 0 AND 1),
    is_in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_supplier_sku UNIQUE (supplier_id, sku_code)
);

-- ----------------------------------------------------------------------------
-- 3. RAW INGREDIENTS & PACKAGING ITEMS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS raw_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    storage_type VARCHAR(50) NOT NULL DEFAULT 'ambient' CHECK (storage_type IN ('ambient', 'refrigerated', 'frozen')),
    shelf_life_hours INT CHECK (shelf_life_hours > 0),
    base_uom unit_of_measure NOT NULL,
    current_unit_cost NUMERIC(12, 6) NOT NULL CHECK (current_unit_cost >= 0),
    density_brix NUMERIC(5, 2) DEFAULT 0.00 CHECK (density_brix >= 0),
    specific_gravity NUMERIC(6, 4) DEFAULT 1.0000 CHECK (specific_gravity > 0),
    default_scrap_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.0300 CHECK (default_scrap_rate BETWEEN 0 AND 1),
    color_hex VARCHAR(7) DEFAULT '#f59e0b',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packaging_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category packaging_category NOT NULL,
    material_type VARCHAR(100) NOT NULL,
    unit_cost NUMERIC(10, 4) NOT NULL CHECK (unit_cost >= 0),
    capacity_ml NUMERIC(8, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. BATCHES & SUB-RECIPES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sub_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_batch_yield_qty NUMERIC(12, 4) NOT NULL CHECK (target_batch_yield_qty > 0),
    yield_uom unit_of_measure NOT NULL,
    prep_waste_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.0500 CHECK (prep_waste_rate BETWEEN 0 AND 1),
    shelf_life_hours INT NOT NULL DEFAULT 4,
    density_brix NUMERIC(5, 2) DEFAULT 0.00,
    color_hex VARCHAR(7) DEFAULT '#3b1d0b',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sub_recipe_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_recipe_id UUID NOT NULL REFERENCES sub_recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES raw_ingredients(id) ON DELETE RESTRICT,
    quantity NUMERIC(12, 4) NOT NULL CHECK (quantity > 0),
    uom unit_of_measure NOT NULL,
    prep_step_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_subrecipe_ingredient UNIQUE (sub_recipe_id, ingredient_id)
);

-- ----------------------------------------------------------------------------
-- 5. FINISHED DRINK RECIPES & STRATA LAYERING
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS drink_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    venue_category venue_category NOT NULL DEFAULT 'coffee',
    menu_description TEXT,
    serving_vessel_type VARCHAR(100) NOT NULL DEFAULT '16oz Cold PET',
    nominal_volume_ml NUMERIC(8, 2) NOT NULL CHECK (nominal_volume_ml > 0),
    target_ice_level ice_level_preset NOT NULL DEFAULT 'standard_35',
    ice_displacement_ratio NUMERIC(5, 4) NOT NULL DEFAULT 0.3500 CHECK (ice_displacement_ratio BETWEEN 0 AND 1),
    target_gross_margin_pct NUMERIC(5, 2) NOT NULL DEFAULT 78.00 CHECK (target_gross_margin_pct BETWEEN 0 AND 99.99),
    retail_menu_price NUMERIC(10, 2) NOT NULL CHECK (retail_menu_price > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drink_recipe_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drink_recipe_id UUID NOT NULL REFERENCES drink_recipes(id) ON DELETE CASCADE,
    component_type item_component_type NOT NULL,
    raw_ingredient_id UUID REFERENCES raw_ingredients(id) ON DELETE RESTRICT,
    sub_recipe_id UUID REFERENCES sub_recipes(id) ON DELETE RESTRICT,
    layer_sequence SMALLINT NOT NULL CHECK (layer_sequence >= 1),
    volume_ml NUMERIC(8, 2) NOT NULL DEFAULT 0.00 CHECK (volume_ml >= 0),
    weight_grams NUMERIC(8, 2) DEFAULT 0.00 CHECK (weight_grams >= 0),
    is_auto_top_off BOOLEAN NOT NULL DEFAULT FALSE,
    specific_scrap_rate_override NUMERIC(5, 4) CHECK (specific_scrap_rate_override BETWEEN 0 AND 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_drink_layer_seq UNIQUE (drink_recipe_id, layer_sequence),
    CONSTRAINT chk_component_reference CHECK (
        (component_type = 'raw_ingredient' AND raw_ingredient_id IS NOT NULL AND sub_recipe_id IS NULL) OR
        (component_type = 'sub_recipe' AND sub_recipe_id IS NOT NULL AND raw_ingredient_id IS NULL)
    )
);

CREATE TABLE IF NOT EXISTS drink_packaging_map (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drink_recipe_id UUID NOT NULL REFERENCES drink_recipes(id) ON DELETE CASCADE,
    packaging_item_id UUID NOT NULL REFERENCES packaging_items(id) ON DELETE RESTRICT,
    quantity_required SMALLINT NOT NULL DEFAULT 1 CHECK (quantity_required >= 1),
    is_optional BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_drink_packaging UNIQUE (drink_recipe_id, packaging_item_id)
);

CREATE TABLE IF NOT EXISTS drink_sop_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drink_recipe_id UUID NOT NULL REFERENCES drink_recipes(id) ON DELETE CASCADE,
    step_number SMALLINT NOT NULL CHECK (step_number >= 1),
    instruction TEXT NOT NULL,
    temperature_target_celsius NUMERIC(5, 2),
    duration_seconds SMALLINT,
    equipment_needed VARCHAR(150),
    CONSTRAINT uq_drink_sop_step UNIQUE (drink_recipe_id, step_number)
);

-- ----------------------------------------------------------------------------
-- 6. REUSABLE ANALYTICS VIEW
-- ----------------------------------------------------------------------------

CREATE OR REPLACE VIEW view_sub_recipe_unit_costs AS
SELECT 
    sr.id AS sub_recipe_id,
    sr.name AS sub_recipe_name,
    sr.target_batch_yield_qty,
    sr.yield_uom,
    sr.prep_waste_rate,
    SUM(sri.quantity * ri.current_unit_cost) AS raw_batch_cost,
    (SUM(sri.quantity * ri.current_unit_cost) / (1.0 - sr.prep_waste_rate)) AS real_batch_cost_with_waste,
    ((SUM(sri.quantity * ri.current_unit_cost) / (1.0 - sr.prep_waste_rate)) / sr.target_batch_yield_qty) AS effective_unit_cost
FROM sub_recipes sr
JOIN sub_recipe_items sri ON sr.id = sri.sub_recipe_id
JOIN raw_ingredients ri ON sri.ingredient_id = ri.id
GROUP BY sr.id, sr.name, sr.target_batch_yield_qty, sr.yield_uom, sr.prep_waste_rate;
