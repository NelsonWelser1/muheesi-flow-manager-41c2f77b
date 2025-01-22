import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddItemForm from './components/AddItemForm';
import InventoryTable from './components/InventoryTable';
import SearchBar from './components/SearchBar';
import InventorySection from './components/InventorySection';
import { useInventoryItems, useAddInventoryItem } from '@/hooks/useInventoryOperations';

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

  const { data: items = [], isLoading, error } = useInventoryItems();
  const addItemMutation = useAddInventoryItem();

  console.log('Current inventory items:', items);

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
    return <div className="text-red-500 p-4">Error loading inventory items: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <AddItemForm
        sections={sections}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={() => addItemMutation.mutate(newItem)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Inventory List</CardTitle>
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