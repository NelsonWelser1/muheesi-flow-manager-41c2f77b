
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Factory, Star } from "lucide-react";

const TabTriggers = ({ reportCounts }) => {
  return (
    <TabsList className="mb-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 w-full">
      <TabsTrigger 
        value="overview" 
        className="h-32 flex flex-col items-center justify-center gap-2 bg-white shadow-md rounded-lg hover:shadow-lg border border-blue-100 hover:border-blue-300 transition-all data-[state=active]:border-blue-500 data-[state=active]:shadow-lg"
      >
        <div className="flex flex-col items-center">
          <div className="p-3 rounded-full bg-blue-50 mb-2">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
          </div>
          <span className="text-lg font-medium">Overview</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {reportCounts.daily || 0} Reports Today
        </div>
      </TabsTrigger>
      
      <TabsTrigger 
        value="production" 
        className="h-32 flex flex-col items-center justify-center gap-2 bg-white shadow-md rounded-lg hover:shadow-lg border border-green-100 hover:border-green-300 transition-all data-[state=active]:border-green-500 data-[state=active]:shadow-lg"
      >
        <div className="flex flex-col items-center">
          <div className="p-3 rounded-full bg-green-50 mb-2">
            <Factory className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-lg font-medium">Production</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {reportCounts.productTypes} Product Types
        </div>
      </TabsTrigger>
      
      <TabsTrigger 
        value="quality" 
        className="h-32 flex flex-col items-center justify-center gap-2 bg-white shadow-md rounded-lg hover:shadow-lg border border-purple-100 hover:border-purple-300 transition-all data-[state=active]:border-purple-500 data-[state=active]:shadow-lg"
      >
        <div className="flex flex-col items-center">
          <div className="p-3 rounded-full bg-purple-50 mb-2">
            <Star className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-lg font-medium">Quality</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Avg Score: {reportCounts.qualityScore || "0%"}
        </div>
      </TabsTrigger>
    </TabsList>
  );
};

export default TabTriggers;
