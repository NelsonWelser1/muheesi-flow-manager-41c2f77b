
-- Check if marketing_campaigns table exists and drop it
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'marketing_campaigns'
    ) THEN
        DROP TABLE public.marketing_campaigns CASCADE;
    END IF;
END $$;

-- Check if campaign_metrics table exists and drop it
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'campaign_metrics'
    ) THEN
        DROP TABLE public.campaign_metrics CASCADE;
    END IF;
END $$;

-- Only try to drop policies for tables that exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'marketing_campaigns' 
        AND policyname = 'Enable read access for authenticated users'
    ) THEN
        DROP POLICY "Enable read access for authenticated users" ON marketing_campaigns;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'marketing_campaigns' 
        AND policyname = 'Enable insert access for authenticated users'
    ) THEN
        DROP POLICY "Enable insert access for authenticated users" ON marketing_campaigns;
    END IF;
END $$;

-- Check if sequences exist before dropping
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.sequences 
        WHERE sequence_schema = 'public' 
        AND sequence_name = 'campaign_id_seq'
    ) THEN
        DROP SEQUENCE campaign_id_seq;
    END IF;
END $$;
