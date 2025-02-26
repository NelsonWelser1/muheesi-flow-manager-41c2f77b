
-- Add unit_weight and unit_quantity to production_line_international if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'production_line_international' AND column_name = 'unit_weight'
  ) THEN
    ALTER TABLE production_line_international ADD COLUMN unit_weight DECIMAL(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'production_line_international' AND column_name = 'unit_quantity'
  ) THEN
    ALTER TABLE production_line_international ADD COLUMN unit_quantity INTEGER;
  END IF;
END $$;

-- Add unit_weight and unit_quantity to production_line_local if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'production_line_local' AND column_name = 'unit_weight'
  ) THEN
    ALTER TABLE production_line_local ADD COLUMN unit_weight DECIMAL(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'production_line_local' AND column_name = 'unit_quantity'
  ) THEN
    ALTER TABLE production_line_local ADD COLUMN unit_quantity INTEGER;
  END IF;
END $$;
