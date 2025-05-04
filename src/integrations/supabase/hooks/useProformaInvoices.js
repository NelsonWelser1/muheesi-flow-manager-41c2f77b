
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

// Fetch proforma invoices with optional filtering
const fetchProformaInvoices = async (filters = {}) => {
  console.log('Fetching proforma invoices with filters:', filters);
  let query = supabase.from('proforma_invoices').select('*');

  // Apply date range filter if provided
  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    query = query.gte('invoice_date', start).lte('invoice_date', end);
  }

  // Apply sorting
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching proforma invoices:', error);
    throw error;
  }

  console.log('Fetched proforma invoices:', data);
  return data;
};

// Fetch a specific proforma invoice by ID
const fetchProformaInvoiceById = async (id) => {
  const { data, error } = await supabase
    .from('proforma_invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching proforma invoice by ID:', error);
    throw error;
  }

  return data;
};

// React Query hook for fetching proforma invoices
export const useProformaInvoices = (filters = {}) => {
  return useQuery({
    queryKey: ['proforma_invoices', filters],
    queryFn: () => fetchProformaInvoices(filters),
  });
};

// React Query hook for fetching a specific proforma invoice
export const useProformaInvoice = (id) => {
  return useQuery({
    queryKey: ['proforma_invoices', id],
    queryFn: () => fetchProformaInvoiceById(id),
    enabled: !!id, // Only run query if ID is provided
  });
};

// React Query hook for creating a new proforma invoice
export const useCreateProformaInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proformaData) => {
      const { data, error } = await supabase
        .from('proforma_invoices')
        .insert([proformaData])
        .select();

      if (error) {
        console.error('Error creating proforma invoice:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proforma_invoices'] });
    },
  });
};

// React Query hook for updating a proforma invoice
export const useUpdateProformaInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, proformaData }) => {
      const { data, error } = await supabase
        .from('proforma_invoices')
        .update(proformaData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating proforma invoice:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proforma_invoices'] });
      queryClient.invalidateQueries({ queryKey: ['proforma_invoices', variables.id] });
    },
  });
};

// React Query hook for deleting a proforma invoice
export const useDeleteProformaInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('proforma_invoices')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting proforma invoice:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proforma_invoices'] });
    },
  });
};
