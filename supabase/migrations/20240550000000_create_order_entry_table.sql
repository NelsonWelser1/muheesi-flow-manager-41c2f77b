
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create order_entries table
CREATE TABLE IF NOT EXISTS logistics_order_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    order_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    order_details TEXT NOT NULL,
    delivery_priority TEXT CHECK (delivery_priority IN ('High', 'Normal', 'Low')),
    order_status TEXT CHECK (order_status IN ('Pending', 'Confirmed', 'Cancelled', 'In Progress')),
    operator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE logistics_order_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies that allow access without authentication (temporarily)
CREATE POLICY "Allow anonymous select" 
    ON logistics_order_entries FOR SELECT 
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous insert" 
    ON logistics_order_entries FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update" 
    ON logistics_order_entries FOR UPDATE 
    TO anon
    USING (true)
    WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_order_entries_order_id ON logistics_order_entries(order_id);
CREATE INDEX IF NOT EXISTS idx_order_entries_status ON logistics_order_entries(order_status);
