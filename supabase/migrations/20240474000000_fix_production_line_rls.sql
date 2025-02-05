-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON production_line_international;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON production_line_international;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON production_line_local;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON production_line_local;

-- Enable RLS
ALTER TABLE production_line_international ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_line_local ENABLE ROW LEVEL SECURITY;

-- Create policies for production_line_international
CREATE POLICY "Enable read access for authenticated users"
    ON production_line_international
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON production_line_international
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policies for production_line_local
CREATE POLICY "Enable read access for authenticated users"
    ON production_line_local
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users"
    ON production_line_local
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON production_line_international TO authenticated;
GRANT ALL ON production_line_local TO authenticated;