
-- Add updated_at triggers to all tables with updated_at column
-- Drop existing triggers first to avoid conflicts, then recreate them

DROP TRIGGER IF EXISTS update_advertising_promotions_updated_at ON public.advertising_promotions;
CREATE TRIGGER update_advertising_promotions_updated_at BEFORE UPDATE ON public.advertising_promotions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_aging_room_records_updated_at ON public.aging_room_records;
CREATE TRIGGER update_aging_room_records_updated_at BEFORE UPDATE ON public.aging_room_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_association_certifications_updated_at ON public.association_certifications;
CREATE TRIGGER update_association_certifications_updated_at BEFORE UPDATE ON public.association_certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_association_members_updated_at ON public.association_members;
CREATE TRIGGER update_association_members_updated_at BEFORE UPDATE ON public.association_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_association_messages_updated_at ON public.association_messages;
CREATE TRIGGER update_association_messages_updated_at BEFORE UPDATE ON public.association_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_association_operations_updated_at ON public.association_operations;
CREATE TRIGGER update_association_operations_updated_at BEFORE UPDATE ON public.association_operations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_association_trainings_updated_at ON public.association_trainings;
CREATE TRIGGER update_association_trainings_updated_at BEFORE UPDATE ON public.association_trainings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_associations_updated_at ON public.associations;
CREATE TRIGGER update_associations_updated_at BEFORE UPDATE ON public.associations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bills_expenses_updated_at ON public.bills_expenses;
CREATE TRIGGER update_bills_expenses_updated_at BEFORE UPDATE ON public.bills_expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cattle_fattening_updated_at ON public.cattle_fattening;
CREATE TRIGGER update_cattle_fattening_updated_at BEFORE UPDATE ON public.cattle_fattening FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cattle_health_records_updated_at ON public.cattle_health_records;
CREATE TRIGGER update_cattle_health_records_updated_at BEFORE UPDATE ON public.cattle_health_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cattle_inventory_updated_at ON public.cattle_inventory;
CREATE TRIGGER update_cattle_inventory_updated_at BEFORE UPDATE ON public.cattle_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ceo_dashboard_data_updated_at ON public.ceo_dashboard_data;
CREATE TRIGGER update_ceo_dashboard_data_updated_at BEFORE UPDATE ON public.ceo_dashboard_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cheese_production_updated_at ON public.cheese_production;
CREATE TRIGGER update_cheese_production_updated_at BEFORE UPDATE ON public.cheese_production FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cheese_vat_records_updated_at ON public.cheese_vat_records;
CREATE TRIGGER update_cheese_vat_records_updated_at BEFORE UPDATE ON public.cheese_vat_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_coffee_export_contracts_updated_at ON public.coffee_export_contracts;
CREATE TRIGGER update_coffee_export_contracts_updated_at BEFORE UPDATE ON public.coffee_export_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_coffee_sales_updated_at ON public.coffee_sales;
CREATE TRIGGER update_coffee_sales_updated_at BEFORE UPDATE ON public.coffee_sales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_coffee_stock_updated_at ON public.coffee_stock;
CREATE TRIGGER update_coffee_stock_updated_at BEFORE UPDATE ON public.coffee_stock FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_coffee_stock_transfers_updated_at ON public.coffee_stock_transfers;
CREATE TRIGGER update_coffee_stock_transfers_updated_at BEFORE UPDATE ON public.coffee_stock_transfers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cold_room_inventory_updated_at ON public.cold_room_inventory;
CREATE TRIGGER update_cold_room_inventory_updated_at BEFORE UPDATE ON public.cold_room_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_contract_documents_updated_at ON public.contract_documents;
CREATE TRIGGER update_contract_documents_updated_at BEFORE UPDATE ON public.contract_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_reports_updated_at ON public.crm_reports;
CREATE TRIGGER update_crm_reports_updated_at BEFORE UPDATE ON public.crm_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_feedback_updated_at ON public.customer_feedback;
CREATE TRIGGER update_customer_feedback_updated_at BEFORE UPDATE ON public.customer_feedback FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_dairy_notifications_updated_at ON public.dairy_notifications;
CREATE TRIGGER update_dairy_notifications_updated_at BEFORE UPDATE ON public.dairy_notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_dairy_production_updated_at ON public.dairy_production;
CREATE TRIGGER update_dairy_production_updated_at BEFORE UPDATE ON public.dairy_production FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_dairy_production_reports_updated_at ON public.dairy_production_reports;
CREATE TRIGGER update_dairy_production_reports_updated_at BEFORE UPDATE ON public.dairy_production_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_dairy_section_reports_updated_at ON public.dairy_section_reports;
CREATE TRIGGER update_dairy_section_reports_updated_at BEFORE UPDATE ON public.dairy_section_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_dairy_sections_updated_at ON public.dairy_sections;
CREATE TRIGGER update_dairy_sections_updated_at BEFORE UPDATE ON public.dairy_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_delivery_notes_updated_at ON public.delivery_notes;
CREATE TRIGGER update_delivery_notes_updated_at BEFORE UPDATE ON public.delivery_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_employee_dossiers_updated_at ON public.employee_dossiers;
CREATE TRIGGER update_employee_dossiers_updated_at BEFORE UPDATE ON public.employee_dossiers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_equipment_updated_at ON public.equipment;
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON public.equipment FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_equipment_maintenance_updated_at ON public.equipment_maintenance;
CREATE TRIGGER update_equipment_maintenance_updated_at BEFORE UPDATE ON public.equipment_maintenance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_farm_information_updated_at ON public.farm_information;
CREATE TRIGGER update_farm_information_updated_at BEFORE UPDATE ON public.farm_information FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_farm_staff_updated_at ON public.farm_staff;
CREATE TRIGGER update_farm_staff_updated_at BEFORE UPDATE ON public.farm_staff FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_harvest_records_updated_at ON public.harvest_records;
CREATE TRIGGER update_harvest_records_updated_at BEFORE UPDATE ON public.harvest_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_high_priority_reports_updated_at ON public.high_priority_reports;
CREATE TRIGGER update_high_priority_reports_updated_at BEFORE UPDATE ON public.high_priority_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_items_updated_at ON public.inventory_items;
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_kashari_milk_production_updated_at ON public.kashari_milk_production;
CREATE TRIGGER update_kashari_milk_production_updated_at BEFORE UPDATE ON public.kashari_milk_production FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_kashari_transactions_updated_at ON public.kashari_transactions;
CREATE TRIGGER update_kashari_transactions_updated_at BEFORE UPDATE ON public.kashari_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_kazo_coffee_reports_updated_at ON public.kazo_coffee_reports;
CREATE TRIGGER update_kazo_coffee_reports_updated_at BEFORE UPDATE ON public.kazo_coffee_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_loans_updated_at ON public.loans;
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON public.loans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_local_purchase_agreements_updated_at ON public.local_purchase_agreements;
CREATE TRIGGER update_local_purchase_agreements_updated_at BEFORE UPDATE ON public.local_purchase_agreements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_logistics_deliveries_updated_at ON public.logistics_deliveries;
CREATE TRIGGER update_logistics_deliveries_updated_at BEFORE UPDATE ON public.logistics_deliveries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_logistics_delivery_management_updated_at ON public.logistics_delivery_management;
CREATE TRIGGER update_logistics_delivery_management_updated_at BEFORE UPDATE ON public.logistics_delivery_management FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_logistics_delivery_performance_updated_at ON public.logistics_delivery_performance;
CREATE TRIGGER update_logistics_delivery_performance_updated_at BEFORE UPDATE ON public.logistics_delivery_performance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_logistics_order_entries_updated_at ON public.logistics_order_entries;
CREATE TRIGGER update_logistics_order_entries_updated_at BEFORE UPDATE ON public.logistics_order_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_maintenance_records_updated_at ON public.maintenance_records;
CREATE TRIGGER update_maintenance_records_updated_at BEFORE UPDATE ON public.maintenance_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_maintenance_reports_updated_at ON public.maintenance_reports;
CREATE TRIGGER update_maintenance_reports_updated_at BEFORE UPDATE ON public.maintenance_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_milk_production_updated_at ON public.milk_production;
CREATE TRIGGER update_milk_production_updated_at BEFORE UPDATE ON public.milk_production FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_milk_reception_updated_at ON public.milk_reception;
CREATE TRIGGER update_milk_reception_updated_at BEFORE UPDATE ON public.milk_reception FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_milk_reception_quality_metrics_updated_at ON public.milk_reception_quality_metrics;
CREATE TRIGGER update_milk_reception_quality_metrics_updated_at BEFORE UPDATE ON public.milk_reception_quality_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_milk_reception_settings_updated_at ON public.milk_reception_settings;
CREATE TRIGGER update_milk_reception_settings_updated_at BEFORE UPDATE ON public.milk_reception_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_milk_tank_offloads_updated_at ON public.milk_tank_offloads;
CREATE TRIGGER update_milk_tank_offloads_updated_at BEFORE UPDATE ON public.milk_tank_offloads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_operations_form_updated_at ON public.operations_form;
CREATE TRIGGER update_operations_form_updated_at BEFORE UPDATE ON public.operations_form FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pasteurizer_records_updated_at ON public.pasteurizer_records;
CREATE TRIGGER update_pasteurizer_records_updated_at BEFORE UPDATE ON public.pasteurizer_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_receipts_updated_at ON public.payments_receipts;
CREATE TRIGGER update_payments_receipts_updated_at BEFORE UPDATE ON public.payments_receipts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payroll_payslips_updated_at ON public.payroll_payslips;
CREATE TRIGGER update_payroll_payslips_updated_at BEFORE UPDATE ON public.payroll_payslips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_personnel_documents_updated_at ON public.personnel_documents;
CREATE TRIGGER update_personnel_documents_updated_at BEFORE UPDATE ON public.personnel_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_personnel_employee_records_updated_at ON public.personnel_employee_records;
CREATE TRIGGER update_personnel_employee_records_updated_at BEFORE UPDATE ON public.personnel_employee_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_personnel_recruitment_records_updated_at ON public.personnel_recruitment_records;
CREATE TRIGGER update_personnel_recruitment_records_updated_at BEFORE UPDATE ON public.personnel_recruitment_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_personnel_scheduled_tasks_updated_at ON public.personnel_scheduled_tasks;
CREATE TRIGGER update_personnel_scheduled_tasks_updated_at BEFORE UPDATE ON public.personnel_scheduled_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_personnel_training_evaluations_updated_at ON public.personnel_training_evaluations;
CREATE TRIGGER update_personnel_training_evaluations_updated_at BEFORE UPDATE ON public.personnel_training_evaluations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_planting_harvesting_schedule_updated_at ON public.planting_harvesting_schedule;
CREATE TRIGGER update_planting_harvesting_schedule_updated_at BEFORE UPDATE ON public.planting_harvesting_schedule FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pricing_sheets_updated_at ON public.pricing_sheets;
CREATE TRIGGER update_pricing_sheets_updated_at BEFORE UPDATE ON public.pricing_sheets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_catalogs_updated_at ON public.product_catalogs;
CREATE TRIGGER update_product_catalogs_updated_at BEFORE UPDATE ON public.product_catalogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_production_batches_updated_at ON public.production_batches;
CREATE TRIGGER update_production_batches_updated_at BEFORE UPDATE ON public.production_batches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_production_line_international_updated_at ON public.production_line_international;
CREATE TRIGGER update_production_line_international_updated_at BEFORE UPDATE ON public.production_line_international FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_production_line_local_updated_at ON public.production_line_local;
CREATE TRIGGER update_production_line_local_updated_at BEFORE UPDATE ON public.production_line_local FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_quality_checks_updated_at ON public.quality_checks;
CREATE TRIGGER update_quality_checks_updated_at BEFORE UPDATE ON public.quality_checks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_quality_score_settings_updated_at ON public.quality_score_settings;
CREATE TRIGGER update_quality_score_settings_updated_at BEFORE UPDATE ON public.quality_score_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_quotations_updated_at ON public.quotations;
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_quotes_updated_at ON public.quotes;
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_raw_materials_inventory_updated_at ON public.raw_materials_inventory;
CREATE TRIGGER update_raw_materials_inventory_updated_at BEFORE UPDATE ON public.raw_materials_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_report_configurations_updated_at ON public.report_configurations;
CREATE TRIGGER update_report_configurations_updated_at BEFORE UPDATE ON public.report_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_requisitions_updated_at ON public.requisitions;
CREATE TRIGGER update_requisitions_updated_at BEFORE UPDATE ON public.requisitions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_role_templates_updated_at ON public.role_templates;
CREATE TRIGGER update_role_templates_updated_at BEFORE UPDATE ON public.role_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_sales_contracts_updated_at ON public.sales_contracts;
CREATE TRIGGER update_sales_contracts_updated_at BEFORE UPDATE ON public.sales_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_sales_orders_updated_at ON public.sales_orders;
CREATE TRIGGER update_sales_orders_updated_at BEFORE UPDATE ON public.sales_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_sales_proposals_updated_at ON public.sales_proposals;
CREATE TRIGGER update_sales_proposals_updated_at BEFORE UPDATE ON public.sales_proposals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_silage_inventory_updated_at ON public.silage_inventory;
CREATE TRIGGER update_silage_inventory_updated_at BEFORE UPDATE ON public.silage_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_specialty_coffee_contracts_updated_at ON public.specialty_coffee_contracts;
CREATE TRIGGER update_specialty_coffee_contracts_updated_at BEFORE UPDATE ON public.specialty_coffee_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_storage_tanks_updated_at ON public.storage_tanks;
CREATE TRIGGER update_storage_tanks_updated_at BEFORE UPDATE ON public.storage_tanks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tank_cleaning_records_updated_at ON public.tank_cleaning_records;
CREATE TRIGGER update_tank_cleaning_records_updated_at BEFORE UPDATE ON public.tank_cleaning_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_yogurt_cleaning_sanitation_updated_at ON public.yogurt_cleaning_sanitation;
CREATE TRIGGER update_yogurt_cleaning_sanitation_updated_at BEFORE UPDATE ON public.yogurt_cleaning_sanitation FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_yogurt_cooling_setting_updated_at ON public.yogurt_cooling_setting;
CREATE TRIGGER update_yogurt_cooling_setting_updated_at BEFORE UPDATE ON public.yogurt_cooling_setting FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_yogurt_culture_addition_updated_at ON public.yogurt_culture_addition;
CREATE TRIGGER update_yogurt_culture_addition_updated_at BEFORE UPDATE ON public.yogurt_culture_addition FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_yogurt_fermentation_updated_at ON public.yogurt_fermentation;
CREATE TRIGGER update_yogurt_fermentation_updated_at BEFORE UPDATE ON public.yogurt_fermentation FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_yogurt_inventory_updated_at ON public.yogurt_inventory;
CREATE TRIGGER update_yogurt_inventory_updated_at BEFORE UPDATE ON public.yogurt_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_yogurt_milk_preparation_updated_at ON public.yogurt_milk_preparation;
CREATE TRIGGER update_yogurt_milk_preparation_updated_at BEFORE UPDATE ON public.yogurt_milk_preparation FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_yogurt_packaging_updated_at ON public.yogurt_packaging;
CREATE TRIGGER update_yogurt_packaging_updated_at BEFORE UPDATE ON public.yogurt_packaging FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_yogurt_pasteurization_updated_at ON public.yogurt_pasteurization;
CREATE TRIGGER update_yogurt_pasteurization_updated_at BEFORE UPDATE ON public.yogurt_pasteurization FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_yogurt_quality_testing_updated_at ON public.yogurt_quality_testing;
CREATE TRIGGER update_yogurt_quality_testing_updated_at BEFORE UPDATE ON public.yogurt_quality_testing FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
