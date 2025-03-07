
-- Drop sales proposals/quotations related tables
DROP TABLE IF EXISTS sales_proposals CASCADE;
DROP TABLE IF EXISTS product_quotations CASCADE;

-- Drop product catalogues/brochures related tables
DROP TABLE IF EXISTS product_catalogues CASCADE;
DROP TABLE IF EXISTS product_brochures CASCADE;

-- Drop marketing campaign related tables
DROP TABLE IF EXISTS marketing_campaigns CASCADE;
DROP TABLE IF EXISTS campaign_metrics CASCADE;

-- Drop CRM related tables
DROP TABLE IF EXISTS customer_interactions CASCADE;
DROP TABLE IF EXISTS sales_leads CASCADE;
DROP TABLE IF EXISTS conversion_metrics CASCADE;

-- Drop advertising materials related tables
DROP TABLE IF EXISTS promotional_materials CASCADE;
DROP TABLE IF EXISTS social_media_calendars CASCADE;
DROP TABLE IF EXISTS press_releases CASCADE;

-- Drop pricing related tables
DROP TABLE IF EXISTS pricing_sheets CASCADE;
DROP TABLE IF EXISTS pricing_strategies CASCADE;

-- Drop sales contracts related tables
DROP TABLE IF EXISTS sales_contracts CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS distributor_agreements CASCADE;

-- Drop customer feedback related tables
DROP TABLE IF EXISTS customer_feedback CASCADE;
DROP TABLE IF EXISTS customer_surveys CASCADE;

-- Remove any related policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON sales_proposals;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON sales_proposals;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON product_catalogues;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON product_catalogues;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON marketing_campaigns;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON marketing_campaigns;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON customer_interactions;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON customer_interactions;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON promotional_materials;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON promotional_materials;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON pricing_sheets;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON pricing_sheets;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON sales_contracts;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON sales_contracts;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON customer_feedback;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON customer_feedback;

-- Drop any related sequences
DROP SEQUENCE IF EXISTS sales_proposal_id_seq;
DROP SEQUENCE IF EXISTS quotation_number_seq;
DROP SEQUENCE IF EXISTS campaign_id_seq;
DROP SEQUENCE IF EXISTS interaction_id_seq;
DROP SEQUENCE IF EXISTS contract_number_seq;
DROP SEQUENCE IF EXISTS feedback_id_seq;

