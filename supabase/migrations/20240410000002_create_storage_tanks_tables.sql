-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage tanks table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage_tanks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    capacity FLOAT NOT NULL,
    current_volume FLOAT NOT NULL DEFAULT 0,
    temperature FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create milk transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS milk_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tank_id UUID REFERENCES storage_tanks(id),
    liters_added FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    price_per_liter FLOAT NOT NULL,
    total_cost FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some initial sample data
INSERT INTO storage_tanks (name, capacity, current_volume, temperature)
VALUES 
    ('Tank 1', 5000, 2500, 4.2),
    ('Tank 2', 3000, 1800, 4.0),
    ('Tank 3', 4000, 3800, 4.8);

-- Enable RLS
ALTER TABLE storage_tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated read access" ON storage_tanks
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert access" ON storage_tanks
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update access" ON storage_tanks
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read access" ON milk_transactions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert access" ON milk_transactions
    FOR INSERT TO authenticated WITH CHECK (true);