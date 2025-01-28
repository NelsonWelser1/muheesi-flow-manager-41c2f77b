-- Create storage tank settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage_tank_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temperature_threshold FLOAT NOT NULL DEFAULT 4.5,
    capacity_warning_threshold INTEGER NOT NULL DEFAULT 90,
    auto_cleaning_enabled BOOLEAN NOT NULL DEFAULT false,
    cleaning_interval INTEGER NOT NULL DEFAULT 7,
    maintenance_interval INTEGER NOT NULL DEFAULT 30,
    last_maintenance TIMESTAMP WITH TIME ZONE,
    next_maintenance TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE storage_tank_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access"
    ON storage_tank_settings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert access"
    ON storage_tank_settings FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update access"
    ON storage_tank_settings FOR UPDATE
    TO authenticated
    USING (true);