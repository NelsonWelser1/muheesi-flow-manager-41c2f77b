-- Create sequence for batch IDs if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS cheese_batch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;

-- Create or replace the function to generate batch IDs
CREATE OR REPLACE FUNCTION generate_batch_id()
RETURNS TEXT
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION generate_batch_id() TO authenticated;

-- Add RLS policy to allow function execution
ALTER FUNCTION generate_batch_id() SECURITY DEFINER;