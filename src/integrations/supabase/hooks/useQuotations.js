
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

// Fetch quotations with optional filtering
const fetchQuotations = async (filters = {}) => {
  console.log('Fetching quotations with filters:', filters);
  let query = supabase.from('quotations').select('*');

  // Apply date range filter if provided
  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    query = query.gte('created_at', start).lte('created_at', end);
  }

  // Apply sorting
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching quotations:', error);
    throw error;
  }

  console.log('Fetched quotations:', data);
  return data;
};

// Fetch a specific quotation by ID
const fetchQuotationById = async (id) => {
  const { data, error } = await supabase
    .from('quotations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching quotation by ID:', error);
    throw error;
  }

  return data;
};

// React Query hook for fetching quotations
export const useQuotations = (filters = {}) => {
  return useQuery({
    queryKey: ['quotations', filters],
    queryFn: () => fetchQuotations(filters),
  });
};

// React Query hook for fetching a specific quotation
export const useQuotation = (id) => {
  return useQuery({
    queryKey: ['quotations', id],
    queryFn: () => fetchQuotationById(id),
    enabled: !!id, // Only run query if ID is provided
  });
};

// React Query hook for creating a new quotation
export const useCreateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quotation) => {
      const { data, error } = await supabase
        .from('quotations')
        .insert([quotation])
        .select();

      if (error) {
        console.error('Error creating quotation:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};

// React Query hook for updating a quotation
export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quotation }) => {
      const { data, error } = await supabase
        .from('quotations')
        .update(quotation)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating quotation:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotations', variables.id] });
    },
  });
};

// React Query hook for deleting a quotation
export const useDeleteQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting quotation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};
