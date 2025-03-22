
-- Create planting_harvesting_schedule table
CREATE TABLE IF NOT EXISTS planting_harvesting_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id TEXT NOT NULL,
  farm_name TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('planting', 'harvesting', 'pruning', 'fertilizing', 'weeding', 'spraying')),
  crop_variety TEXT,
  plot_area NUMERIC,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expected_completion_date TIMESTAMP WITH TIME ZONE,
  responsible_person TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'pending', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an update trigger to set updated_at on record changes
CREATE OR REPLACE FUNCTION update_planting_harvesting_schedule_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER planting_harvesting_schedule_updated_at
BEFORE UPDATE ON planting_harvesting_schedule
FOR EACH ROW
EXECUTE FUNCTION update_planting_harvesting_schedule_updated_at();

-- Add some sample data
INSERT INTO planting_harvesting_schedule (
  farm_id, farm_name, activity_type, crop_variety, plot_area,
  scheduled_date, expected_completion_date, responsible_person, status, notes
) VALUES 
('1', 'Kanoni Coffee Farm', 'planting', 'Arabica - SL28', 15,
 '2025-06-15T10:00:00Z', '2025-06-20T18:00:00Z', 'John Doe', 'scheduled', 'Plant new coffee seedlings in the eastern section'),
('1', 'Kanoni Coffee Farm', 'harvesting', 'Arabica - SL28', 30,
 '2025-11-10T08:00:00Z', '2025-11-25T18:00:00Z', 'Jane Smith', 'pending', 'Main season harvest of mature cherries'),
('2', 'Engari Coffee Plantation', 'planting', 'Robusta', 20,
 '2025-04-05T09:00:00Z', '2025-04-15T18:00:00Z', 'Robert Johnson', 'completed', 'Replanting in sections damaged by storms'),
('3', 'Kyampangara Coffee Estate', 'harvesting', 'Arabica - Bourbon', 45,
 '2025-10-01T07:00:00Z', '2025-10-30T18:00:00Z', 'Elizabeth Davis', 'cancelled', 'Early harvest due to drought conditions'),
('2', 'Engari Coffee Plantation', 'pruning', 'Robusta', 35,
 '2025-07-15T08:00:00Z', '2025-07-25T17:00:00Z', 'Mary Williams', 'scheduled', 'Annual pruning for better yield next season'),
('1', 'Kanoni Coffee Farm', 'fertilizing', 'Arabica - SL28', 50,
 '2025-05-10T07:00:00Z', '2025-05-12T16:00:00Z', 'John Doe', 'in_progress', 'Application of organic fertilizer ahead of rainy season');
