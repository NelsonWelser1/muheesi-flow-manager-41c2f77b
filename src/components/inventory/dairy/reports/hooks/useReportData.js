
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useReportData = () => {
  const [productionData, setProductionData] = useState([]);
  const [qualityMetrics, setQualityMetrics] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [reportCounts, setReportCounts] = useState({
    daily: 0,
    growthPercent: '0%',
    qualityScore: '0%',
    downloads: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDairyReports = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Fetch production data
      const { data: productionResults, error: productionError } = await supabase
        .from('dairy_production')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (productionError) throw productionError;

      // 2. Fetch quality metrics
      const { data: qualityResults, error: qualityError } = await supabase
        .from('milk_reception_quality_metrics')
        .select('*')
        .order('reception_date', { ascending: false })
        .limit(10);

      if (qualityError) throw qualityError;

      // 3. Fetch sales data
      const { data: salesResults, error: salesError } = await supabase
        .from('sales_records')
        .select('*')
        .order('date_time', { ascending: false })
        .limit(10);

      if (salesError) throw salesError;

      // 4. Fetch report counts
      const { data: reportsCount, error: reportsCountError } = await supabase
        .from('maintenance_reports')
        .select('count', { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (reportsCountError) throw reportsCountError;

      // 5. Fetch production growth (simplified calculation)
      const { data: currentMonthProduction, error: growthError } = await supabase
        .from('dairy_production')
        .select('raw_material_used, finished_product_amount')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      
      if (growthError) throw growthError;

      // Format production data for chart display
      const formattedProductionData = formatProductionData(productionResults || []);
      
      // Format quality metrics for chart display
      const formattedQualityMetrics = formatQualityMetrics(qualityResults || []);
      
      // Format sales data for chart display
      const formattedSalesData = formatSalesData(salesResults || []);

      // Calculate the growth percentage
      const growthPercent = calculateGrowthPercentage(currentMonthProduction || []);
      
      // Calculate average quality score
      const avgQualityScore = qualityResults && qualityResults.length > 0
        ? Math.round(qualityResults.reduce((sum, record) => sum + (record.avg_quality_score || 0), 0) / qualityResults.length)
        : 0;

      // Set the state with the fetched data
      setProductionData(formattedProductionData);
      setQualityMetrics(formattedQualityMetrics);
      setSalesData(formattedSalesData);
      setReportCounts({
        daily: reportsCount || 0,
        growthPercent: `+${growthPercent}%`,
        qualityScore: `${avgQualityScore}%`,
        downloads: Math.floor(Math.random() * 30) + 10 // Random value for demo purposes
      });
      
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format production data
  const formatProductionData = (data) => {
    if (!data || data.length === 0) {
      return [
        { product: 'Fresh Milk', quantity: 0 },
        { product: 'Yogurt', quantity: 0 },
        { product: 'Cheese', quantity: 0 },
        { product: 'Butter', quantity: 0 }
      ];
    }

    // Group by product type and sum quantities
    const productMap = {};
    
    data.forEach(item => {
      const productType = item.product_type || 'Other';
      if (!productMap[productType]) {
        productMap[productType] = {
          product: productType,
          quantity: 0,
          efficiency: 0
        };
      }
      
      productMap[productType].quantity += Number(item.finished_product_amount || 0);
      productMap[productType].efficiency = item.efficiency_percentage || 0;
    });
    
    return Object.values(productMap);
  };

  // Helper function to format quality metrics
  const formatQualityMetrics = (data) => {
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(item => ({
      date: new Date(item.reception_date).toLocaleDateString(),
      avgQuality: item.avg_quality_score || 0,
      volume: item.total_volume || 0,
    }));
  };

  // Helper function to format sales data
  const formatSalesData = (data) => {
    if (!data || data.length === 0) {
      return [
        { period: 'Jan', value: 0 },
        { period: 'Feb', value: 0 },
        { period: 'Mar', value: 0 },
        { period: 'Apr', value: 0 }
      ];
    }
    
    // Group by month
    const salesByMonth = {};
    
    data.forEach(sale => {
      const date = new Date(sale.date_time || sale.created_at);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!salesByMonth[month]) {
        salesByMonth[month] = {
          period: month,
          value: 0
        };
      }
      
      salesByMonth[month].value += Number(sale.quantity * (sale.price_per_unit || 0));
    });
    
    return Object.values(salesByMonth);
  };

  // Calculate growth percentage (simplified for demo)
  const calculateGrowthPercentage = (data) => {
    if (!data || data.length === 0) return 12; // Default value
    
    // In real implementation, you'd compare with previous month's data
    // Here we're just calculating a random growth percentage between 5-15%
    return Math.floor(Math.random() * 10) + 5;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDairyReports();
  }, []);

  return {
    productionData,
    qualityMetrics,
    salesData,
    reportCounts,
    isLoading,
    error,
    refreshData: fetchDairyReports
  };
};
