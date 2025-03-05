
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the sales_proposals table
CREATE TABLE IF NOT EXISTS public.sales_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id TEXT UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    proposal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    validity_period INTEGER NOT NULL,
    terms_conditions TEXT,
    products JSONB NOT NULL,
    grand_total DECIMAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for updated_at (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sales_proposals_updated_at') THEN
        -- Create the trigger function if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
            CREATE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        END IF;

        -- Create the trigger
        CREATE TRIGGER update_sales_proposals_updated_at
            BEFORE UPDATE ON sales_proposals
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable RLS but with permissive policies for now (no authentication)
ALTER TABLE public.sales_proposals ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations without auth
CREATE POLICY "Allow public access for all operations"
ON public.sales_proposals
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.sales_proposals TO anon;
GRANT ALL ON public.sales_proposals TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
