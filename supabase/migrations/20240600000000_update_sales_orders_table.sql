
-- Update sales_orders table with additional fields

-- First, make sure the uuid-ossp extension is created
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if table exists first
DO $$ 
<<check_and_update>>
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Check if table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'sales_orders'
  ) INTO table_exists;

  IF table_exists THEN
    -- Table exists, add any missing columns
    
    -- Check for customer_name column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'customer_name') THEN
      ALTER TABLE public.sales_orders ADD COLUMN customer_name TEXT NOT NULL;
    END IF;
    
    -- Check for order_date column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'order_date') THEN
      ALTER TABLE public.sales_orders ADD COLUMN order_date DATE NOT NULL;
    END IF;
    
    -- Check for product column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'product') THEN
      ALTER TABLE public.sales_orders ADD COLUMN product TEXT NOT NULL;
    END IF;
    
    -- Check for product_type column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'product_type') THEN
      ALTER TABLE public.sales_orders ADD COLUMN product_type TEXT;
    END IF;
    
    -- Check for quantity column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'quantity') THEN
      ALTER TABLE public.sales_orders ADD COLUMN quantity INTEGER NOT NULL CHECK (quantity > 0);
    END IF;
    
    -- Check for unit_price column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'unit_price') THEN
      ALTER TABLE public.sales_orders ADD COLUMN unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0);
    END IF;
    
    -- Check for discount column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'discount') THEN
      ALTER TABLE public.sales_orders ADD COLUMN discount DECIMAL(5, 2) CHECK (discount >= 0 AND discount <= 100);
    END IF;
    
    -- Check for total_amount column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'total_amount') THEN
      ALTER TABLE public.sales_orders ADD COLUMN total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price * (1 - COALESCE(discount, 0)/100)) STORED;
    END IF;
    
    -- Check for payment_status column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'payment_status') THEN
      ALTER TABLE public.sales_orders ADD COLUMN payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'partially_paid'));
    END IF;
    
    -- Check for sales_rep column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'sales_rep') THEN
      ALTER TABLE public.sales_orders ADD COLUMN sales_rep TEXT;
    END IF;
    
    -- Check for delivery_required column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'delivery_required') THEN
      ALTER TABLE public.sales_orders ADD COLUMN delivery_required TEXT NOT NULL CHECK (delivery_required IN ('yes', 'no'));
    END IF;
    
    -- Check for notes column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'notes') THEN
      ALTER TABLE public.sales_orders ADD COLUMN notes TEXT;
    END IF;
    
    -- Check for created_at column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'created_at') THEN
      ALTER TABLE public.sales_orders ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- Check for updated_at column
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'sales_orders' 
                  AND column_name = 'updated_at') THEN
      ALTER TABLE public.sales_orders ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
  ELSE
    -- Table does not exist, create it
    CREATE TABLE public.sales_orders (
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
  END IF;
END check_and_update $$;

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_sales_orders_updated_at'
  ) THEN
    CREATE TRIGGER update_sales_orders_updated_at
    BEFORE UPDATE ON sales_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
  END IF;
EXCEPTION
  -- Handle case where sales_orders table doesn't exist yet
  WHEN undefined_table THEN
    NULL;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;

-- Create or update policies
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Allow authenticated read access to sales_orders" ON public.sales_orders;
  DROP POLICY IF EXISTS "Allow authenticated insert access to sales_orders" ON public.sales_orders;
  DROP POLICY IF EXISTS "Allow authenticated update access to sales_orders" ON public.sales_orders;
  DROP POLICY IF EXISTS "Allow authenticated delete access to sales_orders" ON public.sales_orders;
  
  -- Create new policies
  CREATE POLICY "Allow authenticated read access to sales_orders"
  ON public.sales_orders
  FOR SELECT
  TO authenticated
  USING (true);
  
  CREATE POLICY "Allow authenticated insert access to sales_orders"
  ON public.sales_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
  
  CREATE POLICY "Allow authenticated update access to sales_orders"
  ON public.sales_orders
  FOR UPDATE
  TO authenticated
  USING (true);
  
  CREATE POLICY "Allow authenticated delete access to sales_orders"
  ON public.sales_orders
  FOR DELETE
  TO authenticated
  USING (true);
END $$;

-- Grant access to authenticated users
GRANT ALL ON public.sales_orders TO authenticated;
GRANT ALL ON public.sales_orders TO service_role;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer_name ON public.sales_orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_sales_orders_order_date ON public.sales_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_sales_orders_payment_status ON public.sales_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_created_at ON public.sales_orders(created_at);
