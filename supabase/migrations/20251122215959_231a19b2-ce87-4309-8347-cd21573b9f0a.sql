-- ========================================
-- PHASE 7: Production & Quality Control Tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.production_batches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_number text NOT NULL,
    product_type public.product_type NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    raw_milk_used numeric(10,2) NOT NULL,
    expected_yield numeric(10,2) NOT NULL,
    actual_yield numeric(10,2),
    quality_status public.quality_status DEFAULT 'pending'::quality_status,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.production_line_international (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    description text,
    manager text,
    batch_id text NOT NULL,
    offload_batch_id text,
    cheese_type text NOT NULL,
    fromager_identifier text NOT NULL,
    milk_volume numeric NOT NULL,
    processing_temperature numeric NOT NULL,
    processing_time integer NOT NULL,
    coagulant_type text NOT NULL,
    coagulant_quantity numeric NOT NULL,
    starter_culture text NOT NULL,
    starter_quantity numeric NOT NULL,
    expected_yield numeric NOT NULL,
    estimated_duration integer NOT NULL,
    start_time timestamp with time zone NOT NULL,
    unit_quantity integer,
    unit_weight numeric(10,2),
    status text DEFAULT 'in_progress'::text,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.production_line_local (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    description text,
    manager text,
    batch_id text NOT NULL,
    offload_batch_id text,
    cheese_type text NOT NULL,
    fromager_identifier text NOT NULL,
    milk_volume numeric NOT NULL,
    processing_temperature numeric NOT NULL,
    processing_time integer NOT NULL,
    coagulant_type text NOT NULL,
    coagulant_quantity numeric NOT NULL,
    starter_culture text NOT NULL,
    starter_quantity numeric NOT NULL,
    expected_yield numeric NOT NULL,
    estimated_duration integer NOT NULL,
    start_time timestamp with time zone NOT NULL,
    unit_quantity integer,
    unit_weight numeric(10,2),
    status text DEFAULT 'in_progress'::text,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.raw_materials_inventory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    material_name text NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit text NOT NULL,
    supplier text,
    batch_number text,
    expiration_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quality_control (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    parameter text NOT NULL,
    value text NOT NULL,
    standard_value text NOT NULL,
    status text NOT NULL,
    checked_by text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.quality_checks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    temperature_standard numeric NOT NULL,
    temperature_actual numeric NOT NULL,
    temperature_status text NOT NULL,
    ph_level_standard numeric NOT NULL,
    ph_level_actual numeric NOT NULL,
    ph_level_status text NOT NULL,
    moisture_standard numeric NOT NULL,
    moisture_actual numeric NOT NULL,
    moisture_status text NOT NULL,
    fat_standard numeric NOT NULL,
    fat_actual numeric NOT NULL,
    fat_status text NOT NULL,
    protein_standard numeric NOT NULL,
    protein_actual numeric NOT NULL,
    protein_status text NOT NULL,
    salt_standard numeric NOT NULL,
    salt_actual numeric NOT NULL,
    salt_status text NOT NULL,
    notes text,
    checked_by uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.quality_control_checks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id uuid,
    parameter text NOT NULL,
    expected_value text NOT NULL,
    actual_value text NOT NULL,
    passed boolean NOT NULL,
    checked_by text NOT NULL,
    checked_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quality_score_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    grade text NOT NULL,
    min_temperature numeric(5,2),
    max_temperature numeric(5,2),
    min_acidity numeric(5,2),
    max_acidity numeric(5,2),
    max_plate_count integer,
    min_fat_percentage numeric(5,2),
    max_fat_percentage numeric(5,2),
    min_protein_percentage numeric(5,2),
    max_protein_percentage numeric(5,2),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.quality_trends (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    average_score double precision,
    pass_rate double precision NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.storage_tanks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tank_name text NOT NULL,
    capacity double precision NOT NULL,
    current_volume double precision NOT NULL DEFAULT 0,
    initial_volume double precision DEFAULT 0,
    added_volume double precision DEFAULT 0,
    temperature double precision,
    status text DEFAULT 'active'::text,
    cleaner_id uuid,
    last_cleaned timestamp with time zone,
    last_cleaned_at timestamp with time zone,
    service_end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.tank_cleaning_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tank_id uuid,
    cleaner_id text NOT NULL,
    cleaning_date date NOT NULL,
    cleaning_time time without time zone NOT NULL,
    status public.cleaning_status DEFAULT 'completed'::cleaning_status,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.tank_volume_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tank_id uuid,
    initial_volume double precision NOT NULL,
    added_volume double precision,
    total_volume double precision NOT NULL,
    temperature double precision NOT NULL,
    notes text,
    created_by uuid,
    recorded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.cleaning_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tank_id uuid,
    cleaner_id uuid,
    cleaned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.cold_room_inventory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cold_room_id text NOT NULL,
    product_category text NOT NULL,
    product_type text NOT NULL,
    batch_id text NOT NULL,
    production_batch_id text,
    unit_quantity integer NOT NULL,
    unit_weight numeric(10,2) NOT NULL,
    temperature numeric(5,2) NOT NULL,
    humidity numeric(5,2) NOT NULL,
    storage_date_time timestamp with time zone NOT NULL,
    operator_id text NOT NULL,
    movement_action text NOT NULL,
    remarks text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cold_room_environment_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cold_room_id text NOT NULL,
    temperature numeric(5,2) NOT NULL,
    humidity numeric(5,2) NOT NULL,
    recorded_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- PHASE 8: Sales & Logistics Tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.sales_contracts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id text NOT NULL,
    contract_title text NOT NULL,
    contract_type text NOT NULL,
    client_name text NOT NULL,
    client_contact text,
    client_email text,
    client_address text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    total_value numeric(15,2),
    payment_terms text,
    delivery_terms text,
    products jsonb,
    special_clauses text,
    status text,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.sales_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    order_date date NOT NULL,
    product text NOT NULL,
    product_type text,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    discount numeric(5,2),
    total_amount numeric(10,2),
    payment_status text NOT NULL,
    delivery_required text NOT NULL,
    sales_rep text,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.sales_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number text NOT NULL,
    customer_name text NOT NULL,
    product_type text NOT NULL,
    quantity integer NOT NULL,
    price_per_unit numeric(10,2) NOT NULL,
    date_time timestamp with time zone NOT NULL,
    destination text,
    driver_id text,
    vehicle_id text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.sales_proposals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id text,
    proposal_date date NOT NULL,
    customer_name text NOT NULL,
    customer_email text,
    customer_phone text,
    products jsonb NOT NULL,
    grand_total numeric NOT NULL,
    validity_period integer NOT NULL,
    terms_conditions text,
    status text NOT NULL DEFAULT 'draft'::text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.customer_invoices (
    id text PRIMARY KEY,
    customer_name text NOT NULL,
    customer_contact text,
    billing_address text,
    invoice_date date NOT NULL,
    due_date date NOT NULL,
    items jsonb NOT NULL DEFAULT '[]'::jsonb,
    total_amount numeric(10,2) NOT NULL,
    discount numeric(5,2) DEFAULT 0,
    tax numeric(5,2) DEFAULT 0,
    payment_terms text,
    payment_status text DEFAULT 'pending'::text,
    payment_proof_url text,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customer_feedback (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    customer_email text,
    customer_phone text,
    product_service text,
    satisfaction_rating integer NOT NULL,
    feedback_text text,
    improvement_suggestions text,
    follow_up_required boolean DEFAULT false,
    follow_up_status text,
    feedback_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.quotations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number text NOT NULL,
    customer_name text NOT NULL,
    destination text NOT NULL,
    coffee_grade text NOT NULL,
    quantity numeric NOT NULL,
    unit_price numeric NOT NULL,
    total_amount numeric NOT NULL,
    num_containers integer NOT NULL,
    validity date NOT NULL,
    payment_terms text NOT NULL,
    delivery_terms text NOT NULL,
    incoterm text NOT NULL,
    screen_18_percent numeric NOT NULL DEFAULT 0,
    screen_15_percent numeric NOT NULL DEFAULT 0,
    screen_12_percent numeric NOT NULL DEFAULT 0,
    low_grades_percent numeric NOT NULL DEFAULT 0,
    sourcing_costs jsonb NOT NULL DEFAULT '{}'::jsonb,
    transport_cost numeric NOT NULL DEFAULT 0,
    ocean_freight numeric NOT NULL DEFAULT 0,
    port_charges numeric NOT NULL DEFAULT 0,
    total_costs numeric NOT NULL DEFAULT 0,
    total_revenue numeric NOT NULL DEFAULT 0,
    net_profit numeric NOT NULL DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.quote_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id uuid NOT NULL,
    product_code text NOT NULL,
    description text NOT NULL,
    quantity numeric NOT NULL,
    unit_price numeric NOT NULL,
    total_price numeric NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.quotes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number text NOT NULL,
    customer_name text NOT NULL,
    customer_email text,
    customer_address text,
    coffee_grade text NOT NULL,
    quantity numeric NOT NULL,
    unit_price numeric NOT NULL,
    total_amount numeric NOT NULL,
    validity date NOT NULL,
    payment_terms text NOT NULL,
    delivery_terms text NOT NULL,
    terms text,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.pricing_sheets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sheet_id text NOT NULL,
    title text NOT NULL,
    description text,
    effective_date date NOT NULL,
    expiry_date date,
    products jsonb NOT NULL,
    status text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.product_catalogs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    catalog_id text NOT NULL,
    catalog_name text NOT NULL,
    catalog_description text,
    effective_date date NOT NULL,
    expiry_date date,
    products jsonb NOT NULL,
    status text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.delivery_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_reference text NOT NULL,
    delivery_date date NOT NULL,
    delivery_location text NOT NULL,
    delivery_person text,
    receiver_name text NOT NULL,
    receiver_contact text NOT NULL,
    delivered_items jsonb NOT NULL DEFAULT '[]'::jsonb,
    delivery_status text NOT NULL DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.advertising_promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id text NOT NULL,
    title text NOT NULL,
    promotion_type text NOT NULL,
    material_type text NOT NULL,
    target_audience text,
    objectives text,
    budget text,
    start_date date,
    end_date date,
    channels jsonb,
    assets_urls jsonb,
    status text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.logistics_deliveries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id text NOT NULL,
    order_id text NOT NULL,
    customer_name text NOT NULL,
    pickup_location text NOT NULL,
    delivery_location text NOT NULL,
    scheduled_pickup_time timestamp with time zone NOT NULL,
    scheduled_delivery_time timestamp with time zone NOT NULL,
    actual_pickup_time timestamp with time zone,
    actual_delivery_time timestamp with time zone,
    status text NOT NULL,
    comments text,
    operator_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.logistics_delivery_management (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id text NOT NULL,
    order_id text,
    customer_name text NOT NULL,
    pickup_location text NOT NULL,
    delivery_location text NOT NULL,
    scheduled_pickup_time timestamp with time zone NOT NULL,
    scheduled_delivery_time timestamp with time zone NOT NULL,
    actual_pickup_time timestamp with time zone,
    actual_delivery_time timestamp with time zone,
    status text NOT NULL,
    comments text,
    operator_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.logistics_delivery_performance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id text,
    operator_id uuid,
    delivery_time integer NOT NULL,
    deviation_from_average numeric(10,2),
    performance_rating integer,
    action_required boolean DEFAULT false,
    action_details text,
    delay_reason text,
    comments text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.logistics_order_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id text NOT NULL,
    customer_name text NOT NULL,
    order_date_time timestamp with time zone NOT NULL,
    order_details jsonb NOT NULL,
    order_status text NOT NULL,
    delivery_priority text NOT NULL,
    assigned_delivery_id text,
    operator_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.shipments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id text NOT NULL,
    status text NOT NULL,
    container text NOT NULL,
    volume text,
    departure_date date NOT NULL,
    eta date NOT NULL,
    destination text,
    vessel text,
    route text,
    client text,
    special_instructions text,
    last_update date NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);