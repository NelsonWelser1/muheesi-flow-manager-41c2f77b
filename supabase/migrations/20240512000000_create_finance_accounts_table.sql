
-- Create finance accounts table
CREATE TABLE IF NOT EXISTS finance_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    reference_number TEXT,
    payment_method TEXT,
    status TEXT NOT NULL DEFAULT 'Completed',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies (temporarily permissive for development)
ALTER TABLE finance_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select on finance_accounts"
    ON finance_accounts
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anonymous insert on finance_accounts"
    ON finance_accounts
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update on finance_accounts"
    ON finance_accounts
    FOR UPDATE
    USING (true);

CREATE POLICY "Allow anonymous delete on finance_accounts"
    ON finance_accounts
    FOR DELETE
    USING (true);

-- Create a function to create the finance_accounts table if it doesn't exist
CREATE OR REPLACE FUNCTION create_finance_accounts_table()
RETURNS VOID AS $$
BEGIN
    -- This function is a placeholder as the table is created above
    -- It exists to provide a callable RPC endpoint for table setup
    RAISE NOTICE 'Finance accounts table is ready';
END;
$$ LANGUAGE plpgsql;
