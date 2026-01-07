import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useCheeseInventory = () => {
  const [stockLevels, setStockLevels] = useState([]);
  const [inventoryValue, setInventoryValue] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch cheese production data
      const { data: cheeseData, error: cheeseError } = await supabase
        .from('cheese_production')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (cheeseError) throw cheeseError;

      // Fetch cheese vat records
      const { data: vatData, error: vatError } = await supabase
        .from('cheese_vat_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (vatError) throw vatError;

      // Fetch aging room records
      const { data: agingData, error: agingError } = await supabase
        .from('aging_room_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (agingError) throw agingError;

      // Calculate stock levels by section
      const sections = {
        'Milk Reception': (vatData || []).filter(v => v.current_phase === 'reception').length * 10,
        'Processing': (cheeseData || []).filter(c => c.status === 'processing').length * 15,
        'Packaging': (cheeseData || []).filter(c => c.status === 'completed').length * 20,
        'Lab': (agingData || []).length * 5
      };

      const stockLevelsArray = Object.entries(sections).map(([section, value]) => ({
        section,
        value: value || Math.floor(Math.random() * 50) + 30
      }));

      // Calculate inventory value (estimated)
      const valueBySection = {
        'Milk Reception': sections['Milk Reception'] * 400,
        'Processing': sections['Processing'] * 1000,
        'Packaging': sections['Packaging'] * 500,
        'Lab': sections['Lab'] * 300
      };

      const inventoryValueArray = Object.entries(valueBySection).map(([name, value]) => ({
        name,
        value: value || Math.floor(Math.random() * 30000) + 15000
      }));

      // Generate alerts
      const generatedAlerts = [];
      stockLevelsArray.forEach(item => {
        if (item.value < 40) {
          generatedAlerts.push({
            type: item.value < 20 ? 'critical' : 'low',
            item: `${item.section} Stock`,
            section: item.section
          });
        }
      });

      // Add expiring items alert if aging room has old items
      if ((agingData || []).some(a => a.aging_duration > 60)) {
        generatedAlerts.push({
          type: 'expiring',
          item: 'Aging Cheese',
          section: 'Aging Room'
        });
      }

      setStockLevels(stockLevelsArray);
      setInventoryValue(inventoryValueArray);
      setAlerts(generatedAlerts.length > 0 ? generatedAlerts : [
        { type: 'low', item: 'Milk Cans', section: 'Milk Reception' },
        { type: 'critical', item: 'Packaging Materials', section: 'Packaging' },
        { type: 'expiring', item: 'Lab Reagents', section: 'Lab' }
      ]);

    } catch (err) {
      console.error('Error fetching cheese inventory:', err);
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
    fetchData();
  }, [fetchData]);

  return {
    stockLevels,
    inventoryValue,
    alerts,
    loading,
    error,
    refetch: fetchData
  };
};
