-- Enable RLS
ALTER TABLE cheese_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production_stats ENABLE ROW LEVEL SECURITY;

-- Add production_line_id to cheese_production if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'cheese_production' 
        AND column_name = 'production_line_id'
    ) THEN
        ALTER TABLE cheese_production 
        ADD COLUMN production_line_id UUID REFERENCES production_lines(id);
    END IF;
END $$;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
ON cheese_production
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable read access for authenticated users"
ON cheese_production_stats
FOR SELECT
TO authenticated
USING (true);