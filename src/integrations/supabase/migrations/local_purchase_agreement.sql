
-- Migration for Local Purchase Agreement table
CREATE TABLE IF NOT EXISTS local_purchase_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_number TEXT NOT NULL,
  agreement_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Buyer information
  buyer_name TEXT NOT NULL,
  buyer_address TEXT,
  buyer_contact TEXT,
  
  -- Supplier information
  supplier_name TEXT NOT NULL,
  supplier_address TEXT,
  supplier_contact TEXT,
  
  -- Terms
  payment_terms TEXT,
  delivery_terms TEXT,
  quality_requirements TEXT,
  special_terms TEXT,
  notes TEXT,
  
  -- Status and metadata
  contract_status TEXT DEFAULT 'draft',
  total_value NUMERIC(12,2),
  
  -- Items as JSONB array
  items JSONB,
  
  -- Authentication temporarily disabled
  -- created_by UUID REFERENCES auth.users(id),
  created_by UUID, -- will be linked to auth.users when authentication is enabled
  
  -- Signatures (stored as image URLs or base64 strings)
  signature_buyer TEXT,
  signature_supplier TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lpa_contract_number ON local_purchase_agreements(contract_number);
CREATE INDEX IF NOT EXISTS idx_lpa_supplier_name ON local_purchase_agreements(supplier_name);
CREATE INDEX IF NOT EXISTS idx_lpa_created_at ON local_purchase_agreements(created_at);
CREATE INDEX IF NOT EXISTS idx_lpa_contract_status ON local_purchase_agreements(contract_status);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function
CREATE TRIGGER update_local_purchase_agreements_updated_at
BEFORE UPDATE ON local_purchase_agreements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
