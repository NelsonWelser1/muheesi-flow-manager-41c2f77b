
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
        .select('batch_id');

      if (checkedError) throw checkedError;

      // Create a Set of checked batch IDs for efficient lookup
      const checkedBatchIds = new Set((checkedBatches || []).map(b => b.batch_id));

      // Fetch batches from both production lines
      const [internationalResponse, localResponse] = await Promise.all([
        supabase
          .from('production_line_international')
          .select('*')
          .ilike('batch_id', 'INT%')
          .order('created_at', { ascending: false }),
        supabase
          .from('production_line_local')
          .select('*')
          .ilike('batch_id', 'LCL%')
          .order('created_at', { ascending: false })
      ]);

      if (internationalResponse.error) throw internationalResponse.error;
      if (localResponse.error) throw localResponse.error;

      // Format the batches with better labels
      const formatBatch = (batch, isInternational) => ({
        ...batch,
        source: isInternational ? 'International' : 'Local',
        label: `${batch.batch_id} (${batch.cheese_type || 'Unknown Type'})`,
        details: {
          line: isInternational ? 'International Standards' : 'Local Standards',
          date: new Date(batch.created_at).toLocaleDateString(),
          type: batch.cheese_type,
        }
      });

      // Combine and format batches, filtering out already checked ones
      const combinedBatches = [
        ...(internationalResponse.data || []).map(batch => formatBatch(batch, true)),
        ...(localResponse.data || []).map(batch => formatBatch(batch, false))
      ]
      .filter(batch => 
        batch.batch_id && 
        !checkedBatchIds.has(batch.batch_id)
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setBatchOptions(combinedBatches);
      console.log('Fetched batch options:', combinedBatches); // Debug log
      
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
      batch.label.toLowerCase().includes(lowerQuery) ||
      batch.source.toLowerCase().includes(lowerQuery)
    );
  }, [batchOptions, searchQuery]);

  useEffect(() => {
    fetchBatchIds();
    
    // Set up interval for periodic refresh
    const interval = setInterval(fetchBatchIds, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    batchOptions,
    fetchingBatches,
    searchQuery,
    setSearchQuery,
    filteredBatches,
    refetchBatches: fetchBatchIds
  };
};
