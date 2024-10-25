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

-- Add more tables as needed for KAJON Coffee and Kyalima Farmers