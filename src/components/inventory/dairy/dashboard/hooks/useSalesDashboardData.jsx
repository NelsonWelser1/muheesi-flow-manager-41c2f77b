
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";

const useSalesDashboardData = () => {
  const [salesData, setSalesData] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching sales data from Supabase...');
      
      // Try to fetch sales_records first
      let { data: salesRecords, error: salesRecordsError } = await supabase
        .from('sales_records')
        .select('*')
        .order('date_time', { ascending: false });

      // If sales_records is empty or has error, fetch from sales_orders
      if ((salesRecordsError || !salesRecords || salesRecords.length === 0)) {
        console.log('No data in sales_records, trying sales_orders table...');
        const { data: salesOrders, error: salesOrdersError } = await supabase
          .from('sales_orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (salesOrdersError) {
          console.error('Error fetching sales orders:', salesOrdersError);
          throw salesOrdersError;
        }

        // Transform sales_orders data to match expected format
        const formattedSalesOrders = salesOrders.map(order => ({
          id: order.id,
          date_time: order.created_at,
          customer_name: order.customer_name,
          product_type: order.product_type || order.product,
          quantity: order.quantity,
          price_per_unit: order.unit_price,
          invoice_number: order.id.substring(0, 8),
          destination: order.notes
        }));

        console.log('Fetched and formatted sales orders data:', formattedSalesOrders);
        setSalesData(formattedSalesOrders || []);
      } else {
        console.log('Fetched sales records:', salesRecords);
        setSalesData(salesRecords || []);
      }

      // Try to fetch marketing campaign data
      try {
        const { data: campaignRecords, error: campaignError } = await supabase
          .from('marketing_campaigns')
          .select('*')
          .order('created_at', { ascending: false });

        if (campaignError) {
          // If table doesn't exist, just set empty array without throwing
          if (campaignError.code === '42P01') { // PostgreSQL code for "relation does not exist"
            console.log('Marketing campaigns table does not exist yet:', campaignError.message);
            setCampaignData([]);
          } else {
            throw campaignError;
          }
        } else {
          console.log('Fetched campaign data:', campaignRecords);
          setCampaignData(campaignRecords || []);
        }
      } catch (campaignError) {
        console.error('Error fetching campaign data:', campaignError);
        // Set empty array but don't fail the whole data loading
        setCampaignData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { salesData, campaignData, isLoading, error, refetch: fetchData };
};

export default useSalesDashboardData;
