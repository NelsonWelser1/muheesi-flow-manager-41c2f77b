
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useBatchOptions = () => {
  const [batchOptions, setBatchOptions] = useState([]);
  const [fetchingBatches, setFetchingBatches] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchBatchIds = async () => {
    try {
      setFetchingBatches(true);
      
      // First, get all quality-checked batch IDs
      const { data: checkedBatches, error: checkedError } = await supabase
        .from('quality_checks')
        .select('batch_id')
        .distinct();

      if (checkedError) throw checkedError;

      // Create a Set of checked batch IDs for efficient lookup
      const checkedBatchIds = new Set(checkedBatches.map(b => b.batch_id));

      // Fetch batches from both production lines
      const [internationalResponse, localResponse] = await Promise.all([
        supabase
          .from('production_line_international')
          .select('batch_id, cheese_type, created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('production_line_local')
          .select('batch_id, cheese_type, created_at')
          .order('created_at', { ascending: false })
      ]);

      if (internationalResponse.error) throw internationalResponse.error;
      if (localResponse.error) throw localResponse.error;

      const internationalBatches = internationalResponse.data || [];
      const localBatches = localResponse.data || [];

      // Filter out batches that have already been checked
      const combinedBatches = [...internationalBatches, ...localBatches]
        .filter(batch => 
          batch.batch_id && 
          batch.cheese_type && 
          !checkedBatchIds.has(batch.batch_id)
        )
        .map(batch => ({
          ...batch,
          label: `${batch.batch_id} (${batch.cheese_type})`
        }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setBatchOptions(combinedBatches);
      
      // Log for debugging
      console.log('Unchecked batches:', combinedBatches);
      
    } catch (error) {
      console.error('Error fetching batch IDs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch batch IDs",
        variant: "destructive"
      });
    } finally {
      setFetchingBatches(false);
    }
  };

  const filteredBatches = useMemo(() => {
    if (!searchQuery) return batchOptions;
    const lowerQuery = searchQuery.toLowerCase();
    return batchOptions.filter(batch => 
      batch.label.toLowerCase().includes(lowerQuery)
    );
  }, [batchOptions, searchQuery]);

  useEffect(() => {
    fetchBatchIds();
  }, []); // Refresh the list when component mounts

  return {
    batchOptions,
    fetchingBatches,
    searchQuery,
    setSearchQuery,
    filteredBatches,
    refetchBatches: fetchBatchIds // Expose refetch function to refresh list after submission
  };
};
