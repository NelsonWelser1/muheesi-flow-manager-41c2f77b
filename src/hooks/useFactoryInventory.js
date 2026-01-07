import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useFactoryInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [productionLines, setProductionLines] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    productionOutput: 0,
    utilization: 0,
    expiringSoon: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch dairy production data
      const { data: productionData, error: prodError } = await supabase
        .from('dairy_production')
        .select('*')
        .order('production_date', { ascending: false });
      
      if (prodError) throw prodError;

      // Fetch cold room inventory for stock levels
      const { data: coldRoomData, error: coldError } = await supabase
        .from('cold_room_inventory')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (coldError) throw coldError;

      // Aggregate inventory by product type
      const inventoryByType = {};
      (coldRoomData || []).forEach(item => {
        const type = item.product_type || 'Other';
        if (!inventoryByType[type]) {
          inventoryByType[type] = 0;
        }
        inventoryByType[type] += item.unit_quantity || 0;
      });

      const inventoryArray = Object.entries(inventoryByType).map(([name, value]) => ({
        name,
        value
      }));

      // Calculate stats
      const totalProducts = inventoryArray.reduce((sum, item) => sum + item.value, 0);
      const todayProduction = (productionData || [])
        .filter(p => new Date(p.production_date).toDateString() === new Date().toDateString())
        .reduce((sum, p) => sum + (p.quantity || 0), 0);

      // Generate alerts based on inventory levels
      const generatedAlerts = [];
      inventoryArray.forEach(item => {
        if (item.value < 50) {
          generatedAlerts.push({
            id: `low-${item.name}`,
            message: `Low stock alert: ${item.name}`,
            severity: item.value < 20 ? 'critical' : 'warning'
          });
        }
      });

      // Mock production lines from cold room data
      const lines = [
        { id: 1, name: 'Line A', product: 'Cheese', quantity: inventoryByType['Cheese'] || 0, manager: 'Production Team A' },
        { id: 2, name: 'Line B', product: 'Yogurt', quantity: inventoryByType['Yogurt'] || 0, manager: 'Production Team B' },
        { id: 3, name: 'Line C', product: 'Milk', quantity: inventoryByType['Milk'] || 0, manager: 'Production Team C' }
      ];

      setInventory(inventoryArray.length > 0 ? inventoryArray : [
        { name: 'Cheese', value: 120 },
        { name: 'Yogurt', value: 80 },
        { name: 'Processed Milk', value: 200 }
      ]);
      setProductionLines(lines);
      setAlerts(generatedAlerts.length > 0 ? generatedAlerts : [
        { id: 1, message: 'System initialized', severity: 'info' }
      ]);
      setStats({
        totalProducts: totalProducts || 400,
        productionOutput: todayProduction || 80,
        utilization: totalProducts > 0 ? Math.min(Math.round((todayProduction / totalProducts) * 100), 100) : 75,
        expiringSoon: Math.round(totalProducts * 0.05) || 20
      });

    } catch (err) {
      console.error('Error fetching factory inventory:', err);
      setError(err.message);
      toast({
        title: "Error fetching inventory",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    inventory,
    productionLines,
    alerts,
    stats,
    loading,
    error,
    refetch: fetchInventory
  };
};
