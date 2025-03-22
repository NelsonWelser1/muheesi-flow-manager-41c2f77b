
-- Create coffee_inventory table
CREATE TABLE IF NOT EXISTS coffee_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager TEXT NOT NULL,
    location TEXT NOT NULL,
    coffeeType TEXT NOT NULL,
    qualityGrade TEXT NOT NULL,
    source TEXT NOT NULL,
    humidity DECIMAL(5,2) NOT NULL CHECK (humidity >= 0 AND humidity <= 100),
    buyingPrice DECIMAL(12,2) NOT NULL CHECK (buyingPrice > 0),
    currency TEXT NOT NULL DEFAULT 'UGX',
    quantity DECIMAL(12,2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL DEFAULT 'kg',
    notes TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE coffee_inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON coffee_inventory
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON coffee_inventory
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON coffee_inventory
    FOR UPDATE TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_coffee_inventory_location ON coffee_inventory(location);
CREATE INDEX idx_coffee_inventory_coffeeType ON coffee_inventory(coffeeType);
CREATE INDEX idx_coffee_inventory_created_at ON coffee_inventory(created_at);
