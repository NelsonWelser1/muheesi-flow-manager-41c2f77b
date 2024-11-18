import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const FinancialManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Costs</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Selling Price (per kg)</Label>
            <Input type="number" step="0.01" />
          </div>
          
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="cny">CNY</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Processing Cost</Label>
            <Input type="number" step="0.01" />
          </div>

          <div className="space-y-2">
            <Label>Shipping Cost</Label>
            <Input type="number" step="0.01" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input placeholder="Enter invoice number" />
            </div>
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advance">Advance Payment</SelectItem>
                  <SelectItem value="lc">Letter of Credit</SelectItem>
                  <SelectItem value="tt">T/T After Shipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full">Generate Invoice</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialManagement;