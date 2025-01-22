-- Check if tables exist and create them if they don't
DO $$ 
BEGIN
    -- Create cheese_production table if it doesn't exist
    CREATE TABLE IF NOT EXISTS cheese_production (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        batch_number TEXT NOT NULL,
        status TEXT NOT NULL,
        temperature FLOAT NOT NULL,
        duration INTEGER NOT NULL,
        ph_level FLOAT NOT NULL,
        yield_amount FLOAT,
        quality_score INTEGER,
        production_line_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create cheese_production_stats table if it doesn't exist
    CREATE TABLE IF NOT EXISTS cheese_production_stats (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        date DATE NOT NULL,
        production_amount FLOAT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create production_lines table if it doesn't exist
    CREATE TABLE IF NOT EXISTS production_lines (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        manager TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Add foreign key if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'cheese_production_production_line_id_fkey'
    ) THEN
        ALTER TABLE cheese_production
        ADD CONSTRAINT cheese_production_production_line_id_fkey
        FOREIGN KEY (production_line_id) REFERENCES production_lines(id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE cheese_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheese_production_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_lines ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Enable read access for all users"
    ON cheese_production FOR SELECT
    USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users"
    ON cheese_production_stats FOR SELECT
    USING (true);

CREATE POLICY IF NOT EXISTS "Enable read access for all users"
    ON production_lines FOR SELECT
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cheese_production_status ON cheese_production(status);
CREATE INDEX IF NOT EXISTS idx_cheese_production_created_at ON cheese_production(created_at);
CREATE INDEX IF NOT EXISTS idx_production_stats_date ON cheese_production_stats(date);