import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, MoreHorizontal, Calendar, Edit, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderMetrics from './OrderMetrics';
import OrdersTable from './OrdersTable';

const OrdersList = ({ orders, onCreateOrder }) => {
  return (
    <div className="space-y-6">
      <OrderMetrics />

      {/* Filters and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">Unfulfilled</Button>
          <Button variant="outline" size="sm">Unpaid</Button>
          <Button variant="outline" size="sm">Open</Button>
          <Button variant="outline" size="sm">Closed</Button>
          <Button variant="outline" size="sm"><Plus className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Jan 1 - Jan 30, 2024
          </Button>
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="outline" size="sm">More actions</Button>
          <Button size="sm" onClick={onCreateOrder}>Create order</Button>
        </div>
      </div>

      {/* Search and View Options */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-8" />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm"><Search className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><SlidersHorizontal className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable orders={orders} />
    </div>
  );
};

export default OrdersList;