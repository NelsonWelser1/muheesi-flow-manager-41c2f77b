-- Policies for Grand Berna Dairies tables
ALTER TABLE factory_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cold_room_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE dairy_sales_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company users can view their own company data"
    ON factory_operations
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Grand Berna Dairies'
    ));

CREATE POLICY "Operations managers can insert factory data"
    ON factory_operations
    FOR INSERT
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Grand Berna Dairies'
        AND role_name IN ('Operations Manager', 'System Administrator')
    ));

-- KAJON Coffee Limited policies
ALTER TABLE coffee_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE kazo_coffee_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_coffee_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_sales_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "KAJON users can view their company data"
    ON coffee_inventory
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'KAJON Coffee Limited'
    ));

-- Kyalima Farmers Limited policies
ALTER TABLE tz2ug_rice_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_farm_kyiboga ENABLE ROW LEVEL SECURITY;
ALTER TABLE bull_fattening_program ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kyalima users can view their company data"
    ON tz2ug_rice_imports
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Kyalima Farmers Limited'
    ));

-- Fresheco Farming policies
ALTER TABLE fresheco_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE fresheco_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE fresheco_quality_control ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fresheco users can view their company data"
    ON fresheco_inventory
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Fresheco Farming'
    ));

CREATE POLICY "Inventory managers can modify inventory"
    ON fresheco_inventory
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Fresheco Farming'
        AND role_name IN ('Inventory Manager', 'System Administrator')
    ));

-- Add default system admin role
INSERT INTO user_roles (user_id, role_name, company, permissions)
VALUES (
    auth.uid(),
    'System Administrator',
    'All Companies',
    '{"all_access": true}'
);