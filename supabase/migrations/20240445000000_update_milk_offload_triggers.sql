-- Drop any existing triggers that might be updating milk_reception
DROP TRIGGER IF EXISTS update_milk_reception_on_offload ON milk_tank_offloads;
DROP FUNCTION IF EXISTS process_milk_tank_offload();

-- Create a new trigger function to handle milk tank offloads
CREATE OR REPLACE FUNCTION process_milk_tank_offload()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a corresponding negative record in milk_reception
    INSERT INTO milk_reception (
        supplier_name,
        milk_volume,
        temperature,
        fat_percentage,
        protein_percentage,
        total_plate_count,
        acidity,
        notes,
        quality_check,
        datetime
    ) VALUES (
        'Offload from ' || NEW.tank_number,
        -NEW.volume_offloaded,  -- Negative value to represent offload
        NEW.temperature,
        0,  -- Default values for unused fields
        0,
        0,
        0,
        'Offloaded to: ' || NEW.destination,
        NEW.quality_check,
        NEW.offload_date
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create milk_reception record on offload
CREATE TRIGGER create_milk_reception_on_offload
    AFTER INSERT ON milk_tank_offloads
    FOR EACH ROW
    EXECUTE FUNCTION process_milk_tank_offload();

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_milk_tank_offloads_created_at 
    ON milk_tank_offloads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_milk_reception_milk_volume 
    ON milk_reception(milk_volume);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION process_milk_tank_offload() TO authenticated;
GRANT EXECUTE ON FUNCTION process_milk_tank_offload() TO service_role;