-- ========================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ========================================

-- Core Infrastructure
ALTER TABLE public."Dashboard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Grand Berna Dairies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."KAJON Coffee Limited" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Kyalima Farmers Limited" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dairy_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_lines ENABLE ROW LEVEL SECURITY;

-- Coffee Module
ALTER TABLE public.coffee_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_export_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialty_coffee_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.association_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.association_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.association_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.association_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.association_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kazo_coffee_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coffee_stock_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rice_imports ENABLE ROW LEVEL SECURITY;

-- Dairy Module
ALTER TABLE public.milk_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kashari_milk_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_reception ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_reception_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_reception_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_reception_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_tank_offloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milk_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dairy_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dairy_production_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dairy_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dairy_cooler_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cheese_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cheese_production_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cheese_vat_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aging_room_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pasteurizer_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yogurt_milk_preparation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yogurt_pasteurization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yogurt_culture_addition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yogurt_fermentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yogurt_cooling_setting ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yogurt_quality_testing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yogurt_packaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yogurt_cleaning_sanitation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yogurt_inventory ENABLE ROW LEVEL SECURITY;

-- Cattle & Farm
ALTER TABLE public.cattle_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cattle_fattening ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cattle_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bull_fattening_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.silage_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planting_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvest_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planting_harvesting_schedule ENABLE ROW LEVEL SECURITY;

-- Production & Quality
ALTER TABLE public.production_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_line_international ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_line_local ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_materials_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_control_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_score_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tank_cleaning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tank_volume_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cold_room_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cold_room_environment_logs ENABLE ROW LEVEL SECURITY;

-- Sales & Logistics
ALTER TABLE public.sales_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertising_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_delivery_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_delivery_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_order_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Finance & HR
ALTER TABLE public.bills_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kashari_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel_employee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel_recruitment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel_training_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel_scheduled_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personnel_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_payslips ENABLE ROW LEVEL SECURITY;

-- Equipment & Maintenance
ALTER TABLE public.equipment_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_stats ENABLE ROW LEVEL SECURITY;

-- Contracts & Documents
ALTER TABLE public.contract_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_purchase_agreements ENABLE ROW LEVEL SECURITY;

-- Reporting & Admin
ALTER TABLE public.crm_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_read_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_dashboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations_form ENABLE ROW LEVEL SECURITY;

-- ========================================
-- CREATE OPEN ACCESS POLICIES (TEMPORARY - SECURE THESE LATER!)
-- ========================================

-- NOTE: These policies allow full access for now.
-- You should restrict these based on your authentication and role requirements.

DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('profiles', 'user_roles', 'role_templates', 'role_change_audit_log')
    LOOP
        EXECUTE format('CREATE POLICY "Allow all operations" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl);
    END LOOP;
END $$;