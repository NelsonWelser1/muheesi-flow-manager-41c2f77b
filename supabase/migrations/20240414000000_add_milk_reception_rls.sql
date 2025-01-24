-- Enable RLS
ALTER TABLE milk_reception_data ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting data
CREATE POLICY "Users can insert their own milk reception data"
ON milk_reception_data
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for viewing data
CREATE POLICY "Users can view milk reception data"
ON milk_reception_data
FOR SELECT
USING (auth.uid() = user_id);