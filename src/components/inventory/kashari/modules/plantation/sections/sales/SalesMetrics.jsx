
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Percent, ShoppingCart, Package } from "lucide-react";

const SalesMetrics = ({ totalSalesAmount, totalSalesQuantity, totalAvailableStock }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">UGX {totalSalesAmount.toLocaleString()}</span>
            </div>
            <div className="text-sm text-green-500">
              <Percent className="h-4 w-4 inline" />
              <span>+15.2%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sold Quantity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{totalSalesQuantity} Units</span>
            </div>
            <div className="text-sm text-blue-500">
              <span>{((totalSalesQuantity / (totalSalesQuantity + totalAvailableStock)) * 100).toFixed(1)}% of stock</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Available Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-orange-500 mr-2" />
              <span className="text-2xl font-bold">{totalAvailableStock} Units</span>
            </div>
            <div className="text-sm text-orange-500">
              <span>{((totalAvailableStock / (totalSalesQuantity + totalAvailableStock)) * 100).toFixed(1)}% remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesMetrics;
