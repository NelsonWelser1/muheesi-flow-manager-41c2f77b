
-- Update the shipments table to ensure status column has proper constraints
ALTER TABLE IF EXISTS public.shipments
    ALTER COLUMN status SET NOT NULL,
    ADD CONSTRAINT shipment_status_check CHECK (status IN ('Scheduled', 'Preparing', 'Loading', 'In Transit', 'Delivered', 'Delayed'));

-- Add comment on status column
COMMENT ON COLUMN public.shipments.status IS 'Shipment status: Scheduled, Preparing, Loading, In Transit, Delivered, Delayed';

-- Update any existing rows without a status to 'Scheduled'
UPDATE public.shipments SET status = 'Scheduled' WHERE status IS NULL OR status = '';
