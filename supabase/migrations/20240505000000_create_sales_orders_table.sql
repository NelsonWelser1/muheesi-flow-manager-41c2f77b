
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sales_orders table
CREATE TABLE IF NOT EXISTS public.sales_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    order_date DATE NOT NULL,
    product TEXT NOT NULL,
    product_type TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    discount DECIMAL(5, 2) CHECK (discount >= 0 AND discount <= 100),
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price * (1 - COALESCE(discount, 0)/100)) STORED,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'partially_paid')),
    sales_rep TEXT,
    delivery_required TEXT NOT NULL CHECK (delivery_required IN ('yes', 'no')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add update trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sales_orders_updated_at
BEFORE UPDATE ON sales_orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;

-- Create public access policy (for development - will be restricted later)
CREATE POLICY "Allow public access to sales_orders"
ON public.sales_orders
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Grant access to public roles
GRANT ALL ON public.sales_orders TO anon;
GRANT ALL ON public.sales_orders TO authenticated;
GRANT ALL ON public.sales_orders TO service_role;
