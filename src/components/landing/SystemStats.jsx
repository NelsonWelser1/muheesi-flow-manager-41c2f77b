
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SystemStats = () => {
  // Fetch inventory data from multiple tables
  const { data: inventoryData } = useQuery({
    queryKey: ['system-inventory-value'],
    queryFn: async () => {
      const [coffee, cattle, dairy, kashari] = await Promise.all([
        supabase.from('coffee_stock').select('quantity, buying_price'),
        supabase.from('cattle_inventory').select('weight'),
        supabase.from('dairy_production').select('quantity'),
        supabase.from('kashari_milk_production').select('volume')
      ]);
      
      const coffeeValue = (coffee.data || []).reduce((sum, item) => sum + (item.quantity * item.buying_price), 0);
      const cattleCount = (cattle.data || []).length;
      const dairyQty = (dairy.data || []).reduce((sum, item) => sum + Number(item.quantity), 0);
      const kashariVol = (kashari.data || []).reduce((sum, item) => sum + Number(item.volume), 0);
      
      return coffeeValue + (cattleCount * 2000000) + (dairyQty * 3000) + (kashariVol * 1500);
    }
  });

  // Fetch employee count
  const { data: employeeCount } = useQuery({
    queryKey: ['system-employees'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Fetch monthly production
  const { data: productionData } = useQuery({
    queryKey: ['system-production'],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const [dairy, kashari] = await Promise.all([
        supabase.from('dairy_production')
          .select('quantity')
          .gte('production_date', startOfMonth.toISOString()),
        supabase.from('kashari_milk_production')
          .select('volume')
          .gte('date', startOfMonth.toISOString())
      ]);
      
      const dairyTotal = (dairy.data || []).reduce((sum, item) => sum + Number(item.quantity), 0);
      const kashariTotal = (kashari.data || []).reduce((sum, item) => sum + Number(item.volume), 0);
      
      return Math.round(dairyTotal + kashariTotal);
    }
  });

  // Fetch order fulfillment
  const { data: fulfillmentData } = useQuery({
    queryKey: ['system-fulfillment'],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from('sales_orders')
        .select('payment_status');
      
      if (!orders || orders.length === 0) return 0;
      
      const completed = orders.filter(o => o.payment_status === 'Paid').length;
      return ((completed / orders.length) * 100).toFixed(1);
    }
  });

  const formatCurrency = (value) => {
    if (value >= 1000000000) return `UGX ${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `UGX ${(value / 1000000).toFixed(1)}M`;
    return `UGX ${value?.toLocaleString() || '0'}`;
  };

  const stats = [
    {
      title: "Total Inventory Value",
      value: formatCurrency(inventoryData),
      change: "+0%",
      trend: "stable",
      description: "Across all companies"
    },
    {
      title: "Active Employees",
      value: employeeCount?.toString() || "0",
      change: "+0%",
      trend: "stable",
      description: "System users"
    },
    {
      title: "Monthly Production",
      value: productionData?.toLocaleString() || "0",
      change: "+0%",
      trend: "stable",
      description: "Units processed"
    },
    {
      title: "Order Fulfillment",
      value: `${fulfillmentData || 0}%`,
      change: "+0%",
      trend: "stable",
      description: "Success rate"
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">System Overview</h2>
          <p className="text-lg text-gray-600">
            Real-time insights into your integrated business operations
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(stat.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">
                      vs last month
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
