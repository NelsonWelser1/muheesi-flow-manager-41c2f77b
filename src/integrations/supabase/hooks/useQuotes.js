import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fetchQuotes = async () => {
  console.log('Fetching quotes...');
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      quote_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
  console.log('Fetched quotes:', data);
  return data;
};

const fetchQuoteById = async (id) => {
  console.log('Fetching quote by id:', id);
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      quote_items (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching quote by id:', error);
    throw error;
  }
  console.log('Fetched quote:', data);
  return data;
};

export const useQuotes = () => {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
  });
};

export const useQuote = (id) => {
  return useQuery({
    queryKey: ['quotes', id],
    queryFn: () => fetchQuoteById(id),
    enabled: !!id,
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quote, items }) => {
      console.log('Creating quote with data:', { quote, items });
      
      // Insert quote
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert([quote])
        .select()
        .single();

      if (quoteError) {
        console.error('Error creating quote:', quoteError);
        throw quoteError;
      }

      console.log('Created quote:', quoteData);

      // Insert quote items
      const quoteItems = items.map(item => ({
        ...item,
        quote_id: quoteData.id
      }));

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(quoteItems);

      if (itemsError) {
        console.error('Error creating quote items:', itemsError);
        throw itemsError;
      }

      return quoteData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
};

export const useUpdateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quote, items }) => {
      console.log('Updating quote:', { id, quote, items });
      
      // Update quote
      const { error: quoteError } = await supabase
        .from('quotes')
        .update(quote)
        .eq('id', id);

      if (quoteError) {
        console.error('Error updating quote:', quoteError);
        throw quoteError;
      }

      // Delete existing items
      const { error: deleteError } = await supabase
        .from('quote_items')
        .delete()
        .eq('quote_id', id);

      if (deleteError) {
        console.error('Error deleting quote items:', deleteError);
        throw deleteError;
      }

      // Insert new items
      const quoteItems = items.map(item => ({
        ...item,
        quote_id: id
      }));

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(quoteItems);

      if (itemsError) {
        console.error('Error updating quote items:', itemsError);
        throw itemsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
};

export const useDeleteQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      console.log('Deleting quote:', id);
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting quote:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
};