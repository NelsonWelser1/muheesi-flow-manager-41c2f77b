-- First clear existing tanks
DELETE FROM storage_tanks;

-- Insert exactly two tanks with consistent names
INSERT INTO storage_tanks (name, capacity, current_volume, temperature)
VALUES 
    ('Tank A', 5000, 2500, 4.2),
    ('Tank B', 3000, 1800, 4.0);

-- Update the check constraint for valid tank names
ALTER TABLE storage_tanks
DROP CONSTRAINT IF EXISTS valid_tank_names;

ALTER TABLE storage_tanks
ADD CONSTRAINT valid_tank_names 
CHECK (name IN ('Tank A', 'Tank B'));