import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import SearchBar from './components/SearchBar';

const sections = [
  "Milk Reception and Initial Processing",
  "Processing Section",
  "Heating and Cooking",
  "Moulding and Pressing Section",
  "Packaging Section",
  "Storage and Refrigeration",
  "Lab and Quality Control",
  "Additives and Ingredients",
  "Office and Administration",
  "Others (General and Safety)"
];

const itemStatuses = {
  'good': 'Good for Service',
  'fair': 'Fair for Service',
  'bad': 'Bad for Service',
  'out': 'Out of Service',
  'repair': 'Out for Repair & Maintenance',
  'used': 'Used-up',
  'need': 'More Needed'
};

const ItemManagementPanel = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    itemName: '',
    section: '',
    quantity: '',
    unitCost: '',
    supplierDetails: '',
    notes: '',
    status: 'good'
  });

  const queryClient = useQueryClient();

  // Fetch inventory items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: async () => {
      console.log('Fetching inventory items...');
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('procurement_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching inventory items:', error);
        throw error;
      }
      
      console.log('Fetched inventory items:', data);
      return data || [];
    }
  });

  // Add new item mutation
  const addItemMutation = useMutation({
    mutationFn: async (itemData) => {
      console.log('Adding new item:', itemData);
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{
          ...itemData,
          total_cost: Number(itemData.quantity) * Number(itemData.unitCost),
          procurement_date: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error adding item:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventoryItems']);
      toast({
        title: "Success",
        description: "Item added successfully"
      });
      setNewItem({
        itemName: '',
        section: '',
        quantity: '',
        unitCost: '',
        supplierDetails: '',
        notes: '',
        status: 'good'
      });
    },
    onError: (error) => {
      console.error('Error in mutation:', error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update item status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventoryItems']);
      toast({
        title: "Status Updated",
        description: "Item status updated successfully"
      });
    }
  });

  const handleAddItem = () => {
    if (!newItem.itemName || !newItem.section || !newItem.quantity || !newItem.unitCost) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addItemMutation.mutate(newItem);
  };

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  const filteredItems = items.filter(item =>
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading inventory items...</div>;
  }

  return (
    <div className="space-y-6">
      <AddItemForm
        sections={sections}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={handleAddItem}
      />

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </CardHeader>
        <CardContent>
          <InventoryTable
            items={filteredItems}
            itemStatuses={itemStatuses}
            handleStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemManagementPanel;