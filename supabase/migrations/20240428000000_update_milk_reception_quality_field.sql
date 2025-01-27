-- Update the quality_score column to be TEXT type
ALTER TABLE milk_reception 
ALTER COLUMN quality_score TYPE TEXT;

-- Add check constraint for valid quality scores
ALTER TABLE milk_reception 
ADD CONSTRAINT valid_quality_score 
CHECK (quality_score IN ('Grade A', 'Grade B', 'Grade C', 'Rejected'));