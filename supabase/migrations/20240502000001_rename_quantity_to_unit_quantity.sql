
-- Rename quantity column to unit_quantity if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'cold_room_inventory' AND column_name = 'quantity'
  ) THEN
    ALTER TABLE cold_room_inventory RENAME COLUMN quantity TO unit_quantity;
  END IF;
END $$;

-- Ensure the unit_quantity column exists (in case it doesn't)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'cold_room_inventory' AND column_name = 'unit_quantity'
  ) THEN
    ALTER TABLE cold_room_inventory ADD COLUMN unit_quantity INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;
