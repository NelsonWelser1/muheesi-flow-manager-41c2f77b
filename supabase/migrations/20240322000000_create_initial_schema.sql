-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- System Users
CREATE TABLE system_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Grand Berna Dairies Tables
CREATE TABLE factory_operations (
    factory_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    manager TEXT NOT NULL,
    production_line_number INTEGER NOT NULL,
    product_type TEXT NOT NULL,
    product_varieties TEXT[] NOT NULL,
    date DATE NOT NULL,
    quantity FLOAT NOT NULL,
    quality TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cold_room_management (
    cold_room_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    in_charge_name TEXT NOT NULL,
    temperature_reading FLOAT NOT NULL,
    received_product_type TEXT NOT NULL,
    received_quality TEXT NOT NULL,
    received_quantity FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dairy_sales_records (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    product_type TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    revenue FLOAT NOT NULL,
    expenses FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- KAJON Coffee Limited Tables
CREATE TABLE coffee_inventory (
    coffee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coffee_type TEXT NOT NULL,
    source TEXT NOT NULL,
    store_name TEXT NOT NULL,
    store_manager TEXT NOT NULL,
    date_received DATE NOT NULL,
    quantity FLOAT NOT NULL,
    moisture_content FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kazo_coffee_store (
    warehouse_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location TEXT NOT NULL,
    received_product_type TEXT NOT NULL,
    received_quality TEXT NOT NULL,
    procurement_costs FLOAT NOT NULL,
    logistics_costs FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE outbound_coffee_shipments (
    shipment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    authentication TEXT NOT NULL,
    logistics_holder TEXT NOT NULL,
    product_type TEXT NOT NULL,
    quality TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coffee_sales_records (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    product_type TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    revenue FLOAT NOT NULL,
    expenses FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kyalima Farmers Limited Tables
CREATE TABLE tz2ug_rice_imports (
    import_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type TEXT NOT NULL,
    quality TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    procurement_costs FLOAT NOT NULL,
    logistics_costs FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coffee_farm_kyiboga (
    farm_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type TEXT NOT NULL,
    quality TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    farm_costs FLOAT NOT NULL,
    logistics_costs FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bull_fattening_program (
    program_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager_name TEXT NOT NULL,
    num_mothers INTEGER NOT NULL,
    num_heifers INTEGER NOT NULL,
    num_bulls INTEGER NOT NULL,
    num_calves INTEGER NOT NULL,
    recorded_deaths INTEGER NOT NULL,
    death_reasons TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fresheco Farming Limited Tables
CREATE TABLE fresheco_inventory (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    unit TEXT NOT NULL,
    storage_condition TEXT NOT NULL,
    harvest_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fresheco_exports (
    export_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name TEXT NOT NULL,
    quantity FLOAT NOT NULL,
    destination_country TEXT NOT NULL,
    export_date DATE NOT NULL,
    shipping_method TEXT NOT NULL,
    container_number TEXT,
    certification_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fresheco_quality_control (
    qc_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name TEXT NOT NULL,
    batch_number TEXT NOT NULL,
    inspection_date DATE NOT NULL,
    inspector_name TEXT NOT NULL,
    quality_grade TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
