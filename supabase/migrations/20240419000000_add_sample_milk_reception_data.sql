-- Insert sample data into milk_reception table
INSERT INTO milk_reception (
    supplier_name,
    milk_volume,
    temperature,
    quality_score,
    fat_percentage,
    protein_percentage,
    total_plate_count,
    acidity,
    notes,
    datetime
) VALUES 
    (
        'Kashari Farm',
        250.5,
        4.2,
        92,
        3.8,
        3.2,
        85000,
        6.7,
        'Good quality milk, passed all tests',
        CURRENT_TIMESTAMP - interval '2 hours'
    ),
    (
        'Mbarara Dairy Cooperative',
        180.0,
        4.0,
        88,
        3.6,
        3.1,
        95000,
        6.8,
        'Acceptable quality, slight variation in fat content',
        CURRENT_TIMESTAMP - interval '4 hours'
    ),
    (
        'Kyamuhunga Farmers',
        320.75,
        4.1,
        95,
        4.0,
        3.4,
        75000,
        6.6,
        'Excellent quality, premium grade milk',
        CURRENT_TIMESTAMP - interval '6 hours'
    ),
    (
        'Bushenyi Dairy Farm',
        150.25,
        4.3,
        87,
        3.5,
        3.0,
        98000,
        6.9,
        'Standard quality, needs improvement in protein content',
        CURRENT_TIMESTAMP - interval '8 hours'
    ),
    (
        'Rwampara Farmers Association',
        275.0,
        4.0,
        90,
        3.7,
        3.3,
        82000,
        6.7,
        'Good quality, consistent supplier',
        CURRENT_TIMESTAMP - interval '10 hours'
    );

-- Add RLS policy for reading sample data
ALTER TABLE milk_reception ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON milk_reception
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON milk_reception
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON milk_reception
    FOR UPDATE
    TO authenticated
    USING (true);