
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
        // Try to fetch from inventory_items table first, which should exist
        const { data: inventoryItems, error: inventoryError } = await supabase
          .from('inventory_items')
          .select('*')
          .order('updated_at', { ascending: false });
          
        if (inventoryError) throw inventoryError;
        
        if (inventoryItems && inventoryItems.length > 0) {
          // Filter for coffee-related items
          const coffeeItems = inventoryItems.filter(item => 
            item.item_name?.toLowerCase().includes('coffee') || 
            item.section?.toLowerCase().includes('coffee')
          );
            
          if (coffeeItems.length > 0) {
            // Transform inventory data to match our component's structure
            const formattedInventoryData = coffeeItems.map(item => ({
              id: item.id,
              name: item.item_name || 'Coffee Beans',
              type: determineItemType(item.item_name),
              grade: item.grade || 'A',
              location: item.section || 'Main Warehouse',
              current_stock: Number(item.quantity) || 0,
              max_capacity: Number(item.max_capacity) || Number(item.quantity) * 1.5,
              updated_at: item.updated_at || new Date().toISOString(),
              trend: item.previous_quantity ? determineStockTrend(item.previous_quantity, item.quantity) : 'stable',
              health: determineStockHealth(item.quantity, item.min_quantity || 0, item.max_capacity || item.quantity * 1.5)
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
            
            // Try to fetch historical data or generate it
            await fetchHistoricalData();
          } else {
            // Try the company_stocks table for coffee data
            await fetchFromCompanyStocks();
          }
        } else {
          // Try the company_stocks table
          await fetchFromCompanyStocks();
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
    
    const fetchFromCompanyStocks = async () => {
      try {
        const { data: companyStocks, error: stocksError } = await supabase
          .from('company_stocks')
          .select('*')
          .ilike('company', '%KAJON%')
          .order('updated_at', { ascending: false });
        
        if (stocksError) throw stocksError;
        
        if (companyStocks && companyStocks.length > 0) {
          // Transform company_stocks data to match our component's structure
          const formattedStocksData = companyStocks.map(item => ({
            id: item.id,
            name: item.product || 'Coffee Beans',
            type: determineItemType(item.product),
            grade: determineGradeFromProduct(item.product) || 'A',
            location: 'KAJON Warehouse',
            current_stock: Number(item.quantity) || 0,
            max_capacity: Number(item.quantity) * 1.5,
            updated_at: item.updated_at || new Date().toISOString(),
            trend: 'stable',
            health: determineStockHealth(item.quantity, 0, item.quantity * 1.5)
          }));
          
          setStockData(formattedStocksData);
          
          // Process location data
          const locations = {
            'KAJON Warehouse': {
              name: 'KAJON Warehouse',
              stockLevel: formattedStocksData.reduce((sum, item) => sum + item.current_stock, 0),
              maxCapacity: formattedStocksData.reduce((sum, item) => sum + item.max_capacity, 0)
            }
          };
          
          setLocationData(Object.values(locations));
          
          // Generate historical data based on current stock
          generateHistoricalData(formattedStocksData);
        } else {
          // If still no data, generate mock data as a fallback
          generateFallbackData();
        }
      } catch (err) {
        console.error("Error fetching from company_stocks:", err);
        // Generate fallback data in case of error
        generateFallbackData();
      }
    };
    
    const fetchHistoricalData = async () => {
      try {
        // Try to fetch from coffee_stock_transfers if it exists
        const { data: transfersData, error: transfersError } = await supabase
          .from('coffee_stock_transfers')
          .select('*')
          .order('created_at', { ascending: true });
          
        if (transfersError) {
          console.log("No coffee_stock_transfers table found, generating historical data");
          generateHistoricalData(stockData);
          return;
        }
        
        if (transfersData && transfersData.length > 0) {
          processTransfersAsHistoricalData(transfersData);
        } else {
          generateHistoricalData(stockData);
        }
      } catch (err) {
        console.error("Error fetching historical data:", err);
        generateHistoricalData(stockData);
      }
    };
    
    const processTransfersAsHistoricalData = (data) => {
      // Group transfers by month and coffee type
      const monthlyData = data.reduce((acc, item) => {
        const date = new Date(item.created_at || item.transfer_date || new Date());
        const month = date.toLocaleString('default', { month: 'short' });
        
        if (!acc[month]) {
          acc[month] = { month, arabica: 0, robusta: 0 };
        }
        
        const coffeeType = (item.coffee_type || item.product_type || '').toLowerCase();
        if (coffeeType.includes('arabica')) {
          acc[month].arabica += Number(item.quantity) || 0;
        } else if (coffeeType.includes('robusta')) {
          acc[month].robusta += Number(item.quantity) || 0;
        }
        
        return acc;
      }, {});
      
      setHistoricalData(Object.values(monthlyData));
    };
    
    const generateHistoricalData = (stockItems) => {
      // Generate 5 months of data based on current stock
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const arabicaItems = stockItems.filter(item => 
        (item.type || '').toLowerCase().includes('arabica')
      );
      const robustaItems = stockItems.filter(item => 
        (item.type || '').toLowerCase().includes('robusta')
      );
        
      const arabicaBase = arabicaItems.length > 0 
        ? arabicaItems.reduce((sum, item) => sum + item.current_stock, 0) / 5
        : 100;
        
      const robustaBase = robustaItems.length > 0
        ? robustaItems.reduce((sum, item) => sum + item.current_stock, 0) / 5
        : 150;
        
      const generated = months.map((month, index) => ({
        month,
        arabica: Math.round(arabicaBase * (0.8 + index * 0.1)),
        robusta: Math.round(robustaBase * (0.9 + index * 0.05))
      }));
      
      setHistoricalData(generated);
    };
    
    const generateFallbackData = () => {
      // Generate basic fallback data if no real data exists
      const mockStockData = [
        {
          id: 1,
          name: 'Arabica Coffee: Bugisu AA',
          type: 'Arabica',
          grade: 'AA',
          location: 'Kampala Store',
          current_stock: 450,
          max_capacity: 600,
          updated_at: new Date().toISOString(),
          trend: 'up',
          health: 'good'
        },
        {
          id: 2,
          name: 'Robusta Coffee: FAQ',
          type: 'Robusta',
          grade: 'FAQ',
          location: 'Mbarara Warehouse',
          current_stock: 350,
          max_capacity: 800,
          updated_at: new Date().toISOString(),
          trend: 'down',
          health: 'warning'
        },
        {
          id: 3,
          name: 'Arabica Coffee: Parchment',
          type: 'Arabica',
          grade: 'A',
          location: 'Kakyinga Factory',
          current_stock: 150,
          max_capacity: 500,
          updated_at: new Date().toISOString(),
          trend: 'stable',
          health: 'critical'
        }
      ];
      
      setStockData(mockStockData);
      
      // Generate location data
      const locations = {
        'Kampala Store': {
          name: 'Kampala Store',
          stockLevel: 450,
          maxCapacity: 600
        },
        'Mbarara Warehouse': {
          name: 'Mbarara Warehouse',
          stockLevel: 350,
          maxCapacity: 800
        },
        'Kakyinga Factory': {
          name: 'Kakyinga Factory',
          stockLevel: 150,
          maxCapacity: 500
        }
      };
      
      setLocationData(Object.values(locations));
      
      // Generate historical data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const historical = months.map((month, index) => ({
        month,
        arabica: 300 + index * 30,
        robusta: 400 + index * 20
      }));
      
      setHistoricalData(historical);
      
      toast({
        title: "Using fallback data",
        description: "Could not retrieve actual stock data from database. Displaying sample data.",
        variant: "warning",
      });
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
    if (!quantity) return 'critical';
    const ratio = Number(quantity) / Number(maxCapacity);
    if (ratio < 0.3 || Number(quantity) <= Number(minQuantity)) return 'critical';
    if (ratio < 0.5) return 'warning';
    return 'good';
  };
  
  // Helper to determine coffee type from item name
  const determineItemType = (itemName = '') => {
    const name = itemName ? itemName.toLowerCase() : '';
    if (name.includes('arabica')) return 'Arabica';
    if (name.includes('robusta')) return 'Robusta';
    if (name.includes('green')) return 'Green';
    if (name.includes('roasted')) return 'Roasted';
    return 'Mixed';
  };
  
  // Helper to determine grade from product name
  const determineGradeFromProduct = (product = '') => {
    const name = product ? product.toLowerCase() : '';
    if (name.includes('aa')) return 'AA';
    if (name.includes(' a ') || name.includes(': a')) return 'A';
    if (name.includes('pb')) return 'PB';
    if (name.includes('faq')) return 'FAQ';
    if (name.includes('screen 18')) return 'Screen 18';
    if (name.includes('screen 15')) return 'Screen 15';
    if (name.includes('screen 12')) return 'Screen 12';
    return 'A';
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
