
-- Create the loans table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.loans (
    id SERIAL PRIMARY KEY,
    loan_id VARCHAR(50) UNIQUE NOT NULL,
    institution VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    remaining_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    payment_frequency VARCHAR(50) NOT NULL,
    next_payment_date DATE,
    next_payment_amount DECIMAL(15, 2),
    purpose VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    collateral TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies (commented out for now since authentication is disabled)
-- ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow full access" ON public.loans FOR ALL USING (true);

-- Create an index on loan_id for faster lookups
CREATE INDEX IF NOT EXISTS loans_loan_id_idx ON public.loans (loan_id);

-- Create index on institution
CREATE INDEX IF NOT EXISTS loans_institution_idx ON public.loans (institution);

-- Create index on status
CREATE INDEX IF NOT EXISTS loans_status_idx ON public.loans (status);
