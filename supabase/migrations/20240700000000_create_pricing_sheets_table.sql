
-- Create pricing_sheets table with fields matching the UI form
CREATE TABLE IF NOT EXISTS pricing_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sheet_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    effective_date DATE NOT NULL,
    expiry_date DATE,
    status TEXT NOT NULL,
    products JSONB NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_pricing_sheets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pricing_sheets_updated_at
    BEFORE UPDATE ON pricing_sheets
    FOR EACH ROW
    EXECUTE FUNCTION update_pricing_sheets_updated_at();

-- Enable Row Level Security but with permissive policies temporarily
ALTER TABLE pricing_sheets ENABLE ROW LEVEL SECURITY;

-- Temporarily allow all operations for anyone (will be restricted later)
CREATE POLICY "Allow all operations for anyone" ON pricing_sheets
    FOR ALL
    USING (true)
    WITH CHECK (true);
