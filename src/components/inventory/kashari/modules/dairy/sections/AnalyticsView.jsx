
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AnalyticsView = () => {
  const [activeTab, setActiveTab] = useState('production');

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="production">Production Summary</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="historical">Historical Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="production">
          <div className="p-4 bg-gray-50 rounded-lg">
            Production summary analytics will be displayed here
          </div>
        </TabsContent>
        
        <TabsContent value="financial">
          <div className="p-4 bg-gray-50 rounded-lg">
            Financial reports will be displayed here
          </div>
        </TabsContent>
        
        <TabsContent value="historical">
          <div className="p-4 bg-gray-50 rounded-lg">
            Historical trends will be displayed here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsView;
