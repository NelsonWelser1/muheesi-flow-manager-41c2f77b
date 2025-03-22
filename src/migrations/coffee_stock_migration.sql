
-- Migration for coffee_stock table
CREATE TABLE IF NOT EXISTS coffee_stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager TEXT NOT NULL,
  location TEXT NOT NULL,
  coffee_type TEXT NOT NULL,
  quality_grade TEXT NOT NULL,
  source TEXT NOT NULL,
  humidity DECIMAL(5,2) NOT NULL,
  buying_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'UGX',
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_coffee_stock_created_at ON coffee_stock(created_at);

-- Create an index on manager for filtering
CREATE INDEX IF NOT EXISTS idx_coffee_stock_manager ON coffee_stock(manager);

-- Create an index on location for filtering
CREATE INDEX IF NOT EXISTS idx_coffee_stock_location ON coffee_stock(location);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_coffee_stock_status ON coffee_stock(status);
