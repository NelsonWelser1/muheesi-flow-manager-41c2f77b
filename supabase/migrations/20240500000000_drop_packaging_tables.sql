
-- Drop packaging_records table if it exists
DROP TABLE IF EXISTS packaging_records;

-- Drop packaging_labeling table if it exists
DROP TABLE IF EXISTS packaging_labeling;

-- Remove any related policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON packaging_records;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON packaging_records;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON packaging_records;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON packaging_records;
DROP POLICY IF EXISTS "Enable insert access for all authenticated users" ON packaging_records;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON packaging_labeling;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON packaging_labeling;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON packaging_labeling;
