
-- Migration to drop the coffee_inventory table

-- First, drop policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON coffee_inventory;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON coffee_inventory;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON coffee_inventory;

-- Drop indexes
DROP INDEX IF EXISTS idx_coffee_inventory_location;
DROP INDEX IF EXISTS idx_coffee_inventory_coffeeType;
DROP INDEX IF EXISTS idx_coffee_inventory_created_at;

-- Drop the table
DROP TABLE IF EXISTS coffee_inventory;

-- Add a comment to document the removal
COMMENT ON SCHEMA public IS 'Coffee inventory table has been removed as of 2024-05-25';
