import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useKAJONCoffees } from '@/integrations/supabase/hooks/useKAJONCoffee';

const ViewCurrentStock = () => {
  const [filter, setFilter] = useState('category');
  const [selectedValue, setSelectedValue] = useState('');
  const { data: stockData, isLoading, error } = useKAJONCoffees();

  const categories = ['Dairy', 'Coffee', 'Grains'];
  const types = ['Fresh Milk', 'Yogurt', 'Robusta Coffee', 'Arabica Coffee', 'Rice', 'Maize'];
  const locations = ['Warehouse A', 'Warehouse B', 'Cold Storage'];

  const filteredItems = stockData?.filter(item => 
    filter === 'category' ? item.category === selectedValue :
    filter === 'type' ? item.type === selectedValue :
    item.location === selectedValue
  ) || [];

  if (isLoading) {
    return <div>Loading stock data...</div>;
  }

  if (error) {
    return <div>Error loading stock data</div>;
  }

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
            {filter === 'category' && categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
            {filter === 'type' && types.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
            {filter === 'location' && locations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <Card key={item.id}>
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