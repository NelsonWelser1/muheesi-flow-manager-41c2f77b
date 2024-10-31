-- Enable RLS
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- User Accounts Table
CREATE TABLE user_accounts (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'Pending',
    company TEXT NOT NULL,
    responsibilities TEXT[] DEFAULT ARRAY[]::TEXT[],
    session_data JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT valid_status CHECK (status IN ('Active', 'Pending', 'Deactivated'))
);

-- Audit Trail Table
CREATE TABLE audit_trail (
    action_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_accounts(user_id),
    action_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changed_by UUID REFERENCES auth.users(id),
    changes JSONB NOT NULL DEFAULT '{}'
);

-- RLS Policies
CREATE POLICY "System admins can do everything"
    ON user_accounts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role_name = 'System Administrator'
        )
    );

CREATE POLICY "Users can view their own account"
    ON user_accounts
    FOR SELECT
    USING (user_id::TEXT = auth.uid()::TEXT);