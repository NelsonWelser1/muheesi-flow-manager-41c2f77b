-- Create quality_score_settings table
CREATE TABLE IF NOT EXISTS public.quality_score_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade TEXT NOT NULL,
    min_fat_percentage DECIMAL(5,2),
    max_fat_percentage DECIMAL(5,2),
    min_protein_percentage DECIMAL(5,2),
    max_protein_percentage DECIMAL(5,2),
    min_temperature DECIMAL(5,2),
    max_temperature DECIMAL(5,2),
    max_plate_count INTEGER,
    min_acidity DECIMAL(5,2),
    max_acidity DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_grade UNIQUE (grade),
    CONSTRAINT check_grade CHECK (grade IN ('Grade A', 'Grade B', 'Grade C', 'Rejected'))
);

-- Insert default quality score settings
INSERT INTO public.quality_score_settings 
(grade, min_fat_percentage, max_fat_percentage, min_protein_percentage, max_protein_percentage, 
min_temperature, max_temperature, max_plate_count, min_acidity, max_acidity)
VALUES 
('Grade A', 3.5, 4.5, 3.2, 3.8, 2.0, 4.0, 100000, 6.6, 6.8),
('Grade B', 3.0, 4.8, 3.0, 4.0, 1.5, 4.5, 300000, 6.4, 7.0),
('Grade C', 2.5, 5.0, 2.8, 4.2, 1.0, 5.0, 500000, 6.2, 7.2),
('Rejected', 0.0, 6.0, 0.0, 5.0, 0.0, 6.0, 1000000, 5.0, 8.0);

-- Grant permissions
GRANT ALL ON public.quality_score_settings TO authenticated;
GRANT ALL ON public.quality_score_settings TO service_role;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_quality_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quality_settings_timestamp
    BEFORE UPDATE ON quality_score_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_quality_settings_updated_at();