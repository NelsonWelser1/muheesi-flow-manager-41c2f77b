import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Analytics = () => {
  // Fetch sales data from database
  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['plantation-sales-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coffee_sales_records')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch inventory data
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ['plantation-inventory-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coffee_stock')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Process sales data by month
  const getMonthlySalesData = () => {
    if (!salesData || salesData.length === 0) {
      return [
        { name: 'Jan', sales: 780000, expenses: 350000 },
        { name: 'Feb', sales: 650000, expenses: 410000 },
        { name: 'Mar', sales: 820000, expenses: 390000 },
        { name: 'Apr', sales: 960000, expenses: 430000 },
      ];
    }
    
    const monthlyData = {};
    salesData.forEach(record => {
      const date = new Date(record.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { name: monthKey, sales: 0, expenses: 0 };
      }
      monthlyData[monthKey].sales += record.revenue || 0;
      monthlyData[monthKey].expenses += record.expenses || 0;
    });
    
    return Object.values(monthlyData);
  };

  // Process inventory data
  const getInventoryValueData = () => {
    if (!inventoryData || inventoryData.length === 0) {
      return [
        { name: 'Arabica', stock: 160, value: 1040000, color: '#8884d8' },
        { name: 'Robusta', stock: 355, value: 1775000, color: '#82ca9d' },
      ];
    }
    
    const typeData = {};
    inventoryData.forEach(item => {
      const type = item.coffee_type || 'Unknown';
      if (!typeData[type]) {
        typeData[type] = { name: type, stock: 0, value: 0, color: type.toLowerCase().includes('arabica') ? '#8884d8' : '#82ca9d' };
      }
      typeData[type].stock += item.quantity || 0;
      typeData[type].value += (item.quantity || 0) * (item.buying_price || 0);
    });
    
    return Object.values(typeData);
  };

  // Get sales by product type
  const getSalesByProductData = () => {
    if (!salesData || salesData.length === 0) {
      return [
        { name: 'Arabica', value: 585000, color: '#8884d8' },
        { name: 'Robusta', value: 375000, color: '#82ca9d' },
      ];
    }
    
    const productData = {};
    salesData.forEach(record => {
      const type = record.product_type || 'Unknown';
      if (!productData[type]) {
        productData[type] = { name: type, value: 0, color: type.toLowerCase().includes('arabica') ? '#8884d8' : '#82ca9d' };
      }
      productData[type].value += record.revenue || 0;
    });
    
    return Object.values(productData);
  };

  // Get daily sales trend
  const getSalesTrend = () => {
    if (!salesData || salesData.length === 0) {
      return [
        { day: '01', sales: 55000 },
        { day: '02', sales: 48000 },
        { day: '03', sales: 62000 },
        { day: '04', sales: 37000 },
        { day: '05', sales: 42000 },
      ];
    }
    
    return salesData.slice(-10).map((record, index) => ({
      day: String(index + 1).padStart(2, '0'),
      sales: record.revenue || 0
    }));
  };

  const monthlySales = getMonthlySalesData();
  const inventoryValue = getInventoryValueData();
  const salesByProduct = getSalesByProductData();
  const salesTrend = getSalesTrend();

  if (salesLoading || inventoryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Plantation Inventory & Sales Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales & Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="sales" name="Sales (UGX)" fill="#8884d8" />
                  <Bar dataKey="expenses" name="Expenses (UGX)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryValue}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {inventoryValue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByProduct}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByProduct.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `UGX ${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" name="Daily Sales (UGX)" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
