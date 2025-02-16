
-- Add service_end_date column to storage_tanks table
ALTER TABLE public.storage_tanks
ADD COLUMN IF NOT EXISTS service_end_date TIMESTAMP WITH TIME ZONE;

-- Update the status check constraint to include our new statuses
ALTER TABLE public.storage_tanks
DROP CONSTRAINT IF EXISTS check_status;

ALTER TABLE public.storage_tanks
ADD CONSTRAINT check_status 
CHECK (status IN ('active', 'suspended', 'out_of_service'));

-- Create index for better query performance on status and service_end_date
CREATE INDEX IF NOT EXISTS idx_storage_tanks_status 
ON storage_tanks(status);

CREATE INDEX IF NOT EXISTS idx_storage_tanks_service_end_date 
ON storage_tanks(service_end_date);

-- Grant necessary permissions
GRANT ALL ON public.storage_tanks TO authenticated;
GRANT ALL ON public.storage_tanks TO service_role;

