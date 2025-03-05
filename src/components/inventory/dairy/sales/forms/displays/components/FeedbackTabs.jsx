
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeedbackTabs = ({ activeTab, setActiveTab, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Feedback</TabsTrigger>
        <TabsTrigger value="high">High Satisfaction (4-5)</TabsTrigger>
        <TabsTrigger value="medium">Medium Satisfaction (3)</TabsTrigger>
        <TabsTrigger value="low">Low Satisfaction (1-2)</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab}>
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default FeedbackTabs;
