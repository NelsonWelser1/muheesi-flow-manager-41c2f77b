-- Add additional fields and constraints to milk_reception table
ALTER TABLE milk_reception
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS company_id UUID,
ADD COLUMN IF NOT EXISTS facility_id UUID,
ADD CONSTRAINT milk_reception_unique_batch UNIQUE (batchId);

-- Create an enum for milk types
CREATE TYPE milk_type AS ENUM ('Cow Milk', 'Goat Milk', 'Sheep Milk');

-- Add check constraints for quality parameters
ALTER TABLE milk_reception
ADD CONSTRAINT check_fat_percentage 
    CHECK (fatPercentage >= 0 AND fatPercentage <= 100),
ADD CONSTRAINT check_protein_percentage 
    CHECK (proteinPercentage >= 0 AND proteinPercentage <= 100),
ADD CONSTRAINT check_acidity 
    CHECK (acidity >= 0 AND acidity <= 14),
ADD CONSTRAINT check_volume 
    CHECK (milkVolume > 0),
ADD CONSTRAINT check_temperature 
    CHECK (temperature >= 0 AND temperature <= 100);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_milk_reception_company 
    ON milk_reception(company_id);
CREATE INDEX IF NOT EXISTS idx_milk_reception_facility 
    ON milk_reception(facility_id);
CREATE INDEX IF NOT EXISTS idx_milk_reception_quality 
    ON milk_reception(quality_score DESC);

-- Create a view for quality metrics
CREATE OR REPLACE VIEW milk_reception_quality_metrics AS
SELECT 
    date_trunc('day', dateTime) as reception_date,
    COUNT(*) as total_receptions,
    AVG(quality_score) as avg_quality_score,
    AVG(fatPercentage) as avg_fat_percentage,
    AVG(proteinPercentage) as avg_protein_percentage,
    SUM(milkVolume) as total_volume
FROM milk_reception
GROUP BY date_trunc('day', dateTime)
ORDER BY reception_date DESC;

-- Create a function to calculate quality score
CREATE OR REPLACE FUNCTION calculate_milk_quality_score(
    fat_percentage DECIMAL,
    protein_percentage DECIMAL,
    acidity DECIMAL,
    plate_count INTEGER
) RETURNS INTEGER AS $$
DECLARE
    fat_score INTEGER;
    protein_score INTEGER;
    acidity_score INTEGER;
    plate_count_score INTEGER;
BEGIN
    -- Fat percentage scoring (0-25 points)
    fat_score := CASE 
        WHEN fat_percentage >= 3.5 THEN 25
        WHEN fat_percentage >= 3.0 THEN 20
        WHEN fat_percentage >= 2.5 THEN 15
        ELSE 10
    END;

    -- Protein percentage scoring (0-25 points)
    protein_score := CASE 
        WHEN protein_percentage >= 3.2 THEN 25
        WHEN protein_percentage >= 2.8 THEN 20
        WHEN protein_percentage >= 2.4 THEN 15
        ELSE 10
    END;

    -- Acidity scoring (0-25 points)
    acidity_score := CASE 
        WHEN acidity BETWEEN 6.6 AND 6.8 THEN 25
        WHEN acidity BETWEEN 6.4 AND 7.0 THEN 20
        WHEN acidity BETWEEN 6.2 AND 7.2 THEN 15
        ELSE 10
    END;

    -- Plate count scoring (0-25 points)
    plate_count_score := CASE 
        WHEN plate_count <= 100000 THEN 25
        WHEN plate_count <= 300000 THEN 20
        WHEN plate_count <= 500000 THEN 15
        ELSE 10
    END;

    -- Return total score (0-100)
    RETURN fat_score + protein_score + acidity_score + plate_count_score;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically calculate quality score
CREATE OR REPLACE FUNCTION update_quality_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.quality_score := calculate_milk_quality_score(
        NEW.fatPercentage,
        NEW.proteinPercentage,
        NEW.acidity,
        NEW.totalPlateCount
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER calculate_quality_score_trigger
    BEFORE INSERT OR UPDATE ON milk_reception
    FOR EACH ROW
    EXECUTE FUNCTION update_quality_score();

-- Add RLS policies
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view milk reception data in their company"
    ON milk_reception FOR SELECT
    TO authenticated
    USING (company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can insert milk reception data for their company"
    ON milk_reception FOR INSERT
    TO authenticated
    WITH CHECK (company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own milk reception data"
    ON milk_reception FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (company_id IN (
        SELECT company_id FROM user_companies 
        WHERE user_id = auth.uid()
    ));

-- Create audit log table
CREATE TABLE IF NOT EXISTS milk_reception_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milk_reception_id UUID REFERENCES milk_reception(id),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create audit trigger
CREATE OR REPLACE FUNCTION log_milk_reception_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO milk_reception_audit_log (
            milk_reception_id, user_id, action, new_data
        ) VALUES (
            NEW.id, 
            auth.uid(), 
            'INSERT', 
            row_to_json(NEW)::jsonb
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO milk_reception_audit_log (
            milk_reception_id, user_id, action, old_data, new_data
        ) VALUES (
            NEW.id, 
            auth.uid(), 
            'UPDATE', 
            row_to_json(OLD)::jsonb,
            row_to_json(NEW)::jsonb
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER milk_reception_audit_trigger
    AFTER INSERT OR UPDATE ON milk_reception
    FOR EACH ROW
    EXECUTE FUNCTION log_milk_reception_changes();