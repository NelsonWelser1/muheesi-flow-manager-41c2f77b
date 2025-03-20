
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create logistics_delivery_performance table
CREATE TABLE IF NOT EXISTS logistics_delivery_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id TEXT NOT NULL,
    performance_rating INTEGER CHECK (performance_rating BETWEEN 1 AND 5),
    delivery_time INTEGER,
    delay_reason TEXT CHECK (delay_reason IN ('Traffic', 'Weather', 'Operational', 'Other')),
    action_required BOOLEAN DEFAULT false,
    action_details TEXT,
    comments TEXT,
    deviation_from_average DECIMAL,
    operator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE logistics_delivery_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies that allow access without authentication (temporarily)
CREATE POLICY "Allow anonymous select on performance" 
    ON logistics_delivery_performance FOR SELECT 
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous insert on performance" 
    ON logistics_delivery_performance FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update on performance" 
    ON logistics_delivery_performance FOR UPDATE 
    TO anon
    USING (true)
    WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_performance_delivery_id ON logistics_delivery_performance(delivery_id);
CREATE INDEX IF NOT EXISTS idx_performance_rating ON logistics_delivery_performance(performance_rating);
CREATE INDEX IF NOT EXISTS idx_performance_created_at ON logistics_delivery_performance(created_at);

-- Add trigger to calculate deviation from average when a new record is inserted
CREATE OR REPLACE FUNCTION calculate_delivery_time_deviation()
RETURNS TRIGGER AS $$
DECLARE
    avg_delivery_time DECIMAL;
BEGIN
    SELECT AVG(delivery_time) INTO avg_delivery_time 
    FROM logistics_delivery_performance
    WHERE delivery_time IS NOT NULL;
    
    IF avg_delivery_time IS NOT NULL AND avg_delivery_time > 0 AND NEW.delivery_time IS NOT NULL THEN
        NEW.deviation_from_average := ((NEW.delivery_time - avg_delivery_time) / avg_delivery_time) * 100;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_deviation
BEFORE INSERT OR UPDATE ON logistics_delivery_performance
FOR EACH ROW
EXECUTE FUNCTION calculate_delivery_time_deviation();
