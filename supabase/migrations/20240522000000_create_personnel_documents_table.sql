
-- Create personnel_documents table for storing employee document information
CREATE TABLE IF NOT EXISTS personnel_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT NOT NULL, 
  category TEXT,
  description TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_personnel_documents_employee_id ON personnel_documents(employee_id);
CREATE INDEX idx_personnel_documents_category ON personnel_documents(category);
CREATE INDEX idx_personnel_documents_created_at ON personnel_documents(created_at);

-- Enable Row Level Security
ALTER TABLE personnel_documents ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (temporarily disabling authentication)
CREATE POLICY "Allow public access to personnel_documents" 
  ON personnel_documents
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for employee documents if it doesn't exist
-- Note: This is a reminder as bucket creation can't be done via SQL
-- You'll need to create the bucket via Supabase UI or API
