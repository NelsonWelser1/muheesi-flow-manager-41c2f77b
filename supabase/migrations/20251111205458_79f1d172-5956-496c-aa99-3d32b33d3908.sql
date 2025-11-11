-- Update RLS policies for milk_reception to allow more roles

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all milk reception records" ON public.milk_reception;
DROP POLICY IF EXISTS "Admins can insert milk reception records" ON public.milk_reception;
DROP POLICY IF EXISTS "Admins can update milk reception records" ON public.milk_reception;
DROP POLICY IF EXISTS "Admins can delete milk reception records" ON public.milk_reception;

-- Create new policies that allow multiple roles
CREATE POLICY "Authorized users can view milk reception records"
ON public.milk_reception
FOR SELECT
USING (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'ceo'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role)
);

CREATE POLICY "Authorized users can insert milk reception records"
ON public.milk_reception
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role)
);

CREATE POLICY "Authorized users can update milk reception records"
ON public.milk_reception
FOR UPDATE
USING (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role)
);

CREATE POLICY "Authorized users can delete milk reception records"
ON public.milk_reception
FOR DELETE
USING (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role)
);

-- Update RLS policies for milk_tank_offloads as well
DROP POLICY IF EXISTS "Admins can view all milk tank offloads" ON public.milk_tank_offloads;
DROP POLICY IF EXISTS "Admins can insert milk tank offloads" ON public.milk_tank_offloads;
DROP POLICY IF EXISTS "Admins can update milk tank offloads" ON public.milk_tank_offloads;
DROP POLICY IF EXISTS "Admins can delete milk tank offloads" ON public.milk_tank_offloads;

CREATE POLICY "Authorized users can view milk tank offloads"
ON public.milk_tank_offloads
FOR SELECT
USING (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'ceo'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role) OR
  has_role(auth.uid(), 'logistics_manager'::app_role)
);

CREATE POLICY "Authorized users can insert milk tank offloads"
ON public.milk_tank_offloads
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role) OR
  has_role(auth.uid(), 'logistics_manager'::app_role)
);

CREATE POLICY "Authorized users can update milk tank offloads"
ON public.milk_tank_offloads
FOR UPDATE
USING (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role) OR
  has_role(auth.uid(), 'logistics_manager'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role) OR
  has_role(auth.uid(), 'logistics_manager'::app_role)
);

CREATE POLICY "Authorized users can delete milk tank offloads"
ON public.milk_tank_offloads
FOR DELETE
USING (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role)
);

-- Update RLS policies for milk_reception_quality_metrics as well
DROP POLICY IF EXISTS "Admins can view all quality metrics" ON public.milk_reception_quality_metrics;
DROP POLICY IF EXISTS "Admins can insert quality metrics" ON public.milk_reception_quality_metrics;
DROP POLICY IF EXISTS "Admins can update quality metrics" ON public.milk_reception_quality_metrics;
DROP POLICY IF EXISTS "Admins can delete quality metrics" ON public.milk_reception_quality_metrics;

CREATE POLICY "Authorized users can view quality metrics"
ON public.milk_reception_quality_metrics
FOR SELECT
USING (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'ceo'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role) OR
  has_role(auth.uid(), 'compliance_officer'::app_role)
);

CREATE POLICY "Authorized users can insert quality metrics"
ON public.milk_reception_quality_metrics
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role) OR
  has_role(auth.uid(), 'compliance_officer'::app_role)
);

CREATE POLICY "Authorized users can update quality metrics"
ON public.milk_reception_quality_metrics
FOR UPDATE
USING (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role) OR
  has_role(auth.uid(), 'compliance_officer'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'warehouse_supervisor'::app_role) OR
  has_role(auth.uid(), 'compliance_officer'::app_role)
);

CREATE POLICY "Authorized users can delete quality metrics"
ON public.milk_reception_quality_metrics
FOR DELETE
USING (
  has_role(auth.uid(), 'sysadmin'::app_role) OR
  has_role(auth.uid(), 'operations_manager'::app_role) OR
  has_role(auth.uid(), 'inventory_manager'::app_role) OR
  has_role(auth.uid(), 'factory_manager'::app_role) OR
  has_role(auth.uid(), 'compliance_officer'::app_role)
);