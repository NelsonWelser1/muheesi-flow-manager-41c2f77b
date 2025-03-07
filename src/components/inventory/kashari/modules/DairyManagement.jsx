import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DairyManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dairy Products Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Average Fat Content: 3.8%</p>
                  <p>Total Production Today: 250L</p>
                  <p>Quality Grade: A</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Sold Today: 200L</p>
                  <p>Revenue: UGX 600,000</p>
                  <p>Stock Remaining: 50L</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DairyManagement;