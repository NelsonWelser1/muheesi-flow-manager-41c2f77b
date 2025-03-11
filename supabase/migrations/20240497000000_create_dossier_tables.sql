
-- Create tables for the Personnel Dossier system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create personnel_documents table
CREATE TABLE IF NOT EXISTS personnel_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL REFERENCES personnel_employee_records(employee_id),
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size TEXT NOT NULL,
    category TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create personnel_scheduled_tasks table
CREATE TABLE IF NOT EXISTS personnel_scheduled_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL REFERENCES personnel_employee_records(employee_id),
    task_type TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    location TEXT,
    assigned_to TEXT,
    notes TEXT,
    completed BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add department and status columns to the existing personnel_employee_records table
ALTER TABLE personnel_employee_records 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS status TEXT;

-- Enable RLS
ALTER TABLE personnel_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel_scheduled_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all personnel documents"
    ON personnel_documents FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert personnel documents"
    ON personnel_documents FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can view all scheduled tasks"
    ON personnel_scheduled_tasks FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert scheduled tasks"
    ON personnel_scheduled_tasks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their scheduled tasks"
    ON personnel_scheduled_tasks FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by);

-- Create storage bucket for employee documents
-- Note: This has to be done via the API or dashboard, not SQL directly
-- But here is a reminder to create the bucket
/* 
Storage bucket: employee_documents
RLS Policies:
- INSERT: authenticated users only
- SELECT: authenticated users only
*/
