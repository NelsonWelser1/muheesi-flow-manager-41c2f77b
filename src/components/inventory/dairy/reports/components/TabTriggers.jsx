
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Factory, Star } from "lucide-react";

const TabTriggers = ({ reportCounts }) => {
  return (
    <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 relative z-50 shadow-md">
      <TabsTrigger 
        value="overview" 
        className="h-32 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 data-[state=active]:from-blue-200 data-[state=active]:to-blue-300 transition-all relative z-50"
      >
        <div className="flex flex-col items-center">
          <LayoutDashboard className="h-8 w-8 mb-2 text-blue-600" />
          <span className="text-lg font-medium">Overview</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {reportCounts.daily || 0} Reports Today
        </div>
      </TabsTrigger>
      
      <TabsTrigger 
        value="production" 
        className="h-32 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200 data-[state=active]:from-green-200 data-[state=active]:to-green-300 transition-all relative z-50"
      >
        <div className="flex flex-col items-center">
          <Factory className="h-8 w-8 mb-2 text-green-600" />
          <span className="text-lg font-medium">Production</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {reportCounts.productTypes} Product Types
        </div>
      </TabsTrigger>
      
      <TabsTrigger 
        value="quality" 
        className="h-32 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 data-[state=active]:from-purple-200 data-[state=active]:to-purple-300 transition-all relative z-50"
      >
        <div className="flex flex-col items-center">
          <Star className="h-8 w-8 mb-2 text-purple-600" />
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
