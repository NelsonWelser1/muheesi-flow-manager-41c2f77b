
-- Create requisitions table
CREATE TABLE IF NOT EXISTS requisitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_name TEXT NOT NULL,
  department TEXT NOT NULL,
  requisition_type TEXT NOT NULL,
  tools_machinery TEXT,
  repairs TEXT,
  justification TEXT NOT NULL,
  urgency_level TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an update trigger to set updated_at on record changes
CREATE OR REPLACE FUNCTION update_requisitions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER requisitions_updated_at
BEFORE UPDATE ON requisitions
FOR EACH ROW
EXECUTE FUNCTION update_requisitions_updated_at();

-- Enable Row Level Security
ALTER TABLE requisitions ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all operations (no authentication required for now)
CREATE POLICY "Allow public access to requisitions" 
  ON requisitions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_requisitions_status ON requisitions(status);
CREATE INDEX idx_requisitions_created_at ON requisitions(created_at);
CREATE INDEX idx_requisitions_urgency_level ON requisitions(urgency_level);
