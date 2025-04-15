
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const HealthRecordsView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Stethoscope className="mr-2 h-6 w-6 text-purple-500" />
          Health Records
        </h2>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Health Record
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h3 className="text-lg font-medium text-purple-600">Vaccinations</h3>
              <p className="text-3xl font-bold">156</p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <h3 className="text-lg font-medium text-red-600">Treatments</h3>
              <p className="text-3xl font-bold">42</p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <h3 className="text-lg font-medium text-amber-600">Scheduled Checkups</h3>
              <p className="text-3xl font-bold">18</p>
              <p className="text-sm text-gray-500">Next 7 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Health Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Displaying health records table here...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthRecordsView;
