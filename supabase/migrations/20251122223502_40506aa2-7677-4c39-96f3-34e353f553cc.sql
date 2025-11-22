
-- Create proper role-based RLS policies for all tables
-- Drop existing open access policies and replace with role-based ones

-- DAIRY & PRODUCTION TABLES
-- dairy_production
DROP POLICY IF EXISTS "Allow all operations" ON public.dairy_production;
CREATE POLICY "sysadmin_all" ON public.dairy_production FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.dairy_production FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.dairy_production FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- production_batches
DROP POLICY IF EXISTS "Allow all operations" ON public.production_batches;
CREATE POLICY "sysadmin_all" ON public.production_batches FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.production_batches FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.production_batches FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- milk_reception
DROP POLICY IF EXISTS "Allow all operations" ON public.milk_reception;
CREATE POLICY "sysadmin_all" ON public.milk_reception FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.milk_reception FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.milk_reception FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- milk_tank_offloads
DROP POLICY IF EXISTS "Allow all operations" ON public.milk_tank_offloads;
CREATE POLICY "sysadmin_all" ON public.milk_tank_offloads FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.milk_tank_offloads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.milk_tank_offloads FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- production_line_international
DROP POLICY IF EXISTS "Allow all operations" ON public.production_line_international;
CREATE POLICY "sysadmin_all" ON public.production_line_international FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.production_line_international FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.production_line_international FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- dairy_production_reports
DROP POLICY IF EXISTS "Allow all operations" ON public.dairy_production_reports;
CREATE POLICY "sysadmin_all" ON public.dairy_production_reports FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.dairy_production_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.dairy_production_reports FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- YOGURT PROCESSING TABLES
-- yogurt_milk_preparation
DROP POLICY IF EXISTS "Allow all operations" ON public.yogurt_milk_preparation;
CREATE POLICY "sysadmin_all" ON public.yogurt_milk_preparation FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.yogurt_milk_preparation FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.yogurt_milk_preparation FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- yogurt_pasteurization
DROP POLICY IF EXISTS "Allow all operations" ON public.yogurt_pasteurization;
CREATE POLICY "sysadmin_all" ON public.yogurt_pasteurization FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.yogurt_pasteurization FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.yogurt_pasteurization FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- yogurt_fermentation
DROP POLICY IF EXISTS "Allow all operations" ON public.yogurt_fermentation;
CREATE POLICY "sysadmin_all" ON public.yogurt_fermentation FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.yogurt_fermentation FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.yogurt_fermentation FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- yogurt_cooling_setting
DROP POLICY IF EXISTS "Allow all operations" ON public.yogurt_cooling_setting;
CREATE POLICY "sysadmin_all" ON public.yogurt_cooling_setting FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.yogurt_cooling_setting FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.yogurt_cooling_setting FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- yogurt_quality_testing
DROP POLICY IF EXISTS "Allow all operations" ON public.yogurt_quality_testing;
CREATE POLICY "sysadmin_all" ON public.yogurt_quality_testing FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.yogurt_quality_testing FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.yogurt_quality_testing FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- yogurt_inventory
DROP POLICY IF EXISTS "Allow all operations" ON public.yogurt_inventory;
CREATE POLICY "sysadmin_all" ON public.yogurt_inventory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.yogurt_inventory FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.yogurt_inventory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- CHEESE TABLES
-- cheese_production
DROP POLICY IF EXISTS "Allow all operations" ON public.cheese_production;
CREATE POLICY "sysadmin_all" ON public.cheese_production FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.cheese_production FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.cheese_production FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- cheese_vat_records
DROP POLICY IF EXISTS "Allow all operations" ON public.cheese_vat_records;
CREATE POLICY "sysadmin_all" ON public.cheese_vat_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.cheese_vat_records FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.cheese_vat_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- aging_room_records
DROP POLICY IF EXISTS "Allow all operations" ON public.aging_room_records;
CREATE POLICY "sysadmin_all" ON public.aging_room_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.aging_room_records FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.aging_room_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- COFFEE TABLES
-- coffee_stock
DROP POLICY IF EXISTS "Allow all operations" ON public.coffee_stock;
CREATE POLICY "sysadmin_all" ON public.coffee_stock FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.coffee_stock FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.coffee_stock FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- coffee_sales
DROP POLICY IF EXISTS "Allow all operations" ON public.coffee_sales;
CREATE POLICY "sysadmin_all" ON public.coffee_sales FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.coffee_sales FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.coffee_sales FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));

-- coffee_stock_transfers
DROP POLICY IF EXISTS "Allow all operations" ON public.coffee_stock_transfers;
CREATE POLICY "sysadmin_all" ON public.coffee_stock_transfers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.coffee_stock_transfers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.coffee_stock_transfers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- coffee_export_contracts
DROP POLICY IF EXISTS "Allow all operations" ON public.coffee_export_contracts;
CREATE POLICY "sysadmin_all" ON public.coffee_export_contracts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.coffee_export_contracts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.coffee_export_contracts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));

-- SALES & CRM TABLES
-- sales_orders
DROP POLICY IF EXISTS "Allow all operations" ON public.sales_orders;
CREATE POLICY "sysadmin_all" ON public.sales_orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.sales_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.sales_orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));
CREATE POLICY "finance_read" ON public.sales_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'finance_manager'::app_role));

-- sales_contracts
DROP POLICY IF EXISTS "Allow all operations" ON public.sales_contracts;
CREATE POLICY "sysadmin_all" ON public.sales_contracts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.sales_contracts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.sales_contracts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));

-- quotes
DROP POLICY IF EXISTS "Allow all operations" ON public.quotes;
CREATE POLICY "sysadmin_all" ON public.quotes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.quotes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.quotes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));

-- customer_feedback
DROP POLICY IF EXISTS "Allow all operations" ON public.customer_feedback;
CREATE POLICY "sysadmin_all" ON public.customer_feedback FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.customer_feedback FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.customer_feedback FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));

-- crm_reports
DROP POLICY IF EXISTS "Allow all operations" ON public.crm_reports;
CREATE POLICY "sysadmin_all" ON public.crm_reports FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.crm_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.crm_reports FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));

-- LOGISTICS TABLES
-- logistics_order_entries
DROP POLICY IF EXISTS "Allow all operations" ON public.logistics_order_entries;
CREATE POLICY "sysadmin_all" ON public.logistics_order_entries FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.logistics_order_entries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.logistics_order_entries FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- FINANCE TABLES
-- transactions
DROP POLICY IF EXISTS "Allow all operations" ON public.transactions;
CREATE POLICY "sysadmin_all" ON public.transactions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.transactions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "finance_all" ON public.transactions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'finance_manager'::app_role));

-- bills_expenses
DROP POLICY IF EXISTS "Allow all operations" ON public.bills_expenses;
CREATE POLICY "sysadmin_all" ON public.bills_expenses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.bills_expenses FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "finance_all" ON public.bills_expenses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'finance_manager'::app_role));

-- payroll_payslips
DROP POLICY IF EXISTS "Allow all operations" ON public.payroll_payslips;
CREATE POLICY "sysadmin_all" ON public.payroll_payslips FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.payroll_payslips FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "hr_all" ON public.payroll_payslips FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'hr_manager'::app_role));
CREATE POLICY "finance_all" ON public.payroll_payslips FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'finance_manager'::app_role));

-- CATTLE & FARMING TABLES
-- cattle_inventory
DROP POLICY IF EXISTS "Allow all operations" ON public.cattle_inventory;
CREATE POLICY "sysadmin_all" ON public.cattle_inventory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.cattle_inventory FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.cattle_inventory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- cattle_health_records
DROP POLICY IF EXISTS "Allow all operations" ON public.cattle_health_records;
CREATE POLICY "sysadmin_all" ON public.cattle_health_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.cattle_health_records FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.cattle_health_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- cattle_fattening
DROP POLICY IF EXISTS "Allow all operations" ON public.cattle_fattening;
CREATE POLICY "sysadmin_all" ON public.cattle_fattening FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.cattle_fattening FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.cattle_fattening FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- kashari_milk_production
DROP POLICY IF EXISTS "Allow all operations" ON public.kashari_milk_production;
CREATE POLICY "sysadmin_all" ON public.kashari_milk_production FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.kashari_milk_production FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.kashari_milk_production FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- EQUIPMENT & MAINTENANCE
-- equipment
DROP POLICY IF EXISTS "Allow all operations" ON public.equipment;
CREATE POLICY "sysadmin_all" ON public.equipment FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.equipment FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.equipment FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- maintenance_records
DROP POLICY IF EXISTS "Allow all operations" ON public.maintenance_records;
CREATE POLICY "sysadmin_all" ON public.maintenance_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.maintenance_records FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.maintenance_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- HR & PERSONNEL TABLES
-- personnel_employee_records
DROP POLICY IF EXISTS "Allow all operations" ON public.personnel_employee_records;
CREATE POLICY "sysadmin_all" ON public.personnel_employee_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.personnel_employee_records FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "hr_all" ON public.personnel_employee_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'hr_manager'::app_role));

-- ASSOCIATIONS TABLES
-- associations
DROP POLICY IF EXISTS "Allow all operations" ON public.associations;
CREATE POLICY "sysadmin_all" ON public.associations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.associations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.associations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- association_members
DROP POLICY IF EXISTS "Allow all operations" ON public.association_members;
CREATE POLICY "sysadmin_all" ON public.association_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.association_members FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.association_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- association_operations
DROP POLICY IF EXISTS "Allow all operations" ON public.association_operations;
CREATE POLICY "sysadmin_all" ON public.association_operations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.association_operations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.association_operations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- association_trainings
DROP POLICY IF EXISTS "Allow all operations" ON public.association_trainings;
CREATE POLICY "sysadmin_all" ON public.association_trainings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.association_trainings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.association_trainings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- association_certifications
DROP POLICY IF EXISTS "Allow all operations" ON public.association_certifications;
CREATE POLICY "sysadmin_all" ON public.association_certifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.association_certifications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.association_certifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- association_messages
DROP POLICY IF EXISTS "Allow all operations" ON public.association_messages;
CREATE POLICY "sysadmin_all" ON public.association_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.association_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.association_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- PRODUCT & CATALOG TABLES
-- product_catalogs
DROP POLICY IF EXISTS "Allow all operations" ON public.product_catalogs;
CREATE POLICY "sysadmin_all" ON public.product_catalogs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.product_catalogs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.product_catalogs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));

-- COLD ROOM & STORAGE
-- cold_room_inventory
DROP POLICY IF EXISTS "Allow all operations" ON public.cold_room_inventory;
CREATE POLICY "sysadmin_all" ON public.cold_room_inventory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.cold_room_inventory FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.cold_room_inventory FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- DAIRY COOLER & ENVIRONMENT
-- dairy_cooler_records
DROP POLICY IF EXISTS "Allow all operations" ON public.dairy_cooler_records;
CREATE POLICY "sysadmin_all" ON public.dairy_cooler_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.dairy_cooler_records FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.dairy_cooler_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- QUALITY CONTROL
-- quality_control_checks
DROP POLICY IF EXISTS "Allow all operations" ON public.quality_control_checks;
CREATE POLICY "sysadmin_all" ON public.quality_control_checks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.quality_control_checks FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.quality_control_checks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- CEO DASHBOARD
-- ceo_dashboard_data
DROP POLICY IF EXISTS "Allow all operations" ON public.ceo_dashboard_data;
CREATE POLICY "sysadmin_all" ON public.ceo_dashboard_data FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_all" ON public.ceo_dashboard_data FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));

-- REPORTS & NOTIFICATIONS
-- dairy_notifications
DROP POLICY IF EXISTS "Allow all operations" ON public.dairy_notifications;
CREATE POLICY "sysadmin_all" ON public.dairy_notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "authenticated_read" ON public.dairy_notifications FOR SELECT TO authenticated USING (true);

-- dairy_sections
DROP POLICY IF EXISTS "Allow all operations" ON public.dairy_sections;
CREATE POLICY "sysadmin_all" ON public.dairy_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "authenticated_read" ON public.dairy_sections FOR SELECT TO authenticated USING (true);

-- dairy_section_reports
DROP POLICY IF EXISTS "Enable read access for all users" ON public.dairy_section_reports;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.dairy_section_reports;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.dairy_section_reports;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.dairy_section_reports;
CREATE POLICY "sysadmin_all" ON public.dairy_section_reports FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.dairy_section_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.dairy_section_reports FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- high_priority_reports
DROP POLICY IF EXISTS "Enable read access for all users" ON public.high_priority_reports;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.high_priority_reports;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.high_priority_reports;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.high_priority_reports;
CREATE POLICY "sysadmin_all" ON public.high_priority_reports FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.high_priority_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.high_priority_reports FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- report_configurations
DROP POLICY IF EXISTS "Allow all operations" ON public.report_configurations;
CREATE POLICY "sysadmin_all" ON public.report_configurations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.report_configurations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));

-- report_shares
DROP POLICY IF EXISTS "Allow all operations" ON public.report_shares;
CREATE POLICY "sysadmin_all" ON public.report_shares FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "authenticated_read" ON public.report_shares FOR SELECT TO authenticated USING (true);

-- CLEANING RECORDS
-- cleaning_records
DROP POLICY IF EXISTS "Allow all operations" ON public.cleaning_records;
CREATE POLICY "sysadmin_all" ON public.cleaning_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "operations_all" ON public.cleaning_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- BULL FATTENING
-- bull_fattening_program
DROP POLICY IF EXISTS "Allow all operations" ON public.bull_fattening_program;
CREATE POLICY "sysadmin_all" ON public.bull_fattening_program FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.bull_fattening_program FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.bull_fattening_program FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- PLANTING RECORDS
-- planting_records
DROP POLICY IF EXISTS "Allow all operations" ON public.planting_records;
CREATE POLICY "sysadmin_all" ON public.planting_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.planting_records FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.planting_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- SALES RECORDS
-- coffee_sales_records
DROP POLICY IF EXISTS "Allow all operations" ON public.coffee_sales_records;
CREATE POLICY "sysadmin_all" ON public.coffee_sales_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.coffee_sales_records FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.coffee_sales_records FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));
CREATE POLICY "finance_read" ON public.coffee_sales_records FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'finance_manager'::app_role));

-- cheese_production_stats
DROP POLICY IF EXISTS "Allow all operations" ON public.cheese_production_stats;
CREATE POLICY "sysadmin_all" ON public.cheese_production_stats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.cheese_production_stats FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "operations_all" ON public.cheese_production_stats FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- cold_room_environment_logs
DROP POLICY IF EXISTS "Allow all operations" ON public.cold_room_environment_logs;
CREATE POLICY "sysadmin_all" ON public.cold_room_environment_logs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "operations_all" ON public.cold_room_environment_logs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'operations_manager'::app_role));

-- CONTRACT DOCUMENTS
-- contract_documents
DROP POLICY IF EXISTS "Allow all operations" ON public.contract_documents;
CREATE POLICY "sysadmin_all" ON public.contract_documents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.contract_documents FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.contract_documents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));

-- QUOTE ITEMS
-- quote_items
DROP POLICY IF EXISTS "Allow all operations" ON public.quote_items;
CREATE POLICY "sysadmin_all" ON public.quote_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "sales_all" ON public.quote_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));

-- CUSTOMER INVOICES
-- customer_invoices
DROP POLICY IF EXISTS "Allow all operations" ON public.customer_invoices;
CREATE POLICY "sysadmin_all" ON public.customer_invoices FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.customer_invoices FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "finance_all" ON public.customer_invoices FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'finance_manager'::app_role));
CREATE POLICY "sales_read" ON public.customer_invoices FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));

-- ADVERTISING PROMOTIONS
-- advertising_promotions
DROP POLICY IF EXISTS "Allow all operations" ON public.advertising_promotions;
CREATE POLICY "sysadmin_all" ON public.advertising_promotions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sysadmin'::app_role));
CREATE POLICY "ceo_read" ON public.advertising_promotions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ceo'::app_role));
CREATE POLICY "sales_all" ON public.advertising_promotions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'sales_manager'::app_role));
