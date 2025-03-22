
-- Migration script for coffee_sales table
CREATE TABLE public.coffee_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager TEXT NOT NULL,
  location TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_contact TEXT NOT NULL,
  coffee_type TEXT NOT NULL CHECK (coffee_type IN ('arabica', 'robusta')),
  quality_grade TEXT NOT NULL,
  selling_price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'UGX',
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_coffee_sales_created_at ON public.coffee_sales(created_at);
CREATE INDEX idx_coffee_sales_location ON public.coffee_sales(location);
CREATE INDEX idx_coffee_sales_manager ON public.coffee_sales(manager);

-- Add RLS policies (disabled for now per requirements)
ALTER TABLE public.coffee_sales ENABLE ROW LEVEL SECURITY;

-- Allow access to authenticated users (disabled temporarily)
CREATE POLICY "Anyone can access coffee_sales" ON public.coffee_sales 
  FOR ALL USING (true);

-- Make sure the table is accessible to the public
GRANT ALL ON public.coffee_sales TO public;
