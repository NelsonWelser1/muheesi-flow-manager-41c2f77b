-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL,
    section TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    supplier_details TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    procurement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create dairy_cooler_records table
CREATE TABLE IF NOT EXISTS dairy_cooler_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooler_id TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    humidity FLOAT,
    status TEXT NOT NULL,
    last_check TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create production_lines table if it doesn't exist
CREATE TABLE IF NOT EXISTS production_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    manager TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create or recreate cheese_production table with proper foreign key
DROP TABLE IF EXISTS cheese_production CASCADE;
CREATE TABLE cheese_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    status TEXT NOT NULL,
    temperature FLOAT NOT NULL,
    duration INTEGER NOT NULL,
    ph_level FLOAT NOT NULL,
    yield_amount FLOAT,
    quality_score INTEGER,
    production_line_id UUID REFERENCES production_lines(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cheese_production_stats table
CREATE TABLE IF NOT EXISTS cheese_production_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    production_amount FLOAT NOT NULL,
    yield_efficiency FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dairy_cooler_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Enable read access for authenticated users" ON inventory_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON dairy_cooler_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON production_lines
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON cheese_production
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON cheese_production_stats
    FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_procurement_date ON inventory_items(procurement_date);
CREATE INDEX IF NOT EXISTS idx_dairy_cooler_records_created_at ON dairy_cooler_records(created_at);
CREATE INDEX IF NOT EXISTS idx_cheese_production_created_at ON cheese_production(created_at);
CREATE INDEX IF NOT EXISTS idx_cheese_production_stats_date ON cheese_production_stats(date);

-- Insert sample data
INSERT INTO production_lines (name, status, manager)
VALUES 
    ('Production Line 1', 'active', 'John Doe'),
    ('Production Line 2', 'active', 'Jane Smith')
ON CONFLICT DO NOTHING;

INSERT INTO dairy_cooler_records (cooler_id, temperature, humidity, status)
VALUES 
    ('COOL-001', 4.2, 85, 'operational'),
    ('COOL-002', 3.8, 82, 'operational')
ON CONFLICT DO NOTHING;

INSERT INTO cheese_production_stats (date, production_amount, yield_efficiency)
VALUES 
    (CURRENT_DATE, 1200, 0.85),
    (CURRENT_DATE - INTERVAL '1 day', 1150, 0.83)
ON CONFLICT DO NOTHING;