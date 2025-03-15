
-- Create table for bills and expenses
CREATE TABLE IF NOT EXISTS public.bills_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_number TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  bill_date DATE NOT NULL,
  due_date DATE NOT NULL,
  expense_type TEXT NOT NULL,
  expense_details TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'UGX',
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT,
  recurring_end_date DATE,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster querying
CREATE INDEX IF NOT EXISTS bills_expenses_bill_number_idx ON public.bills_expenses(bill_number);
CREATE INDEX IF NOT EXISTS bills_expenses_created_at_idx ON public.bills_expenses(created_at);
CREATE INDEX IF NOT EXISTS bills_expenses_status_idx ON public.bills_expenses(status);

-- Set up RLS policies (initially allowing all access since auth is disabled)
ALTER TABLE public.bills_expenses ENABLE ROW LEVEL SECURITY;

-- Policy for public access (no auth required)
CREATE POLICY "Allow public access to bills_expenses" 
  ON public.bills_expenses 
  FOR ALL 
  TO public 
  USING (true)
  WITH CHECK (true);

-- Create a storage bucket for expense attachments (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('expenses', 'expenses', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to the expenses bucket
CREATE POLICY "Allow public access to expenses bucket"
  ON storage.objects
  FOR ALL
  TO public
  USING (bucket_id = 'expenses')
  WITH CHECK (bucket_id = 'expenses');
