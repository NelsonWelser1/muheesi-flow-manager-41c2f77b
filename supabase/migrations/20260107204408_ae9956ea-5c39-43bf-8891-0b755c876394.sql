-- Create sourcing_records table for procurement data
CREATE TABLE public.sourcing_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location TEXT NOT NULL,
    coffee_type TEXT NOT NULL,
    moisture_content DECIMAL(5,2),
    procurement_cost DECIMAL(12,2),
    currency TEXT DEFAULT 'UGX',
    screen_grade TEXT,
    quality_rating TEXT,
    source TEXT,
    manager TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create hulling_operations table
CREATE TABLE public.hulling_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id TEXT NOT NULL,
    input_weight DECIMAL(12,2) NOT NULL,
    output_weight DECIMAL(12,2),
    yield_percentage DECIMAL(5,2),
    operator TEXT,
    machine_id TEXT,
    status TEXT DEFAULT 'pending',
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create grading_records table
CREATE TABLE public.grading_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id TEXT NOT NULL,
    hulling_operation_id UUID REFERENCES public.hulling_operations(id),
    screen_18 DECIMAL(5,2),
    screen_15 DECIMAL(5,2),
    screen_12 DECIMAL(5,2),
    below_screen_12 DECIMAL(5,2),
    defect_count INTEGER,
    defect_percentage DECIMAL(5,2),
    final_grade TEXT,
    grader TEXT,
    cupping_score DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.sourcing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hulling_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_records ENABLE ROW LEVEL SECURITY;

-- Create policies for sourcing_records
CREATE POLICY "Allow anonymous select on sourcing_records" ON public.sourcing_records FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert on sourcing_records" ON public.sourcing_records FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on sourcing_records" ON public.sourcing_records FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on sourcing_records" ON public.sourcing_records FOR DELETE TO anon USING (true);

-- Create policies for hulling_operations
CREATE POLICY "Allow anonymous select on hulling_operations" ON public.hulling_operations FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert on hulling_operations" ON public.hulling_operations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on hulling_operations" ON public.hulling_operations FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on hulling_operations" ON public.hulling_operations FOR DELETE TO anon USING (true);

-- Create policies for grading_records
CREATE POLICY "Allow anonymous select on grading_records" ON public.grading_records FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert on grading_records" ON public.grading_records FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on grading_records" ON public.grading_records FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete on grading_records" ON public.grading_records FOR DELETE TO anon USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_sourcing_records_updated_at BEFORE UPDATE ON public.sourcing_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hulling_operations_updated_at BEFORE UPDATE ON public.hulling_operations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_grading_records_updated_at BEFORE UPDATE ON public.grading_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();