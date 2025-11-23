-- Enable public read access to all inventory tables for company showcase

-- Yogurt inventory
ALTER TABLE yogurt_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to yogurt_inventory"
ON yogurt_inventory FOR SELECT TO public USING (true);

-- Cold room inventory
ALTER TABLE cold_room_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to cold_room_inventory"
ON cold_room_inventory FOR SELECT TO public USING (true);

-- Coffee stock
ALTER TABLE coffee_stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to coffee_stock"
ON coffee_stock FOR SELECT TO public USING (true);

-- Cattle inventory
ALTER TABLE cattle_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to cattle_inventory"
ON cattle_inventory FOR SELECT TO public USING (true);

-- Inventory items
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to inventory_items"
ON inventory_items FOR SELECT TO public USING (true);

-- Kashari milk production
ALTER TABLE kashari_milk_production ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to kashari_milk_production"
ON kashari_milk_production FOR SELECT TO public USING (true);

-- Dairy production
ALTER TABLE dairy_production ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to dairy_production"
ON dairy_production FOR SELECT TO public USING (true);