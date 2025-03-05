
-- Create customer_feedback table with fields matching the UI form
CREATE TABLE IF NOT EXISTS customer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    product_service TEXT,
    satisfaction_rating INTEGER NOT NULL,
    feedback_text TEXT,
    improvement_suggestions TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_status TEXT,
    feedback_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_customer_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_feedback_updated_at
    BEFORE UPDATE ON customer_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_feedback_updated_at();

-- Enable Row Level Security but with permissive policies
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (temporarily disabled authentication)
CREATE POLICY "Allow all operations for anyone" ON customer_feedback
    FOR ALL
    USING (true)
    WITH CHECK (true);
