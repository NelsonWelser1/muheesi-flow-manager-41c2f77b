
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KyalimaFinancialLedger from './kyalima/KyalimaFinancialLedger';

const KyalimaFarmersLimited = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="overview">Company Overview</TabsTrigger>
            <TabsTrigger value="assets">Assets Management</TabsTrigger>
            <TabsTrigger value="farmers">Farmer Cooperatives</TabsTrigger>
            <TabsTrigger value="ledger">Financial Ledger</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Kyalima Farmers Limited - Executive Management</h2>
              <p className="text-gray-600 mb-4">
                Strategic management of dairy operations and farm assets across multiple locations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Company Assets</h3>
                  <ul className="list-disc ml-5 text-green-700">
                    <li>7 Dairy Farms (including Bukomero Dairy Farm)</li>
                    <li>3 Processing Plants</li>
                    <li>15 Distribution Centers</li>
                    <li>4,200 Acres of Agricultural Land</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Operations Overview</h3>
                  <ul className="list-disc ml-5 text-blue-700">
                    <li>1,200+ Employees</li>
                    <li>200+ Farmer Cooperatives</li>
                    <li>Annual Revenue: 28.5B UGX</li>
                    <li>Export Markets: 6 Countries</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="assets">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Asset Management</h2>
              <p>Asset management dashboard will be displayed here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="farmers">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Farmer Cooperatives</h2>
              <p>Farmer cooperatives management will be displayed here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="ledger">
            <KyalimaFinancialLedger />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KyalimaFarmersLimited;
