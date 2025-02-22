
-- Enhance equipment maintenance table
ALTER TABLE equipment_maintenance 
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS manufacturer TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS serial_number TEXT,
ADD COLUMN IF NOT EXISTS purchase_date DATE,
ADD COLUMN IF NOT EXISTS warranty_expiry DATE,
ADD COLUMN IF NOT EXISTS health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
ADD COLUMN IF NOT EXISTS company TEXT DEFAULT 'Grand Berna Dairies',
ADD COLUMN IF NOT EXISTS project TEXT DEFAULT 'Cheese Factory';

-- Create report configurations table
CREATE TABLE IF NOT EXISTS report_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    report_type TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    filters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies for report_configurations
ALTER TABLE report_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own report configurations"
ON report_configurations
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Insert sample equipment data
INSERT INTO equipment_maintenance (
    equipment_name,
    type,
    manufacturer,
    model,
    serial_number,
    status,
    health_score,
    last_maintenance,
    next_maintenance,
    maintenance_type,
    notes
) VALUES 
    ('Milk Pasteurizer A1', 'Pasteurization', 'TechDairy', 'MP-2000', 'TD20231001', 'operational', 95, NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', 'Regular Service', 'Monthly inspection completed'),
    ('Cheese Vat CV-101', 'Processing', 'CheeseEquip', 'CV-500', 'CE20230501', 'maintenance', 75, NOW() - INTERVAL '45 days', NOW() + INTERVAL '5 days', 'Deep Clean', 'Requires thorough cleaning'),
    ('Cooling System CS-3', 'Temperature Control', 'CoolTech', 'CT-1000', 'CT20230301', 'critical', 60, NOW() - INTERVAL '60 days', NOW() - INTERVAL '10 days', 'Repair', 'Temperature fluctuations detected'),
    ('Aging Room Control', 'Environmental', 'ClimateControl', 'AR-2000', 'CC20230601', 'operational', 90, NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days', 'Calibration', 'Humidity sensors working properly')
ON CONFLICT DO NOTHING;

-- Create equipment_categories table
CREATE TABLE IF NOT EXISTS equipment_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies for equipment_categories
ALTER TABLE equipment_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to equipment_categories"
ON equipment_categories FOR ALL TO authenticated
USING (true);

-- Insert default categories
INSERT INTO equipment_categories (name, description) VALUES
    ('Processing', 'Equipment used in direct food processing'),
    ('Storage', 'Storage and preservation equipment'),
    ('Quality Control', 'Testing and measurement equipment'),
    ('Utilities', 'Support systems and utilities')
ON CONFLICT DO NOTHING;

-- Add references to categories
ALTER TABLE equipment_maintenance
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES equipment_categories(id);
