
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create plantation_inventory table
CREATE TABLE IF NOT EXISTS plantation_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product TEXT NOT NULL,
    quantity DECIMAL NOT NULL,
    unit TEXT NOT NULL,
    location TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create plantation_sales table
CREATE TABLE IF NOT EXISTS plantation_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    product TEXT NOT NULL,
    quantity DECIMAL NOT NULL,
    unit TEXT NOT NULL,
    unit_price DECIMAL NOT NULL,
    total_amount DECIMAL NOT NULL,
    customer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE plantation_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantation_sales ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON plantation_inventory
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON plantation_inventory
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON plantation_inventory
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON plantation_sales
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON plantation_sales
    FOR INSERT TO authenticated WITH CHECK (true);
