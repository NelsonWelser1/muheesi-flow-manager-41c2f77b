import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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
  const [items, setItems] = useState([]);
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

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      console.log('Fetching inventory items...');
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched items:', data);
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory items",
        variant: "destructive"
      });
    }
  };

  const handleAddItem = async () => {
    if (!newItem.itemName || !newItem.section || !newItem.quantity || !newItem.unitCost) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const totalCost = Number(newItem.quantity) * Number(newItem.unitCost);
      const itemToAdd = {
        ...newItem,
        totalCost,
        created_at: new Date().toISOString(),
        status: 'good'
      };

      console.log('Adding new item:', itemToAdd);
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([itemToAdd])
        .select();

      if (error) throw error;

      console.log('Item added successfully:', data);
      setItems([...(data || []), ...items]);
      setNewItem({
        itemName: '',
        section: '',
        quantity: '',
        unitCost: '',
        supplierDetails: '',
        notes: '',
        status: 'good'
      });

      toast({
        title: "Success",
        description: "Item added successfully"
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log('Updating item status:', { id, newStatus });
      const { data, error } = await supabase
        .from('inventory_items')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) throw error;

      setItems(items.map(item => {
        if (item.id === id) {
          return { ...item, status: newStatus };
        }
        return item;
      }));

      toast({
        title: "Status Updated",
        description: `Item status changed to ${itemStatuses[newStatus]}`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            getStatusColor={getStatusColor}
            handleStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemManagementPanel;
