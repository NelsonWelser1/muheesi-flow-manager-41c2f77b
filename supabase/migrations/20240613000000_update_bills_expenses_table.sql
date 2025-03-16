
-- Update the bills_expenses table to fix column naming issues
ALTER TABLE IF EXISTS public.bills_expenses 
  RENAME COLUMN bill_number TO bill_number;

-- Add missing columns with correct names to match form data
ALTER TABLE IF EXISTS public.bills_expenses 
  ADD COLUMN IF NOT EXISTS bill_date DATE,
  ADD COLUMN IF NOT EXISTS due_date DATE;

-- Rename columns to match what's being sent from the form
ALTER TABLE IF EXISTS public.bills_expenses 
  RENAME COLUMN created_at TO created_at;

-- Update payment_status to use standard names
ALTER TABLE IF EXISTS public.bills_expenses 
  RENAME COLUMN status TO status;

-- These are just to ensure we have all necessary columns
ALTER TABLE IF EXISTS public.bills_expenses 
  ADD COLUMN IF NOT EXISTS supplier_name TEXT,
  ADD COLUMN IF NOT EXISTS expense_type TEXT,
  ADD COLUMN IF NOT EXISTS expense_details TEXT,
  ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS recurring_frequency TEXT,
  ADD COLUMN IF NOT EXISTS recurring_end_date DATE,
  ADD COLUMN IF NOT EXISTS receipt_url TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'UGX';

-- Fix RLS policies to ensure they work correctly
ALTER TABLE public.bills_expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public access to bills_expenses" ON public.bills_expenses;
CREATE POLICY "Allow public access to bills_expenses" 
  ON public.bills_expenses 
  FOR ALL 
  TO public 
  USING (true)
  WITH CHECK (true);
