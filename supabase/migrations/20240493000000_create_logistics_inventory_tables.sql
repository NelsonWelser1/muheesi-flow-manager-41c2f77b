
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create delivery_management table
CREATE TABLE IF NOT EXISTS logistics_delivery_management (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id TEXT UNIQUE NOT NULL,
    order_id TEXT,
    customer_name TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    scheduled_pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_delivery_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('Pending', 'In Transit', 'Delivered', 'Delayed')) NOT NULL,
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    operator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_entries table
CREATE TABLE IF NOT EXISTS logistics_order_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    order_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    order_details JSONB NOT NULL,
    delivery_priority TEXT CHECK (delivery_priority IN ('High', 'Normal', 'Low')) NOT NULL,
    assigned_delivery_id TEXT REFERENCES logistics_delivery_management(delivery_id),
    order_status TEXT CHECK (order_status IN ('Pending', 'Confirmed', 'Cancelled', 'In Progress')) NOT NULL,
    operator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create delivery_performance table
CREATE TABLE IF NOT EXISTS logistics_delivery_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id TEXT REFERENCES logistics_delivery_management(delivery_id),
    performance_rating INTEGER CHECK (performance_rating BETWEEN 1 AND 5),
    delivery_time INTEGER NOT NULL,
    deviation_from_average DECIMAL(10,2),
    comments TEXT,
    action_required BOOLEAN DEFAULT FALSE,
    action_details TEXT,
    delay_reason TEXT CHECK (delay_reason IN ('Traffic', 'Weather', 'Operational', 'Other')),
    operator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE logistics_delivery_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_order_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_delivery_performance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their organization's deliveries"
    ON logistics_delivery_management FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert deliveries"
    ON logistics_delivery_management FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = operator_id);

CREATE POLICY "Users can view their organization's orders"
    ON logistics_order_entries FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert orders"
    ON logistics_order_entries FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = operator_id);

CREATE POLICY "Users can view performance data"
    ON logistics_delivery_performance FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert performance data"
    ON logistics_delivery_performance FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = operator_id);

-- Create indexes
CREATE INDEX idx_delivery_management_status ON logistics_delivery_management(status);
CREATE INDEX idx_order_entries_status ON logistics_order_entries(order_status);
CREATE INDEX idx_delivery_performance_delivery_id ON logistics_delivery_performance(delivery_id);
