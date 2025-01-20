import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryItemCard from './InventoryItemCard';

const InventorySection = ({ section, items, itemStatuses }) => {
  if (!items || items.length === 0) return null;

  return (
    <Card key={section}>
      <CardHeader>
        <CardTitle>{section}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <InventoryItemCard 
              key={item.id} 
              item={item} 
              itemStatuses={itemStatuses}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventorySection;