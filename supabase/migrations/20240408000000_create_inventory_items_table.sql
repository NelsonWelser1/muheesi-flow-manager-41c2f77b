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
    status TEXT DEFAULT 'good',
    urgency TEXT DEFAULT 'medium' NOT NULL,
    serial_numbers TEXT[], -- Array of serial numbers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON inventory_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON inventory_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON inventory_items
    FOR UPDATE TO authenticated USING (true);

-- Insert initial data from the Excel sheet
INSERT INTO inventory_items (item_name, section, quantity, unit_cost, total_cost, urgency, serial_numbers) VALUES
('Milk cans', 'Milk Reception and Initial Processing', 3, 500000.00, 1500000.00, 'high', ARRAY['MC001', 'MC002', 'MC003']),
('Aluminium buckets', 'Milk Reception and Initial Processing', 2, 100000.00, 200000.00, 'high', ARRAY['AB001', 'AB002']),
-- ... Add all other items from the Excel sheet following the same pattern
('Wall clock', 'Others (General and Safety)', 1, 20000.00, 20000.00, 'medium', ARRAY['WC001']);