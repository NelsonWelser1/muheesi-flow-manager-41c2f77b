
-- Create coffee_export_contracts table
CREATE TABLE IF NOT EXISTS coffee_export_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_number TEXT NOT NULL UNIQUE,  -- Added UNIQUE constraint to prevent duplicates
  contract_date DATE NOT NULL,
  -- Seller details
  seller_name TEXT NOT NULL,
  seller_address TEXT,
  seller_registration TEXT,
  -- Buyer details
  buyer_name TEXT NOT NULL,
  buyer_address TEXT,
  buyer_registration TEXT,
  -- Products (stored as JSONB array)
  products JSONB NOT NULL,
  -- Payment terms (stored as JSONB array)
  payment_terms_items JSONB NOT NULL,
  -- Shipping terms
  shipping_left_label1 TEXT,
  shipping_left_value1 TEXT,
  shipping_left_label2 TEXT,
  shipping_left_value2 TEXT,
  shipping_left_label3 TEXT,
  shipping_left_value3 TEXT,
  shipping_right_label1 TEXT,
  shipping_right_value1 TEXT,
  shipping_right_label2 TEXT,
  shipping_right_value2 TEXT,
  shipping_right_label3 TEXT,
  shipping_right_value3 TEXT,
  additional_shipping_terms_label TEXT,
  additional_shipping_terms TEXT,
  -- Signature fields
  for_seller_label TEXT,
  seller_name_label TEXT,
  seller_name_value TEXT,
  seller_title_label TEXT,
  seller_title_value TEXT,
  seller_date_label TEXT,
  seller_date_value TEXT,
  seller_signature_label TEXT,
  seller_signature_value TEXT,
  for_buyer_label TEXT,
  buyer_signature_name_label TEXT,
  buyer_signature_name_value TEXT,
  buyer_signature_title_label TEXT,
  buyer_signature_title_value TEXT,
  buyer_signature_date_label TEXT,
  buyer_signature_date_value TEXT,
  buyer_signature_label TEXT,
  buyer_signature_value TEXT,
  company_stamp TEXT,
  -- Metadata
  total_contract_value NUMERIC(15, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_flag TEXT DEFAULT NULL  -- Added flag to prevent duplicate submissions
);

-- Create an index on contract_number for faster lookups
CREATE INDEX IF NOT EXISTS coffee_export_contracts_contract_number_idx ON coffee_export_contracts(contract_number);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coffee_export_contracts_modtime
BEFORE UPDATE ON coffee_export_contracts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Temporarily disable RLS (Row Level Security) for now since authentication is disabled
ALTER TABLE coffee_export_contracts DISABLE ROW LEVEL SECURITY;

