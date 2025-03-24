
-- Drop the association_operations table and its associated objects

-- Drop trigger first
DROP TRIGGER IF EXISTS update_association_operations_updated_at ON association_operations;

-- Drop function
DROP FUNCTION IF EXISTS update_operations_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_association_operations_association_id;
DROP INDEX IF EXISTS idx_association_operations_status;
DROP INDEX IF EXISTS idx_association_operations_created_at;

-- Drop the table itself
DROP TABLE IF EXISTS association_operations;
