import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import SearchBar from './components/SearchBar';
import { useInventoryItems } from '@/hooks/useInventoryItems';

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
  const { items, isLoading, addItem, updateItemStatus } = useInventoryItems();
  const [newItem, setNewItem] = useState({
    item_name: '',
    section: '',
    quantity: '',
    unit_cost: '',
    supplier_details: '',
    notes: '',
    status: 'good'
  });

  console.log('ItemManagementPanel rendered with items:', items);

  const handleAddItem = () => {
    if (!newItem.item_name || !newItem.section || !newItem.quantity || !newItem.unit_cost) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const totalCost = Number(newItem.quantity) * Number(newItem.unit_cost);
    const itemWithTotal = {
      ...newItem,
      total_cost: totalCost,
      status: 'good'
    };

    addItem(itemWithTotal, {
      onSuccess: () => {
        setNewItem({
          item_name: '',
          section: '',
          quantity: '',
          unit_cost: '',
          supplier_details: '',
          notes: '',
          status: 'good'
        });
        toast({
          title: "Success",
          description: "Item added successfully"
        });
      },
      onError: (error) => {
        console.error('Error adding item:', error);
        toast({
          title: "Error",
          description: "Failed to add item",
          variant: "destructive"
        });
      }
    });
  };

  const handleStatusChange = (id, newStatus) => {
    updateItemStatus({ id, status: newStatus }, {
      onSuccess: () => {
        toast({
          title: "Status Updated",
          description: `Item status changed to ${itemStatuses[newStatus]}`
        });
      },
      onError: (error) => {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive"
        });
      }
    });
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

  const filteredItems = items?.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            items={filteredItems}
          />
        </CardHeader>
        <CardContent>
          <InventoryTable
            items={filteredItems}
            itemStatuses={itemStatuses}
            getStatusColor={getStatusColor}
            handleStatusChange={handleStatusChange}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemManagementPanel;