
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export interface InventoryItem {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  location: string;
  date: string;
}

export interface SaleRecord {
  id: string;
  date: string;
  product: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_amount: number;
  customer: string;
}

export const usePlantationData = () => {
  const queryClient = useQueryClient();

  // Fetch inventory data
  const { data: inventory, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['plantationInventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plantation_inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch sales data
  const { data: sales, isLoading: isLoadingSales } = useQuery({
    queryKey: ['plantationSales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plantation_sales')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Add inventory item
  const addInventoryItem = useMutation({
    mutationFn: async (newItem: Omit<InventoryItem, 'id'>) => {
      const { data, error } = await supabase
        .from('plantation_inventory')
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantationInventory'] });
    },
  });

  // Add sale record
  const addSaleRecord = useMutation({
    mutationFn: async (newSale: Omit<SaleRecord, 'id'>) => {
      const { data, error } = await supabase
        .from('plantation_sales')
        .insert([newSale])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantationSales'] });
    },
  });

  return {
    inventory,
    sales,
    isLoadingInventory,
    isLoadingSales,
    addInventoryItem,
    addSaleRecord,
  };
};
