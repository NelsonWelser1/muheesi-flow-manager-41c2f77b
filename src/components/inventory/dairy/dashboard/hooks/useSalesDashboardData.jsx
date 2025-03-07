
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
      const { data: salesRecords, error: salesError } = await supabase
        .from('sales_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;
      setSalesData(salesRecords);

      const { data: campaignRecords, error: campaignError } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignError) throw campaignError;
      setCampaignData(campaignRecords);
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
