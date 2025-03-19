
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, TrendingUp, AlertCircle } from 'lucide-react';
import useSalesDashboardData from './dashboard/hooks/useSalesDashboardData';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SalesMarketing = () => {
  const { salesData, campaignData, isLoading, error } = useSalesDashboardData();

  // Calculate total daily revenue
  const calculateDailyRevenue = () => {
    if (!salesData || salesData.length === 0) return 0;
    
    const today = new Date().setHours(0, 0, 0, 0);
    const todaySales = salesData.filter(sale => {
      const saleDate = new Date(sale.date_time || sale.created_at).setHours(0, 0, 0, 0);
      return saleDate === today;
    });
    
    return todaySales.reduce((total, sale) => 
      total + (sale.quantity * (sale.price_per_unit || sale.unit_price)), 0);
  };
  
  // Calculate total products sold today
  const calculateTodayProducts = () => {
    if (!salesData || salesData.length === 0) return 0;
    
    const today = new Date().setHours(0, 0, 0, 0);
    const todaySales = salesData.filter(sale => {
      const saleDate = new Date(sale.date_time || sale.created_at).setHours(0, 0, 0, 0);
      return saleDate === today;
    });
    
    return todaySales.reduce((total, sale) => total + sale.quantity, 0);
  };
  
  // Calculate growth rate (comparing today with yesterday)
  const calculateGrowthRate = () => {
    if (!salesData || salesData.length < 2) return 0;
    
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);
    
    const todaySales = salesData.filter(sale => {
      const saleDate = new Date(sale.date_time || sale.created_at).setHours(0, 0, 0, 0);
      return saleDate === today;
    });
    
    const yesterdaySales = salesData.filter(sale => {
      const saleDate = new Date(sale.date_time || sale.created_at).setHours(0, 0, 0, 0);
      return saleDate === yesterday;
    });
    
    const todayRevenue = todaySales.reduce((total, sale) => 
      total + (sale.quantity * (sale.price_per_unit || sale.unit_price)), 0);
    
    const yesterdayRevenue = yesterdaySales.reduce((total, sale) => 
      total + (sale.quantity * (sale.price_per_unit || sale.unit_price)), 0);
    
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
              <div className="text-2xl font-bold">${calculateDailyRevenue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
          <p>Loading sales data...</p>
        </div>
      ) : salesData.length === 0 ? (
        <div className="text-center py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>
              No sales data available. Please add sales records to see them reflected here.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="text-center py-8">
          <p>Showing data from {salesData.length} sales records.</p>
          <p>Select an option from the menu above to view detailed reports.</p>
        </div>
      )}
    </div>
  );
};

export default SalesMarketing;
