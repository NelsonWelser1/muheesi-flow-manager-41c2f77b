
-- Migration for coffee_stock_transfers table
CREATE TABLE IF NOT EXISTS coffee_stock_transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager TEXT NOT NULL,
  source_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  coffee_type TEXT NOT NULL,
  quality_grade TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, received, declined
  recipient_user_id UUID,
  sender_user_id UUID,
  received_at TIMESTAMP WITH TIME ZONE,
  declined_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transfers_status ON coffee_stock_transfers(status);
CREATE INDEX IF NOT EXISTS idx_transfers_source_location ON coffee_stock_transfers(source_location);
CREATE INDEX IF NOT EXISTS idx_transfers_destination_location ON coffee_stock_transfers(destination_location);
CREATE INDEX IF NOT EXISTS idx_transfers_created_at ON coffee_stock_transfers(created_at);

-- Enable Row Level Security
ALTER TABLE coffee_stock_transfers ENABLE ROW LEVEL SECURITY;

-- Create policy for all operations (will be restricted properly in production)
CREATE POLICY "Enable all operations for development" 
ON coffee_stock_transfers
FOR ALL 
USING (true)
WITH CHECK (true);
