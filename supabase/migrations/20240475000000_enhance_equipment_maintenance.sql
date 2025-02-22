
-- Enhance equipment maintenance table
ALTER TABLE equipment_maintenance 
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS manufacturer TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS serial_number TEXT,
ADD COLUMN IF NOT EXISTS purchase_date DATE,
ADD COLUMN IF NOT EXISTS warranty_expiry DATE;

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
ON CONFLICT (id) DO NOTHING;
