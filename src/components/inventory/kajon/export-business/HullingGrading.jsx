import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const HullingGrading = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hulling Process</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Batch Number</Label>
            <Input placeholder="Enter batch number" />
          </div>
          <div className="space-y-2">
            <Label>Input Quantity (kg)</Label>
            <Input type="number" />
          </div>
          <div className="space-y-2">
            <Label>Output Quantity (kg)</Label>
            <Input type="number" />
          </div>
          <div className="space-y-2">
            <Label>Yield Percentage</Label>
            <Input type="number" step="0.01" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grading & Packaging</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Screen Size</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select screen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18">Screen 18</SelectItem>
                  <SelectItem value="15">Screen 15</SelectItem>
                  <SelectItem value="12">Screen 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Package Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jute">Jute Bags</SelectItem>
                  <SelectItem value="bulk">Bulk Bags</SelectItem>
                  <SelectItem value="gummy">Gummy Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full">Record Hulling & Grading</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HullingGrading;