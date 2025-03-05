
-- Create banana plantation table
CREATE TABLE IF NOT EXISTS banana_plantation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plantation_area NUMERIC NOT NULL,
    growth_stage TEXT NOT NULL,
    last_fertilization_date DATE,
    fertilizer_used TEXT,
    next_fertilization_date DATE,
    last_pesticide_date DATE,
    pesticide_used TEXT,
    application_reason TEXT,
    disease_status TEXT NOT NULL,
    bunches_harvested NUMERIC DEFAULT 0,
    harvest_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies (temporarily permissive for development)
ALTER TABLE banana_plantation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select on banana_plantation"
    ON banana_plantation
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anonymous insert on banana_plantation"
    ON banana_plantation
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update on banana_plantation"
    ON banana_plantation
    FOR UPDATE
    USING (true);

CREATE POLICY "Allow anonymous delete on banana_plantation"
    ON banana_plantation
    FOR DELETE
    USING (true);

-- Create a function to create the banana_plantation table if it doesn't exist
CREATE OR REPLACE FUNCTION create_banana_plantation_table()
RETURNS VOID AS $$
BEGIN
    -- This function is a placeholder as the table is created above
    -- It exists to provide a callable RPC endpoint for table setup
    RAISE NOTICE 'Banana plantation table is ready';
END;
$$ LANGUAGE plpgsql;
