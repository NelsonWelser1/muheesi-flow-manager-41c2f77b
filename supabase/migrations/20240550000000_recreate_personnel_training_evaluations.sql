
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS personnel_training_evaluations CASCADE;
DROP FUNCTION IF EXISTS insert_training_evaluation;

-- Create the training evaluations table without foreign key constraints for development
CREATE TABLE personnel_training_evaluations (
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

-- Enable Row Level Security
ALTER TABLE personnel_training_evaluations ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to allow operations from frontend during development
CREATE POLICY "Allow public access to training_evaluations" 
    ON personnel_training_evaluations
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Comment for future implementation when employee records are properly set up
-- ALTER TABLE personnel_training_evaluations 
-- ADD CONSTRAINT personnel_training_evaluations_employee_id_fkey 
-- FOREIGN KEY (employee_id) REFERENCES personnel_employee_records(employee_id);
