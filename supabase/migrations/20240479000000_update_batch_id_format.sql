
-- Update batch ID format constraint for both tables
ALTER TABLE production_line_international
DROP CONSTRAINT IF EXISTS batch_id_format_check,
ADD CONSTRAINT batch_id_format_check
CHECK (batch_id ~ '^INT\d{8}-[A-Z]{3}-\d{6}$');

ALTER TABLE production_line_local
DROP CONSTRAINT IF EXISTS batch_id_format_check,
ADD CONSTRAINT batch_id_format_check
CHECK (batch_id ~ '^LCL\d{8}-[A-Z]{3}-\d{6}$');

-- Add indexes for better query performance on batch IDs
CREATE INDEX IF NOT EXISTS idx_international_batch_id ON production_line_international(batch_id);
CREATE INDEX IF NOT EXISTS idx_local_batch_id ON production_line_local(batch_id);
