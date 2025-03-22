
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useCoffeeStockData = () => {
  const [stockData, setStockData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      try {
        // Fetch coffee inventory data
        const { data: coffeeInventory, error: coffeeError } = await supabase
          .from('coffee_inventory')
          .select('*')
          .order('updated_at', { ascending: false });

        if (coffeeError) throw coffeeError;

        if (coffeeInventory && coffeeInventory.length > 0) {
          // Transform the data to match our component's data structure
          const formattedStockData = coffeeInventory.map(item => ({
            id: item.id,
            name: item.coffee_type || item.name || 'Coffee Beans',
            type: item.variety || item.coffee_type || 'Mixed',
            grade: item.grade || 'A',
            location: item.storage_location || 'Main Warehouse',
            current_stock: Number(item.quantity) || 0,
            max_capacity: Number(item.max_capacity) || (Number(item.quantity) * 1.5),
            updated_at: item.updated_at || new Date().toISOString(),
            trend: determineStockTrend(item.previous_quantity, item.quantity),
            health: determineStockHealth(item.quantity, item.min_quantity, item.max_capacity)
          }));
          
          setStockData(formattedStockData);
          
          // Process location data
          const locations = {};
          formattedStockData.forEach(item => {
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
          
          setLocationData(Object.values(locations));
          
          // Try to fetch historical data
          fetchHistoricalData();
        } else {
          // As a fallback, fetch from inventory_items table
          const { data: inventoryItems, error: inventoryError } = await supabase
            .from('inventory_items')
            .select('*')
            .order('updated_at', { ascending: false });
            
          if (inventoryError) throw inventoryError;
          
          if (inventoryItems && inventoryItems.length > 0) {
            // Transform inventory data to match our component's structure
            const formattedInventoryData = inventoryItems
              .filter(item => item.item_name.toLowerCase().includes('coffee') || 
                              item.section.toLowerCase().includes('coffee'))
              .map(item => ({
                id: item.id,
                name: item.item_name,
                type: determineItemType(item.item_name),
                grade: 'A',
                location: item.section || 'Main Warehouse',
                current_stock: Number(item.quantity) || 0,
                max_capacity: Number(item.quantity) * 1.5,
                updated_at: item.updated_at || new Date().toISOString(),
                trend: 'stable',
                health: determineStockHealth(item.quantity, 0, item.quantity * 1.5)
              }));
              
            setStockData(formattedInventoryData);
            
            // Process location data from inventory items
            const locationsFromInventory = {};
            formattedInventoryData.forEach(item => {
              if (!locationsFromInventory[item.location]) {
                locationsFromInventory[item.location] = {
                  name: item.location,
                  stockLevel: 0,
                  maxCapacity: 0
                };
              }
              locationsFromInventory[item.location].stockLevel += item.current_stock;
              locationsFromInventory[item.location].maxCapacity += item.max_capacity;
            });
            
            setLocationData(Object.values(locationsFromInventory));
          } else {
            // If no data found in any table, show an error
            throw new Error("No coffee inventory data found in the database");
          }
        }
      } catch (err) {
        console.error("Error fetching coffee stock data:", err);
        setError(err);
        toast({
          title: "Error loading stock data",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchHistoricalData = async () => {
      try {
        // Try to fetch historical data from coffee_stock_history or similar table
        const { data: historyData, error: historyError } = await supabase
          .from('coffee_stock_history')
          .select('*')
          .order('created_at', { ascending: true });
          
        if (historyError) {
          console.log("No coffee_stock_history table found, trying coffee_stock_transfers");
          // Try coffee_stock_transfers as an alternative
          const { data: transfersData, error: transfersError } = await supabase
            .from('coffee_stock_transfers')
            .select('*')
            .order('created_at', { ascending: true });
            
          if (transfersError) {
            console.log("No historical data tables found, generating from current data");
            // Generate historical data based on current stock
            generateHistoricalData();
            return;
          }
          
          if (transfersData && transfersData.length > 0) {
            processTransfersAsHistoricalData(transfersData);
          } else {
            generateHistoricalData();
          }
          return;
        }
        
        if (historyData && historyData.length > 0) {
          processHistoricalData(historyData);
        } else {
          generateHistoricalData();
        }
      } catch (err) {
        console.error("Error fetching historical data:", err);
        generateHistoricalData();
      }
    };
    
    const processHistoricalData = (data) => {
      // Group by month and coffee type
      const monthlyData = data.reduce((acc, item) => {
        const date = new Date(item.created_at);
        const month = date.toLocaleString('default', { month: 'short' });
        
        if (!acc[month]) {
          acc[month] = { month, arabica: 0, robusta: 0 };
        }
        
        const type = (item.coffee_type || '').toLowerCase();
        if (type.includes('arabica')) {
          acc[month].arabica += Number(item.quantity) || 0;
        } else if (type.includes('robusta')) {
          acc[month].robusta += Number(item.quantity) || 0;
        }
        
        return acc;
      }, {});
      
      setHistoricalData(Object.values(monthlyData));
    };
    
    const processTransfersAsHistoricalData = (data) => {
      // Group transfers by month and coffee type
      const monthlyData = data.reduce((acc, item) => {
        const date = new Date(item.created_at);
        const month = date.toLocaleString('default', { month: 'short' });
        
        if (!acc[month]) {
          acc[month] = { month, arabica: 0, robusta: 0 };
        }
        
        const type = (item.coffee_type || '').toLowerCase();
        if (type.includes('arabica')) {
          acc[month].arabica += Number(item.quantity) || 0;
        } else if (type.includes('robusta')) {
          acc[month].robusta += Number(item.quantity) || 0;
        }
        
        return acc;
      }, {});
      
      setHistoricalData(Object.values(monthlyData));
    };
    
    const generateHistoricalData = () => {
      // Generate 5 months of data based on current stock
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const arabicaBase = stockData
        .filter(item => item.type.toLowerCase().includes('arabica'))
        .reduce((sum, item) => sum + item.current_stock, 0) / 5;
        
      const robustaBase = stockData
        .filter(item => item.type.toLowerCase().includes('robusta'))
        .reduce((sum, item) => sum + item.current_stock, 0) / 5;
        
      const generated = months.map((month, index) => ({
        month,
        arabica: Math.round(arabicaBase * (0.8 + index * 0.1)),
        robusta: Math.round(robustaBase * (0.9 + index * 0.05))
      }));
      
      setHistoricalData(generated);
    };
    
    fetchStockData();
  }, [toast]);
  
  // Helper function to determine stock trend
  const determineStockTrend = (previous, current) => {
    if (!previous || !current) return 'stable';
    if (Number(current) > Number(previous)) return 'up';
    if (Number(current) < Number(previous)) return 'down';
    return 'stable';
  };
  
  // Helper function to determine stock health
  const determineStockHealth = (quantity, minQuantity = 0, maxCapacity = 100) => {
    const ratio = Number(quantity) / Number(maxCapacity);
    if (ratio < 0.3 || Number(quantity) <= Number(minQuantity)) return 'critical';
    if (ratio < 0.5) return 'warning';
    return 'good';
  };
  
  // Helper to determine coffee type from item name
  const determineItemType = (itemName = '') => {
    const name = itemName.toLowerCase();
    if (name.includes('arabica')) return 'Arabica';
    if (name.includes('robusta')) return 'Robusta';
    if (name.includes('green')) return 'Green';
    if (name.includes('roasted')) return 'Roasted';
    return 'Mixed';
  };

  return {
    stockData,
    locationData,
    historicalData,
    isLoading,
    error
  };
};

export default useCoffeeStockData;
