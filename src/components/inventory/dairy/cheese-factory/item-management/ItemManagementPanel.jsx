import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import SearchBar from './components/SearchBar';
import InventorySection from './components/InventorySection';

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
  'need': 'More Needed',
  'pending': 'Pending Review'
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
    status: 'pending'
  });

  const queryClient = useQueryClient();

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
      
      return data || [];
    }
  });

  const addItemMutation = useMutation({
    mutationFn: async (itemData) => {
      console.log('Adding new item:', itemData);
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{
          item_name: itemData.itemName,
          section: itemData.section,
          quantity: Number(itemData.quantity),
          unit_cost: Number(itemData.unitCost),
          total_cost: Number(itemData.quantity) * Number(itemData.unitCost),
          supplier_details: itemData.supplierDetails,
          notes: itemData.notes,
          status: 'pending',
          procurement_date: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventoryItems']);
      toast({
        title: "Success",
        description: "Item added successfully and pending review"
      });
      setNewItem({
        itemName: '',
        section: '',
        quantity: '',
        unitCost: '',
        supplierDetails: '',
        notes: '',
        status: 'pending'
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

  const filteredItems = items.filter(item =>
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = sections.reduce((acc, section) => {
    acc[section] = filteredItems.filter(item => item.section === section);
    return acc;
  }, {});

  if (isLoading) {
    return <div>Loading inventory items...</div>;
  }

  return (
    <div className="space-y-6">
      <AddItemForm
        sections={sections}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={() => addItemMutation.mutate(newItem)}
      />

      <div className="space-y-4">
        {sections.map((section) => (
          <InventorySection
            key={section}
            section={section}
            items={groupedItems[section]}
            itemStatuses={itemStatuses}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </CardHeader>
        <CardContent>
          <InventoryTable
            items={filteredItems}
            itemStatuses={itemStatuses}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemManagementPanel;