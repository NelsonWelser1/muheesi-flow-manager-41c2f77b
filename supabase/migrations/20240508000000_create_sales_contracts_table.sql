
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sales_contracts table
CREATE TABLE IF NOT EXISTS public.sales_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id TEXT NOT NULL UNIQUE,
    contract_title TEXT NOT NULL,
    contract_type TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_contact TEXT,
    client_email TEXT,
    client_address TEXT,
    products JSONB,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    payment_terms TEXT,
    delivery_terms TEXT,
    total_value NUMERIC(15, 2),
    status TEXT,
    notes TEXT,
    special_clauses TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_contracts_contract_id 
ON public.sales_contracts(contract_id);

CREATE INDEX IF NOT EXISTS idx_sales_contracts_client_name 
ON public.sales_contracts(client_name);

CREATE INDEX IF NOT EXISTS idx_sales_contracts_created_at 
ON public.sales_contracts(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.sales_contracts ENABLE ROW LEVEL SECURITY;

-- Create policies for temporarily disabling authentication
CREATE POLICY "Enable read access for all users" 
ON public.sales_contracts
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for all users" 
ON public.sales_contracts
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for all users" 
ON public.sales_contracts
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for all users" 
ON public.sales_contracts
FOR DELETE 
USING (true);

-- Create trigger for updated_at column
CREATE OR REPLACE FUNCTION update_sales_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sales_contracts_updated_at
BEFORE UPDATE ON public.sales_contracts
FOR EACH ROW
EXECUTE FUNCTION update_sales_contracts_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.sales_contracts TO anon;
GRANT ALL ON public.sales_contracts TO authenticated;
GRANT ALL ON public.sales_contracts TO service_role;
