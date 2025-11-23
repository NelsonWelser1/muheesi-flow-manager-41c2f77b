-- Enable RLS on user_roles if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "System admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "System admins can manage all user roles" ON public.user_roles;

-- Create RLS policies for user_roles
-- System admins can view all roles
CREATE POLICY "System admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'sysadmin'::app_role));

-- Users can view their own role
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- System admins can manage all roles (INSERT, UPDATE, DELETE)
CREATE POLICY "System admins can manage all user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'sysadmin'::app_role))
WITH CHECK (has_role(auth.uid(), 'sysadmin'::app_role));