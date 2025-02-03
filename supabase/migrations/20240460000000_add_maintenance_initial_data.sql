-- Insert initial maintenance stats if none exist
INSERT INTO maintenance_stats (completed_today, equipment_health, pending_maintenance)
SELECT 0, 100, 0
WHERE NOT EXISTS (SELECT 1 FROM maintenance_stats);

-- Insert sample equipment maintenance data if none exists
INSERT INTO equipment_maintenance (
    equipment_name,
    maintenance_type,
    status,
    last_maintenance,
    next_maintenance,
    health_score,
    notes
)
SELECT 
    'Milk Pasteurizer',
    'Routine Check',
    'due',
    NOW() - INTERVAL '30 days',
    NOW() + INTERVAL '7 days',
    85,
    'Monthly inspection required'
WHERE NOT EXISTS (SELECT 1 FROM equipment_maintenance);