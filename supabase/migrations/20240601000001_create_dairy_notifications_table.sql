
-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dairy_notifications table
CREATE TABLE IF NOT EXISTS dairy_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    section_id TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_dairy_notifications_section_id ON dairy_notifications(section_id);
CREATE INDEX IF NOT EXISTS idx_dairy_notifications_user_id ON dairy_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_dairy_notifications_is_read ON dairy_notifications(is_read);

-- Enable RLS
ALTER TABLE dairy_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON dairy_notifications
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON dairy_notifications
    FOR INSERT
    WITH CHECK (true);
    
CREATE POLICY "Enable update for authenticated users" ON dairy_notifications
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Insert sample notifications
INSERT INTO dairy_notifications (title, message, type, section_id)
VALUES 
    ('Low Stock Alert', 'Fresh milk inventory is running low', 'warning', 'inventory'),
    ('Quality Check Required', 'Batch CH-2023-001 requires quality verification', 'info', 'quality'),
    ('Maintenance Due', 'Pasteurization equipment scheduled maintenance', 'warning', 'maintenance'),
    ('New Sales Order', 'New order received from SuperMart chain', 'info', 'sales'),
    ('Production Target Met', 'Weekly yogurt production target achieved', 'success', 'production')
ON CONFLICT DO NOTHING;
