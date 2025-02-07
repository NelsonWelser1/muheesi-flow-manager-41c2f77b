
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create packaging_labeling table
CREATE TABLE IF NOT EXISTS packaging_labeling (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    batch_id TEXT NOT NULL,
    cheese_type TEXT NOT NULL,
    packaging_size TEXT NOT NULL,
    operator_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    expiry_date DATE NOT NULL,
    nutritional_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE packaging_labeling ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Enable read access for authenticated users"
    ON packaging_labeling FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON packaging_labeling FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update access for authenticated users"
    ON packaging_labeling FOR UPDATE
    TO authenticated
    USING (auth.uid() IS NOT NULL);

-- Create indexes for better query performance
CREATE INDEX idx_packaging_batch_id ON packaging_labeling(batch_id);
CREATE INDEX idx_packaging_cheese_type ON packaging_labeling(cheese_type);
CREATE INDEX idx_packaging_created_at ON packaging_labeling(created_at);
