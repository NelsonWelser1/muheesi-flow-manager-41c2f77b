
-- Drop the existing delivery_notes table if it exists
DROP TABLE IF EXISTS delivery_notes;

-- Create delivery_notes table with the updated schema
CREATE TABLE IF NOT EXISTS delivery_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_reference TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    receiver_name TEXT NOT NULL,
    receiver_contact TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    delivery_person TEXT,
    delivery_status TEXT NOT NULL DEFAULT 'pending',
    delivered_items JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (temporarily disable authentication requirements)
CREATE POLICY "Allow all operations for everyone" ON delivery_notes
    FOR ALL TO public USING (true) WITH CHECK (true);

-- Create indexes for common query patterns
CREATE INDEX idx_delivery_notes_order_reference ON delivery_notes(order_reference);
CREATE INDEX idx_delivery_notes_delivery_date ON delivery_notes(delivery_date);
CREATE INDEX idx_delivery_notes_delivery_status ON delivery_notes(delivery_status);
