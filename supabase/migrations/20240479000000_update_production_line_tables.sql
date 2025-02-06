-- Add missing columns to production_line_local
ALTER TABLE IF EXISTS production_line_local
ADD COLUMN IF NOT EXISTS fromager_identifier TEXT,
ADD COLUMN IF NOT EXISTS cheese_type TEXT,
ADD COLUMN IF NOT EXISTS batch_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS milk_volume DECIMAL,
ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER,
ADD COLUMN IF NOT EXISTS starter_culture TEXT,
ADD COLUMN IF NOT EXISTS starter_quantity DECIMAL,
ADD COLUMN IF NOT EXISTS coagulant_type TEXT,
ADD COLUMN IF NOT EXISTS coagulant_quantity DECIMAL,
ADD COLUMN IF NOT EXISTS processing_temperature DECIMAL,
ADD COLUMN IF NOT EXISTS processing_time INTEGER,
ADD COLUMN IF NOT EXISTS expected_yield DECIMAL,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add missing columns to production_line_international
ALTER TABLE IF EXISTS production_line_international
ADD COLUMN IF NOT EXISTS fromager_identifier TEXT,
ADD COLUMN IF NOT EXISTS cheese_type TEXT,
ADD COLUMN IF NOT EXISTS batch_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS milk_volume DECIMAL,
ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER,
ADD COLUMN IF NOT EXISTS starter_culture TEXT,
ADD COLUMN IF NOT EXISTS starter_quantity DECIMAL,
ADD COLUMN IF NOT EXISTS coagulant_type TEXT,
ADD COLUMN IF NOT EXISTS coagulant_quantity DECIMAL,
ADD COLUMN IF NOT EXISTS processing_temperature DECIMAL,
ADD COLUMN IF NOT EXISTS processing_time INTEGER,
ADD COLUMN IF NOT EXISTS expected_yield DECIMAL,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pl_local_batch_id ON production_line_local(batch_id);
CREATE INDEX IF NOT EXISTS idx_pl_international_batch_id ON production_line_international(batch_id);

-- Update RLS policies to ensure proper access
ALTER TABLE production_line_local ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_line_international ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
    ON production_line_local FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON production_line_local FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
    ON production_line_international FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON production_line_international FOR INSERT
    TO authenticated
    WITH CHECK (true);