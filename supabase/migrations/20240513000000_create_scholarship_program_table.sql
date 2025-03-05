
-- Create scholarship program table
CREATE TABLE IF NOT EXISTS scholarship_program (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name TEXT NOT NULL,
    student_id TEXT,
    gender TEXT,
    date_of_birth DATE,
    school_name TEXT NOT NULL,
    education_level TEXT NOT NULL,
    scholarship_type TEXT NOT NULL,
    scholarship_amount NUMERIC NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'Active',
    contact_person TEXT,
    contact_phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies (temporarily permissive for development)
ALTER TABLE scholarship_program ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select on scholarship_program"
    ON scholarship_program
    FOR SELECT
    USING (true);

CREATE POLICY "Allow anonymous insert on scholarship_program"
    ON scholarship_program
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update on scholarship_program"
    ON scholarship_program
    FOR UPDATE
    USING (true);

CREATE POLICY "Allow anonymous delete on scholarship_program"
    ON scholarship_program
    FOR DELETE
    USING (true);

-- Create a function to create the scholarship_program table if it doesn't exist
CREATE OR REPLACE FUNCTION create_scholarship_program_table()
RETURNS VOID AS $$
BEGIN
    -- This function is a placeholder as the table is created above
    -- It exists to provide a callable RPC endpoint for table setup
    RAISE NOTICE 'Scholarship program table is ready';
END;
$$ LANGUAGE plpgsql;
