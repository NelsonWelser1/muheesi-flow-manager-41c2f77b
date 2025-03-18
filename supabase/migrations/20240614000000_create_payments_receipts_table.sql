
-- Create table for payments and receipts
CREATE TABLE IF NOT EXISTS public.payments_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_number TEXT NOT NULL,
  payment_type TEXT NOT NULL,
  party_name TEXT NOT NULL,
  payment_date DATE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'UGX',
  payment_method TEXT NOT NULL,
  reference_number TEXT,
  status TEXT NOT NULL,
  notes TEXT,
  user_id UUID DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster querying
CREATE INDEX IF NOT EXISTS payments_receipts_payment_number_idx ON public.payments_receipts(payment_number);
CREATE INDEX IF NOT EXISTS payments_receipts_payment_type_idx ON public.payments_receipts(payment_type);
CREATE INDEX IF NOT EXISTS payments_receipts_created_at_idx ON public.payments_receipts(created_at);
CREATE INDEX IF NOT EXISTS payments_receipts_status_idx ON public.payments_receipts(status);

-- Set up RLS policies (initially allowing all access since auth is disabled)
ALTER TABLE public.payments_receipts ENABLE ROW LEVEL SECURITY;

-- Policy for public access (no auth required)
CREATE POLICY "Allow public access to payments_receipts" 
  ON public.payments_receipts 
  FOR ALL 
  TO public 
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_payments_receipts_updated_at
  BEFORE UPDATE ON public.payments_receipts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
