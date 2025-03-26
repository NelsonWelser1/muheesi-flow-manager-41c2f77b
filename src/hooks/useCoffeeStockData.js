import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

// Kazo locations for filtering
const KAZO_LOCATIONS = [
  "Kanoni-Mbogo",
  "Kanoni-Rwakahaya",
  "Engari-Kaichumu",
  "Engari-Kyengando",
  "Migina",
  "Kagarama",
  "Kyampangara",
  "Nkungu",
  "Buremba",
  "Kazo Town council",
  "Burunga",
  "Rwemikoma"
];

export const useCoffeeStockData = (isKazo = false) => {
  const [stockData, setStockData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      try {
        // First attempt to get data from inventory_items
        let query = supabase
          .from('inventory_items')
          .select('*')
          .or('item_name.ilike.%coffee%,section.ilike.%coffee%');
          
        // If isKazo is true, filter by Kazo locations
        if (isKazo) {
          const locationFilters = KAZO_LOCATIONS.map(
            loc => `section.ilike.%${loc}%,location.ilike.%${loc}%`
          ).join(',');
          
          if (locationFilters) {
            query = query.or(locationFilters);
          }
        }
        
        const { data: inventoryData, error: inventoryError } = await query;
        
        if (inventoryError) {
          console.error("Error fetching inventory data:", inventoryError);
          // Continue to try other tables
        }
        
        // Try to get data from coffee_stock_transfers
        let transfersQuery = supabase
          .from('coffee_stock_transfers')
          .select('*')
          .order('created_at', { ascending: false });
          
        // If isKazo is true, filter by Kazo locations
        if (isKazo) {
          const locationFilters = KAZO_LOCATIONS.map(
            loc => `source_location.ilike.%${loc}%,destination_location.ilike.%${loc}%`
          ).join(',');
          
          if (locationFilters) {
            transfersQuery = transfersQuery.or(locationFilters);
          }
        }
        
        const { data: transfersData, error: transfersError } = await transfersQuery;
        
        if (transfersError) {
          console.error("Error fetching transfers data:", transfersError);
          // Continue to try other sources
        }
        
        // If we have data from any source, process it
        const combinedData = [];
        
        // Process inventory data if available
        if (inventoryData && inventoryData.length > 0) {
          const processedInventory = inventoryData.map(item => {
            const stockRatio = item.max_capacity 
              ? Number(item.quantity) / Number(item.max_capacity) 
              : 0.5; // Default ratio if max_capacity not available
            
            return {
              id: item.id,
              name: item.item_name || 'Coffee',
              type: item.item_name?.includes('Arabica') ? 'Arabica' : 
                    item.item_name?.includes('Robusta') ? 'Robusta' : 'Coffee',
              grade: item.quality_grade || 'Standard',
              location: isKazo ? (item.section || 'Kazo Warehouse') : (item.section || 'KAJON Warehouse'),
              current_stock: Number(item.quantity) || 0,
              max_capacity: Number(item.max_capacity) || (Number(item.quantity) * 2), // Estimate max if not provided
              health: stockRatio < 0.3 ? 'critical' : stockRatio < 0.6 ? 'warning' : 'good',
              trend: 'stable', // Default trend
              updated_at: item.updated_at || new Date().toISOString(),
              source: 'inventory'
            };
          });
          
          combinedData.push(...processedInventory);
        }
        
        // Process transfers data if available
        if (transfersData && transfersData.length > 0) {
          const processedTransfers = transfersData.map(item => {
            const location = isKazo ? 
              (KAZO_LOCATIONS.some(loc => item.destination_location?.includes(loc)) 
                ? item.destination_location 
                : item.source_location) 
              : item.destination_location || 'Warehouse';
            
            return {
              id: `transfer-${item.id}`,
              name: item.coffee_type || 'Coffee',
              type: item.coffee_type?.includes('Arabica') ? 'Arabica' : 
                    item.coffee_type?.includes('Robusta') ? 'Robusta' : 'Coffee',
              grade: item.quality_grade || 'Standard',
              location: location,
              current_stock: Number(item.quantity) || 0,
              max_capacity: Number(item.quantity) * 2, // Estimate max capacity
              health: 'good', // Default health for transfers
              trend: item.status === 'completed' ? 'up' : 'stable',
              updated_at: item.created_at || new Date().toISOString(),
              source: 'transfers'
            };
          });
          
          combinedData.push(...processedTransfers);
        }
        
        // If we still don't have data, use mock data
        if (combinedData.length === 0) {
          console.warn("No real data found, using mock data");
          
          // Create mock data appropriate for the context
          const mockData = [
            {
              id: 1,
              name: isKazo ? 'Kazo Arabica AA' : 'KAJON Arabica Premium',
              type: 'Arabica',
              grade: 'AA',
              location: isKazo ? 'Kazo-Kanoni' : 'Kampala Warehouse',
              current_stock: 450,
              max_capacity: 1000,
              health: 'warning',
              trend: 'stable',
              updated_at: new Date().toISOString(),
              source: 'mock'
            },
            {
              id: 2,
              name: isKazo ? 'Kazo Robusta Natural' : 'KAJON Robusta Premium',
              type: 'Robusta',
              grade: 'A',
              location: isKazo ? 'Buremba' : 'JBER Processing',
              current_stock: 300,
              max_capacity: 500,
              health: 'good',
              trend: 'up',
              updated_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
              source: 'mock'
            }
          ];
          
          combinedData.push(...mockData);
        }
        
        // Process location data from stock data
        const locations = {};
        combinedData.forEach(item => {
          if (!locations[item.location]) {
            locations[item.location] = {
              name: item.location,
              stockLevel: 0,
              maxCapacity: 0
            };
          }
          
          locations[item.location].stockLevel += item.current_stock;
          locations[item.location].maxCapacity += item.max_capacity;
        });
        
        // Generate historical data (mock for now - in the future could use real data)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const historicalTrends = months.map((month, index) => {
          const baseArabica = 200 + (index * 50);
          const baseRobusta = 300 + (index * 30);
          
          return {
            month,
            arabica: baseArabica + Math.floor(Math.random() * 100),
            robusta: baseRobusta + Math.floor(Math.random() * 120)
          };
        });
        
        setStockData(combinedData);
        setLocationData(Object.values(locations));
        setHistoricalData(historicalTrends);
      } catch (err) {
        console.error("Error in useCoffeeStockData:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockData();
  }, [isKazo]);
  
  return { stockData, locationData, historicalData, isLoading, error };
};

export default useCoffeeStockData;
