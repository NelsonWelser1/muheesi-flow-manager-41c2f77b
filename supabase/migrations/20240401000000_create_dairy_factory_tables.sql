-- Create enum for product types
CREATE TYPE product_type AS ENUM ('cheese', 'yogurt', 'processed_milk');

-- Create enum for quality status
CREATE TYPE quality_status AS ENUM ('pending', 'passed', 'failed');

-- Production batches table
CREATE TABLE production_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    product_type product_type NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    raw_milk_used DECIMAL(10,2) NOT NULL,
    expected_yield DECIMAL(10,2) NOT NULL,
    actual_yield DECIMAL(10,2),
    quality_status quality_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Raw materials inventory
CREATE TABLE raw_materials_inventory (
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

-- Quality control checks
CREATE TABLE quality_control_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES production_batches(id),
    parameter TEXT NOT NULL,
    expected_value TEXT NOT NULL,
    actual_value TEXT NOT NULL,
    passed BOOLEAN NOT NULL,
    checked_by TEXT NOT NULL,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE production_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_control_checks ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow read access for authenticated users"
    ON production_batches FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow read access for authenticated users"
    ON raw_materials_inventory FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow read access for authenticated users"
    ON quality_control_checks FOR SELECT
    TO authenticated
    USING (true);

-- Create policies for specific roles (managers and operators)
CREATE POLICY "Allow all access for managers"
    ON production_batches FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'manager');

CREATE POLICY "Allow all access for managers"
    ON raw_materials_inventory FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'manager');

CREATE POLICY "Allow all access for managers"
    ON quality_control_checks FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'manager');

-- Create function to update timestamps
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