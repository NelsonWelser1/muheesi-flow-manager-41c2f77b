-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cold_room_inventory table
CREATE TABLE IF NOT EXISTS cold_room_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    batch_number TEXT,
    expiration_date DATE,
    storage_conditions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bull_fattening_program table
CREATE TABLE IF NOT EXISTS bull_fattening_program (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager_name TEXT NOT NULL,
    num_mothers INTEGER NOT NULL,
    num_heifers INTEGER NOT NULL,
    num_bulls INTEGER NOT NULL,
    num_calves INTEGER NOT NULL,
    recorded_deaths INTEGER NOT NULL DEFAULT 0,
    death_reasons TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create coffee_sales_records table
CREATE TABLE IF NOT EXISTS coffee_sales_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    product_type TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    revenue FLOAT NOT NULL,
    expenses FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create coffee_inventory table
CREATE TABLE IF NOT EXISTS coffee_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coffee_type TEXT NOT NULL,
    source TEXT NOT NULL,
    store_name TEXT NOT NULL,
    store_manager TEXT NOT NULL,
    date_received DATE NOT NULL,
    quantity FLOAT NOT NULL,
    moisture_content FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create rice_imports table
CREATE TABLE IF NOT EXISTS rice_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type TEXT NOT NULL,
    quality TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    procurement_costs FLOAT NOT NULL,
    logistics_costs FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE cold_room_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE bull_fattening_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE rice_imports ENABLE ROW LEVEL SECURITY;

-- Create policies to allow authenticated users to read data
CREATE POLICY "Allow authenticated read access" ON cold_room_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON bull_fattening_program FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON coffee_sales_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON coffee_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON rice_imports FOR SELECT TO authenticated USING (true);

-- Create policies to allow authenticated users to insert data
CREATE POLICY "Allow authenticated insert" ON cold_room_inventory FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON bull_fattening_program FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON coffee_sales_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON coffee_inventory FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON rice_imports FOR INSERT TO authenticated WITH CHECK (true);