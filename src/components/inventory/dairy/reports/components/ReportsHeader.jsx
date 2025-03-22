
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const ReportsHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6 p-2 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  );
};

export default ReportsHeader;
