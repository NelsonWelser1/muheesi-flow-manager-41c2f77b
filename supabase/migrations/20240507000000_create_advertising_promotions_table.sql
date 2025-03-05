
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create advertising_promotions table
CREATE TABLE IF NOT EXISTS public.advertising_promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    promotion_type TEXT NOT NULL,
    material_type TEXT NOT NULL,
    target_audience TEXT,
    objectives TEXT,
    start_date DATE,
    end_date DATE,
    budget TEXT,
    channels JSONB,
    assets_urls JSONB,
    status TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_advertising_promotions_created_at 
ON public.advertising_promotions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.advertising_promotions ENABLE ROW LEVEL SECURITY;

-- Create policies for temporarily disabling authentication
CREATE POLICY "Enable read access for all users" 
ON public.advertising_promotions
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for all users" 
ON public.advertising_promotions
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for all users" 
ON public.advertising_promotions
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for all users" 
ON public.advertising_promotions
FOR DELETE 
USING (true);

-- Create trigger for updated_at column
CREATE OR REPLACE FUNCTION update_advertising_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_advertising_promotions_updated_at
BEFORE UPDATE ON public.advertising_promotions
FOR EACH ROW
EXECUTE FUNCTION update_advertising_promotions_updated_at();

-- Create a function to create the table if it doesn't exist
CREATE OR REPLACE FUNCTION create_advertising_promotions_table()
RETURNS BOOLEAN AS $$
BEGIN
    -- Table creation is handled by the migration, so this function
    -- just serves as a way for the frontend to trigger table creation
    -- if needed without having direct DDL privileges
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL ON public.advertising_promotions TO anon;
GRANT ALL ON public.advertising_promotions TO authenticated;
GRANT ALL ON public.advertising_promotions TO service_role;

-- Ensure storage bucket exists for marketing assets
DO $$
BEGIN
    BEGIN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('marketing', 'marketing', true);
    EXCEPTION WHEN unique_violation THEN
        -- Bucket already exists, do nothing
    END;
END$$;

-- Set public access policy for the marketing bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketing');

CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'marketing');
