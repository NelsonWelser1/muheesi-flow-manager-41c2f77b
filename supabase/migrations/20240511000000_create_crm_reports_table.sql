
-- Create CRM Reports table
CREATE TABLE IF NOT EXISTS public.crm_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_title TEXT NOT NULL,
    report_type TEXT NOT NULL,
    department TEXT NOT NULL,
    date_range_start DATE,
    date_range_end DATE,
    summary TEXT,
    key_findings TEXT,
    recommendations TEXT,
    distribution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id),
    created_by_name TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_crm_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crm_reports_updated_at
    BEFORE UPDATE ON public.crm_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_crm_reports_updated_at();

-- Enable RLS but allow all operations for now (authentication disabled)
ALTER TABLE public.crm_reports ENABLE ROW LEVEL SECURITY;

-- Allow all operations without authentication for now
CREATE POLICY "Allow all operations for everyone" ON public.crm_reports
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Comment on table
COMMENT ON TABLE public.crm_reports IS 'Stores CRM reports created through the CRM Reports Form';
