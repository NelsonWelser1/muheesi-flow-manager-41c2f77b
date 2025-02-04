-- Create report_configurations table
CREATE TABLE IF NOT EXISTS report_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE report_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access on report_configurations"
    ON report_configurations FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on report_configurations"
    ON report_configurations FOR INSERT
    TO authenticated
    WITH CHECK (true);