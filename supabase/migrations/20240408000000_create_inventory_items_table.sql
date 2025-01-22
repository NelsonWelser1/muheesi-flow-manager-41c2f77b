-- Create inventory_items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_name TEXT NOT NULL,
    section TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    supplier_details TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'good',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all items
CREATE POLICY "Allow authenticated users to read inventory_items"
    ON public.inventory_items
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy to allow authenticated users to insert their own items
CREATE POLICY "Allow authenticated users to insert inventory_items"
    ON public.inventory_items
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy to allow authenticated users to update their own items
CREATE POLICY "Allow authenticated users to update inventory_items"
    ON public.inventory_items
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create index for faster searches
CREATE INDEX idx_inventory_items_item_name ON public.inventory_items (item_name);
CREATE INDEX idx_inventory_items_section ON public.inventory_items (section);
CREATE INDEX idx_inventory_items_status ON public.inventory_items (status);