import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InvoiceManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Order Reference</Label>
              <Input placeholder="Select order" />
            </div>
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" />
            </div>
            <Button className="w-full">Generate Invoice</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManagement;