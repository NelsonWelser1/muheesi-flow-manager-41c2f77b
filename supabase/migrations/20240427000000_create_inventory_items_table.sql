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

-- Enable Row Level Security
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Enable read access for authenticated users"
    ON inventory_items FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON inventory_items FOR INSERT
    TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON inventory_items FOR UPDATE
    TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX idx_inventory_items_section ON inventory_items(section);
CREATE INDEX idx_inventory_items_status ON inventory_items(status);
CREATE INDEX idx_inventory_items_procurement_date ON inventory_items(procurement_date);

-- Insert some sample data
INSERT INTO inventory_items (
    item_name,
    section,
    quantity,
    unit_cost,
    total_cost,
    supplier_details,
    notes,
    status
) VALUES 
    ('Milk Cans', 'Milk Reception and Initial Processing', 50, 75.00, 3750.00, 'Dairy Equipment Co.', 'Standard 40L capacity', 'good'),
    ('pH Meter', 'Lab and Quality Control', 5, 120.00, 600.00, 'Lab Supplies Inc.', 'Digital with 0.01 accuracy', 'good'),
    ('Cheese Molds', 'Moulding and Pressing Section', 100, 25.00, 2500.00, 'Cheese Craft Ltd.', 'Round shape, 2kg capacity', 'good'),
    ('Salt', 'Additives and Ingredients', 500, 1.50, 750.00, 'Pure Salt Co.', 'Non-iodized cheese salt', 'good'),
    ('Safety Gloves', 'Others (General and Safety)', 200, 2.00, 400.00, 'Safety First Ltd.', 'Latex-free, medium size', 'good');