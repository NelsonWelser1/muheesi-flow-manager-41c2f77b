
-- Create Logistics Deliveries Table
CREATE TABLE IF NOT EXISTS public.logistics_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id TEXT NOT NULL,
    order_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    status TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    scheduled_pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_delivery_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    operator_id UUID,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_logistics_deliveries_updated_at ON logistics_deliveries;
CREATE TRIGGER update_logistics_deliveries_updated_at
BEFORE UPDATE ON logistics_deliveries
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_logistics_deliveries_delivery_id ON logistics_deliveries(delivery_id);
CREATE INDEX IF NOT EXISTS idx_logistics_deliveries_status ON logistics_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_logistics_deliveries_customer_name ON logistics_deliveries(customer_name);

-- Add RLS policies (disabled for now as per requirement)
ALTER TABLE public.logistics_deliveries ENABLE ROW LEVEL SECURITY;

-- Temporarily allow all access without authentication
CREATE POLICY "Allow all access to logistics_deliveries" ON public.logistics_deliveries
    USING (true)
    WITH CHECK (true);
