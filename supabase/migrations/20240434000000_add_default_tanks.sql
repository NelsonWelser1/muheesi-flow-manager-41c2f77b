-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated read access" ON storage_tanks;
DROP POLICY IF EXISTS "Allow authenticated insert access" ON storage_tanks;
DROP POLICY IF EXISTS "Allow authenticated update access" ON storage_tanks;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON storage_tanks;

-- Enable RLS
ALTER TABLE storage_tanks ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for all users (including anonymous)
CREATE POLICY "Allow all read access" 
ON storage_tanks FOR SELECT 
TO PUBLIC
USING (true);

CREATE POLICY "Allow all insert access" 
ON storage_tanks FOR INSERT 
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "Allow all update access" 
ON storage_tanks FOR UPDATE 
TO PUBLIC
USING (true);

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