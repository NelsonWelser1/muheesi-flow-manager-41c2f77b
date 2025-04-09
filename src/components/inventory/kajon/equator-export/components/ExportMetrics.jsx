
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Ship, FileText, DollarSign, Users } from 'lucide-react';

const ExportMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-700">Pending Shipments</p>
              <p className="text-2xl font-bold text-blue-900">{metrics.pendingShipments}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Ship className="h-5 w-5 text-blue-700" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-emerald-50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-emerald-700">Active Contracts</p>
              <p className="text-2xl font-bold text-emerald-900">{metrics.activeContracts}</p>
            </div>
            <div className="bg-emerald-100 p-2 rounded-full">
              <FileText className="h-5 w-5 text-emerald-700" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-amber-700">Total Revenue</p>
              <p className="text-2xl font-bold text-amber-900">{metrics.revenue}</p>
            </div>
            <div className="bg-amber-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-amber-700" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-purple-700">New Buyers</p>
              <p className="text-2xl font-bold text-purple-900">{metrics.newBuyers}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-purple-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportMetrics;
