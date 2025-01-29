-- Create storage_tanks table to manage tank settings
CREATE TABLE IF NOT EXISTS public.storage_tanks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tank_name TEXT NOT NULL,
    capacity DECIMAL(10,2) NOT NULL,
    current_volume DECIMAL(10,2) DEFAULT 0,
    temperature DECIMAL(5,2),
    last_cleaned TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_tank_name CHECK (tank_name IN ('Tank A', 'Tank B')),
    CONSTRAINT check_status CHECK (status IN ('active', 'maintenance', 'cleaning', 'inactive'))
);

-- Add indexes
CREATE INDEX idx_storage_tanks_name ON storage_tanks(tank_name);
CREATE INDEX idx_storage_tanks_status ON storage_tanks(status);

-- Insert default tanks
INSERT INTO public.storage_tanks (tank_name, capacity)
VALUES 
    ('Tank A', 5000),
    ('Tank B', 5000)
ON CONFLICT (tank_name) DO NOTHING;

-- Grant permissions
GRANT ALL ON public.storage_tanks TO authenticated;
GRANT ALL ON public.storage_tanks TO service_role;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_storage_tanks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_storage_tanks_timestamp
    BEFORE UPDATE ON storage_tanks
    FOR EACH ROW
    EXECUTE FUNCTION update_storage_tanks_updated_at();