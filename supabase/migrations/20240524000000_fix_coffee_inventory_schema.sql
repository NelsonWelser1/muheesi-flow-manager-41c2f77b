
-- Fix coffee_inventory schema to ensure coffeeType column is properly recognized

-- First, let's make sure the table exists
CREATE TABLE IF NOT EXISTS coffee_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager TEXT NOT NULL,
    location TEXT NOT NULL,
    coffeeType TEXT NOT NULL,
    qualityGrade TEXT NOT NULL,
    source TEXT NOT NULL,
    humidity DECIMAL(5,2) NOT NULL CHECK (humidity >= 0 AND humidity <= 100),
    buying_price DECIMAL(12,2) NOT NULL CHECK (buying_price > 0),
    currency TEXT NOT NULL DEFAULT 'UGX',
    quantity DECIMAL(12,2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL DEFAULT 'kg',
    notes TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add the coffeeType column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'coffee_inventory' AND column_name = 'coffeetype'
    ) THEN
        ALTER TABLE coffee_inventory ADD COLUMN coffeeType TEXT NOT NULL DEFAULT 'arabica';
    END IF;
END $$;

-- Force re-caching of schema for supabase
COMMENT ON TABLE coffee_inventory IS 'Table for storing coffee inventory items';
COMMENT ON COLUMN coffee_inventory.coffeeType IS 'Type of coffee (e.g., arabica, robusta)';

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_coffee_inventory_location ON coffee_inventory(location);
CREATE INDEX IF NOT EXISTS idx_coffee_inventory_coffeeType ON coffee_inventory(coffeeType);
CREATE INDEX IF NOT EXISTS idx_coffee_inventory_created_at ON coffee_inventory(created_at);

-- Make sure RLS is enabled
ALTER TABLE coffee_inventory ENABLE ROW LEVEL SECURITY;

-- Recreate policies to ensure they're properly registered
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON coffee_inventory;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON coffee_inventory;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON coffee_inventory;

CREATE POLICY "Enable read access for authenticated users" ON coffee_inventory
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON coffee_inventory
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON coffee_inventory
    FOR UPDATE TO authenticated USING (true);
