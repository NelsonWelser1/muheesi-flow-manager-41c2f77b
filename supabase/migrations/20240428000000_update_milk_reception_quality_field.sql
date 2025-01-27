-- First create a temporary column to hold existing data
ALTER TABLE milk_reception 
ADD COLUMN quality_score_new TEXT;

-- Copy existing data if any exists
UPDATE milk_reception 
SET quality_score_new = 
  CASE 
    WHEN quality_score::text = '1' THEN 'Grade A'
    WHEN quality_score::text = '2' THEN 'Grade B'
    WHEN quality_score::text = '3' THEN 'Grade C'
    WHEN quality_score::text = '4' THEN 'Rejected'
    ELSE 'Grade A'
  END;

-- Drop the old column
ALTER TABLE milk_reception 
DROP COLUMN quality_score;

-- Rename the new column
ALTER TABLE milk_reception 
RENAME COLUMN quality_score_new TO quality_score;

-- Set the default value
ALTER TABLE milk_reception 
ALTER COLUMN quality_score SET DEFAULT 'Grade A';

-- Add check constraint for valid quality scores
ALTER TABLE milk_reception 
ADD CONSTRAINT valid_quality_score 
CHECK (quality_score IN ('Grade A', 'Grade B', 'Grade C', 'Rejected'));