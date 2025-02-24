
-- First, ensure urgency has proper constraints and default value
ALTER TABLE inventory_items 
  ALTER COLUMN urgency SET DEFAULT 'medium',
  ADD CONSTRAINT check_valid_urgency 
    CHECK (urgency IN ('critical', 'high', 'medium', 'medium-low', 'low'));

-- Update any null or invalid urgency values to 'medium'
UPDATE inventory_items 
SET urgency = 'medium' 
WHERE urgency IS NULL OR urgency NOT IN ('critical', 'high', 'medium', 'medium-low', 'low');

-- Enable RLS
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable urgency updates for authenticated users" ON inventory_items
    FOR UPDATE TO authenticated USING (true);
