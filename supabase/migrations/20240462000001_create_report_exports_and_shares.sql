
-- Create report_exports table to track report exports
CREATE TABLE IF NOT EXISTS report_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type TEXT NOT NULL,
    date_range TEXT NOT NULL,
    export_format TEXT NOT NULL,
    exported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES auth.users(id)
);

-- Create report_shares table to track report sharing
CREATE TABLE IF NOT EXISTS report_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type TEXT NOT NULL,
    share_method TEXT NOT NULL,
    recipients TEXT[] NOT NULL,
    recipient_ids UUID[] DEFAULT NULL,
    message TEXT,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE report_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access on report_exports"
    ON report_exports FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on report_exports"
    ON report_exports FOR INSERT
    TO authenticated
    WITH CHECK (true);

ALTER TABLE report_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access on report_shares"
    ON report_shares FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on report_shares"
    ON report_shares FOR INSERT
    TO authenticated
    WITH CHECK (true);
