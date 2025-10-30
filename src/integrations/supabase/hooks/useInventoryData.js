import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

// Generic fetch function
const fetchFromSupabase = async (table) => {
  const { data, error } = await supabase
    .from(table)
    .select('*');
  if (error) throw error;
  return data;
};

// Generic insert function
const insertToSupabase = async (table, data) => {
  const { data: result, error } = await supabase
    .from(table)
    .insert([data])
    .select();
  if (error) throw error;
  return result;
};

// Generic update function
const updateInSupabase = async (table, id, data) => {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return result;
};

// Hooks for Grand Berna Dairies
export const useDairyInventory = () => useQuery({
  queryKey: ['dairyInventory'],
  queryFn: () => fetchFromSupabase('dairy_inventory')
});

export const useAddDairyInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => insertToSupabase('dairy_inventory', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['dairyInventory']);
    }
  });
};

// Hooks for KAJON Coffee
export const useCoffeeInventory = () => useQuery({
  queryKey: ['coffeeInventory'],
  queryFn: () => fetchFromSupabase('coffee_inventory')
});

export const useAddCoffeeInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => insertToSupabase('coffee_inventory', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['coffeeInventory']);
    }
  });
};

// Hooks for Kyalima Farmers
export const useFarmInventory = () => useQuery({
  queryKey: ['farmInventory'],
  queryFn: () => fetchFromSupabase('farm_inventory')
});

export const useAddFarmInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => insertToSupabase('farm_inventory', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['farmInventory']);
    }
  });
};
