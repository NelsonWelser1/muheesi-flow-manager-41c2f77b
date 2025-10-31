-- Phase 1: Critical Security & Access Fixes

-- Step 1: Fix RLS Policies on profiles table (make them PERMISSIVE)
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "System admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "System admins can update all profiles" ON profiles;

-- Recreate as PERMISSIVE policies (OR logic - if ANY policy passes, access is granted)
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "System admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'sysadmin'::app_role));

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "System admins can update all profiles"
ON profiles FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'sysadmin'::app_role))
WITH CHECK (has_role(auth.uid(), 'sysadmin'::app_role));

-- Step 2: Fix function search paths for security
-- Update update_updated_at_column function to include explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Verify all other functions have proper security definer settings (they do)
-- has_role() - ✓ already has search_path
-- get_user_role() - ✓ already has search_path
-- handle_new_user() - ✓ already has search_path