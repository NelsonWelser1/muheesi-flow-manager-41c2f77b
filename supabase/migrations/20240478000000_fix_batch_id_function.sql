-- Drop existing sequence and function if they exist
DROP SEQUENCE IF EXISTS cheese_batch_id_seq CASCADE;
DROP FUNCTION IF EXISTS generate_batch_id();

-- Create sequence for batch IDs
CREATE SEQUENCE cheese_batch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;

-- Create the function to generate batch IDs
CREATE OR REPLACE FUNCTION generate_batch_id()
RETURNS TEXT
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    next_id INTEGER;
BEGIN
    -- Get next value from sequence
    next_id := nextval('cheese_batch_id_seq');
    
    -- Format the batch ID with leading zeros
    RETURN 'CHE-' || LPAD(next_id::TEXT, 6, '0');
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SEQUENCE cheese_batch_id_seq TO authenticated;
GRANT EXECUTE ON FUNCTION generate_batch_id() TO authenticated;

-- Create a policy to allow authenticated users to execute the function
CREATE POLICY "Allow authenticated users to execute generate_batch_id"
    ON cheese_batch_id_seq
    FOR ALL
    TO authenticated
    USING (true);

-- Enable RLS on the sequence
ALTER SEQUENCE cheese_batch_id_seq ENABLE ROW LEVEL SECURITY;