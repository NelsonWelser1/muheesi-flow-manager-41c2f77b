-- Create enum for tank cleaning status
CREATE TYPE cleaning_status AS ENUM ('pending', 'in_progress', 'completed');

-- Create table for tank cleaning records
CREATE TABLE IF NOT EXISTS tank_cleaning_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tank_id UUID REFERENCES storage_tanks(id),
    cleaning_date DATE NOT NULL,
    cleaning_time TIME NOT NULL,
    cleaner_id TEXT NOT NULL,
    status cleaning_status DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for tank volume records
CREATE TABLE IF NOT EXISTS tank_volume_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tank_id UUID REFERENCES storage_tanks(id),
    initial_volume FLOAT NOT NULL,
    added_volume FLOAT,
    temperature FLOAT NOT NULL,
    total_volume FLOAT NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    notes TEXT
);

-- Add indexes for better query performance
CREATE INDEX idx_cleaning_records_tank_id ON tank_cleaning_records(tank_id);
CREATE INDEX idx_cleaning_records_date ON tank_cleaning_records(cleaning_date);
CREATE INDEX idx_volume_records_tank_id ON tank_volume_records(tank_id);
CREATE INDEX idx_volume_records_date ON tank_volume_records(recorded_at);

-- Add RLS policies
ALTER TABLE tank_cleaning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tank_volume_records ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated read access" ON tank_cleaning_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert access" ON tank_cleaning_records
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read access" ON tank_volume_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert access" ON tank_volume_records
    FOR INSERT TO authenticated WITH CHECK (true);