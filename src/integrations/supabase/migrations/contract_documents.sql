
-- Contract Documents Migration SQL
-- Run this in Supabase SQL Editor

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the contract_documents table
CREATE TABLE IF NOT EXISTS contract_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT,
  contract_id TEXT,
  file_type TEXT,
  file_size BIGINT,
  status TEXT DEFAULT 'pending_verification',
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  client TEXT,
  notes TEXT,
  keywords TEXT[],
  signed_by TEXT[],
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contract_documents_contract_id ON contract_documents(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_documents_status ON contract_documents(status);
CREATE INDEX IF NOT EXISTS idx_contract_documents_filename ON contract_documents(filename);

-- Add RLS policies (disabled for now as we're not using authentication yet)
ALTER TABLE contract_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public contract_documents access" ON contract_documents
  FOR ALL
  USING (true);
