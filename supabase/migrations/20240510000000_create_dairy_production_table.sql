
-- Create dairy production table
CREATE TABLE IF NOT EXISTS dairy_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quantity NUMERIC NOT NULL,
    fat_content NUMERIC,
    production_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies (temporarily permissive for development)
ALTER TABLE dairy_production ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select on dairy_production"
    ON dairy_production
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anonymous insert on dairy_production"
    ON dairy_production
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update on dairy_production"
    ON dairy_production
    FOR UPDATE
    USING (true);

CREATE POLICY "Allow anonymous delete on dairy_production"
    ON dairy_production
    FOR DELETE
    USING (true);

-- Create a function to create the dairy_production table if it doesn't exist
CREATE OR REPLACE FUNCTION create_dairy_production_table()
RETURNS VOID AS $$
BEGIN
    -- This function is a placeholder as the table is created above
    -- It exists to provide a callable RPC endpoint for table setup
    RAISE NOTICE 'Dairy production table is ready';
END;
$$ LANGUAGE plpgsql;
