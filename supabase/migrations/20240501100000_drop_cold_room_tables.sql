
-- Drop cold room related tables
DROP TABLE IF EXISTS cold_room_inventory;
DROP TABLE IF EXISTS cold_room_environment_logs;

-- Remove any related RLS policies (they will be automatically dropped with the tables)
