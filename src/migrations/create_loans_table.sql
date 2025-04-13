
-- Create loans table for Kyalima Farmers Limited

-- Drop existing table if it exists to recreate with correct schema
DROP TABLE IF EXISTS public.loans;

CREATE TABLE IF NOT EXISTS public.loans (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  loan_id text NOT NULL,
  institution text NOT NULL,
  start_date date NOT NULL,
  due_date date NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  interest_rate numeric NOT NULL CHECK (interest_rate > 0),
  payment_frequency text NOT NULL CHECK (payment_frequency IN ('monthly', 'quarterly', 'biannual', 'annual')),
  purpose text NOT NULL,
  collateral text,
  contact_person text,
  notes text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON loans;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON loans
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Drop existing policies if they exist
DROP POLICY IF EXISTS loans_select_policy ON loans;
DROP POLICY IF EXISTS loans_insert_policy ON loans;
DROP POLICY IF EXISTS loans_update_policy ON loans;
DROP POLICY IF EXISTS loans_delete_policy ON loans;

-- Add RLS policies
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

-- Policy for selecting loans (read-only) - Currently unrestricted for development
CREATE POLICY loans_select_policy ON loans
  FOR SELECT
  USING (true);

-- Policy for inserting loans - Currently unrestricted for development
CREATE POLICY loans_insert_policy ON loans
  FOR INSERT
  WITH CHECK (true);

-- Policy for updating loans - Currently unrestricted for development
CREATE POLICY loans_update_policy ON loans
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy for deleting loans - Currently unrestricted for development
CREATE POLICY loans_delete_policy ON loans
  FOR DELETE
  USING (true);

-- Add comment to table
COMMENT ON TABLE public.loans IS 'Stores loan information for Kyalima Farmers Limited';
