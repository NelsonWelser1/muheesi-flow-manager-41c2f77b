
-- First add the urgency column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'inventory_items' 
                  AND column_name = 'urgency') 
    THEN
        ALTER TABLE inventory_items 
        ADD COLUMN urgency TEXT DEFAULT 'medium';
    END IF;
END $$;

-- Then ensure urgency has proper constraints
ALTER TABLE inventory_items 
  ALTER COLUMN urgency SET DEFAULT 'medium',
  ADD CONSTRAINT IF NOT EXISTS check_valid_urgency 
    CHECK (urgency IN ('critical', 'high', 'medium', 'medium-low', 'low'));

-- Update any null or invalid urgency values to 'medium'
UPDATE inventory_items 
SET urgency = 'medium' 
WHERE urgency IS NULL OR urgency NOT IN ('critical', 'high', 'medium', 'medium-low', 'low');

-- Enable RLS (safe to run even if already enabled)
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Drop the policy if it exists, then recreate it
DROP POLICY IF EXISTS "Enable urgency updates for authenticated users" ON inventory_items;

CREATE POLICY "Enable urgency updates for authenticated users" ON inventory_items
    FOR UPDATE TO authenticated USING (true);
