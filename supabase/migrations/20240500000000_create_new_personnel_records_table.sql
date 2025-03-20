
-- Drop the old personnel_employee_records table if it exists
DROP TABLE IF EXISTS personnel_employee_records;

-- Create the new table with the correct schema that matches our form
CREATE TABLE personnel_employee_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL,
    job_title TEXT,
    shift_start TIMESTAMP WITH TIME ZONE,
    shift_end TIMESTAMP WITH TIME ZONE,
    performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 5),
    review_date_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'Active',
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    operator_id UUID
);

-- Create indexes for better performance
CREATE INDEX idx_personnel_employee_records_employee_id ON personnel_employee_records(employee_id);
CREATE INDEX idx_personnel_employee_records_status ON personnel_employee_records(status);
CREATE INDEX idx_personnel_employee_records_created_at ON personnel_employee_records(created_at);

-- Enable Row Level Security
ALTER TABLE personnel_employee_records ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to allow operations from frontend
CREATE POLICY "Allow public access to personnel_employee_records"
    ON personnel_employee_records
    FOR ALL
    USING (true)
    WITH CHECK (true);
