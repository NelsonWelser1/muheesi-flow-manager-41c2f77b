
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create delivery_notes table
CREATE TABLE IF NOT EXISTS public.delivery_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_reference TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    receiver_name TEXT NOT NULL,
    receiver_contact TEXT NOT NULL, 
    delivery_location TEXT NOT NULL,
    delivery_person TEXT,
    delivery_status TEXT NOT NULL DEFAULT 'pending',
    items JSONB DEFAULT '[]'::jsonb,
    digital_signature TEXT,
    geolocation JSONB,
    qr_code TEXT,
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

CREATE TRIGGER update_delivery_notes_updated_at
BEFORE UPDATE ON delivery_notes
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.delivery_notes ENABLE ROW LEVEL SECURITY;

-- Create public access policy (temporarily disabled authentication)
CREATE POLICY "Allow public access to delivery_notes"
ON public.delivery_notes
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Grant access to public roles
GRANT ALL ON public.delivery_notes TO anon;
GRANT ALL ON public.delivery_notes TO authenticated;
GRANT ALL ON public.delivery_notes TO service_role;
