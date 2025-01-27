-- First drop the existing column constraints if any exist
ALTER TABLE milk_reception 
DROP CONSTRAINT IF EXISTS valid_quality_score;

-- Update the quality_score column to be TEXT type and set default
ALTER TABLE milk_reception 
ALTER COLUMN quality_score TYPE TEXT,
ALTER COLUMN quality_score SET DEFAULT 'Grade A';

-- Add check constraint for valid quality scores
ALTER TABLE milk_reception 
ADD CONSTRAINT valid_quality_score 
CHECK (quality_score IN ('Grade A', 'Grade B', 'Grade C', 'Rejected'));