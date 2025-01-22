import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import SearchBar from './components/SearchBar';
import { supabase } from '@/integrations/supabase/supabase';

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
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    itemName: '',
    section: '',
    quantity: '',
    unitCost: '',
    supplierDetails: '',
    notes: '',
    status: 'good'
  });

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      console.log('Fetching inventory items...');
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('last_updated', { ascending: false });

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
    } finally {
      setIsLoading(false);
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
        item_name: newItem.itemName,
        section: newItem.section,
        quantity: Number(newItem.quantity),
        unit_cost: Number(newItem.unitCost),
        total_cost: totalCost,
        supplier_details: newItem.supplierDetails,
        notes: newItem.notes,
        status: 'good',
        last_updated: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('inventory_items')
        .insert([itemToAdd])
        .select();

      if (error) throw error;

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

      // Refresh items list
      fetchItems();
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
      const { error } = await supabase
        .from('inventory_items')
        .update({ 
          status: newStatus,
          last_updated: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setItems(items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            last_updated: new Date().toISOString()
          };
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
        description: "Failed to update item status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      good: 'bg-green-100 text-green-800',
      fair: 'bg-yellow-100 text-yellow-800',
      bad: 'bg-red-100 text-red-800',
      out: 'bg-gray-100 text-gray-800',
      repair: 'bg-blue-100 text-blue-800',
      used: 'bg-purple-100 text-purple-800',
      need: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
            getStatusColor={getStatusColor}
            handleStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemManagementPanel;
