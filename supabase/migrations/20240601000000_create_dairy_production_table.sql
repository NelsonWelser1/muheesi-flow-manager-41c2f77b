
-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dairy_production table for production reports
CREATE TABLE IF NOT EXISTS dairy_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type TEXT NOT NULL,
    batch_id TEXT,
    raw_material_used DECIMAL(10,2) NOT NULL,
    finished_product_amount DECIMAL(10,2) NOT NULL,
    production_date DATE NOT NULL,
    efficiency_percentage INTEGER,
    quality_score INTEGER,
    operator_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dairy_production_product_type ON dairy_production(product_type);
CREATE INDEX IF NOT EXISTS idx_dairy_production_production_date ON dairy_production(production_date);
CREATE INDEX IF NOT EXISTS idx_dairy_production_batch_id ON dairy_production(batch_id);

-- Enable RLS
ALTER TABLE dairy_production ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON dairy_production
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON dairy_production
    FOR INSERT
    WITH CHECK (true);

-- Insert sample data
INSERT INTO dairy_production (product_type, batch_id, raw_material_used, finished_product_amount, production_date, efficiency_percentage, quality_score, notes)
VALUES 
    ('Fresh Milk', 'FM-2023-001', 1000, 950, CURRENT_DATE - INTERVAL '1 day', 95, 92, 'Regular production'),
    ('Yogurt', 'YG-2023-001', 500, 480, CURRENT_DATE - INTERVAL '2 days', 96, 94, 'Strawberry flavor'),
    ('Cheese', 'CH-2023-001', 800, 120, CURRENT_DATE - INTERVAL '3 days', 90, 88, 'Cheddar type'),
    ('Butter', 'BT-2023-001', 400, 320, CURRENT_DATE - INTERVAL '4 days', 92, 90, 'Salted butter')
ON CONFLICT DO NOTHING;
