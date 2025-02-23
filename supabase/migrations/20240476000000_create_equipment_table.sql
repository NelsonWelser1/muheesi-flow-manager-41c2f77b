
-- Create equipment table with all form fields
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classification TEXT NOT NULL,
    equipment_name TEXT NOT NULL,
    type TEXT,
    model TEXT,
    use_description TEXT,
    purchase_date DATE,
    purchase_condition TEXT,
    current_condition TEXT,
    serial_number TEXT,
    manufacturer TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS but allow all operations initially
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (temporary until auth is implemented)
CREATE POLICY "Allow all operations" ON equipment
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);
