-- Enable RLS
ALTER TABLE cheese_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production_stats ENABLE ROW LEVEL SECURITY;

-- Add foreign key for production lines if not exists
ALTER TABLE cheese_production
ADD COLUMN IF NOT EXISTS production_line_id UUID REFERENCES production_lines(id);

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
ON cheese_production FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable read access for authenticated users"
ON cheese_production_stats FOR SELECT
TO authenticated
USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cheese_production_status 
ON cheese_production(status);

CREATE INDEX IF NOT EXISTS idx_cheese_production_created_at 
ON cheese_production(created_at);

CREATE INDEX IF NOT EXISTS idx_cheese_production_stats_date 
ON cheese_production_stats(date);