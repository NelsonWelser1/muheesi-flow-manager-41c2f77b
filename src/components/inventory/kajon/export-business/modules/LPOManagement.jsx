import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LPOManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Local Purchase Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Input placeholder="Select supplier" />
            </div>
            <div className="space-y-2">
              <Label>Order Reference</Label>
              <Input placeholder="Enter order reference" />
            </div>
            <div className="space-y-2">
              <Label>Items</Label>
              <Input placeholder="Add items" />
            </div>
            <Button className="w-full">Generate LPO</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LPOManagement;