
-- CEO Dashboard Data Migration SQL
-- Run this in Supabase SQL Editor

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the ceo_dashboard_data table
CREATE TABLE IF NOT EXISTS ceo_dashboard_data (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  company TEXT NOT NULL,
  module TEXT NOT NULL,
  data_type TEXT NOT NULL,
  data JSONB,
  source_module TEXT,
  source_user TEXT,
  source_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ceo_dashboard_data_company ON ceo_dashboard_data(company);
CREATE INDEX IF NOT EXISTS idx_ceo_dashboard_data_module ON ceo_dashboard_data(module);
CREATE INDEX IF NOT EXISTS idx_ceo_dashboard_data_data_type ON ceo_dashboard_data(data_type);
CREATE INDEX IF NOT EXISTS idx_ceo_dashboard_data_created_at ON ceo_dashboard_data(created_at);

-- Add RLS policies (disabled for now as we're not using authentication yet)
ALTER TABLE ceo_dashboard_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public ceo_dashboard_data access" ON ceo_dashboard_data
  FOR ALL
  USING (true);

-- Create function to notify on new entries
CREATE OR REPLACE FUNCTION notify_ceo_dashboard_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('ceo_dashboard_changes', json_build_object(
    'table', TG_TABLE_NAME,
    'type', TG_OP,
    'id', NEW.id,
    'company', NEW.company,
    'data_type', NEW.data_type
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications
DROP TRIGGER IF EXISTS notify_ceo_dashboard_trigger ON ceo_dashboard_data;
CREATE TRIGGER notify_ceo_dashboard_trigger
  AFTER INSERT ON ceo_dashboard_data
  FOR EACH ROW
  EXECUTE FUNCTION notify_ceo_dashboard_changes();
