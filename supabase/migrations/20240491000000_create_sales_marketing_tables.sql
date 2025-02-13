
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sales_records table
CREATE TABLE IF NOT EXISTS sales_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    customer_name TEXT NOT NULL,
    product_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    invoice_number TEXT NOT NULL,
    driver_id TEXT,
    vehicle_id TEXT,
    destination TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id)
);

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    platform TEXT NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    engagement_metrics TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for sales_records
CREATE POLICY "Enable read access for authenticated users on sales_records"
    ON sales_records FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users on sales_records"
    ON sales_records FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Create policies for marketing_campaigns
CREATE POLICY "Enable read access for authenticated users on marketing_campaigns"
    ON marketing_campaigns FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users on marketing_campaigns"
    ON marketing_campaigns FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);
