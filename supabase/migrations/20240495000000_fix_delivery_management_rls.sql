
-- Drop existing RLS policy for inserts on logistics_delivery_management
DROP POLICY IF EXISTS "Users can insert deliveries" ON logistics_delivery_management;

-- Create a new policy that allows inserts without requiring operator_id
CREATE POLICY "Users can insert deliveries" 
    ON logistics_delivery_management FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Also add a policy for anonymous access during development
CREATE POLICY "Allow anonymous inserts" 
    ON logistics_delivery_management FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Update select policy for public access
DROP POLICY IF EXISTS "Users can view their organization's deliveries" ON logistics_delivery_management;

CREATE POLICY "Anyone can view deliveries" 
    ON logistics_delivery_management FOR SELECT 
    TO public 
    USING (true);
