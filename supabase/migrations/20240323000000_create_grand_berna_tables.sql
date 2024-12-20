-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Milk Cooler Management
CREATE TABLE milk_cooler_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooler_id UUID NOT NULL,
    temperature FLOAT NOT NULL,
    agitation_duration INTEGER,
    cleaning_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE milk_cooler_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooler_id UUID NOT NULL,
    alert_type TEXT NOT NULL,
    alert_message TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dairy Factory Management
CREATE TABLE production_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type TEXT NOT NULL,
    batch_number TEXT NOT NULL,
    raw_material_used FLOAT,
    processing_steps JSONB,
    quality_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE raw_materials_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_name TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    unit TEXT NOT NULL,
    expiration_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cold Room Management
CREATE TABLE cold_room_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    batch_number TEXT,
    expiration_date DATE,
    storage_conditions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cold_room_environment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Slaughterhouse Management
CREATE TABLE animal_processing_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    animal_type TEXT NOT NULL,
    weight FLOAT NOT NULL,
    processed_products JSONB,
    processing_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    expiration_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS policies
ALTER TABLE milk_cooler_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE milk_cooler_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cold_room_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cold_room_environment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_processing_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_inventory ENABLE ROW LEVEL SECURITY;

-- Create basic policies (customize these based on your specific needs)
CREATE POLICY "Allow authenticated read access" ON milk_cooler_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON milk_cooler_alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON production_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON raw_materials_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON cold_room_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON cold_room_environment_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON animal_processing_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read access" ON product_inventory FOR SELECT TO authenticated USING (true);