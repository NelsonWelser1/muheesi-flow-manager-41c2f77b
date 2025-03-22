
-- Create kazo_coffee_reports table
CREATE TABLE IF NOT EXISTS kazo_coffee_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    report_type TEXT NOT NULL,
    content TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    send_via TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location TEXT DEFAULT 'Kazo'
);

-- Add RLS policy but temporarily disable authentication requirement
ALTER TABLE kazo_coffee_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to kazo_coffee_reports"
    ON kazo_coffee_reports
    FOR ALL
    TO PUBLIC
    USING (true)
    WITH CHECK (true);

-- Grant access to anonymous users (temporarily for development)
GRANT ALL ON kazo_coffee_reports TO anon;
GRANT ALL ON kazo_coffee_reports TO authenticated;
