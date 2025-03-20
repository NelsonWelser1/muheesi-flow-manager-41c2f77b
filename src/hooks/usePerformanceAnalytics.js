
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

export const usePerformanceAnalytics = () => {
  const [performanceRecords, setPerformanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all performance records
  const fetchPerformanceRecords = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching performance records from Supabase...');
      
      const { data, error } = await supabase
        .from('logistics_delivery_performance')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching performance records:', error);
        setError(error.message);
        toast({
          title: "Error fetching records",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Performance records fetched successfully:', data);
      setPerformanceRecords(data || []);
    } catch (err) {
      console.error('Unexpected error fetching performance records:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new performance record
  const addPerformanceRecord = async (performanceData) => {
    try {
      setIsLoading(true);
      console.log('Adding new performance record:', performanceData);
      
      // Ensure numeric values are properly converted
      const formattedData = {
        ...performanceData,
        performance_rating: parseInt(performanceData.performance_rating),
        delivery_time: performanceData.delivery_time ? parseInt(performanceData.delivery_time) : null,
        action_required: !!performanceData.action_required,
        operator_id: null // Setting to null since authentication is temporarily disabled
      };
      
      const { data, error } = await supabase
        .from('logistics_delivery_performance')
        .insert([formattedData])
        .select();
      
      if (error) {
        console.error('Error adding performance record:', error);
        setError(error.message);
        toast({
          title: "Error adding record",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error };
      }
      
      console.log('Performance record added successfully:', data);
      
      // Update the local state with the new record
      setPerformanceRecords(prevRecords => [data[0], ...prevRecords]);
      
      toast({
        title: "Success",
        description: "Performance record added successfully",
      });
      
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Unexpected error adding performance record:', err);
      setError(err.message);
      toast({
        title: "Unexpected error",
        description: err.message,
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch performance records on component mount
  useEffect(() => {
    fetchPerformanceRecords();
  }, []);

  return {
    performanceRecords,
    isLoading,
    error,
    fetchPerformanceRecords,
    addPerformanceRecord
  };
};
