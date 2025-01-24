-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if it exists
DROP TABLE IF EXISTS milk_reception_data;

-- Create milk_reception_data table with all required columns
CREATE TABLE IF NOT EXISTS milk_reception_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    reception_date TIMESTAMP WITH TIME ZONE,
    supplier TEXT NOT NULL,
    milk_type TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    fat_percentage DECIMAL(5,2) NOT NULL,
    protein_percentage DECIMAL(5,2) NOT NULL,
    total_plate_count INTEGER NOT NULL,
    acidity DECIMAL(5,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE milk_reception_data ENABLE ROW LEVEL SECURITY;

-- Create policies to allow authenticated users to read data
CREATE POLICY "Allow authenticated read access" ON milk_reception_data 
    FOR SELECT TO authenticated USING (true);

-- Create policies to allow authenticated users to insert data
CREATE POLICY "Allow authenticated insert" ON milk_reception_data 
    FOR INSERT TO authenticated WITH CHECK (true);

-- Create an index on created_at for better query performance
CREATE INDEX milk_reception_data_created_at_idx ON milk_reception_data(created_at);