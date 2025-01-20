import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const InventoryItemCard = ({ item, itemStatuses }) => {
  const getStatusColor = (status) => {
    const colors = {
      'good': 'bg-green-100 text-green-800',
      'fair': 'bg-yellow-100 text-yellow-800',
      'bad': 'bg-red-100 text-red-800',
      'pending': 'bg-blue-100 text-blue-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.default;
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.item_name}</h3>
        <div className="space-y-1 text-sm">
          <p>Quantity: {item.quantity}</p>
          <p>Unit Cost: ${item.unit_cost}</p>
          <p>Total Cost: ${item.total_cost}</p>
          <p>Status: 
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
              {itemStatuses[item.status] || 'Pending'}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryItemCard;