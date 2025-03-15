
-- Create table for customer invoices
CREATE TABLE IF NOT EXISTS public.customer_invoices (
  id TEXT PRIMARY KEY NOT NULL,
  customer_name TEXT NOT NULL,
  customer_contact TEXT,
  billing_address TEXT,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::JSONB, -- Array of invoice line items
  tax NUMERIC(5, 2) DEFAULT 0,             -- Tax percentage
  discount NUMERIC(5, 2) DEFAULT 0,        -- Discount percentage
  total_amount NUMERIC(10, 2) NOT NULL,    -- Total invoice amount
  payment_terms TEXT,                      -- cash, bank_transfer, credit, mobile_money
  payment_status TEXT DEFAULT 'pending',   -- pending, partially_paid, paid
  payment_proof_url TEXT,                 -- URL to uploaded payment proof file
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID DEFAULT NULL             -- Link to auth.users when auth is enabled
);

-- Create an index for faster querying
CREATE INDEX IF NOT EXISTS customer_invoices_customer_name_idx ON public.customer_invoices(customer_name);
CREATE INDEX IF NOT EXISTS customer_invoices_created_at_idx ON public.customer_invoices(created_at);
CREATE INDEX IF NOT EXISTS customer_invoices_payment_status_idx ON public.customer_invoices(payment_status);

-- Set up RLS policies (initially allowing all access since auth is disabled)
ALTER TABLE public.customer_invoices ENABLE ROW LEVEL SECURITY;

-- Policy for public access (no auth required)
CREATE POLICY "Allow public access to customer_invoices" 
  ON public.customer_invoices 
  FOR ALL 
  TO public 
  USING (true)
  WITH CHECK (true);

-- Create a storage bucket for invoice attachments (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to the invoices bucket
CREATE POLICY "Allow public access to invoices bucket"
  ON storage.objects
  FOR ALL
  TO public
  USING (bucket_id = 'invoices')
  WITH CHECK (bucket_id = 'invoices');
