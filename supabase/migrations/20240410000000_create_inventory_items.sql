-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL,
    section TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(12,2) NOT NULL,
    total_cost DECIMAL(12,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'good',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Insert initial data from the Excel sheet
INSERT INTO inventory_items (item_name, section, quantity, unit_cost, total_cost, status, notes) VALUES
-- Milk Reception and Initial Processing
('Milk cans', 'Milk Reception and Initial Processing', 3, 500000.00, 1500000.00, 'good', 'Must have at the start'),
('Aluminium buckets', 'Milk Reception and Initial Processing', 2, 100000.00, 200000.00, 'good', 'Must have at the start'),
('Sieving cloths', 'Milk Reception and Initial Processing', 4, 30000.00, 120000.00, 'good', 'Must have at the start'),

-- Processing Section
('Processing vats (Big)', 'Processing Section', 1, 0.00, 0.00, 'need', 'Needed at later stage'),
('Processing vats (Small)', 'Processing Section', 1, 0.00, 0.00, 'need', 'Needed at later stage'),
('Saucepans (Big)', 'Processing Section', 4, 350000.00, 1400000.00, 'good', 'Must have at the start'),
('Saucepans (Medium)', 'Processing Section', 2, 200000.00, 400000.00, 'good', 'Must have at the start'),
('Sauce pans (Small)', 'Processing Section', 3, 50000.00, 150000.00, 'good', 'Must have at the start'),

-- Lab and Quality Control
('Test tubes', 'Lab and Quality Control', 40, 2000.00, 80000.00, 'good', 'Must have at the start'),
('Test tube rack', 'Lab and Quality Control', 2, 5000.00, 10000.00, 'good', 'Must have at the start'),
('Test tube holders', 'Lab and Quality Control', 2, 10000.00, 20000.00, 'good', 'Must have at the start'),
('Milk analyser', 'Lab and Quality Control', 1, 3500000.00, 3500000.00, 'good', 'Must have at the start'),
('Lactometer', 'Lab and Quality Control', 1, 40000.00, 40000.00, 'good', 'Must have at the start'),
('Digital thermometer', 'Lab and Quality Control', 2, 50000.00, 100000.00, 'good', 'Must have at the start'),

-- Packaging Section
('Impulse Sealer', 'Packaging Section', 1, 200000.00, 200000.00, 'good', 'Must have at the start'),
('Vacuum sealer', 'Packaging Section', 1, 15000000.00, 15000000.00, 'need', 'Needed at later stage'),
('Weighing scale', 'Packaging Section', 1, 350000.00, 350000.00, 'good', 'Must have at the start'),
('Labels Mozzarella', 'Packaging Section', 15, 15000.00, 225000.00, 'good', 'Must have at the start'),
('Labels Gouda', 'Packaging Section', 1, 0.00, 0.00, 'need', 'Needed at later stage'),

-- Storage and Refrigeration
('Deep freezers', 'Storage and Refrigeration', 1, 2000000.00, 2000000.00, 'need', 'Needed at later stage'),
('Fridge guards', 'Storage and Refrigeration', 4, 40000.00, 160000.00, 'good', 'Must have at the start'),
('Extension cables', 'Storage and Refrigeration', 4, 35000.00, 140000.00, 'good', 'Must have at the start');

-- Add RLS policies
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON inventory_items
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON inventory_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON inventory_items
    FOR UPDATE USING (auth.role() = 'authenticated');