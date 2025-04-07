
-- Create coffee_export_contracts table
CREATE TABLE IF NOT EXISTS coffee_export_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_number TEXT NOT NULL,
  contract_date DATE NOT NULL,
  
  -- Seller details
  seller_name TEXT NOT NULL,
  seller_address TEXT,
  seller_registration TEXT,
  seller_contact TEXT,
  seller_email TEXT,
  
  -- Buyer details
  buyer_name TEXT NOT NULL,
  buyer_address TEXT,
  buyer_registration TEXT,
  buyer_contact TEXT,
  buyer_email TEXT,
  
  -- Products (stored as JSONB array)
  products JSONB NOT NULL,
  
  -- Quality specifications (stored as JSONB array)
  quality_specifications JSONB NOT NULL,
  
  -- Payment terms (stored as JSONB array)
  payment_terms_items JSONB NOT NULL,
  
  -- Shipping details
  shipping_incoterm TEXT,
  shipping_packaging TEXT,
  shipping_loading_port TEXT,
  shipping_destination TEXT,
  shipping_latest_date TEXT,
  shipping_timeline TEXT,
  additional_shipping_terms TEXT,
  
  -- Certification details
  certifications JSONB,
  
  -- Insurance and risk
  insurance_requirements TEXT,
  risk_transfer TEXT,
  
  -- Inspection
  inspection_method TEXT,
  inspection_location TEXT,
  inspection_timeline TEXT,
  
  -- Quality claims
  quality_claims_period TEXT,
  quality_claims_process TEXT,
  
  -- Defaults and remedies
  defaults_remedies TEXT,
  
  -- Force majeure
  force_majeure TEXT,
  
  -- Governing law
  governing_law TEXT,
  dispute_resolution TEXT,
  
  -- Signatures and completion
  seller_signature_name TEXT,
  seller_signature_title TEXT,
  seller_signature_date TEXT,
  seller_signature_value TEXT,
  
  buyer_signature_name TEXT,
  buyer_signature_title TEXT,
  buyer_signature_date TEXT,
  buyer_signature_value TEXT,
  
  company_stamp TEXT,
  
  -- Metadata
  total_contract_value NUMERIC(15, 2),
  contract_status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on contract_number for faster lookups
CREATE INDEX IF NOT EXISTS coffee_export_contracts_contract_number_idx ON coffee_export_contracts(contract_number);

-- Create an index on buyer_name for faster lookups
CREATE INDEX IF NOT EXISTS coffee_export_contracts_buyer_name_idx ON coffee_export_contracts(buyer_name);

-- Create the updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists before creating it again
DROP TRIGGER IF EXISTS update_coffee_export_contracts_modtime ON coffee_export_contracts;

-- Create the trigger
CREATE TRIGGER update_coffee_export_contracts_modtime
BEFORE UPDATE ON coffee_export_contracts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Temporarily disable RLS (Row Level Security) for now since authentication is disabled
ALTER TABLE coffee_export_contracts DISABLE ROW LEVEL SECURITY;
