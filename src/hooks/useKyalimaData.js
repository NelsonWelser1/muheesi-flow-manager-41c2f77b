import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useKyalimaData = () => {
  const [farmMetrics, setFarmMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchFarmMetrics = async () => {
    setIsLoading(true);
    try {
      // Fetch all cattle for Kyalima farm with type breakdown
      const { data: allCattle, error: cattleError } = await supabase
        .from('cattle_inventory')
        .select('*')
        .eq('farm_id', 'kyalima');

      if (cattleError) throw cattleError;

      // Calculate cattle breakdown by type
      const cattleBreakdown = allCattle?.reduce((acc, cattle) => {
        const type = cattle.type?.toLowerCase() || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      // Get fattening program data
      const { data: fatteningData, error: fatteningError } = await supabase
        .from('cattle_fattening')
        .select('*')
        .eq('farm_id', 'kyalima')
        .eq('status', 'active');

      if (fatteningError) throw fatteningError;

      // Get milk production from kashari_milk_production table (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: milkData, error: milkError } = await supabase
        .from('kashari_milk_production')
        .select('volume, date')
        .eq('location', 'Kyalima')
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (milkError) throw milkError;

      // Get financial data - Revenue from sales_orders
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      
      const { data: salesData, error: salesError } = await supabase
        .from('sales_orders')
        .select('total_amount, payment_status')
        .gte('order_date', startOfMonth.toISOString().split('T')[0]);

      if (salesError) throw salesError;

      // Get expenses from transactions
      const { data: expensesData, error: expensesError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'expense')
        .gte('date', startOfMonth.toISOString().split('T')[0]);

      if (expensesError) throw expensesError;

      // Get staff count
      const { data: staffData, error: staffError } = await supabase
        .from('farm_staff')
        .select('id')
        .eq('farm_id', 'kyalima')
        .eq('status', 'active');

      if (staffError) throw staffError;

      // Get grain/feed inventory from inventory_items
      const { data: feedInventory, error: feedError } = await supabase
        .from('inventory_items')
        .select('*')
        .or('product_name.ilike.%maize%,product_name.ilike.%soybean%,product_name.ilike.%hay%,product_name.ilike.%silage%,product_name.ilike.%grain%');

      if (feedError) console.error('Feed inventory error:', feedError);

      // Calculate grain inventory totals
      const grainTotals = feedInventory?.reduce((acc, item) => {
        const name = item.product_name?.toLowerCase() || '';
        const qty = Number(item.quantity || 0);
        
        if (name.includes('maize') && !name.includes('silage')) {
          acc.maize += qty;
        } else if (name.includes('soybean')) {
          acc.soybean += qty;
        } else if (name.includes('hay')) {
          acc.hay += qty;
        } else if (name.includes('silage')) {
          acc.silage += qty;
        }
        return acc;
      }, { maize: 0, soybean: 0, hay: 0, silage: 0 }) || { maize: 0, soybean: 0, hay: 0, silage: 0 };

      // Calculate metrics
      const totalCattle = allCattle?.length || 0;
      const activeFattening = fatteningData?.length || 0;
      
      const avgDailyMilk = milkData?.length > 0
        ? milkData.reduce((sum, day) => sum + Number(day.volume || 0), 0) / milkData.length
        : 0;

      const monthlyRevenue = salesData
        ?.filter(s => s.payment_status === 'Paid')
        ?.reduce((sum, s) => sum + Number(s.total_amount || 0), 0) || 0;

      const monthlyExpenses = expensesData
        ?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0;

      // Count milking cows (mother cows)
      const milkingCows = cattleBreakdown?.['mother cow'] || cattleBreakdown?.['cow'] || 0;

      // Set consolidated metrics
      setFarmMetrics({
        totalCattle,
        milkProduction: `${avgDailyMilk.toFixed(0)} liters/day`,
        avgDailyMilk,
        milkingCows,
        activeFattening,
        cattleBreakdown: {
          motherCows: cattleBreakdown?.['mother cow'] || cattleBreakdown?.['cow'] || 0,
          heifers: cattleBreakdown?.['heifer'] || 0,
          bulls: cattleBreakdown?.['bull'] || 0,
          femaleCalves: cattleBreakdown?.['female calf'] || cattleBreakdown?.['calf'] || 0,
          maleCalves: cattleBreakdown?.['male calf'] || 0,
        },
        financial: {
          monthlyRevenue: monthlyRevenue.toFixed(0),
          monthlyExpenses: monthlyExpenses.toFixed(0),
          totalLoans: 150000000, // This would need a separate loans table
          loanRepayment: 35 // This would be calculated from loan repayment data
        },
        grainInventory: grainTotals,
        staffCount: staffData?.length || 0,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error fetching Kyalima data:', err);
      setError(err);
      toast({
        title: "Error Loading Data",
        description: "Failed to load farm metrics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmMetrics();
    
    // Set up real-time subscriptions for live updates
    const cattleSubscription = supabase
      .channel('kyalima-cattle-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'cattle_inventory',
        filter: 'farm_id=eq.kyalima'
      }, () => {
        fetchFarmMetrics();
      })
      .subscribe();
      
    const milkSubscription = supabase
      .channel('kyalima-milk-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'kashari_milk_production',
        filter: 'location=eq.Kyalima'
      }, () => {
        fetchFarmMetrics();
      })
      .subscribe();

    const fatteningSubscription = supabase
      .channel('kyalima-fattening-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'cattle_fattening',
        filter: 'farm_id=eq.kyalima'
      }, () => {
        fetchFarmMetrics();
      })
      .subscribe();

    const inventorySubscription = supabase
      .channel('kyalima-inventory-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'inventory_items'
      }, () => {
        fetchFarmMetrics();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(cattleSubscription);
      supabase.removeChannel(milkSubscription);
      supabase.removeChannel(fatteningSubscription);
      supabase.removeChannel(inventorySubscription);
    };
  }, []);

  return {
    farmMetrics,
    isLoading,
    error,
    refreshMetrics: fetchFarmMetrics
  };
};
