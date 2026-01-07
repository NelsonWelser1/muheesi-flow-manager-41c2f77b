import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCoffeeAnalytics = () => {
  // Fetch coffee orders for export analytics
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['coffee-orders-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coffee_orders')
        .select('*')
        .order('order_date', { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch coffee stock for inventory analytics
  const { data: stock, isLoading: stockLoading } = useQuery({
    queryKey: ['coffee-stock-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coffee_stock')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch coffee sales records
  const { data: salesRecords, isLoading: salesLoading } = useQuery({
    queryKey: ['coffee-sales-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coffee_sales_records')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch coffee customers for destination analysis
  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['coffee-customers-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coffee_customers')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Process orders data by month
  const getMonthlyOverview = () => {
    if (!orders || orders.length === 0) return [];
    
    const monthlyData = {};
    orders.forEach(order => {
      if (!order.order_date) return;
      const date = new Date(order.order_date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, quantity: 0, value: 0 };
      }
      monthlyData[monthKey].quantity += (order.quantity || 0) / 1000; // Convert to MT
      monthlyData[monthKey].value += order.total_amount || 0;
    });
    
    return Object.values(monthlyData);
  };

  // Get destination distribution from customers
  const getDestinationData = () => {
    if (!customers || customers.length === 0) return [];
    
    const countryCount = {};
    customers.forEach(customer => {
      const country = customer.country || 'Unknown';
      countryCount[country] = (countryCount[country] || 0) + 1;
    });
    
    const total = Object.values(countryCount).reduce((a, b) => a + b, 0);
    return Object.entries(countryCount).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100)
    }));
  };

  // Get coffee type distribution from stock
  const getCoffeeTypeDistribution = () => {
    if (!stock || stock.length === 0) return [];
    
    const typeData = {};
    stock.forEach(item => {
      const type = item.coffee_type || 'Unknown';
      if (!typeData[type]) {
        typeData[type] = { arabica: 0, robusta: 0 };
      }
      if (type.toLowerCase().includes('arabica')) {
        typeData[type].arabica += item.quantity || 0;
      } else {
        typeData[type].robusta += item.quantity || 0;
      }
    });
    
    return typeData;
  };

  // Get price trends from orders
  const getPriceTrends = () => {
    if (!orders || orders.length === 0) return [];
    
    const monthlyPrices = {};
    orders.forEach(order => {
      if (!order.order_date || !order.unit_price) return;
      const date = new Date(order.order_date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const coffeeType = (order.coffee_type || '').toLowerCase();
      
      if (!monthlyPrices[monthKey]) {
        monthlyPrices[monthKey] = { month: monthKey, arabicaPrices: [], robustaPrices: [] };
      }
      
      if (coffeeType.includes('arabica')) {
        monthlyPrices[monthKey].arabicaPrices.push(order.unit_price);
      } else {
        monthlyPrices[monthKey].robustaPrices.push(order.unit_price);
      }
    });
    
    return Object.values(monthlyPrices).map(item => ({
      month: item.month,
      arabicaPrice: item.arabicaPrices.length > 0 
        ? item.arabicaPrices.reduce((a, b) => a + b, 0) / item.arabicaPrices.length 
        : null,
      robustaPrice: item.robustaPrices.length > 0 
        ? item.robustaPrices.reduce((a, b) => a + b, 0) / item.robustaPrices.length 
        : null
    }));
  };

  // Get summary statistics
  const getSummaryStats = () => {
    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
    const totalQuantity = orders?.reduce((sum, o) => sum + (o.quantity || 0), 0) || 0;
    const confirmedOrders = orders?.filter(o => o.status === 'confirmed').length || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
    
    return {
      totalOrders,
      totalRevenue,
      totalQuantity,
      confirmedOrders,
      pendingOrders,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  };

  return {
    orders,
    stock,
    salesRecords,
    customers,
    isLoading: ordersLoading || stockLoading || salesLoading || customersLoading,
    getMonthlyOverview,
    getDestinationData,
    getCoffeeTypeDistribution,
    getPriceTrends,
    getSummaryStats
  };
};

export default useCoffeeAnalytics;
