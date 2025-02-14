
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create employee_records table
CREATE TABLE IF NOT EXISTS personnel_employee_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT UNIQUE NOT NULL,
    job_title TEXT NOT NULL,
    shift_start TIMESTAMP WITH TIME ZONE NOT NULL,
    shift_end TIMESTAMP WITH TIME ZONE NOT NULL,
    performance_rating INTEGER CHECK (performance_rating BETWEEN 1 AND 5),
    review_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    comments TEXT,
    operator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create training_evaluations table
CREATE TABLE IF NOT EXISTS personnel_training_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT REFERENCES personnel_employee_records(employee_id),
    training_module TEXT NOT NULL,
    training_date DATE NOT NULL,
    performance_rating INTEGER CHECK (performance_rating BETWEEN 1 AND 5),
    feedback TEXT,
    operator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create recruitment_records table
CREATE TABLE IF NOT EXISTS personnel_recruitment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    interview_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    feedback TEXT,
    hiring_manager_id TEXT NOT NULL,
    status TEXT CHECK (status IN ('Pending', 'Interviewed', 'Hired', 'Rejected')) DEFAULT 'Pending',
    operator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE personnel_employee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel_training_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel_recruitment_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all employee records"
    ON personnel_employee_records FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert employee records"
    ON personnel_employee_records FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = operator_id);

CREATE POLICY "Users can view all training evaluations"
    ON personnel_training_evaluations FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert training evaluations"
    ON personnel_training_evaluations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = operator_id);

CREATE POLICY "Users can view all recruitment records"
    ON personnel_recruitment_records FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert recruitment records"
    ON personnel_recruitment_records FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = operator_id);
