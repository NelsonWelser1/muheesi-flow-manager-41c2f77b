
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, Filter } from 'lucide-react';

const InventoryManagement = () => {
  const inventoryItems = [
    { id: 'SKU001', name: 'Coffee Beans - Arabica', quantity: 2500, location: 'A-12-3', status: 'In Stock' },
    { id: 'SKU002', name: 'Coffee Beans - Robusta', quantity: 1800, location: 'A-14-2', status: 'Low Stock' },
    { id: 'SKU003', name: 'Packaging Materials', quantity: 500, location: 'B-05-1', status: 'In Stock' },
    { id: 'SKU004', name: 'Export Bags', quantity: 150, location: 'C-08-4', status: 'Critical' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Inventory Management</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-10" />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        {inventoryItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">SKU: {item.id} | Location: {item.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">{item.quantity} units</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                    item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InventoryManagement;
