
-- Create employee_dossiers table
CREATE TABLE IF NOT EXISTS employee_dossiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id TEXT NOT NULL,
  job_title TEXT,
  department TEXT,
  status TEXT,
  shift_start TIMESTAMP WITH TIME ZONE,
  shift_end TIMESTAMP WITH TIME ZONE,
  performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 5),
  review_date_time TIMESTAMP WITH TIME ZONE,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_employee_dossiers_employee_id ON employee_dossiers(employee_id);
CREATE INDEX idx_employee_dossiers_status ON employee_dossiers(status);
CREATE INDEX idx_employee_dossiers_created_at ON employee_dossiers(created_at);

-- Enable Row Level Security
ALTER TABLE employee_dossiers ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (temporarily disabling authentication)
CREATE POLICY "Allow public access to employee_dossiers" 
  ON employee_dossiers
  FOR ALL
  USING (true)
  WITH CHECK (true);
