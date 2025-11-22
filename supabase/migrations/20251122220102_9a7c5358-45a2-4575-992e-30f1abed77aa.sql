-- ========================================
-- PHASE 9: Finance & HR Tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.bills_expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_number text NOT NULL,
    supplier_name text NOT NULL,
    expense_details text,
    bill_date date NOT NULL,
    due_date date NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text NOT NULL DEFAULT 'UGX'::text,
    payment_method text NOT NULL,
    status text NOT NULL,
    expense_type text NOT NULL,
    is_recurring boolean DEFAULT false,
    recurring_frequency text,
    recurring_end_date date,
    receipt_url text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.loans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id text NOT NULL,
    institution text NOT NULL,
    start_date date NOT NULL,
    due_date date NOT NULL,
    amount numeric NOT NULL CHECK (amount > 0),
    interest_rate numeric NOT NULL CHECK (interest_rate > 0),
    payment_frequency text NOT NULL CHECK (payment_frequency IN ('monthly', 'quarterly', 'biannual', 'annual')),
    purpose text NOT NULL,
    collateral text,
    contact_person text,
    notes text,
    status text NOT NULL DEFAULT 'active'::text CHECK (status IN ('active', 'completed', 'overdue')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments_receipts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number text NOT NULL,
    payment_type text NOT NULL,
    party_name text NOT NULL,
    amount numeric(15,2) NOT NULL,
    currency text NOT NULL DEFAULT 'UGX'::text,
    payment_method text NOT NULL,
    payment_date date NOT NULL,
    status text NOT NULL,
    reference_number text,
    notes text,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    type varchar(50) NOT NULL,
    amount numeric(15,2) NOT NULL,
    bank_account varchar(255) NOT NULL,
    payee varchar(255) NOT NULL,
    reason varchar(500) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.kashari_transactions (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    date date NOT NULL,
    type varchar(50) NOT NULL,
    amount numeric(12,2) NOT NULL,
    bank_account varchar(255) NOT NULL,
    payee varchar(255) NOT NULL,
    reason varchar(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.employee_dossiers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id text NOT NULL,
    job_title text,
    department text,
    status text,
    shift_start timestamp with time zone,
    shift_end timestamp with time zone,
    performance_rating integer,
    review_date_time timestamp with time zone,
    comments text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.personnel_employee_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id text NOT NULL,
    job_title text,
    department text,
    status text DEFAULT 'Active'::text,
    shift_start timestamp with time zone,
    shift_end timestamp with time zone,
    performance_rating integer,
    review_date_time timestamp with time zone,
    comments text,
    operator_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.personnel_recruitment_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title text NOT NULL,
    candidate_name text NOT NULL,
    status text DEFAULT 'Pending'::text,
    interview_date_time timestamp with time zone,
    hiring_manager_id text,
    feedback text,
    operator_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.personnel_training_evaluations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id text NOT NULL,
    training_module text NOT NULL,
    training_date date,
    performance_rating integer,
    feedback text,
    operator_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.personnel_scheduled_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id text NOT NULL,
    task_type text NOT NULL,
    scheduled_date date NOT NULL,
    scheduled_time time without time zone,
    location text,
    assigned_to text,
    notes text,
    completed boolean DEFAULT false,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.personnel_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id text NOT NULL,
    filename text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    file_size text NOT NULL,
    category text,
    description text,
    uploaded_by text,
    upload_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payroll_payslips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payslip_number text NOT NULL,
    employee_id text NOT NULL,
    employee_name text NOT NULL,
    department text,
    salary_period text NOT NULL,
    basic_salary numeric(12,2) NOT NULL,
    tax_amount numeric(12,2) NOT NULL DEFAULT 0,
    nssf_amount numeric(12,2) NOT NULL DEFAULT 0,
    loan_deduction numeric(12,2) NOT NULL DEFAULT 0,
    other_deductions numeric(12,2) NOT NULL DEFAULT 0,
    net_salary numeric(12,2) NOT NULL,
    payment_date date NOT NULL,
    payment_method text NOT NULL,
    payment_status text NOT NULL,
    currency text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- ========================================
-- PHASE 10: Equipment & Maintenance Tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.equipment_maintenance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company text NOT NULL,
    project text NOT NULL,
    equipment_name text NOT NULL,
    maintenance_type text NOT NULL,
    status text NOT NULL,
    last_maintenance timestamp with time zone,
    next_maintenance timestamp with time zone NOT NULL,
    health_score integer NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.maintenance_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_name text NOT NULL,
    maintenance_type text NOT NULL,
    status text NOT NULL,
    company text NOT NULL DEFAULT 'Grand Berna Dairies'::text,
    project text NOT NULL DEFAULT 'Cheese Factory'::text,
    last_maintenance timestamp with time zone,
    next_maintenance timestamp with time zone NOT NULL,
    health_score integer NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.maintenance_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    type text NOT NULL,
    content text NOT NULL,
    recipient_name text NOT NULL,
    recipient_email text NOT NULL,
    recipient_phone text NOT NULL,
    send_via text[] NOT NULL,
    category text,
    tags text[],
    priority text DEFAULT 'medium'::text,
    status text DEFAULT 'pending'::text,
    related_section text,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.maintenance_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    completed_today integer NOT NULL DEFAULT 0,
    pending_maintenance integer NOT NULL DEFAULT 0,
    equipment_health integer NOT NULL DEFAULT 0,
    last_updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PHASE 11: Contracts & Documents Tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.contract_documents (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    filename text NOT NULL,
    file_path text NOT NULL,
    file_url text,
    contract_id text,
    file_type text,
    file_size bigint,
    status text DEFAULT 'pending_verification'::text,
    client text,
    notes text,
    keywords text[],
    signed_by text[],
    verified_by text,
    verified_at timestamp with time zone,
    metadata jsonb,
    upload_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.local_purchase_agreements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number text NOT NULL,
    agreement_date date NOT NULL,
    buyer_name text NOT NULL,
    buyer_address text,
    buyer_contact text,
    supplier_name text NOT NULL,
    supplier_address text,
    supplier_contact text,
    items jsonb,
    total_value numeric(12,2),
    payment_terms text,
    delivery_terms text,
    quality_requirements text,
    special_terms text,
    contract_status text DEFAULT 'draft'::text,
    signature_buyer text,
    signature_supplier text,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- PHASE 12: Reporting & Admin Tables
-- ========================================

CREATE TABLE IF NOT EXISTS public.crm_reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    report_title text NOT NULL,
    report_type text NOT NULL,
    department text NOT NULL,
    date_range_start date,
    date_range_end date,
    summary text,
    key_findings text,
    recommendations text,
    distribution text,
    created_by_name text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.high_priority_reports (
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

CREATE TABLE IF NOT EXISTS public.report_configurations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    report_type text NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.report_downloads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    report_type text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.report_exports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    report_type text NOT NULL,
    export_format text NOT NULL,
    date_range text NOT NULL,
    exported_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.report_read_status (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    report_id uuid,
    is_read boolean DEFAULT false,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.report_shares (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    report_type text NOT NULL,
    recipients text[] NOT NULL,
    recipient_ids uuid[],
    share_method text NOT NULL,
    message text,
    shared_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.ceo_dashboard_data (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company text NOT NULL,
    module text NOT NULL,
    data_type text NOT NULL,
    data jsonb,
    source_id text,
    source_module text,
    source_user text,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventory_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name text NOT NULL,
    section text NOT NULL,
    quantity integer NOT NULL,
    unit_cost numeric(10,2) NOT NULL,
    total_cost numeric(10,2) NOT NULL,
    supplier_details text,
    procurement_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    urgency text DEFAULT 'medium'::text,
    status text DEFAULT 'pending'::text,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    assigned_to text,
    due_date date NOT NULL,
    reminder_time time without time zone,
    status text NOT NULL,
    priority text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.requisitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    department text NOT NULL,
    requisition_type text NOT NULL,
    requester_name text NOT NULL,
    urgency_level text NOT NULL,
    justification text NOT NULL,
    repairs text,
    tools_machinery text,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.operations_form (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id uuid,
    training_schedule timestamp with time zone,
    next_meeting_date timestamp with time zone,
    shared_equipment text,
    collective_resources text,
    status text DEFAULT 'scheduled'::text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PHASE 13: Add Foreign Key Constraints
-- ========================================

-- Add FK for milk_reception_quality_metrics
ALTER TABLE public.milk_reception_quality_metrics
ADD CONSTRAINT fk_reception_id 
FOREIGN KEY (reception_id) 
REFERENCES public.milk_reception(id) 
ON DELETE CASCADE;

-- ========================================
-- PHASE 14: Create Indexes
-- ========================================

-- Date-based indexes
CREATE INDEX IF NOT EXISTS idx_coffee_sales_created_at ON public.coffee_sales(created_at);
CREATE INDEX IF NOT EXISTS idx_milk_production_date ON public.milk_production(date);
CREATE INDEX IF NOT EXISTS idx_kashari_milk_production_date ON public.kashari_milk_production(date);
CREATE INDEX IF NOT EXISTS idx_milk_reception_created_at ON public.milk_reception(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_orders_order_date ON public.sales_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_bills_expenses_bill_date ON public.bills_expenses(bill_date);
CREATE INDEX IF NOT EXISTS idx_loans_start_date ON public.loans(start_date);

-- Status/Type indexes
CREATE INDEX IF NOT EXISTS idx_coffee_stock_status ON public.coffee_stock(status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_payment_status ON public.sales_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_bills_expenses_status ON public.bills_expenses(status);
CREATE INDEX IF NOT EXISTS idx_loans_status ON public.loans(status);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- Location-based indexes
CREATE INDEX IF NOT EXISTS idx_coffee_stock_location ON public.coffee_stock(location);
CREATE INDEX IF NOT EXISTS idx_coffee_stock_manager ON public.coffee_stock(manager);

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_association_members_association_id ON public.association_members(association_id);
CREATE INDEX IF NOT EXISTS idx_cattle_health_records_cattle_id ON public.cattle_health_records(cattle_id);

-- Batch/ID lookup indexes
CREATE INDEX IF NOT EXISTS idx_milk_reception_batch_id ON public.milk_reception(batch_id);
CREATE INDEX IF NOT EXISTS idx_production_batches_batch_number ON public.production_batches(batch_number);