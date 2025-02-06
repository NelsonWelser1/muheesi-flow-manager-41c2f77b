-- First, let's drop any existing duplicate policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON production_line_local;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON production_line_local;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON production_line_international;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON production_line_international;

-- Drop existing tables if they exist to ensure clean slate
DROP TABLE IF EXISTS production_line_local;
DROP TABLE IF EXISTS production_line_international;

-- Create production_line_international table with all required columns
CREATE TABLE production_line_international (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fromager_identifier TEXT NOT NULL,
    cheese_type TEXT NOT NULL,
    batch_id TEXT UNIQUE NOT NULL,
    milk_volume DECIMAL NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_duration INTEGER NOT NULL,
    starter_culture TEXT NOT NULL,
    starter_quantity DECIMAL NOT NULL,
    coagulant_type TEXT NOT NULL,
    coagulant_quantity DECIMAL NOT NULL,
    processing_temperature DECIMAL NOT NULL,
    processing_time INTEGER NOT NULL,
    expected_yield DECIMAL NOT NULL,
    notes TEXT,
    name TEXT,
    manager TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'in_progress'
);

-- Create production_line_local table with identical structure
CREATE TABLE production_line_local (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fromager_identifier TEXT NOT NULL,
    cheese_type TEXT NOT NULL,
    batch_id TEXT UNIQUE NOT NULL,
    milk_volume DECIMAL NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_duration INTEGER NOT NULL,
    starter_culture TEXT NOT NULL,
    starter_quantity DECIMAL NOT NULL,
    coagulant_type TEXT NOT NULL,
    coagulant_quantity DECIMAL NOT NULL,
    processing_temperature DECIMAL NOT NULL,
    processing_time INTEGER NOT NULL,
    expected_yield DECIMAL NOT NULL,
    notes TEXT,
    name TEXT,
    manager TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'in_progress'
);

-- Create indexes for better query performance
CREATE INDEX idx_pl_international_batch_id ON production_line_international(batch_id);
CREATE INDEX idx_pl_local_batch_id ON production_line_local(batch_id);

-- Enable RLS
ALTER TABLE production_line_international ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_line_local ENABLE ROW LEVEL SECURITY;

-- Create policies for production_line_international
CREATE POLICY "Enable read access for authenticated users"
    ON production_line_international FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON production_line_international FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policies for production_line_local
CREATE POLICY "Enable read access for authenticated users"
    ON production_line_local FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON production_line_local FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create or replace the batch ID generation function
CREATE OR REPLACE FUNCTION generate_batch_id(cheese_type TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    seq_number INTEGER;
    date_prefix TEXT;
    type_prefix TEXT;
BEGIN
    -- Get current date prefix
    date_prefix := to_char(CURRENT_DATE, 'YYYYMMDD');
    
    -- Get next sequence number
    seq_number := nextval('cheese_batch_id_seq');
    
    -- Determine cheese type prefix
    CASE cheese_type
        WHEN 'Mozzarella' THEN type_prefix := 'MOZ';
        WHEN 'Gouda' THEN type_prefix := 'GOU';
        WHEN 'Parmesan' THEN type_prefix := 'PAR';
        WHEN 'Swiss' THEN type_prefix := 'SUI';
        WHEN 'Blue Cheese' THEN type_prefix := 'BLU';
        ELSE type_prefix := 'CHE';
    END CASE;
    
    -- Return formatted batch ID
    RETURN date_prefix || '-' || type_prefix || '-' || LPAD(seq_number::TEXT, 6, '0');
END;
$$;