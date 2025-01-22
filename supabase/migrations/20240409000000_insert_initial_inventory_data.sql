-- Insert initial inventory data
INSERT INTO inventory_items (item_name, section, quantity, unit_cost, total_cost, status, notes) VALUES
-- Milk Reception and Initial Processing
('Milk cans', 'Milk Reception and Initial Processing', 3, 500000.00, 1500000.00, 'good', 'Must have at the start'),
('Aluminium buckets', 'Milk Reception and Initial Processing', 2, 100000.00, 200000.00, 'good', 'Must have at the start'),
('Sieving cloths', 'Milk Reception and Initial Processing', 4, 30000.00, 120000.00, 'good', 'Must have at the start'),

-- Processing Section
('Processing vats (Big)', 'Processing Section', 1, 0.00, 0.00, 'need', 'Needed at later stage'),
('Processing vats (Small)', 'Processing Section', 1, 0.00, 0.00, 'need', 'Needed at later stage'),
('Saucepans (Big)', 'Processing Section', 4, 350000.00, 1400000.00, 'good', 'Must have at the start'),
('Saucepans (Medium)', 'Processing Section', 2, 200000.00, 400000.00, 'good', 'Must have at the start'),
('Sauce pans (Small)', 'Processing Section', 3, 50000.00, 150000.00, 'good', 'Must have at the start'),

-- Lab and Quality Control
('Test tubes', 'Lab and Quality Control', 40, 2000.00, 80000.00, 'good', 'Must have at the start'),
('Test tube rack', 'Lab and Quality Control', 2, 5000.00, 10000.00, 'good', 'Must have at the start'),
('Test tube holders', 'Lab and Quality Control', 2, 10000.00, 20000.00, 'good', 'Must have at the start'),
('Milk analyser', 'Lab and Quality Control', 1, 3500000.00, 3500000.00, 'good', 'Must have at the start'),
('Lactometer', 'Lab and Quality Control', 1, 40000.00, 40000.00, 'good', 'Must have at the start'),
('Digital thermometer', 'Lab and Quality Control', 2, 50000.00, 100000.00, 'good', 'Must have at the start'),

-- Packaging Section
('Impulse Sealer', 'Packaging Section', 1, 200000.00, 200000.00, 'good', 'Must have at the start'),
('Vacuum sealer', 'Packaging Section', 1, 15000000.00, 15000000.00, 'need', 'Needed at later stage'),
('Weighing scale', 'Packaging Section', 1, 350000.00, 350000.00, 'good', 'Must have at the start'),
('Labels Mozzarella', 'Packaging Section', 15, 15000.00, 225000.00, 'good', 'Must have at the start'),
('Labels Gouda', 'Packaging Section', 1, 0.00, 0.00, 'need', 'Needed at later stage'),

-- Storage and Refrigeration
('Deep freezers', 'Storage and Refrigeration', 1, 2000000.00, 2000000.00, 'need', 'Needed at later stage'),
('Fridge guards', 'Storage and Refrigeration', 4, 40000.00, 160000.00, 'good', 'Must have at the start'),
('Extension cables', 'Storage and Refrigeration', 4, 35000.00, 140000.00, 'good', 'Must have at the start'),

-- Office and Administration
('Tables', 'Office and Administration', 1, 0.00, 0.00, 'need', 'Needed at later stage'),
('Chairs', 'Office and Administration', 1, 0.00, 0.00, 'need', 'Needed at later stage'),
('Plastic chairs', 'Office and Administration', 4, 25000.00, 100000.00, 'good', 'Must have at the start'),
('Stationery', 'Office and Administration', 1, 200000.00, 200000.00, 'need', 'Needed at later stage'),
('Computers', 'Office and Administration', 1, 1000000.00, 1000000.00, 'need', 'Needed at later stage'),

-- Additives and Ingredients
('Rennet Enzyme', 'Additives and Ingredients', 0.25, 800000.00, 200000.00, 'good', 'Must have at the start'),
('Salt Peter', 'Additives and Ingredients', 1, 0.00, 0.00, 'need', 'Needed at later stage'),
('Potassium', 'Additives and Ingredients', 1, 0.00, 0.00, 'need', 'Needed at later stage'),
('Culture Gouda', 'Additives and Ingredients', 1, 32000.00, 32000.00, 'good', 'Must have at the start'),
('Salt', 'Additives and Ingredients', 20, 2000.00, 40000.00, 'good', 'Must have at the start'),

-- Others (General and Safety)
('First aid kit', 'Others (General and Safety)', 1, 150000.00, 150000.00, 'need', 'Needed at later stage'),
('Uniforms', 'Others (General and Safety)', 1, 25000.00, 25000.00, 'need', 'Needed at later stage'),
('Gumboots', 'Others (General and Safety)', 1, 20000.00, 20000.00, 'need', 'Needed at later stage'),
('Wall clock', 'Others (General and Safety)', 1, 20000.00, 20000.00, 'good', 'Must have at the start');