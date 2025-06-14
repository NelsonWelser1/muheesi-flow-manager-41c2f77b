
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useColdRoomInventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Function to fetch all inventory items
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cold_room_inventory')
        .select('*')
        .order('storage_date_time', { ascending: false });

      if (error) throw error;
      
      setInventoryItems(data || []);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching cold room inventory:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch inventory data",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Function to get current stock levels by batch ID
  const getStockLevelsByBatch = useCallback(async () => {
    try {
      const inventory = await fetchInventory();
      
      if (!inventory || inventory.length === 0) {
        return {};
      }
      
      // Group by batch_id
      const stockByBatch = {};
      
      inventory.forEach(item => {
        if (!stockByBatch[item.batch_id]) {
          stockByBatch[item.batch_id] = {
            batch_id: item.batch_id,
            production_batch_id: item.production_batch_id,
            product_type: item.product_type,
            product_category: item.product_category,
            cold_room_id: item.cold_room_id,
            unit_weight: item.unit_weight,
            received: 0,
            issued: 0,
            current: 0,
            lastUpdated: null
          };
        }
        
        // Update the stock level based on movement_action
        if (item.movement_action === 'In') {
          stockByBatch[item.batch_id].received += item.unit_quantity;
        } else if (item.movement_action === 'Out') {
          stockByBatch[item.batch_id].issued += item.unit_quantity;
        }
        
        // Update last updated timestamp if newer
        const itemDate = new Date(item.storage_date_time);
        if (!stockByBatch[item.batch_id].lastUpdated || 
            itemDate > new Date(stockByBatch[item.batch_id].lastUpdated)) {
          stockByBatch[item.batch_id].lastUpdated = item.storage_date_time;
        }
      });
      
      // Calculate current stock for each batch
      Object.keys(stockByBatch).forEach(batchId => {
        stockByBatch[batchId].current = 
          stockByBatch[batchId].received - stockByBatch[batchId].issued;
      });
      
      return stockByBatch;
    } catch (err) {
      console.error('Error calculating stock levels:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to calculate stock levels",
        variant: "destructive",
      });
      return {};
    }
  }, [fetchInventory, toast]);

  // Fetch inventory on mount
  useEffect(() => {
    fetchInventory();
    
    // Set up interval for periodic refresh
    const intervalId = setInterval(fetchInventory, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchInventory]);

  return {
    inventoryItems,
    loading,
    error,
    fetchInventory,
    getStockLevelsByBatch
  };
};
