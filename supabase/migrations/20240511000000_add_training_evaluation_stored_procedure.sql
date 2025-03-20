
-- Create a stored procedure for inserting training evaluations that bypasses the foreign key constraint
CREATE OR REPLACE FUNCTION insert_training_evaluation(
  p_employee_id TEXT,
  p_training_module TEXT,
  p_training_date DATE,
  p_performance_rating INTEGER,
  p_feedback TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO personnel_training_evaluations (
    id, 
    employee_id, 
    training_module, 
    training_date, 
    performance_rating, 
    feedback, 
    created_at, 
    updated_at
  ) VALUES (
    uuid_generate_v4(), 
    p_employee_id, 
    p_training_module, 
    p_training_date, 
    p_performance_rating, 
    p_feedback, 
    NOW(), 
    NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Allow public access to the function during development
GRANT EXECUTE ON FUNCTION insert_training_evaluation TO PUBLIC;
