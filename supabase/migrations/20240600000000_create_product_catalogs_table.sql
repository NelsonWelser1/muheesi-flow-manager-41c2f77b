
-- Create product_catalogs table with fields matching the UI form
CREATE TABLE IF NOT EXISTS product_catalogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    catalog_id TEXT NOT NULL UNIQUE,
    catalog_name TEXT NOT NULL,
    catalog_description TEXT,
    effective_date DATE NOT NULL,
    expiry_date DATE,
    status TEXT NOT NULL,
    products JSONB NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_product_catalogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_catalogs_updated_at
    BEFORE UPDATE ON product_catalogs
    FOR EACH ROW
    EXECUTE FUNCTION update_product_catalogs_updated_at();

-- Enable Row Level Security but with permissive policies temporarily
ALTER TABLE product_catalogs ENABLE ROW LEVEL SECURITY;

-- Temporarily allow all operations for anyone (will be restricted later)
CREATE POLICY "Allow all operations for anyone" ON product_catalogs
    FOR ALL
    USING (true)
    WITH CHECK (true);
