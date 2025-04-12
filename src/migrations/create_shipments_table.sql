
-- Create the shipments table
CREATE TABLE public.shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id TEXT NOT NULL,
    status TEXT NOT NULL,
    container TEXT NOT NULL,
    volume TEXT,
    departure_date DATE NOT NULL,
    eta DATE NOT NULL,
    destination TEXT,
    vessel TEXT,
    route TEXT,
    client TEXT,
    special_instructions TEXT,
    last_update DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies to temporarily allow all operations without authentication
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.shipments
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON public.shipments
    FOR SELECT TO anon
    USING (true);

CREATE POLICY "Allow anonymous update" ON public.shipments
    FOR UPDATE TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous delete" ON public.shipments
    FOR DELETE TO anon
    USING (true);
