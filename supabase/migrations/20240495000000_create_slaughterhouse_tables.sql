
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Animal Procurement Table
CREATE TABLE slaughterhouse_procurement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procurement_date TIMESTAMP WITH TIME ZONE NOT NULL,
    animal_id TEXT NOT NULL,
    animal_type TEXT NOT NULL,
    supplier_info TEXT NOT NULL,
    weight_before DECIMAL(10,2) NOT NULL,
    health_inspection TEXT NOT NULL,
    operator_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Processing and Production Table
CREATE TABLE slaughterhouse_processing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id TEXT NOT NULL,
    processing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    procurement_id UUID REFERENCES slaughterhouse_procurement(id),
    weight_before DECIMAL(10,2) NOT NULL,
    weight_after DECIMAL(10,2) NOT NULL,
    meat_quality_grade TEXT NOT NULL,
    operator_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Packaging and Storage Table
CREATE TABLE slaughterhouse_packaging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    processing_id UUID REFERENCES slaughterhouse_processing(id),
    packaging_date TIMESTAMP WITH TIME ZONE NOT NULL,
    batch_id TEXT NOT NULL,
    packaging_type TEXT NOT NULL,
    quantity_packaged DECIMAL(10,2) NOT NULL,
    labeling_details JSONB NOT NULL,
    cold_storage_id TEXT NOT NULL,
    operator_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Compliance and Safety Table
CREATE TABLE slaughterhouse_compliance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_date DATE NOT NULL,
    compliance_details JSONB NOT NULL,
    inspector_id TEXT NOT NULL,
    findings TEXT,
    remediation_steps TEXT,
    operator_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE slaughterhouse_procurement ENABLE ROW LEVEL SECURITY;
ALTER TABLE slaughterhouse_processing ENABLE ROW LEVEL SECURITY;
ALTER TABLE slaughterhouse_packaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE slaughterhouse_compliance ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their company's procurement records"
    ON slaughterhouse_procurement
    FOR SELECT
    USING (auth.uid() IN (
        SELECT user_id FROM user_roles 
        WHERE company = 'Grand Berna Dairies'
    ));

CREATE POLICY "Users can insert procurement records"
    ON slaughterhouse_procurement
    FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT user_id FROM user_roles 
        WHERE company = 'Grand Berna Dairies'
    ));

-- Repeat similar policies for other tables
