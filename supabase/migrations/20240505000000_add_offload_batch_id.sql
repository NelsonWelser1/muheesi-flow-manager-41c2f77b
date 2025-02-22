
-- Add offload_batch_id column to both production line tables
ALTER TABLE production_line_international 
ADD COLUMN IF NOT EXISTS offload_batch_id TEXT;

ALTER TABLE production_line_local 
ADD COLUMN IF NOT EXISTS offload_batch_id TEXT;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_pl_international_offload_batch ON production_line_international(offload_batch_id);
CREATE INDEX IF NOT EXISTS idx_pl_local_offload_batch ON production_line_local(offload_batch_id);

