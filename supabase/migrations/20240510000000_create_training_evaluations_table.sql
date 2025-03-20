
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the training evaluations table
CREATE TABLE IF NOT EXISTS personnel_training_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL,
    training_module TEXT NOT NULL,
    training_date DATE,
    performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    operator_id UUID
);

-- Create indexes for better performance
CREATE INDEX idx_training_evaluations_employee_id ON personnel_training_evaluations(employee_id);
CREATE INDEX idx_training_evaluations_training_date ON personnel_training_evaluations(training_date);
CREATE INDEX idx_training_evaluations_created_at ON personnel_training_evaluations(created_at);

-- If the personnel_employee_records table exists, add a foreign key constraint
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'personnel_employee_records') THEN
        ALTER TABLE personnel_training_evaluations 
        ADD CONSTRAINT personnel_training_evaluations_employee_id_fkey 
        FOREIGN KEY (employee_id) REFERENCES personnel_employee_records(employee_id);
    END IF;
END
$$;

-- Enable Row Level Security
ALTER TABLE personnel_training_evaluations ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to allow operations from frontend
-- This is a temporary policy for development without authentication
CREATE POLICY "Allow public access to training_evaluations" 
    ON personnel_training_evaluations
    FOR ALL
    USING (true)
    WITH CHECK (true);
