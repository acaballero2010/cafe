-- ============================================================================
-- POURCRAFT OS: SAMPLE SEED DATA
-- ============================================================================

-- 1. Suppliers
INSERT INTO suppliers (id, name, legal_entity_name, contact_email, regional_delivery_zones, default_payment_terms, is_verified)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Sysco Metro Supply', 'Sysco Corporation', 'orders@syscometro.com', '{"US-CA-SFBAY", "US-WEST"}', 'net_30', TRUE),
('a0000000-0000-0000-0000-000000000002', 'Bossen Food Corp', 'Bossen Boba Direct LLC', 'wholesale@bossenstore.com', '{"US-NATIONAL"}', 'net_30', TRUE),
('a0000000-0000-0000-0000-000000000003', 'Marukyu Koyamaen Kyoto Direct', 'Marukyu Koyamaen Co Ltd', 'export@marukyu.jp', '{"GLOBAL", "US-WEST"}', 'net_15', TRUE),
('a0000000-0000-0000-0000-000000000004', 'EcoCraft Packaging Solutions', 'EcoCraft Supplies Inc', 'b2b@ecocraftpack.com', '{"US-NATIONAL"}', 'net_30', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Raw Ingredients
INSERT INTO raw_ingredients (id, primary_supplier_id, name, category, base_uom, current_unit_cost, density_brix, default_scrap_rate, color_hex)
VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Ethiopia Guji Heirloom Coffee Beans', 'espresso_beans', 'g', 0.028000, 9.5, 0.0800, '#3d2012'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Oatly Barista Edition Oat Milk', 'alt_milk', 'ml', 0.003870, 12.0, 0.1500, '#f3ece1'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'Raw Black Tapioca Pearls', 'boba_raw', 'g', 0.002888, 72.0, 0.1800, '#1a0c02'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Dark Muscovado Brown Sugar', 'sweetener', 'g', 0.004200, 68.0, 0.0400, '#4a1e06'),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 'Kyoto Ceremonial Grade Matcha Powder', 'tea_powder', 'g', 0.190000, 5.0, 0.0300, '#2d6a4f'),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Organic Heavy Whipping Cream 36%', 'dairy', 'ml', 0.005500, 18.0, 0.1000, '#fffdf0'),
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'Organic Cream Cheese Block', 'dairy', 'g', 0.008800, 24.0, 0.0500, '#fff9e6')
ON CONFLICT (id) DO NOTHING;

-- 3. Sub-Recipes (Batches)
INSERT INTO sub_recipes (id, name, description, target_batch_yield_qty, yield_uom, prep_waste_rate, shelf_life_hours, density_brix, color_hex)
VALUES
('c0000000-0000-0000-0000-000000000001', 'House Brown Sugar Tiger Boba Batch', 'Slow-simmered tapioca with Muscovado syrup glaze (4h window)', 2500.00, 'g', 0.0800, 4, 70.0, '#160802'),
('c0000000-0000-0000-0000-000000000002', 'Sea Salt Himalayan Cheese Cream Cap', 'Whipped cream cheese, cream, and pink rock salt froth', 1500.00, 'ml', 0.0600, 24, 22.0, '#fffdf0')
ON CONFLICT (id) DO NOTHING;

-- 4. Sub-Recipe Items
INSERT INTO sub_recipe_items (sub_recipe_id, ingredient_id, quantity, uom, prep_step_notes)
VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 1000.00, 'g', 'Boil tapioca for 25m, steam 20m'),
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 500.00, 'g', 'Simmer with warm pearls until glassy'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 1000.00, 'ml', 'Whip cold cream to soft peaks'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000007', 300.00, 'g', 'Blend smooth with sea salt')
ON CONFLICT DO NOTHING;

-- 5. Packaging Items
INSERT INTO packaging_items (id, primary_supplier_id, name, category, material_type, unit_cost, capacity_ml)
VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', '16oz PET Crystal Clear Cold Cup', 'cup', 'PET', 0.1400, 473.00),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'Strawless Sip-Through Lid', 'lid', 'PET', 0.0600, NULL),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', '12mm Bamboo Boba Straw', 'straw', 'bamboo_fiber', 0.0500, NULL)
ON CONFLICT (id) DO NOTHING;
