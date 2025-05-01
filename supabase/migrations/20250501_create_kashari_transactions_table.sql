
-- Migration script for kashari_transactions table
CREATE TABLE IF NOT EXISTS public.kashari_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  bank_account TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  payee TEXT NOT NULL,
  reason TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_kashari_transactions_date ON public.kashari_transactions(date);
CREATE INDEX IF NOT EXISTS idx_kashari_transactions_type ON public.kashari_transactions(type);

-- Add RLS policies (disabled for now per requirements)
ALTER TABLE public.kashari_transactions ENABLE ROW LEVEL SECURITY;

-- Allow access to all users (since authentication is temporarily disabled)
CREATE POLICY "Allow full access to all users" ON public.kashari_transactions 
  FOR ALL USING (true);

-- Make sure the table is accessible to the public
GRANT ALL ON public.kashari_transactions TO public;
