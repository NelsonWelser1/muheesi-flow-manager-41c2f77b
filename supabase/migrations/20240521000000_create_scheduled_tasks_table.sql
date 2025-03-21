
-- Create a table for scheduled tasks
CREATE TABLE IF NOT EXISTS personnel_scheduled_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id TEXT NOT NULL,
  task_type TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  location TEXT,
  assigned_to TEXT,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_personnel_scheduled_tasks_employee_id ON personnel_scheduled_tasks(employee_id);
CREATE INDEX idx_personnel_scheduled_tasks_completed ON personnel_scheduled_tasks(completed);
CREATE INDEX idx_personnel_scheduled_tasks_scheduled_date ON personnel_scheduled_tasks(scheduled_date);

-- Enable Row Level Security
ALTER TABLE personnel_scheduled_tasks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (no authentication required for now)
CREATE POLICY "Allow public access to personnel_scheduled_tasks" 
  ON personnel_scheduled_tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);
