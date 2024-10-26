CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    role_name TEXT NOT NULL,
    company TEXT NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create policies for user roles
CREATE POLICY "Users can view their own roles"
    ON user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Only system admins can insert roles"
    ON user_roles
    FOR INSERT
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND role_name = 'System Administrator'
    ));

CREATE POLICY "Only system admins can update roles"
    ON user_roles
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND role_name = 'System Administrator'
    ));