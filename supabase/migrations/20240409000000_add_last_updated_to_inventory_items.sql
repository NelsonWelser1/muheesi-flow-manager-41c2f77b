-- Add last_updated column to inventory_items if it doesn't exist
ALTER TABLE IF EXISTS inventory_items 
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Update existing rows to have a last_updated value
UPDATE inventory_items 
SET last_updated = created_at 
WHERE last_updated IS NULL;