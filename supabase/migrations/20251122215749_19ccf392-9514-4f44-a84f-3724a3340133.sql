-- ========================================
-- PHASE 1: Drop Conflicting Tables
-- ========================================
DROP TABLE IF EXISTS public.milk_reception CASCADE;
DROP TABLE IF EXISTS public.milk_reception_quality_metrics CASCADE;
DROP TABLE IF EXISTS public.milk_tank_offloads CASCADE;

-- ========================================
-- PHASE 2: Create Custom ENUM Types
-- ========================================
DO $$ BEGIN
    CREATE TYPE public.quality_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.cleaning_status AS ENUM ('pending', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.product_type AS ENUM ('cheese', 'yogurt', 'milk', 'butter', 'cream', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ========================================
-- PHASE 3: Create Core Infrastructure Tables
-- ========================================

-- Company/Organization Structure Tables
CREATE TABLE IF NOT EXISTS public."Dashboard" (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    content text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    "Date & Time" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
    title text,
    "Charts" text
);

CREATE TABLE IF NOT EXISTS public."Grand Berna Dairies" (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."KAJON Coffee Limited" (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."Kyalima Farmers Limited" (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Associations and Farm Information
CREATE TABLE IF NOT EXISTS public.associations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    association_name text NOT NULL,
    registration_number text,
    association_type text,
    member_count integer,
    coffee_types text,
    total_farm_area numeric,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.farm_information (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_name text NOT NULL,
    farm_size numeric(10,2) NOT NULL,
    supervisor_name text NOT NULL,
    manager_name text NOT NULL,
    coffee_type text NOT NULL,
    daily_production numeric(10,2),
    weekly_production numeric(10,2),
    monthly_production numeric(10,2),
    quarterly_production numeric(10,2),
    annual_production numeric(10,2),
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Equipment
CREATE TABLE IF NOT EXISTS public.equipment (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_name text NOT NULL,
    type text,
    classification text NOT NULL,
    manufacturer text,
    model text,
    serial_number text,
    purchase_date date,
    purchase_condition text,
    current_condition text,
    use_description text,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Dairy Sections
CREATE TABLE IF NOT EXISTS public.dairy_sections (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text,
    color text,
    icon text,
    priority integer DEFAULT 0,
    metrics jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Production Lines
CREATE TABLE IF NOT EXISTS public.production_lines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    manager text,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PHASE 4: Coffee Module Tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.coffee_stock (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    manager text NOT NULL,
    location text NOT NULL,
    coffee_type text NOT NULL,
    quality_grade text NOT NULL,
    source text NOT NULL,
    humidity numeric(5,2) NOT NULL,
    buying_price numeric(10,2) NOT NULL,
    currency text NOT NULL DEFAULT 'UGX'::text,
    quantity numeric(10,2) NOT NULL,
    unit text NOT NULL DEFAULT 'kg'::text,
    notes text,
    status text NOT NULL DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coffee_sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    manager text NOT NULL,
    location text NOT NULL,
    buyer_name text NOT NULL,
    buyer_contact text NOT NULL,
    coffee_type text NOT NULL,
    quality_grade text NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit text NOT NULL DEFAULT 'kg'::text,
    selling_price numeric(10,2) NOT NULL,
    currency text NOT NULL DEFAULT 'UGX'::text,
    total_price numeric(10,2) NOT NULL,
    status text NOT NULL DEFAULT 'completed'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coffee_sales_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_type text NOT NULL,
    date date NOT NULL,
    quantity double precision NOT NULL,
    revenue double precision NOT NULL,
    expenses double precision NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.coffee_export_contracts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number text NOT NULL,
    contract_date date NOT NULL,
    seller_name text NOT NULL,
    seller_address text,
    seller_registration text,
    buyer_name text NOT NULL,
    buyer_address text,
    buyer_registration text,
    products jsonb NOT NULL,
    payment_terms_items jsonb NOT NULL,
    total_contract_value numeric(15,2),
    shipping_left_label1 text,
    shipping_left_value1 text,
    shipping_left_label2 text,
    shipping_left_value2 text,
    shipping_left_label3 text,
    shipping_left_value3 text,
    shipping_right_label1 text,
    shipping_right_value1 text,
    shipping_right_label2 text,
    shipping_right_value2 text,
    shipping_right_label3 text,
    shipping_right_value3 text,
    additional_shipping_terms_label text,
    additional_shipping_terms text,
    for_seller_label text,
    seller_name_label text,
    seller_name_value text,
    seller_title_label text,
    seller_title_value text,
    seller_date_label text,
    seller_date_value text,
    seller_signature_label text,
    seller_signature_value text,
    for_buyer_label text,
    buyer_signature_name_label text,
    buyer_signature_name_value text,
    buyer_signature_title_label text,
    buyer_signature_title_value text,
    buyer_signature_date_label text,
    buyer_signature_date_value text,
    buyer_signature_label text,
    buyer_signature_value text,
    company_stamp text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.specialty_coffee_contracts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number text NOT NULL,
    contract_date date NOT NULL,
    seller_name text NOT NULL,
    seller_address text,
    seller_registration text,
    buyer_name text NOT NULL,
    buyer_address text,
    buyer_registration text,
    coffee_variety text,
    coffee_grade text,
    coffee_origin text,
    coffee_process text,
    coffee_certification text,
    cupping_score numeric(4,2),
    currency text DEFAULT 'USD'::text,
    status text DEFAULT 'active'::text,
    client_reference_id text,
    products jsonb,
    payment_terms_items jsonb,
    total_contract_value numeric(12,2),
    shipping_left_label1 text DEFAULT 'Incoterm:'::text,
    shipping_left_value1 text DEFAULT 'FOB Mombasa'::text,
    shipping_left_label2 text DEFAULT 'Packaging:'::text,
    shipping_left_value2 text DEFAULT '60kg jute bags with GrainPro liners'::text,
    shipping_left_label3 text DEFAULT 'Loading Port:'::text,
    shipping_left_value3 text DEFAULT 'Mombasa, Kenya'::text,
    shipping_right_label1 text DEFAULT 'Destination:'::text,
    shipping_right_value1 text DEFAULT 'Hamburg, Germany'::text,
    shipping_right_label2 text DEFAULT 'Latest Shipment Date:'::text,
    shipping_right_value2 text DEFAULT 'October 15, 2024'::text,
    shipping_right_label3 text DEFAULT 'Delivery Timeline:'::text,
    shipping_right_value3 text DEFAULT '30-45 days from loading'::text,
    additional_shipping_terms_label text DEFAULT 'Additional Shipping Terms:'::text,
    additional_shipping_terms text,
    for_seller_label text DEFAULT 'For and on behalf of SELLER'::text,
    seller_name_label text DEFAULT 'Name:'::text,
    seller_name_value text,
    seller_title_label text DEFAULT 'Title:'::text,
    seller_title_value text,
    seller_date_label text DEFAULT 'Date:'::text,
    seller_date_value text,
    seller_signature_label text DEFAULT 'Signature:'::text,
    seller_signature_value text,
    for_buyer_label text DEFAULT 'For and on behalf of BUYER'::text,
    buyer_signature_name_label text DEFAULT 'Name:'::text,
    buyer_signature_name_value text,
    buyer_signature_title_label text DEFAULT 'Title:'::text,
    buyer_signature_title_value text,
    buyer_signature_date_label text DEFAULT 'Date:'::text,
    buyer_signature_date_value text,
    buyer_signature_label text DEFAULT 'Signature:'::text,
    buyer_signature_value text,
    company_stamp text DEFAULT '[Company Seal/Stamp]'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.association_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id uuid REFERENCES public.associations(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    phone text,
    location text,
    farm_size numeric(10,2),
    coffee_type text,
    experience integer,
    join_date timestamp with time zone DEFAULT timezone('utc'::text, now()),
    status text DEFAULT 'active'::text,
    member_level text DEFAULT 'bronze'::text,
    last_delivery timestamp with time zone,
    photo_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.association_certifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    issuer varchar(255) NOT NULL,
    status varchar(50) NOT NULL,
    issue_date date,
    expiry_date date,
    requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
    progress integer DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.association_operations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id uuid REFERENCES public.associations(id) ON DELETE CASCADE,
    training_schedule timestamp with time zone,
    next_meeting_date timestamp with time zone,
    shared_equipment text,
    collective_resources text,
    status text DEFAULT 'scheduled'::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.association_trainings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id uuid REFERENCES public.associations(id) ON DELETE CASCADE,
    title text NOT NULL,
    category text NOT NULL,
    date date NOT NULL,
    "time" time without time zone NOT NULL,
    location text NOT NULL,
    trainer text NOT NULL,
    description text,
    max_members integer NOT NULL,
    enrolled_members integer DEFAULT 0,
    status text DEFAULT 'upcoming'::text,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.association_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id uuid REFERENCES public.associations(id) ON DELETE CASCADE,
    subject text NOT NULL,
    message text NOT NULL,
    recipients text NOT NULL,
    type text NOT NULL,
    status text NOT NULL,
    sent_by text,
    sent_date timestamp with time zone,
    scheduled_date timestamp with time zone,
    delivery_status text,
    read_status boolean DEFAULT false,
    response_data jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kazo_coffee_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    report_type text NOT NULL,
    recipient_name text NOT NULL,
    recipient_email text NOT NULL,
    recipient_phone text NOT NULL,
    send_via text[] NOT NULL,
    location text DEFAULT 'Kazo'::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.coffee_stock_transfers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    manager text NOT NULL,
    source_location text NOT NULL,
    destination_location text NOT NULL,
    coffee_type text NOT NULL,
    quality_grade text NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit text NOT NULL DEFAULT 'kg'::text,
    status text NOT NULL DEFAULT 'pending'::text,
    reason text,
    notes text,
    sender_user_id uuid,
    recipient_user_id uuid,
    received_at timestamp with time zone,
    declined_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rice_imports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_type text NOT NULL,
    quantity double precision NOT NULL,
    quality text NOT NULL,
    procurement_costs double precision NOT NULL,
    logistics_costs double precision NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);