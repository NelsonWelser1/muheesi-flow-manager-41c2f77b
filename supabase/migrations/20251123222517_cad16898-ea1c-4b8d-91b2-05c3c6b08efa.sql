-- Enable Row Level Security on companies table
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view companies (public showcase)
CREATE POLICY "Allow public read access to companies"
ON companies
FOR SELECT
TO public
USING (true);