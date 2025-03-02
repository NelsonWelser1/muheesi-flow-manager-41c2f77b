
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { showErrorToast } from '@/components/ui/notifications';

export const useBatchOptions = () => {
  const [batchOptions, setBatchOptions] = useState([]);
  const [fetchingBatches, setFetchingBatches] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch batch IDs from both production lines
  const fetchBatchIds = async () => {
    try {
      setFetchingBatches(true);
      
      // Get checked batch IDs for filtering
      const checkedBatchIds = await getCheckedBatchIds();
      
      // Fetch and format batches from both production lines
      const combinedBatches = await fetchAndFormatBatches(checkedBatchIds);
      
      setBatchOptions(combinedBatches);
      console.log('Fetched batch options:', combinedBatches); // Debug log
      
    } catch (error) {
      console.error('Error fetching batch IDs:', error);
      showErrorToast(toast, "Failed to fetch batch IDs");
    } finally {
      setFetchingBatches(false);
    }
  };

  // Fetch checked batch IDs
  const getCheckedBatchIds = async () => {
    const { data: checkedBatches, error: checkedError } = await supabase
      .from('quality_checks')
      .select('batch_id');

    if (checkedError) throw checkedError;

    // Create a Set for efficient lookup
    return new Set((checkedBatches || []).map(b => b.batch_id));
  };

  // Fetch and format batches from both production lines
  const fetchAndFormatBatches = async (checkedBatchIds) => {
    // Fetch batches from both production lines in parallel
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

    // Combine and filter batches
    return [
      ...(internationalResponse.data || []).map(batch => formatBatch(batch, true)),
      ...(localResponse.data || []).map(batch => formatBatch(batch, false))
    ]
    .filter(batch => 
      batch.batch_id && 
      !checkedBatchIds.has(batch.batch_id)
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  // Format a batch with better labels
  const formatBatch = (batch, isInternational) => ({
    ...batch,
    source: isInternational ? 'International' : 'Local',
    label: `${batch.batch_id} (${batch.cheese_type || 'Unknown Type'})`,
    details: {
      line: isInternational ? 'International Standards' : 'Local Standards',
      date: new Date(batch.created_at).toLocaleDateString(),
      type: batch.cheese_type,
      status: batch.status || 'Processing'
    }
  });

  // Filter batches based on search query
  const filteredBatches = useMemo(() => {
    if (!searchQuery) return batchOptions;
    
    const lowerQuery = searchQuery.toLowerCase();
    return batchOptions.filter(batch => 
      batch.label.toLowerCase().includes(lowerQuery) ||
      batch.source.toLowerCase().includes(lowerQuery) ||
      (batch.details.type && batch.details.type.toLowerCase().includes(lowerQuery))
    );
  }, [batchOptions, searchQuery]);

  // Fetch batches on component mount and set up refresh interval
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
