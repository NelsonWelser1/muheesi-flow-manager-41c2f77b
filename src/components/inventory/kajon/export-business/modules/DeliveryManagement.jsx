import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DeliveryManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Delivery Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Order Reference</Label>
              <Input placeholder="Select order" />
            </div>
            <div className="space-y-2">
              <Label>Delivery Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Items to Ship</Label>
              <Input placeholder="Add items" />
            </div>
            <Button className="w-full">Generate Delivery Note</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryManagement;