
-- Create sales expenditure table
CREATE TABLE IF NOT EXISTS sales_expenditure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_type TEXT NOT NULL,
    item_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    customer_vendor TEXT,
    payment_status TEXT NOT NULL DEFAULT 'Paid',
    payment_method TEXT,
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies (temporarily permissive for development)
ALTER TABLE sales_expenditure ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select on sales_expenditure"
    ON sales_expenditure
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anonymous insert on sales_expenditure"
    ON sales_expenditure
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update on sales_expenditure"
    ON sales_expenditure
    FOR UPDATE
    USING (true);

CREATE POLICY "Allow anonymous delete on sales_expenditure"
    ON sales_expenditure
    FOR DELETE
    USING (true);

-- Create a function to create the sales_expenditure table if it doesn't exist
CREATE OR REPLACE FUNCTION create_sales_expenditure_table()
RETURNS VOID AS $$
BEGIN
    -- This function is a placeholder as the table is created above
    -- It exists to provide a callable RPC endpoint for table setup
    RAISE NOTICE 'Sales expenditure table is ready';
END;
$$ LANGUAGE plpgsql;
