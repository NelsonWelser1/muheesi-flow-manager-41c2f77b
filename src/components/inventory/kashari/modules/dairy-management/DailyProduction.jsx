
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DailyProduction = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Milk Production</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="quantity">Quantity (Liters)</Label>
            <Input id="quantity" type="number" placeholder="Enter quantity" />
          </div>
          <div>
            <Label htmlFor="fatContent">Fat Content (%)</Label>
            <Input id="fatContent" type="number" step="0.1" placeholder="Enter fat content" />
          </div>
          <Button type="submit">Record Production</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DailyProduction;
