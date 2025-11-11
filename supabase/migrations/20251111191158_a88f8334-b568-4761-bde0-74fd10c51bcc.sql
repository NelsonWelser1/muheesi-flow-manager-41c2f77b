-- Add missing columns to role_templates table
ALTER TABLE public.role_templates 
  RENAME COLUMN company TO default_company;

ALTER TABLE public.role_templates 
  ADD COLUMN is_active BOOLEAN DEFAULT true NOT NULL;