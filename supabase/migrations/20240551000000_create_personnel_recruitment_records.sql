
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if it exists
DROP TABLE IF EXISTS personnel_recruitment_records CASCADE;

-- Create the recruitment records table for development
CREATE TABLE personnel_recruitment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    interview_date_time TIMESTAMP WITH TIME ZONE,
    hiring_manager_id TEXT,
    feedback TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    operator_id UUID
);

-- Create indexes for better performance
CREATE INDEX idx_recruitment_candidate_name ON personnel_recruitment_records(candidate_name);
CREATE INDEX idx_recruitment_job_title ON personnel_recruitment_records(job_title);
CREATE INDEX idx_recruitment_interview_date ON personnel_recruitment_records(interview_date_time);
CREATE INDEX idx_recruitment_status ON personnel_recruitment_records(status);
CREATE INDEX idx_recruitment_created_at ON personnel_recruitment_records(created_at);

-- Enable Row Level Security
ALTER TABLE personnel_recruitment_records ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to allow operations from frontend during development
CREATE POLICY "Allow public access to recruitment_records" 
    ON personnel_recruitment_records
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_recruitment_record_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recruitment_record_updated_at
BEFORE UPDATE ON personnel_recruitment_records
FOR EACH ROW
EXECUTE FUNCTION update_recruitment_record_updated_at();
