
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Base tables for yogurt processing
CREATE TABLE yogurt_milk_preparation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    milk_volume DECIMAL(10,2) NOT NULL,
    pre_standardization_fat DECIMAL(4,2) NOT NULL,
    target_fat DECIMAL(4,2) NOT NULL,
    homogenizer_id TEXT NOT NULL,
    homogenization_duration INTEGER NOT NULL,
    operator_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE yogurt_pasteurization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    volume_processed DECIMAL(10,2) NOT NULL,
    pasteurization_temp DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL,
    cooling_start_temp DECIMAL(5,2) NOT NULL,
    operator_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE yogurt_culture_addition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    yogurt_type TEXT NOT NULL,
    culture_type TEXT NOT NULL,
    culture_quantity DECIMAL(6,2) NOT NULL,
    additives TEXT[],
    pre_fermentation_temp DECIMAL(5,2) NOT NULL,
    expected_duration INTEGER NOT NULL,
    operator_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE yogurt_fermentation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    start_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    target_temp DECIMAL(5,2) NOT NULL,
    ph_readings JSONB NOT NULL DEFAULT '[]',
    observations TEXT,
    duration INTEGER NOT NULL,
    operator_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE yogurt_cooling_setting (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    target_temp DECIMAL(5,2) NOT NULL,
    cooling_duration INTEGER NOT NULL,
    setting_time INTEGER NOT NULL,
    texture_observations TEXT,
    operator_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE yogurt_packaging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    container_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    seal_verification BOOLEAN NOT NULL,
    expiry_date DATE NOT NULL,
    operator_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE yogurt_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    cold_room_id TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    quantity INTEGER NOT NULL,
    movement_type TEXT NOT NULL,
    operator_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE yogurt_quality_testing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    ph_level DECIMAL(4,2) NOT NULL,
    microbial_count INTEGER,
    sensory_evaluation TEXT NOT NULL,
    tester_id TEXT NOT NULL,
    corrective_actions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE yogurt_cleaning_sanitation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id TEXT NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    cleaning_agent TEXT NOT NULL,
    sanitation_check BOOLEAN NOT NULL,
    operator_id TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE yogurt_milk_preparation ENABLE ROW LEVEL SECURITY;
ALTER TABLE yogurt_pasteurization ENABLE ROW LEVEL SECURITY;
ALTER TABLE yogurt_culture_addition ENABLE ROW LEVEL SECURITY;
ALTER TABLE yogurt_fermentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE yogurt_cooling_setting ENABLE ROW LEVEL SECURITY;
ALTER TABLE yogurt_packaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE yogurt_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE yogurt_quality_testing ENABLE ROW LEVEL SECURITY;
ALTER TABLE yogurt_cleaning_sanitation ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
ON yogurt_milk_preparation FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON yogurt_milk_preparation FOR INSERT TO authenticated WITH CHECK (true);

-- Repeat for other tables
-- ... keep existing code (repeat the same policies for all other tables)

-- Create indexes
CREATE INDEX idx_yogurt_milk_prep_batch ON yogurt_milk_preparation(batch_id);
CREATE INDEX idx_yogurt_past_batch ON yogurt_pasteurization(batch_id);
CREATE INDEX idx_yogurt_culture_batch ON yogurt_culture_addition(batch_id);
CREATE INDEX idx_yogurt_ferm_batch ON yogurt_fermentation(batch_id);
CREATE INDEX idx_yogurt_cool_batch ON yogurt_cooling_setting(batch_id);
CREATE INDEX idx_yogurt_pack_batch ON yogurt_packaging(batch_id);
CREATE INDEX idx_yogurt_inv_batch ON yogurt_inventory(batch_id);
CREATE INDEX idx_yogurt_qa_batch ON yogurt_quality_testing(batch_id);
CREATE INDEX idx_yogurt_clean_equipment ON yogurt_cleaning_sanitation(equipment_id);

