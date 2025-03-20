
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useFetchDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all deliveries from the database
  const fetchDeliveries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching delivery records from Supabase...');
      
      const { data, error } = await supabase
        .from('logistics_delivery_management')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log(`Fetched ${data ? data.length : 0} delivery records`);
      setDeliveries(data || []);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError(err.message);
      toast({
        title: "Error fetching deliveries",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load deliveries when the component mounts
  useEffect(() => {
    fetchDeliveries();
  }, []);

  return {
    deliveries,
    setDeliveries,
    isLoading,
    error,
    fetchDeliveries
  };
};
