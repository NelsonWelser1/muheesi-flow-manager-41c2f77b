import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useCoffeeInventory } from '@/integrations/supabase/hooks/useInventoryData';

const ViewCurrentStock = ({ isKazo }) => {
  const [filter, setFilter] = useState('category');
  const [selectedValue, setSelectedValue] = useState('');
  const { toast } = useToast();
  const { data: coffeeStock, isLoading } = useCoffeeInventory();

  // Filter stock based on company context
  const filteredStock = coffeeStock?.filter(item => {
    if (isKazo) {
      return item.project === 'Kazo Coffee Development Project';
    }
    return item.company === 'KAJON Coffee Limited';
  });

  if (isLoading) {
    return <div>Loading stock data...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        Current Stock for {isKazo ? 'Kazo Coffee Development Project' : 'KAJON Coffee Limited'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStock?.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Type: {item.type}</p>
                <p className="text-sm text-gray-600">Grade: {item.grade}</p>
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