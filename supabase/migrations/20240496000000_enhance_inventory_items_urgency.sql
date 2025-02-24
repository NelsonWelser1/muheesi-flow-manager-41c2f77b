
-- First, ensure urgency has proper constraints and default value
ALTER TABLE inventory_items 
  ALTER COLUMN urgency SET DEFAULT 'medium',
  ADD CONSTRAINT check_valid_urgency 
    CHECK (urgency IN ('critical', 'high', 'medium', 'medium-low', 'low'));

-- Update any null or invalid urgency values to 'medium'
UPDATE inventory_items 
SET urgency = 'medium' 
WHERE urgency IS NULL OR urgency NOT IN ('critical', 'high', 'medium', 'medium-low', 'low');

-- Add or update the trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON inventory_items;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- Create the trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Update RLS policies for urgency updates
DROP POLICY IF EXISTS "Enable urgency updates for authenticated users" ON inventory_items;

CREATE POLICY "Enable urgency updates for authenticated users"
ON inventory_items
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Notify on urgency changes
CREATE OR REPLACE FUNCTION notify_urgency_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.urgency <> OLD.urgency THEN
    PERFORM pg_notify(
      'urgency_change',
      json_build_object(
        'id', NEW.id,
        'old_urgency', OLD.urgency,
        'new_urgency', NEW.urgency,
        'updated_at', NEW.updated_at
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS urgency_change_trigger ON inventory_items;

CREATE TRIGGER urgency_change_trigger
  AFTER UPDATE OF urgency ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION notify_urgency_change();
