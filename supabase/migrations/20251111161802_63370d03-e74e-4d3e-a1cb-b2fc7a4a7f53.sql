-- Create audit log table for role changes
CREATE TABLE public.role_change_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  changed_by UUID REFERENCES auth.users(id),
  affected_user UUID REFERENCES auth.users(id) NOT NULL,
  old_role TEXT,
  new_role TEXT NOT NULL,
  old_company TEXT,
  new_company TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('assigned', 'updated', 'removed')),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.role_change_audit_log ENABLE ROW LEVEL SECURITY;

-- System admins can view all audit logs
CREATE POLICY "System admins can view all audit logs"
ON public.role_change_audit_log
FOR SELECT
USING (has_role(auth.uid(), 'sysadmin'::app_role));

-- System admins can insert audit logs
CREATE POLICY "System admins can insert audit logs"
ON public.role_change_audit_log
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'sysadmin'::app_role));

-- Create index for better performance
CREATE INDEX idx_audit_log_changed_at ON public.role_change_audit_log(changed_at DESC);
CREATE INDEX idx_audit_log_affected_user ON public.role_change_audit_log(affected_user);