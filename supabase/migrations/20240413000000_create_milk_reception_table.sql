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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE milk_reception_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own records" ON milk_reception_data;
DROP POLICY IF EXISTS "Users can insert records" ON milk_reception_data;
DROP POLICY IF EXISTS "Users can update their own records" ON milk_reception_data;

-- Create new RLS policies
CREATE POLICY "Users can view their own records"
ON milk_reception_data
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND (role_name = 'System Administrator' OR company = 'Grand Berna Dairies')
    )
);

CREATE POLICY "Users can insert records"
ON milk_reception_data
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() IS NOT NULL AND (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND (role_name = 'System Administrator' OR company = 'Grand Berna Dairies')
        )
    )
);

CREATE POLICY "Users can update their own records"
ON milk_reception_data
FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND (role_name = 'System Administrator' OR company = 'Grand Berna Dairies')
    )
);

-- Create indexes for better query performance
CREATE INDEX milk_reception_data_created_at_idx ON milk_reception_data(created_at);
CREATE INDEX milk_reception_data_user_id_idx ON milk_reception_data(user_id);
CREATE INDEX milk_reception_data_batch_id_idx ON milk_reception_data(batch_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function
CREATE TRIGGER update_milk_reception_data_updated_at
    BEFORE UPDATE ON milk_reception_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();