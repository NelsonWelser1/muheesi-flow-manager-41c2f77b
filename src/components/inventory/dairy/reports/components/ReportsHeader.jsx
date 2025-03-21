
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";

const ReportsHeader = ({ onOpenReportForm }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold">Reports & Analytics</h2>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button onClick={onOpenReportForm}>
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>
    </div>
  );
};

export default ReportsHeader;
