import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { 
  useDairyInventory, 
  useCoffeeInventory, 
  useFarmInventory, 
  useFreshecoInventory 
} from '@/integrations/supabase/hooks/useInventoryData';

const ViewCurrentStock = () => {
  const [filter, setFilter] = useState('category');
  const [selectedValue, setSelectedValue] = useState('');
  const { toast } = useToast();

  const { data: dairyStock, isLoading: isDairyLoading } = useDairyInventory();
  const { data: coffeeStock, isLoading: isCoffeeLoading } = useCoffeeInventory();
  const { data: farmStock, isLoading: isFarmLoading } = useFarmInventory();
  const { data: freshecoStock, isLoading: isFreshecoLoading } = useFreshecoInventory();

  const isLoading = isDairyLoading || isCoffeeLoading || isFarmLoading || isFreshecoLoading;

  const allStock = [
    ...(dairyStock || []),
    ...(coffeeStock || []),
    ...(farmStock || []),
    ...(freshecoStock || [])
  ];

  const categories = ['Dairy', 'Coffee', 'Grains', 'Fresh Produce'];
  const types = {
    'Coffee': ['Robusta', 'Arabica'],
    'Dairy': ['Fresh Milk', 'Yogurt', 'Cheese'],
    'Grains': ['Rice', 'Maize'],
    'Fresh Produce': ['Vegetables', 'Fruits']
  };
  const locations = ['Warehouse A', 'Warehouse B', 'Cold Storage'];

  const filteredItems = allStock.filter(item => 
    filter === 'category' ? item.category === selectedValue :
    filter === 'type' ? item.type === selectedValue :
    item.location === selectedValue
  );

  if (isLoading) {
    return <div>Loading stock data...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">View Current Stock</h2>
      <div className="flex flex-wrap gap-4">
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
            {filter === 'type' && selectedValue && types[selectedValue]?.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
            {filter === 'location' && locations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Category: {item.category}</p>
                <p className="text-sm text-gray-600">Type: {item.type}</p>
                <p className="text-sm text-gray-600">Location: {item.location}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Current Stock: {item.current_stock}</span>
                    <span>Max: {item.max_capacity}</span>
                  </div>
                  <Progress 
                    value={(item.current_stock / item.max_capacity) * 100} 
                    className="h-2"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Last Updated: {new Date(item.updated_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewCurrentStock;