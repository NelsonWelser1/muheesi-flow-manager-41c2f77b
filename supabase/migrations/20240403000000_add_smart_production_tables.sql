-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- IoT Sensor Readings Table
CREATE TABLE IF NOT EXISTS iot_sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_type TEXT NOT NULL,
    value FLOAT NOT NULL,
    unit TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    equipment_id UUID,
    status TEXT NOT NULL
);

-- Production Predictions Table
CREATE TABLE IF NOT EXISTS production_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    predicted_output FLOAT NOT NULL,
    confidence FLOAT NOT NULL,
    seasonal_trend TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    factors JSONB
);

-- Equipment Status Table
CREATE TABLE IF NOT EXISTS equipment_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL,
    operational_status TEXT NOT NULL,
    last_maintenance TIMESTAMP WITH TIME ZONE,
    next_maintenance TIMESTAMP WITH TIME ZONE,
    alerts JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX idx_iot_readings_timestamp ON iot_sensor_readings(timestamp);
CREATE INDEX idx_predictions_created_at ON production_predictions(created_at);
CREATE INDEX idx_equipment_status_updated ON equipment_status(updated_at);

-- Enable RLS
ALTER TABLE iot_sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_status ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated read access" ON iot_sensor_readings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON production_predictions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON equipment_status FOR SELECT TO authenticated USING (true);