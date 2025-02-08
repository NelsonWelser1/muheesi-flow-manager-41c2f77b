
-- Enable RLS for yogurt processing tables
ALTER TABLE yogurt_milk_preparation ENABLE ROW LEVEL SECURITY;
ALTER TABLE yogurt_pasteurization ENABLE ROW LEVEL SECURITY;

-- Create policies for yogurt_milk_preparation table
CREATE POLICY "Users can view yogurt preparation records"
    ON yogurt_milk_preparation
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Grand Berna Dairies'
    ));

CREATE POLICY "Operations staff can insert yogurt preparation records"
    ON yogurt_milk_preparation
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Grand Berna Dairies'
        AND role_name IN ('Operations Manager', 'Production Operator', 'System Administrator')
    ));

CREATE POLICY "Operations staff can update yogurt preparation records"
    ON yogurt_milk_preparation
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Grand Berna Dairies'
        AND role_name IN ('Operations Manager', 'Production Operator', 'System Administrator')
    ));

-- Create policies for yogurt_pasteurization table
CREATE POLICY "Users can view pasteurization records"
    ON yogurt_pasteurization
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Grand Berna Dairies'
    ));

CREATE POLICY "Operations staff can insert pasteurization records"
    ON yogurt_pasteurization
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Grand Berna Dairies'
        AND role_name IN ('Operations Manager', 'Production Operator', 'System Administrator')
    ));

CREATE POLICY "Operations staff can update pasteurization records"
    ON yogurt_pasteurization
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND company = 'Grand Berna Dairies'
        AND role_name IN ('Operations Manager', 'Production Operator', 'System Administrator')
    ));

