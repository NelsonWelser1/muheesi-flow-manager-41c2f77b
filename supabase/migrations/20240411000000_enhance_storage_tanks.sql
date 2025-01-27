-- Enhance storage tanks table with additional fields
ALTER TABLE storage_tanks
ADD COLUMN IF NOT EXISTS last_cleaned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cleaner_id UUID;

-- Create cleaning records table
CREATE TABLE IF NOT EXISTS cleaning_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tank_id UUID REFERENCES storage_tanks(id),
    cleaner_id UUID,
    cleaned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE cleaning_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON cleaning_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert access" ON cleaning_records
    FOR INSERT TO authenticated WITH CHECK (true);