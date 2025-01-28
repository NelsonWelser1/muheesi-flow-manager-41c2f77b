-- Insert default tanks if they don't exist
INSERT INTO storage_tanks (id, name, capacity, current_volume, temperature)
SELECT 'tank-a', 'Tank A', 5000, 0, 4
WHERE NOT EXISTS (
    SELECT 1 FROM storage_tanks WHERE name = 'Tank A'
);

INSERT INTO storage_tanks (id, name, capacity, current_volume, temperature)
SELECT 'tank-b', 'Tank B', 5000, 0, 4
WHERE NOT EXISTS (
    SELECT 1 FROM storage_tanks WHERE name = 'Tank B'
);