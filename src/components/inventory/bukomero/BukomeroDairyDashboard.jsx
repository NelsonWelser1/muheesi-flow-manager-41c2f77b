
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BukomeroFinancialLedger from './BukomeroFinancialLedger';

const BukomeroDairyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bukomero Dairy Farm</h1>
          <p className="text-gray-500">Data Entry Terminal - Managed by Kyalima Farmers Limited</p>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
          Active Farm
        </Badge>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="overview">Farm Overview</TabsTrigger>
              <TabsTrigger value="milk">Milk Production</TabsTrigger>
              <TabsTrigger value="livestock">Livestock Management</TabsTrigger>
              <TabsTrigger value="feeds">Feeds & Silage</TabsTrigger>
              <TabsTrigger value="ledger">Financial Ledger</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-6">
                <div className="p-5 bg-blue-50 rounded-lg">
                  <h2 className="text-xl font-bold mb-3">Farm Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Location</h3>
                      <p>Bukomero, Kyiboga District</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Manager</h3>
                      <p>Manager Boaz</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Contact</h3>
                      <p>+256 772 674060</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Total Area</h3>
                      <p>450 Acres</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-green-50">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2">Milk Production</h3>
                      <p className="text-3xl font-bold">8,750 L</p>
                      <p className="text-sm text-gray-500">Weekly average</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-50">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2">Livestock Count</h3>
                      <p className="text-3xl font-bold">312</p>
                      <p className="text-sm text-gray-500">Total cattle</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2">Silage Reserves</h3>
                      <p className="text-3xl font-bold">65 Tons</p>
                      <p className="text-sm text-gray-500">Current inventory</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="milk">
              <div className="p-5 bg-white rounded-lg">
                <h2 className="text-xl font-bold mb-3">Milk Production</h2>
                <p>Milk production data and analytics will be displayed here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="livestock">
              <div className="p-5 bg-white rounded-lg">
                <h2 className="text-xl font-bold mb-3">Livestock Management</h2>
                <p>Livestock management system will be displayed here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="feeds">
              <div className="p-5 bg-white rounded-lg">
                <h2 className="text-xl font-bold mb-3">Feeds & Silage</h2>
                <p>Feed management and silage production data will be displayed here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="ledger">
              <BukomeroFinancialLedger />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BukomeroDairyDashboard;
