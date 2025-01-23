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
    serial_number TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Insert initial data with serial numbers
INSERT INTO inventory_items (item_name, section, quantity, unit_cost, total_cost, status, serial_number, updated_at) VALUES
('Milk Cans', 'Milk Reception and Initial Processing', 10, 50000, 500000, 'good', 'MI001', '2023-01-22'),
('Aluminium Buckets', 'Milk Reception and Initial Processing', 15, 30000, 450000, 'good', 'AL001', '2023-01-22'),
('Sieving Cloths', 'Milk Reception and Initial Processing', 20, 5000, 100000, 'good', 'SI001', '2023-01-22'),
('Processing Vats (Big)', 'Processing Section', 5, 200000, 1000000, 'good', 'PR001', '2023-01-22'),
('Processing Vats (Small)', 'Processing Section', 8, 150000, 1200000, 'good', 'PR002', '2023-01-22'),
('Saucepans (Big)', 'Processing Section', 4, 80000, 320000, 'good', 'SA001', '2023-01-22'),
('Saucepans (Medium)', 'Processing Section', 6, 60000, 360000, 'good', 'SA002', '2023-01-22'),
('Sauce Pans (Small)', 'Processing Section', 8, 40000, 320000, 'good', 'SA003', '2023-01-22'),
('Plungers', 'Processing Section', 10, 15000, 150000, 'good', 'PL001', '2023-01-22'),
('Mingling Sticks', 'Processing Section', 12, 10000, 120000, 'good', 'MI002', '2023-01-22'),
('Basin/Plastic Buckets', 'Processing Section', 15, 20000, 300000, 'good', 'BA001', '2023-01-22'),
('Knives', 'Processing Section', 8, 25000, 200000, 'good', 'KN001', '2023-01-22'),
('Cheese Stretcher', 'Processing Section', 3, 100000, 300000, 'good', 'CH001', '2023-01-22'),
('Charcoal Stoves', 'Heating and Cooking', 4, 150000, 600000, 'good', 'CH002', '2023-01-22'),
('Stove Stands (Small)', 'Heating and Cooking', 6, 50000, 300000, 'good', 'ST001', '2023-01-22'),
('Stove Stands (Big)', 'Heating and Cooking', 4, 80000, 320000, 'good', 'ST002', '2023-01-22');

-- Enable Row Level Security
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for all users" ON inventory_items
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON inventory_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON inventory_items
    FOR UPDATE USING (auth.role() = 'authenticated');