-- Update the quality field to quality_score
ALTER TABLE milk_reception 
RENAME COLUMN quality TO quality_score;

-- Ensure the column allows the correct values
ALTER TABLE milk_reception 
ALTER COLUMN quality_score TYPE TEXT,
ALTER COLUMN quality_score SET DEFAULT 'Grade A';

-- Add check constraint for valid quality scores
ALTER TABLE milk_reception 
ADD CONSTRAINT valid_quality_score 
CHECK (quality_score IN ('Grade A', 'Grade B', 'Grade C', 'Rejected'));