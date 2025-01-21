import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import SearchBar from './components/SearchBar';
import InventorySection from './components/InventorySection';
import { useInventoryItems, useAddInventoryItem } from '@/hooks/useInventoryOperations';
import { useToast } from "@/components/ui/use-toast";

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

  const { toast } = useToast();
  const { data: items = [], isLoading, error } = useInventoryItems();
  const addItemMutation = useAddInventoryItem();

  console.log('ItemManagementPanel rendered with items:', items);
  if (error) {
    console.error('Error loading inventory items:', error);
  }

  const filteredItems = items.filter(item =>
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = sections.reduce((acc, section) => {
    acc[section] = filteredItems.filter(item => item.section === section);
    return acc;
  }, {});

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading inventory items...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Error loading inventory items. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AddItemForm
        sections={sections}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={() => {
          console.log('Adding new item:', newItem);
          addItemMutation.mutate(newItem, {
            onSuccess: () => {
              setNewItem({
                itemName: '',
                section: '',
                quantity: '',
                unitCost: '',
                supplierDetails: '',
                notes: '',
                status: 'pending'
              });
              toast({
                title: "Success",
                description: "Item added successfully",
              });
            },
            onError: (error) => {
              console.error('Error adding item:', error);
              toast({
                title: "Error",
                description: "Failed to add item. Please try again.",
                variant: "destructive",
              });
            }
          });
        }}
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