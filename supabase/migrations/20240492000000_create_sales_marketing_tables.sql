
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sales_proposals table
CREATE TABLE IF NOT EXISTS sales_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    products JSONB NOT NULL,
    validity_period INTEGER NOT NULL,
    terms_conditions TEXT,
    grand_total TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create product_catalogues table
CREATE TABLE IF NOT EXISTS product_catalogues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    catalogue_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    products JSONB NOT NULL,
    published_date DATE NOT NULL,
    version TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id TEXT NOT NULL UNIQUE,
    campaign_name TEXT NOT NULL,
    objectives TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    strategies JSONB,
    kpis JSONB,
    progress_status TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create crm_reports table
CREATE TABLE IF NOT EXISTS crm_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id TEXT NOT NULL UNIQUE,
    report_type TEXT NOT NULL,
    customer_id TEXT,
    customer_name TEXT,
    interaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    interaction_type TEXT NOT NULL,
    details TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    status TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create advertising_promotions table
CREATE TABLE IF NOT EXISTS advertising_promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    material_type TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    assets_urls JSONB,
    details TEXT,
    status TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create pricing_sheets table
CREATE TABLE IF NOT EXISTS pricing_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sheet_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    effective_date DATE NOT NULL,
    expiry_date DATE,
    products JSONB NOT NULL,
    pricing_strategy TEXT,
    notes TEXT,
    status TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create sales_contracts table
CREATE TABLE IF NOT EXISTS sales_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_id TEXT,
    contract_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    products JSONB NOT NULL,
    terms TEXT NOT NULL,
    total_value DECIMAL(10,2) NOT NULL,
    status TEXT,
    signed_date DATE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create customer_feedback table
CREATE TABLE IF NOT EXISTS customer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feedback_id TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_id TEXT,
    feedback_date DATE NOT NULL,
    product_id TEXT,
    product_name TEXT,
    rating INTEGER,
    feedback_text TEXT,
    suggestions TEXT,
    action_required BOOLEAN DEFAULT FALSE,
    action_taken TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create stored procedure for creating tables if they don't exist
CREATE OR REPLACE FUNCTION create_sales_proposals_table_if_not_exists()
RETURNS void AS $$
BEGIN
    -- Tables will be created by the migration script above,
    -- this function is just a placeholder for the client-side fallback
    RETURN;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on all tables
ALTER TABLE sales_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_catalogues ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertising_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for each table
-- Sales Proposals
CREATE POLICY "Enable read access for authenticated users on sales_proposals"
    ON sales_proposals FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users on sales_proposals"
    ON sales_proposals FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Product Catalogues
CREATE POLICY "Enable read access for authenticated users on product_catalogues"
    ON product_catalogues FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users on product_catalogues"
    ON product_catalogues FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Marketing Campaigns
CREATE POLICY "Enable read access for authenticated users on marketing_campaigns"
    ON marketing_campaigns FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users on marketing_campaigns"
    ON marketing_campaigns FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- CRM Reports
CREATE POLICY "Enable read access for authenticated users on crm_reports"
    ON crm_reports FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users on crm_reports"
    ON crm_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Advertising Promotions
CREATE POLICY "Enable read access for authenticated users on advertising_promotions"
    ON advertising_promotions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users on advertising_promotions"
    ON advertising_promotions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Pricing Sheets
CREATE POLICY "Enable read access for authenticated users on pricing_sheets"
    ON pricing_sheets FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users on pricing_sheets"
    ON pricing_sheets FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Sales Contracts
CREATE POLICY "Enable read access for authenticated users on sales_contracts"
    ON sales_contracts FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users on sales_contracts"
    ON sales_contracts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Customer Feedback
CREATE POLICY "Enable read access for authenticated users on customer_feedback"
    ON customer_feedback FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users on customer_feedback"
    ON customer_feedback FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_proposals_created_at ON sales_proposals(created_at);
CREATE INDEX IF NOT EXISTS idx_product_catalogues_created_at ON product_catalogues(created_at);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_created_at ON marketing_campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_crm_reports_created_at ON crm_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_advertising_promotions_created_at ON advertising_promotions(created_at);
CREATE INDEX IF NOT EXISTS idx_pricing_sheets_created_at ON pricing_sheets(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_contracts_created_at ON sales_contracts(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_feedback_created_at ON customer_feedback(created_at);

-- Add triggers for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sales_proposals_updated_at
    BEFORE UPDATE ON sales_proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_catalogues_updated_at
    BEFORE UPDATE ON product_catalogues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_campaigns_updated_at
    BEFORE UPDATE ON marketing_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_reports_updated_at
    BEFORE UPDATE ON crm_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertising_promotions_updated_at
    BEFORE UPDATE ON advertising_promotions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_sheets_updated_at
    BEFORE UPDATE ON pricing_sheets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_contracts_updated_at
    BEFORE UPDATE ON sales_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_feedback_updated_at
    BEFORE UPDATE ON customer_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
