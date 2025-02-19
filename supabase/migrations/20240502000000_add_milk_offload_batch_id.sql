
-- Add batch_id column to milk_tank_offloads table
ALTER TABLE public.milk_tank_offloads
ADD COLUMN IF NOT EXISTS batch_id TEXT UNIQUE;

-- Create function to generate batch_id
CREATE OR REPLACE FUNCTION generate_milk_offload_batch_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.batch_id := to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDD-MilkOffload-HH24MISS');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate batch_id
DROP TRIGGER IF EXISTS set_milk_offload_batch_id ON public.milk_tank_offloads;
CREATE TRIGGER set_milk_offload_batch_id
  BEFORE INSERT ON public.milk_tank_offloads
  FOR EACH ROW
  EXECUTE FUNCTION generate_milk_offload_batch_id();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_batch_id ON public.milk_tank_offloads(batch_id);
