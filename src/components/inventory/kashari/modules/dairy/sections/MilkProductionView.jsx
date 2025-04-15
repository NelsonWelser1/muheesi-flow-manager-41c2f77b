
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const MilkProductionView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Droplet className="mr-2 h-6 w-6 text-blue-500" />
          Milk Production
        </h2>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Record Production
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Production Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-lg font-medium text-blue-600">Today's Production</h3>
              <p className="text-3xl font-bold">245 L</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h3 className="text-lg font-medium text-indigo-600">Weekly Average</h3>
              <p className="text-3xl font-bold">238 L</p>
              <p className="text-sm text-green-500">+3% from last week</p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
              <h3 className="text-lg font-medium text-cyan-600">Monthly Total</h3>
              <p className="text-3xl font-bold">7,125 L</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Production Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Displaying milk production records table here...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MilkProductionView;
