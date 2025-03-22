
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from '@/components/ui/use-toast';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

/**
 * Custom hook for managing coffee sales operations
 * @returns {Object} Functions and data for coffee sales operations
 */
export const useCoffeeSales = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch coffee sales records
  const {
    data: salesRecords = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['coffee-sales'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('coffee_sales')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching coffee sales:', err);
        showErrorToast(toast, 'Failed to load coffee sales records');
        return [];
      }
    }
  });

  // Filter coffee sales by time range
  const fetchSalesByTimeRange = async (timeRange) => {
    try {
      let startDate = new Date();
      
      switch (timeRange) {
        case 'hour':
          startDate.setHours(startDate.getHours() - 1);
          break;
        case 'day':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          // Fetch all if no time range specified
          const { data, error } = await supabase
            .from('coffee_sales')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          return data || [];
      }
      
      const { data, error } = await supabase
        .from('coffee_sales')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching coffee sales by time range:', err);
      showErrorToast(toast, 'Failed to filter records by time range');
      return [];
    }
  };

  // Search coffee sales records
  const searchSalesRecords = async (searchTerm) => {
    if (!searchTerm) {
      return refetch();
    }
    
    try {
      const { data, error } = await supabase
        .from('coffee_sales')
        .select('*')
        .or(`buyer_name.ilike.%${searchTerm}%,buyer_contact.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,manager.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error searching coffee sales:', err);
      showErrorToast(toast, 'Failed to search records');
      return [];
    }
  };

  // Create a new coffee sale record
  const createSaleMutation = useMutation({
    mutationFn: async (saleData) => {
      setIsSubmitting(true);
      try {
        // Validate the data
        if (!saleData.manager || !saleData.location) {
          throw new Error('Manager name and location are required');
        }
        
        if (!saleData.buyerName || !saleData.buyerContact) {
          throw new Error('Buyer information is required');
        }
        
        if (!saleData.coffeeType || !saleData.qualityGrade) {
          throw new Error('Coffee type and quality grade are required');
        }
        
        if (!saleData.sellingPrice || !saleData.quantity) {
          throw new Error('Selling price and quantity are required');
        }
        
        // Format the data for insertion
        const formattedData = {
          manager: saleData.manager,
          location: saleData.location,
          buyer_name: saleData.buyerName,
          buyer_contact: saleData.buyerContact,
          coffee_type: saleData.coffeeType,
          quality_grade: saleData.qualityGrade,
          selling_price: parseFloat(saleData.sellingPrice),
          currency: saleData.currency || 'UGX',
          quantity: parseFloat(saleData.quantity),
          unit: saleData.unit || 'kg',
          total_price: parseFloat(saleData.totalPrice || (saleData.sellingPrice * saleData.quantity).toFixed(2)),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Insert the data
        const { data, error } = await supabase
          .from('coffee_sales')
          .insert(formattedData)
          .select()
          .single();
          
        if (error) throw error;
        
        return data;
      } catch (err) {
        console.error('Error creating coffee sale:', err);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      showSuccessToast(toast, 'Coffee sale recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['coffee-sales'] });
    },
    onError: (error) => {
      showErrorToast(toast, `Failed to record sale: ${error.message}`);
    }
  });

  return {
    salesRecords,
    isLoading,
    error,
    isSubmitting,
    createSale: createSaleMutation.mutateAsync,
    fetchSalesByTimeRange,
    searchSalesRecords,
    refetchSales: refetch
  };
};
