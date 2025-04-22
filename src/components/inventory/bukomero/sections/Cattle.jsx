
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BukomeroCattle = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cattle Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">126</div>
            <p className="text-sm text-gray-500">Total cattle in dairy farm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Milking Cows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-sm text-gray-500">Currently producing milk</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Calves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-sm text-gray-500">Young cattle under 1 year</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cattle Health Status</CardTitle>
          <Button size="sm">Schedule Checkup</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Vaccinations Up-to-date</span>
              <span className="font-medium text-green-600">92%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cattle Under Treatment</span>
              <span className="font-medium text-amber-600">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Veterinary Visits This Month</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Next Scheduled Health Check</span>
              <span className="font-medium">May 18, 2023</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Breeding Program</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Pregnant Cows</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Expected Calves Next Month</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Bulls in Service</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Artificial Insemination Success Rate</span>
              <span className="font-medium text-green-600">76%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroCattle;
