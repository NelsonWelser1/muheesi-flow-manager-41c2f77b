
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BukomeroFinance = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 12,450,000</div>
            <p className="text-sm text-gray-500">This month's revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">UGX 7,820,000</div>
            <p className="text-sm text-gray-500">This month's expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">UGX 4,630,000</div>
            <p className="text-sm text-gray-500">This month's profit</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Input id="product" placeholder="e.g., Fresh Milk, Yogurt, Cheese" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="Enter quantity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Unit Price (UGX)</Label>
                <Input id="price" type="number" placeholder="Enter unit price" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Input id="customer" placeholder="Customer name or ID" />
              </div>
            </div>
            <Button type="submit" className="w-full">Record Sale</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border-b">
              <div>
                <div className="font-medium">Sale: 250 liters of Fresh Milk</div>
                <div className="text-sm text-gray-500">Customer: Kampala Supermarket</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">+ UGX 1,250,000</div>
                <div className="text-sm text-gray-500">Today, 11:30 AM</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 border-b">
              <div>
                <div className="font-medium">Purchase: Packaging Materials</div>
                <div className="text-sm text-gray-500">Supplier: PackWell Ltd</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-red-600">- UGX 430,000</div>
                <div className="text-sm text-gray-500">Yesterday, 2:15 PM</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 border-b">
              <div>
                <div className="font-medium">Sale: 75 kg of Cheese</div>
                <div className="text-sm text-gray-500">Customer: Entebbe Resort</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">+ UGX 975,000</div>
                <div className="text-sm text-gray-500">Apr 20, 2023</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroFinance;
