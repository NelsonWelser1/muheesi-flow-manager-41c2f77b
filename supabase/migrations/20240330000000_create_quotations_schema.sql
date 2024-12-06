-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    coffee_grade TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    terms TEXT,
    validity DATE NOT NULL,
    delivery_terms TEXT NOT NULL,
    payment_terms TEXT NOT NULL,
    destination TEXT NOT NULL,
    incoterm TEXT NOT NULL,
    num_containers INTEGER NOT NULL,
    screen_18_percent DECIMAL NOT NULL DEFAULT 0,
    screen_15_percent DECIMAL NOT NULL DEFAULT 0,
    screen_12_percent DECIMAL NOT NULL DEFAULT 0,
    low_grades_percent DECIMAL NOT NULL DEFAULT 0,
    transport_cost DECIMAL NOT NULL DEFAULT 0,
    ocean_freight DECIMAL NOT NULL DEFAULT 0,
    port_charges DECIMAL NOT NULL DEFAULT 0,
    sourcing_costs JSONB NOT NULL DEFAULT '{}',
    total_revenue DECIMAL NOT NULL DEFAULT 0,
    total_costs DECIMAL NOT NULL DEFAULT 0,
    net_profit DECIMAL NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quotations_updated_at
    BEFORE UPDATE ON quotations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON public.quotations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON public.quotations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON public.quotations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON public.quotations
    FOR DELETE USING (auth.role() = 'authenticated');