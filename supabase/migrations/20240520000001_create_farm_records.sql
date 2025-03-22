
-- Create farm_records table
CREATE TABLE IF NOT EXISTS farm_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_name TEXT NOT NULL,
  manager_name TEXT,
  supervisor_name TEXT,
  coffee_type TEXT,
  farm_size NUMERIC,
  daily_production NUMERIC,
  weekly_production NUMERIC,
  monthly_production NUMERIC,
  quarterly_production NUMERIC,
  annual_production NUMERIC,
  status TEXT DEFAULT 'active',
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an update trigger to set updated_at on record changes
CREATE OR REPLACE FUNCTION update_farm_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER farm_records_updated_at
BEFORE UPDATE ON farm_records
FOR EACH ROW
EXECUTE FUNCTION update_farm_records_updated_at();

-- Add some sample data
INSERT INTO farm_records (
  farm_name, manager_name, supervisor_name, coffee_type, 
  farm_size, daily_production, weekly_production, monthly_production,
  quarterly_production, annual_production, status, location, notes
) VALUES 
('Kanoni Coffee Farm', 'John Doe', 'Jane Smith', 'Arabica', 
 120, 250, 1750, 7500, 22500, 90000, 'active', 'Kanoni-Mbogo', 'Prime coffee-growing region'),
('Engari Coffee Plantation', 'Robert Johnson', 'Mary Williams', 'Robusta', 
 85, 180, 1260, 5400, 16200, 65000, 'inactive', 'Engari-Kaichumu', 'Renovation in progress'),
('Kyampangara Coffee Estate', 'Michael Brown', 'Elizabeth Davis', 'Arabica', 
 210, 320, 2240, 9600, 28800, 115000, 'active', 'Kyampangara', 'Largest productive area');
