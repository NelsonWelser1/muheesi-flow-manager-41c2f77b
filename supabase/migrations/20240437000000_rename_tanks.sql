-- Update existing tank names
UPDATE storage_tanks
SET name = 'Tank A'
WHERE name = 'Tank 1';

UPDATE storage_tanks
SET name = 'Tank B'
WHERE name = 'Tank 2';

-- Add a check constraint to ensure only valid tank names are used
ALTER TABLE storage_tanks
DROP CONSTRAINT IF EXISTS valid_tank_names;

ALTER TABLE storage_tanks
ADD CONSTRAINT valid_tank_names 
CHECK (name IN ('Tank A', 'Tank B', 'Both Tanks'));