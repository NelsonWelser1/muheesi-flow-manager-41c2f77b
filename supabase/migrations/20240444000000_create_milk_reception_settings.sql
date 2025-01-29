-- Create the milk_reception_settings table
CREATE TABLE IF NOT EXISTS public.milk_reception_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    temperature_threshold DECIMAL(5,2) NOT NULL DEFAULT 4.5,
    capacity_warning_threshold INTEGER NOT NULL DEFAULT 90,
    auto_cleaning_enabled BOOLEAN NOT NULL DEFAULT false,
    cleaning_interval INTEGER NOT NULL DEFAULT 7,
    maintenance_interval INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.milk_reception_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow read access to everyone" ON public.milk_reception_settings
    FOR SELECT USING (true);

-- Allow insert/update access to authenticated users
CREATE POLICY "Allow insert for authenticated users" ON public.milk_reception_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON public.milk_reception_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO public.milk_reception_settings (
    temperature_threshold,
    capacity_warning_threshold,
    auto_cleaning_enabled,
    cleaning_interval,
    maintenance_interval
) VALUES (
    4.5,
    90,
    false,
    7,
    30
) ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON public.milk_reception_settings TO authenticated;
GRANT SELECT ON public.milk_reception_settings TO anon;