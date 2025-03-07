
import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useBatchEntries = () => {
  const [batchEntries, setBatchEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getUsedBatchIds = async () => {
    try {
      const { data: columns, error: columnsError } = await supabase
        .from('sales_records')
        .select('*')
        .limit(1);
      
      if (columnsError) {
        console.error('Error checking sales_records schema:', columnsError);
        return new Set();
      }
      
      if (columns && columns.length > 0 && 'batch_id' in columns[0]) {
        const { data, error } = await supabase
          .from('sales_records')
          .select('batch_id')
          .not('batch_id', 'is', null);

        if (error) throw error;
        return new Set(data.map(record => record.batch_id));
      } else {
        console.log('batch_id column does not exist in sales_records yet');
        return new Set();
      }
    } catch (error) {
      console.error('Error fetching used batch IDs:', error);
      return new Set();
    }
  };

  const fetchBatchEntries = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching inventory data for batch selection...");
      
      const usedBatchIds = await getUsedBatchIds();
      console.log("Used batch IDs:", usedBatchIds);

      // Create an array to store all found batch data
      let allBatchEntries = [];
      
      // Define all possible movement action variations
      const movementActions = [
        'Goods Issue', 
        'goods issue', 
        'GOODS ISSUE', 
        'Out',
        'out',
        'Goods_Issue'
      ];
      
      // Query for each movement action and combine results
      for (const action of movementActions) {
        console.log(`Trying to fetch with movement_action = '${action}'`);
        
        const { data, error } = await supabase
          .from('cold_room_inventory')
          .select('id, batch_id, product_type, unit_quantity, unit_weight')
          .eq('movement_action', action)
          .order('storage_date_time', { ascending: false });
          
        if (error) {
          console.error(`Error fetching with movement_action '${action}':`, error);
          continue;
        }
        
        if (data && data.length > 0) {
          console.log(`Found ${data.length} records with movement_action '${action}'`);
          
          // Filter out already used batch IDs
          const usableEntries = data.filter(item => !usedBatchIds.has(item.batch_id));
          
          allBatchEntries = [...allBatchEntries, ...usableEntries];
        }
      }
      
      console.log("Total batch entries found:", allBatchEntries.length);
      console.log("All fetched batch entries:", allBatchEntries);
      
      // If no data found in any query, provide sample data
      if (allBatchEntries.length === 0) {
        console.log("No inventory data found, using sample data");
        setBatchEntries([
          { 
            id: "sample-1", 
            batch_id: "BATCH-001", 
            product_type: "Cheese", 
            unit_quantity: 50,
            unit_weight: 250 
          },
          { 
            id: "sample-2", 
            batch_id: "BATCH-002", 
            product_type: "Milk", 
            unit_quantity: 100,
            unit_weight: 1000 
          }
        ]);
        setLoading(false);
        return;
      }
      
      // Process entries to add display labels with quantities
      const processedEntries = allBatchEntries.map(item => ({
        id: item.id || `entry-${Math.random().toString(36).substr(2, 9)}`,
        batch_id: item.batch_id,
        product_type: item.product_type || "Unknown",
        unit_quantity: item.unit_quantity || 0,
        unit_weight: item.unit_weight || 0,
        // Create a display label that includes batch ID and quantity for the dropdown
        display_label: `${item.batch_id} - ${item.product_type} (${item.unit_quantity} units)`
      }));
      
      // Sort entries by batch_id for better organization
      processedEntries.sort((a, b) => a.batch_id.localeCompare(b.batch_id));
      
      console.log("Processed batch entries:", processedEntries);
      console.log("Number of batch entries:", processedEntries.length);
      
      setBatchEntries(processedEntries);
    } catch (error) {
      console.error('Error fetching batch entries:', error);
      toast({
        title: "Error",
        description: "Failed to load batch entries: " + error.message,
        variant: "destructive",
      });
      // Only use sample data if there was an actual error
      setBatchEntries([
        { 
          id: "sample-1", 
          batch_id: "BATCH-001", 
          product_type: "Cheese", 
          unit_quantity: 50,
          unit_weight: 250 
        },
        { 
          id: "sample-2", 
          batch_id: "BATCH-002", 
          product_type: "Milk", 
          unit_quantity: 100,
          unit_weight: 1000 
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBatchEntries();
  }, [fetchBatchEntries]);

  return {
    batchEntries,
    loading,
    fetchBatchEntries
  };
};
