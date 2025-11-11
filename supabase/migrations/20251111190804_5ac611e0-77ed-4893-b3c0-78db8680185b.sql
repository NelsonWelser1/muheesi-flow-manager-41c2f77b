-- Create role_templates table for storing reusable role assignment configurations
CREATE TABLE public.role_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  role app_role NOT NULL,
  company TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(name, company)
);

-- Enable RLS
ALTER TABLE public.role_templates ENABLE ROW LEVEL SECURITY;

-- System admins can view all templates
CREATE POLICY "System admins can view all role templates"
ON public.role_templates
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'sysadmin'::app_role));

-- System admins can create templates
CREATE POLICY "System admins can create role templates"
ON public.role_templates
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'sysadmin'::app_role));

-- System admins can update templates
CREATE POLICY "System admins can update role templates"
ON public.role_templates
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'sysadmin'::app_role))
WITH CHECK (has_role(auth.uid(), 'sysadmin'::app_role));

-- System admins can delete templates
CREATE POLICY "System admins can delete role templates"
ON public.role_templates
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'sysadmin'::app_role));

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_role_templates_updated_at
BEFORE UPDATE ON public.role_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();