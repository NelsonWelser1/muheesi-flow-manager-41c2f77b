-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Quotations table
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination TEXT NOT NULL,
    incoterm TEXT NOT NULL,
    num_containers INTEGER NOT NULL,
    screen_18_percent DECIMAL NOT NULL,
    screen_15_percent DECIMAL NOT NULL,
    screen_12_percent DECIMAL NOT NULL,
    low_grades_percent DECIMAL NOT NULL,
    transport_cost DECIMAL NOT NULL,
    ocean_freight DECIMAL NOT NULL,
    port_charges DECIMAL NOT NULL,
    sourcing_costs JSONB NOT NULL,
    total_revenue DECIMAL NOT NULL,
    total_costs DECIMAL NOT NULL,
    net_profit DECIMAL NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_quotations_updated_at
    BEFORE UPDATE ON quotations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();