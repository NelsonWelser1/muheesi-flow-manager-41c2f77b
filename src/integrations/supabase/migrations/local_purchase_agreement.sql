
-- This migration creates the local_purchase_agreements table
-- Run this in your Supabase project's SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the local_purchase_agreements table
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
  
  created_by UUID,
  
  -- Signatures (stored as image URLs or base64 strings)
  signature_buyer TEXT,
  signature_supplier TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lpa_contract_number ON local_purchase_agreements(contract_number);
CREATE INDEX IF NOT EXISTS idx_lpa_supplier_name ON local_purchase_agreements(supplier_name);
CREATE INDEX IF NOT EXISTS idx_lpa_created_at ON local_purchase_agreements(created_at);
CREATE INDEX IF NOT EXISTS idx_lpa_contract_status ON local_purchase_agreements(contract_status);

-- Add RLS (Row Level Security) policies
ALTER TABLE local_purchase_agreements ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to see all rows
CREATE POLICY "Users can view all purchase agreements" 
  ON local_purchase_agreements 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create a policy that allows all authenticated users to insert rows
CREATE POLICY "Users can create purchase agreements" 
  ON local_purchase_agreements 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Create a policy that allows all authenticated users to update rows
CREATE POLICY "Users can update purchase agreements" 
  ON local_purchase_agreements 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Create a policy that allows all authenticated users to delete rows
CREATE POLICY "Users can delete purchase agreements" 
  ON local_purchase_agreements 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Sample data for testing (optional)
INSERT INTO local_purchase_agreements 
  (contract_number, agreement_date, buyer_name, supplier_name, total_value, contract_status) 
VALUES 
  ('LPA-2025-1001', '2025-01-15', 'KAJON Coffee Limited', 'Coffee Beans Supplier Ltd', 15000.00, 'approved'),
  ('LPA-2025-1002', '2025-02-05', 'KAJON Coffee Limited', 'Farm Equipment Co', 8500.50, 'draft'),
  ('LPA-2025-1003', '2025-02-20', 'KAJON Coffee Limited', 'Packaging Solutions', 3250.75, 'pending')
ON CONFLICT (id) DO NOTHING;
