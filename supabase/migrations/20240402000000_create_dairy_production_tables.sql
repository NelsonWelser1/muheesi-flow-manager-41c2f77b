-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Production batches table
CREATE TABLE IF NOT EXISTS production_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    product_type TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    raw_milk_used DECIMAL(10,2) NOT NULL,
    expected_yield DECIMAL(10,2) NOT NULL,
    actual_yield DECIMAL(10,2),
    quality_status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Raw materials inventory table
CREATE TABLE IF NOT EXISTS raw_materials_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_name TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    expiration_date DATE NOT NULL,
    supplier TEXT,
    batch_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE production_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials_inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow read access for authenticated users"
    ON production_batches FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow read access for authenticated users"
    ON raw_materials_inventory FOR SELECT
    TO authenticated
    USING (true);

-- Create policies for managers and operators
CREATE POLICY "Allow all access for managers"
    ON production_batches FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_name IN ('manager', 'operator')
        )
    );

CREATE POLICY "Allow all access for managers"
    ON raw_materials_inventory FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_name IN ('manager', 'operator')
        )
    );

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_production_batches_updated_at
    BEFORE UPDATE ON production_batches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_raw_materials_inventory_updated_at
    BEFORE UPDATE ON raw_materials_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();