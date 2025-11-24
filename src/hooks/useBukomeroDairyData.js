
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useBukomeroDairyData = () => {
  const [farmMetrics, setFarmMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchFarmMetrics = async () => {
    setIsLoading(true);
    try {
      // Fetch all cattle for Bukomero farm with type breakdown
      const { data: allCattle, error: cattleError } = await supabase
        .from('cattle_inventory')
        .select('*')
        .eq('farm_id', 'bukomero');

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
        .eq('farm_id', 'bukomero')
        .eq('status', 'active');

      if (fatteningError) throw fatteningError;

      // Get milk production from dairy_production table (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: milkData, error: milkError } = await supabase
        .from('dairy_production')
        .select('quantity, production_date')
        .gte('production_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('production_date', { ascending: false });

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
        .eq('farm_id', 'bukomero')
        .eq('status', 'active');

      if (staffError) throw staffError;

      // Get feed/silage inventory from inventory_items
      const { data: feedInventory, error: feedError } = await supabase
        .from('inventory_items')
        .select('*')
        .or('category.eq.Feed,category.eq.Silage,product_name.ilike.%hay%,product_name.ilike.%silage%,product_name.ilike.%concentrate%,product_name.ilike.%forage%');

      if (feedError) console.error('Feed inventory error:', feedError);

      // Calculate feed inventory totals
      const feedTotals = feedInventory?.reduce((acc, item) => {
        const name = item.product_name?.toLowerCase() || '';
        const qty = Number(item.quantity || 0);
        
        if (name.includes('hay') || name.includes('forage')) {
          acc.hay += qty;
        } else if (name.includes('silage')) {
          acc.silage += qty;
        } else if (name.includes('concentrate') || name.includes('feed')) {
          acc.concentrates += qty;
        }
        acc.totalItems++;
        return acc;
      }, { hay: 0, silage: 0, concentrates: 0, totalItems: 0 }) || { hay: 0, silage: 0, concentrates: 0, totalItems: 0 };

      // Estimate days of feed remaining (rough calculation)
      const totalFeedWeight = feedTotals.hay * 20 + feedTotals.silage * 1000 + feedTotals.concentrates;
      const avgDailyConsumption = Math.max(1, totalCattle * 15); // ~15kg per cattle per day
      const daysRemaining = totalFeedWeight > 0 ? Math.round(totalFeedWeight / avgDailyConsumption) : 0;

      // Calculate metrics
      const totalCattle = allCattle?.length || 0;
      const activeFattening = fatteningData?.length || 0;
      
      const avgDailyMilk = milkData?.length > 0
        ? milkData.reduce((sum, day) => sum + Number(day.quantity || 0), 0) / milkData.length
        : 0;

      const monthlyRevenue = salesData
        ?.filter(s => s.payment_status === 'Paid')
        ?.reduce((sum, s) => sum + Number(s.total_amount || 0), 0) || 0;

      const monthlyExpenses = expensesData
        ?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0;

      const livestockSales = salesData
        ?.filter(s => s.product?.toLowerCase().includes('cattle') || s.product?.toLowerCase().includes('bull'))
        ?.reduce((sum, s) => sum + Number(s.total_amount || 0), 0) || 0;

      // Calculate feed efficiency (simplified metric based on milk per cattle ratio)
      const feedEfficiency = totalCattle > 0 ? Math.min(100, (avgDailyMilk / totalCattle) * 10) : 0;

      // Set consolidated metrics
      setFarmMetrics({
        totalCattle,
        milkProduction: `${avgDailyMilk.toFixed(0)} liters/day`,
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
          livestockSales: livestockSales.toFixed(0),
          feedEfficiency: feedEfficiency.toFixed(0)
        },
        feedInventory: {
          ...feedTotals,
          daysRemaining
        },
        staffCount: staffData?.length || 0,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error fetching Bukomero dairy data:', err);
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
      .channel('bukomero-cattle-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'cattle_inventory',
        filter: 'farm_id=eq.bukomero'
      }, () => {
        fetchFarmMetrics();
      })
      .subscribe();
      
    const dairySubscription = supabase
      .channel('bukomero-dairy-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'dairy_production'
      }, () => {
        fetchFarmMetrics();
      })
      .subscribe();

    const fatteningSubscription = supabase
      .channel('bukomero-fattening-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'cattle_fattening',
        filter: 'farm_id=eq.bukomero'
      }, () => {
        fetchFarmMetrics();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(cattleSubscription);
      supabase.removeChannel(dairySubscription);
      supabase.removeChannel(fatteningSubscription);
    };
  }, []);

  return {
    farmMetrics,
    isLoading,
    error,
    refreshMetrics: fetchFarmMetrics
  };
};
