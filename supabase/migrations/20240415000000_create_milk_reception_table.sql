-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create milk_reception table
CREATE TABLE IF NOT EXISTS milk_reception (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number TEXT NOT NULL,
    supplier_id UUID REFERENCES auth.users(id),
    supplier_name TEXT NOT NULL,
    reception_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    milk_quantity DECIMAL(10,2) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    fat_content DECIMAL(5,2),
    density DECIMAL(5,2),
    protein_content DECIMAL(5,2),
    lactose DECIMAL(5,2),
    total_solids DECIMAL(5,2),
    ph_level DECIMAL(4,2),
    quality_grade TEXT CHECK (quality_grade IN ('A', 'B', 'C', 'Rejected')),
    test_results JSONB,
    notes TEXT,
    received_by UUID REFERENCES auth.users(id),
    tank_id UUID,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for common queries
CREATE INDEX idx_milk_reception_batch_number ON milk_reception(batch_number);
CREATE INDEX idx_milk_reception_supplier_id ON milk_reception(supplier_id);
CREATE INDEX idx_milk_reception_reception_date ON milk_reception(reception_date);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_milk_reception_updated_at
    BEFORE UPDATE ON milk_reception
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert
CREATE POLICY "Users can insert milk reception records"
ON milk_reception FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = received_by);

-- Allow users to view their own records and admins to view all
CREATE POLICY "Users can view their own records"
ON milk_reception FOR SELECT
TO authenticated
USING (
    auth.uid() = supplier_id 
    OR auth.uid() = received_by 
    OR EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Allow updates only by receivers and admins
CREATE POLICY "Only receivers and admins can update records"
ON milk_reception FOR UPDATE
TO authenticated
USING (
    auth.uid() = received_by 
    OR EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
)
WITH CHECK (
    auth.uid() = received_by 
    OR EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Add some helpful comments
COMMENT ON TABLE milk_reception IS 'Records of milk received from suppliers';
COMMENT ON COLUMN milk_reception.batch_number IS 'Unique identifier for each batch of milk received';
COMMENT ON COLUMN milk_reception.quality_grade IS 'Quality grade assigned after testing (A, B, C, or Rejected)';
COMMENT ON COLUMN milk_reception.test_results IS 'Detailed test results stored as JSON';