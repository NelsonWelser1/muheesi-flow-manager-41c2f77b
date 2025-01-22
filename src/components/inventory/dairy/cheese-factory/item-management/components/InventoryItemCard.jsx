import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';

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
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.item_name}</h3>
        <div className="space-y-2 text-sm">
          <p className="flex justify-between">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">{item.quantity}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Unit Cost:</span>
            <span className="font-medium">${item.unit_cost}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Total Cost:</span>
            <span className="font-medium">${item.total_cost}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Supplier:</span>
            <span className="font-medium">{item.supplier_details || 'N/A'}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-600">Added:</span>
            <span className="font-medium">
              {format(new Date(item.procurement_date), 'MMM d, yyyy')}
            </span>
          </p>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
              {itemStatuses[item.status] || 'Pending'}
            </span>
          </div>
          {item.notes && (
            <p className="mt-2 text-gray-600">
              <span className="font-medium">Notes:</span> {item.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryItemCard;