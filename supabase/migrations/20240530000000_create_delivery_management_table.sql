
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create delivery_management table with all required form fields
CREATE TABLE IF NOT EXISTS delivery_management (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id TEXT NOT NULL,
    order_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'In Transit', 'Delivered', 'Delayed')),
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    scheduled_pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_delivery_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS but temporarily disable authentication requirements
ALTER TABLE delivery_management ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations (temporarily disable authentication requirements)
CREATE POLICY "Allow all operations for everyone" ON delivery_management
    FOR ALL TO public USING (true) WITH CHECK (true);

-- Create indexes for common query patterns
CREATE INDEX idx_delivery_management_delivery_id ON delivery_management(delivery_id);
CREATE INDEX idx_delivery_management_status ON delivery_management(status);
CREATE INDEX idx_delivery_management_order_id ON delivery_management(order_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_delivery_management_updated_at
    BEFORE UPDATE ON delivery_management
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
