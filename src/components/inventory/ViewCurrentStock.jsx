import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ViewCurrentStock = () => {
  const [filter, setFilter] = useState('category');
  const [selectedValue, setSelectedValue] = useState('');

  // Mock data - replace with actual data fetching logic
  const stockData = {
    categories: ['Dairy', 'Coffee', 'Grains'],
    types: ['Fresh Milk', 'Yogurt', 'Robusta Coffee', 'Arabica Coffee', 'Rice', 'Maize'],
    locations: ['Warehouse A', 'Warehouse B', 'Cold Storage'],
    items: [
      { name: 'Fresh Milk', category: 'Dairy', type: 'Fresh Milk', location: 'Cold Storage', currentStock: 1000, maxCapacity: 1500, authorizedAmount: 1200 },
      { name: 'Yogurt', category: 'Dairy', type: 'Yogurt', location: 'Cold Storage', currentStock: 500, maxCapacity: 800, authorizedAmount: 600 },
      { name: 'Robusta Coffee', category: 'Coffee', type: 'Robusta Coffee', location: 'Warehouse A', currentStock: 2000, maxCapacity: 3000, authorizedAmount: 2500 },
      { name: 'Arabica Coffee', category: 'Coffee', type: 'Arabica Coffee', location: 'Warehouse A', currentStock: 1500, maxCapacity: 2000, authorizedAmount: 1800 },
      { name: 'Rice', category: 'Grains', type: 'Rice', location: 'Warehouse B', currentStock: 5000, maxCapacity: 10000, authorizedAmount: 8000 },
      { name: 'Maize', category: 'Grains', type: 'Maize', location: 'Warehouse B', currentStock: 3000, maxCapacity: 5000, authorizedAmount: 4000 },
    ],
  };

  const filteredItems = stockData.items.filter(item => 
    filter === 'category' ? item.category === selectedValue :
    filter === 'type' ? item.type === selectedValue :
    item.location === selectedValue
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">View Current Stock</h2>
      <div className="flex space-x-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="type">Product Type</SelectItem>
            <SelectItem value="location">Location</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedValue} onValueChange={setSelectedValue}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={`Select ${filter}`} />
          </SelectTrigger>
          <SelectContent>
            {filter === 'category' && stockData.categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
            {filter === 'type' && stockData.types.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
            {filter === 'location' && stockData.locations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Current Stock: {item.currentStock}</p>
              <p>Max Capacity: {item.maxCapacity}</p>
              <Progress value={(item.currentStock / item.maxCapacity) * 100} className="mt-2" />
              <p className="mt-2">Authorized Amount: {item.authorizedAmount}</p>
              {item.currentStock !== item.authorizedAmount && (
                <p className="text-red-500">
                  Discrepancy: {item.currentStock - item.authorizedAmount}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewCurrentStock;