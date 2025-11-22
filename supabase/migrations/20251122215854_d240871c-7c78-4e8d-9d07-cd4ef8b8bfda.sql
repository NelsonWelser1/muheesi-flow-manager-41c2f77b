-- ========================================
-- PHASE 5: Dairy Module Tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.milk_production (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id text NOT NULL,
    date date NOT NULL,
    session text NOT NULL,
    volume numeric NOT NULL,
    milking_cows integer NOT NULL,
    fat_content numeric,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CHECK (session IN ('morning', 'midday', 'evening'))
);

CREATE TABLE IF NOT EXISTS public.kashari_milk_production (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    session text NOT NULL,
    volume numeric NOT NULL,
    milking_cows integer NOT NULL,
    fat_content numeric,
    protein_content numeric,
    location text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CHECK (session IN ('morning', 'midday', 'evening'))
);

CREATE TABLE IF NOT EXISTS public.milk_reception (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text,
    supplier_name text NOT NULL,
    tank_number text NOT NULL,
    milk_volume numeric(10,2) NOT NULL,
    temperature numeric(5,2) NOT NULL,
    fat_percentage numeric(5,2) NOT NULL,
    protein_percentage numeric(5,2) NOT NULL,
    acidity numeric(5,2) NOT NULL,
    total_plate_count integer NOT NULL,
    quality_score text NOT NULL,
    destination text,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.milk_reception_quality_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reception_id uuid,
    date date NOT NULL,
    volume numeric,
    temperature numeric,
    fat_content numeric,
    protein_content numeric,
    lactose_content numeric,
    total_solids numeric,
    bacteria_count numeric,
    ph_level numeric,
    quality_score numeric,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.milk_reception_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    temperature_threshold numeric(5,2) NOT NULL DEFAULT 4.5,
    capacity_warning_threshold integer NOT NULL DEFAULT 90,
    auto_cleaning_enabled boolean NOT NULL DEFAULT false,
    cleaning_interval integer NOT NULL DEFAULT 7,
    maintenance_interval integer NOT NULL DEFAULT 30,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.milk_reception_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    milk_reception_id uuid,
    action text NOT NULL,
    old_data jsonb,
    new_data jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.milk_tank_offloads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text,
    storage_tank text NOT NULL,
    volume_offloaded numeric(10,2) NOT NULL,
    temperature numeric(5,2) NOT NULL,
    fat_percentage numeric(5,2),
    protein_percentage numeric(5,2),
    acidity numeric(5,2),
    total_plate_count integer,
    destination text NOT NULL,
    quality_check text NOT NULL DEFAULT 'Grade A'::text,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.milk_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tank_id uuid,
    liters_added double precision NOT NULL,
    temperature double precision NOT NULL,
    price_per_liter double precision NOT NULL,
    total_cost double precision NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.dairy_production (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    production_date date NOT NULL DEFAULT CURRENT_DATE,
    quantity numeric NOT NULL,
    fat_content numeric,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dairy_production_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    product_type text NOT NULL,
    production_date date NOT NULL,
    raw_material numeric(10,2) NOT NULL,
    finished_product numeric(10,2) NOT NULL,
    efficiency integer,
    quality_score integer,
    operator_id uuid,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dairy_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    priority text DEFAULT 'normal'::text,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.dairy_section_reports (
    id uuid,
    title text,
    type text,
    content text,
    recipient_name text,
    recipient_email text,
    recipient_phone text,
    send_via text[],
    category text,
    tags text[],
    priority text,
    status text,
    related_section text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.dairy_cooler_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cooler_id text NOT NULL,
    temperature double precision NOT NULL,
    humidity double precision,
    status text NOT NULL,
    last_check timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.cheese_production (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_number text NOT NULL,
    production_line_id uuid,
    ph_level double precision NOT NULL,
    temperature double precision NOT NULL,
    duration integer NOT NULL,
    yield_amount double precision,
    quality_score integer,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.cheese_production_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    production_amount double precision NOT NULL,
    yield_efficiency double precision,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.cheese_vat_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vat_id text NOT NULL,
    product_type text NOT NULL,
    current_phase text NOT NULL,
    status text NOT NULL,
    temperature double precision NOT NULL,
    ph_level double precision,
    stirring_speed integer,
    curd_size double precision,
    operator_id text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.aging_room_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id text NOT NULL,
    cheese_type text NOT NULL,
    temperature double precision NOT NULL,
    humidity integer NOT NULL,
    occupancy integer NOT NULL,
    aging_duration integer NOT NULL,
    recorded_by text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.pasteurizer_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id text NOT NULL,
    status text NOT NULL,
    operator_id text NOT NULL,
    current_temperature double precision NOT NULL,
    target_temperature double precision NOT NULL,
    batch_volume double precision NOT NULL,
    flow_rate double precision,
    holding_time integer,
    cleaning_status text,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.yogurt_milk_preparation (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    date_time timestamp with time zone NOT NULL,
    milk_volume numeric(10,2) NOT NULL,
    pre_standardization_fat numeric(5,2) NOT NULL,
    target_fat numeric(5,2) NOT NULL,
    homogenization_duration integer NOT NULL,
    operator_id uuid NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.yogurt_pasteurization (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    date_time timestamp with time zone NOT NULL,
    pasteurization_temp numeric(5,2) NOT NULL,
    holding_time integer NOT NULL,
    cooling_temp numeric(5,2) NOT NULL,
    operator_id uuid NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.yogurt_culture_addition (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    date_time timestamp with time zone NOT NULL,
    yogurt_type text NOT NULL,
    culture_type text NOT NULL,
    culture_quantity numeric(6,2) NOT NULL,
    pre_fermentation_temp numeric(5,2) NOT NULL,
    expected_duration integer NOT NULL,
    additives text[],
    operator_id text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.yogurt_fermentation (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    start_date_time timestamp with time zone NOT NULL,
    target_temp numeric(5,2) NOT NULL,
    ph_readings jsonb NOT NULL DEFAULT '[]'::jsonb,
    operator_id text NOT NULL,
    observations text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.yogurt_cooling_setting (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    date_time timestamp with time zone NOT NULL,
    target_temp numeric(5,2) NOT NULL,
    cooling_duration integer NOT NULL,
    setting_time integer NOT NULL,
    texture_observations text,
    operator_id text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.yogurt_quality_testing (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    test_date_time timestamp with time zone NOT NULL,
    ph_level numeric(4,2) NOT NULL,
    titratable_acidity numeric(5,2) NOT NULL,
    taste_score integer NOT NULL,
    texture_score integer NOT NULL,
    appearance_score integer NOT NULL,
    overall_rating text NOT NULL,
    tested_by text NOT NULL,
    remarks text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.yogurt_packaging (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    packaging_date_time timestamp with time zone NOT NULL,
    package_size text NOT NULL,
    units_packaged integer NOT NULL,
    lot_number text NOT NULL,
    expiry_date date NOT NULL,
    operator_id text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.yogurt_cleaning_sanitation (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id text NOT NULL,
    date_time timestamp with time zone NOT NULL,
    cleaning_agent text NOT NULL,
    sanitation_check boolean NOT NULL,
    operator_id text NOT NULL,
    remarks text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.yogurt_inventory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    product_name text NOT NULL,
    package_size text NOT NULL,
    quantity integer NOT NULL,
    production_date date NOT NULL,
    expiry_date date NOT NULL,
    storage_location text NOT NULL,
    status text NOT NULL DEFAULT 'available'::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PHASE 6: Cattle & Farm Management Tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.cattle_inventory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_number text NOT NULL,
    name text,
    type text NOT NULL,
    breed text NOT NULL,
    date_of_birth date,
    weight numeric,
    health_status text DEFAULT 'good'::text,
    purchase_date date,
    farm_id text NOT NULL DEFAULT 'kashari'::text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cattle_fattening (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_number text NOT NULL,
    name text,
    cattle_type text NOT NULL,
    breed text NOT NULL,
    date_of_birth date,
    entry_date date NOT NULL,
    entry_weight numeric NOT NULL,
    current_weight numeric NOT NULL,
    target_weight numeric NOT NULL,
    daily_gain numeric,
    feeding_regime text NOT NULL DEFAULT 'standard'::text,
    expected_completion_date date,
    status text NOT NULL DEFAULT 'active'::text,
    farm_id text NOT NULL,
    batch_id text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cattle_health_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cattle_id uuid REFERENCES public.cattle_inventory(id) ON DELETE CASCADE,
    record_date date NOT NULL,
    record_type text NOT NULL,
    description text NOT NULL,
    treatment text,
    administered_by text,
    next_due_date date,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CHECK (record_type IN ('vaccination', 'treatment', 'examination', 'deworming'))
);

CREATE TABLE IF NOT EXISTS public.bull_fattening_program (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_name text NOT NULL,
    num_mothers integer NOT NULL,
    num_calves integer NOT NULL,
    num_bulls integer NOT NULL,
    num_heifers integer NOT NULL,
    recorded_deaths integer NOT NULL DEFAULT 0,
    death_reasons text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.farm_staff (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    role text NOT NULL DEFAULT 'farm_worker'::text,
    email text,
    contact_number text NOT NULL,
    address text,
    start_date date,
    salary numeric(12,2),
    status text NOT NULL DEFAULT 'active'::text,
    notes text,
    avatar_url text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.silage_inventory (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id text NOT NULL,
    type text NOT NULL,
    amount numeric NOT NULL,
    unit text NOT NULL,
    quality text NOT NULL,
    production_date date NOT NULL,
    expiry_date date,
    storage_location text,
    person_in_charge text,
    ingredients text[],
    expenses_incurred numeric,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.planting_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    crop_type varchar(100) NOT NULL,
    variety varchar(100) NOT NULL,
    plot_id varchar(100) NOT NULL,
    area numeric NOT NULL,
    seeds_quantity varchar(100),
    fertilizer varchar(255),
    workers varchar(255),
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.harvest_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    crop_type varchar NOT NULL,
    variety varchar NOT NULL,
    plot_id varchar NOT NULL,
    quantity numeric NOT NULL,
    unit varchar NOT NULL,
    quality varchar NOT NULL,
    workers varchar,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.planting_harvesting_schedule (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id uuid,
    farm_name text NOT NULL,
    activity_type text NOT NULL,
    scheduled_date date NOT NULL,
    expected_completion_date date,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);