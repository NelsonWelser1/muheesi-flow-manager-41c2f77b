
-- Create export_contracts table if it doesn't exist
CREATE TABLE IF NOT EXISTS export_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('coffee', 'general', 'fresh')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'completed', 'pending', 'negotiation')),
  contract_date DATE NOT NULL,
  contract_number TEXT,
  buyer_name TEXT,
  buyer_address TEXT,
  buyer_registration TEXT,
  -- Store product details and quality specifications as JSONB arrays
  product_details JSONB DEFAULT '[]'::jsonb,
  quality_specifications JSONB DEFAULT '[]'::jsonb,
  -- Additional contract terms
  payment_terms TEXT,
  delivery_terms TEXT,
  shipping_terms TEXT,
  inspection_terms TEXT,
  additional_terms TEXT,
  seller_signature TEXT,
  buyer_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add a comment to the table
COMMENT ON TABLE export_contracts IS 'Stores export contracts for coffee, general produce, and fresh produce';

-- Create an index on contract type for faster filtering
CREATE INDEX IF NOT EXISTS export_contracts_type_idx ON export_contracts (type);

-- Create an index on contract date for chronological sorting
CREATE INDEX IF NOT EXISTS export_contracts_date_idx ON export_contracts (contract_date);

-- Create updated_at trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_export_contracts_modtime ON export_contracts;
CREATE TRIGGER update_export_contracts_modtime
BEFORE UPDATE ON export_contracts
FOR EACH ROW
EXECUTE FUNCTION moddatetime(updated_at);

-- Enable Row Level Security
ALTER TABLE export_contracts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'export_contracts' AND policyname = 'authenticated_full_access'
  ) THEN
    CREATE POLICY authenticated_full_access ON export_contracts
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END
$$;
