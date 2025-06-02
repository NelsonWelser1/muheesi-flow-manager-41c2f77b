
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";

const SalesMarketing = () => {
  const [salesOrdersData, setSalesOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch paid sales orders from the database
  useEffect(() => {
    const fetchPaidSalesOrders = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching paid sales orders from Supabase...');
        
        const { data, error } = await supabase
          .from('sales_orders')
          .select('*')
          .eq('payment_status', 'paid')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching paid sales orders:', error);
          setError(error);
          return;
        }

        console.log('Fetched paid sales orders:', data);
        setSalesOrdersData(data || []);
      } catch (err) {
        console.error('Unexpected error fetching paid sales orders:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaidSalesOrders();
  }, []);

  // Calculate total daily revenue from paid sales orders
  const calculateDailyRevenue = () => {
    if (!salesOrdersData || salesOrdersData.length === 0) return 0;
    
    const today = new Date().setHours(0, 0, 0, 0);
    const todaySales = salesOrdersData.filter(sale => {
      const saleDate = new Date(sale.order_date || sale.created_at).setHours(0, 0, 0, 0);
      return saleDate === today;
    });
    
    return todaySales.reduce((total, sale) => 
      total + (sale.total_amount || (sale.quantity * sale.unit_price)), 0);
  };
  
  // Calculate total products sold today from paid sales orders
  const calculateTodayProducts = () => {
    if (!salesOrdersData || salesOrdersData.length === 0) return 0;
    
    const today = new Date().setHours(0, 0, 0, 0);
    const todaySales = salesOrdersData.filter(sale => {
      const saleDate = new Date(sale.order_date || sale.created_at).setHours(0, 0, 0, 0);
      return saleDate === today;
    });
    
    return todaySales.reduce((total, sale) => total + sale.quantity, 0);
  };
  
  // Calculate growth rate (comparing today with yesterday) from paid sales orders
  const calculateGrowthRate = () => {
    if (!salesOrdersData || salesOrdersData.length < 2) return 0;
    
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);
    
    const todaySales = salesOrdersData.filter(sale => {
      const saleDate = new Date(sale.order_date || sale.created_at).setHours(0, 0, 0, 0);
      return saleDate === today;
    });
    
    const yesterdaySales = salesOrdersData.filter(sale => {
      const saleDate = new Date(sale.order_date || sale.created_at).setHours(0, 0, 0, 0);
      return saleDate === yesterday;
    });
    
    const todayRevenue = todaySales.reduce((total, sale) => 
      total + (sale.total_amount || (sale.quantity * sale.unit_price)), 0);
    
    const yesterdayRevenue = yesterdaySales.reduce((total, sale) => 
      total + (sale.total_amount || (sale.quantity * sale.unit_price)), 0);
    
    if (yesterdayRevenue === 0) return todayRevenue > 0 ? 100 : 0;
    
    return Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100);
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Error loading sales data: {error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">UGX {calculateDailyRevenue().toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold Today</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{calculateTodayProducts()} units</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className={`text-2xl font-bold ${calculateGrowthRate() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculateGrowthRate() >= 0 ? '+' : ''}{calculateGrowthRate()}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading paid sales data...</p>
        </div>
      ) : salesOrdersData.length === 0 ? (
        <div className="text-center py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>
              No paid sales orders available. Please add and process sales orders to see them reflected here.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="text-center py-8">
          <p>Showing data from {salesOrdersData.length} paid sales orders.</p>
          <p>Select an option from the menu above to view detailed reports.</p>
        </div>
      )}
    </div>
  );
};

export default SalesMarketing;
