
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useProposalsFetching = () => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch existing sales proposals from Supabase
  const fetchProposals = async () => {
    console.log('Fetching sales proposals...');
    setIsLoading(true);
    try {
      // Check if table exists first
      const { error: checkError } = await supabase
        .from('sales_proposals')
        .select('count(*)')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        console.log('Table does not exist yet. Please run the migration script.');
        setProposals([]);
        return;
      }

      // Fetch the records
      const { data, error } = await supabase
        .from('sales_proposals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Sales proposals fetched:', data);
      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching sales proposals:', error);
      toast({
        title: "Error",
        description: "Failed to load sales proposals data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchProposals();
  }, []);

  return {
    proposals,
    isLoading,
    fetchProposals
  };
};

export default useProposalsFetching;
