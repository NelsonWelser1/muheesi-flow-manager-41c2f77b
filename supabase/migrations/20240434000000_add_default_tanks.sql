-- Insert default tanks if they don't exist
INSERT INTO storage_tanks (name, capacity, current_volume, temperature)
SELECT 'Tank A', 5000, 0, 4
WHERE NOT EXISTS (
    SELECT 1 FROM storage_tanks WHERE name = 'Tank A'
);

INSERT INTO storage_tanks (name, capacity, current_volume, temperature)
SELECT 'Tank B', 5000, 0, 4
WHERE NOT EXISTS (
    SELECT 1 FROM storage_tanks WHERE name = 'Tank B'
);