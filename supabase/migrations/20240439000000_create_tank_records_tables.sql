-- Create tank cleaning records table
CREATE TABLE IF NOT EXISTS tank_cleaning_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tank_id UUID REFERENCES storage_tanks(id),
    cleaning_date DATE NOT NULL,
    cleaning_time TIME NOT NULL,
    cleaner_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tank volume records table
CREATE TABLE IF NOT EXISTS tank_volume_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tank_id UUID REFERENCES storage_tanks(id),
    initial_volume FLOAT NOT NULL,
    added_volume FLOAT,
    temperature FLOAT NOT NULL,
    total_volume FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE tank_cleaning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tank_volume_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON tank_cleaning_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON tank_cleaning_records
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON tank_volume_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON tank_volume_records
    FOR INSERT TO authenticated WITH CHECK (true);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tank_cleaning_records_tank_id ON tank_cleaning_records(tank_id);
CREATE INDEX IF NOT EXISTS idx_tank_volume_records_tank_id ON tank_volume_records(tank_id);