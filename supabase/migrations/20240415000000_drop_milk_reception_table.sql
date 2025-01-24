-- Drop the triggers first
DROP TRIGGER IF EXISTS update_milk_reception_data_updated_at ON milk_reception_data;

-- Drop the function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop the policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON milk_reception_data;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON milk_reception_data;

-- Drop the indexes
DROP INDEX IF EXISTS idx_milk_reception_batch_id;
DROP INDEX IF EXISTS idx_milk_reception_user_id;
DROP INDEX IF EXISTS idx_milk_reception_created_at;

-- Finally drop the table
DROP TABLE IF EXISTS milk_reception_data;