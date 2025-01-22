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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON inventory_items
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON inventory_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON inventory_items
    FOR UPDATE USING (true);