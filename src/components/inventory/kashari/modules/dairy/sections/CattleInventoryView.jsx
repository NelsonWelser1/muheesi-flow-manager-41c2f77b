
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beef, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const CattleInventoryView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Beef className="mr-2 h-6 w-6 text-orange-500" />
          Cattle Inventory
        </h2>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Cattle
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cattle Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <h3 className="text-lg font-medium text-orange-600">Total Cattle</h3>
              <p className="text-3xl font-bold">245</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-lg font-medium text-blue-600">Dairy Cows</h3>
              <p className="text-3xl font-bold">128</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="text-lg font-medium text-green-600">Calves</h3>
              <p className="text-3xl font-bold">67</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Additions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Displaying cattle inventory table here...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CattleInventoryView;
