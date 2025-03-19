
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
      
      // Fetch sales data
      const { data: salesRecords, error: salesError } = await supabase
        .from('sales_records')
        .select('*')
        .order('date_time', { ascending: false });

      if (salesError) throw salesError;
      console.log('Fetched sales data:', salesRecords);
      setSalesData(salesRecords || []);

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
