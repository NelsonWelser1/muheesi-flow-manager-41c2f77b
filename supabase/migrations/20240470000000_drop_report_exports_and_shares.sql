
-- Drop tables if they exist
DROP TABLE IF EXISTS report_exports;
DROP TABLE IF EXISTS report_shares;

-- For safety, also remove any foreign key constraints if they exist
-- We don't need to explicitly drop these as dropping the tables will handle it,
-- but including for completeness
ALTER TABLE IF EXISTS report_exports 
  DROP CONSTRAINT IF EXISTS report_exports_user_id_fkey;

ALTER TABLE IF EXISTS report_shares
  DROP CONSTRAINT IF EXISTS report_shares_user_id_fkey;
