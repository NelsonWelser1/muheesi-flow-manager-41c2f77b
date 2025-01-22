-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create inventory_items table
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL,
    section TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    supplier_details TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'good',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON inventory_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON inventory_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON inventory_items
    FOR UPDATE TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_inventory_items_section ON inventory_items(section);
CREATE INDEX idx_inventory_items_status ON inventory_items(status);