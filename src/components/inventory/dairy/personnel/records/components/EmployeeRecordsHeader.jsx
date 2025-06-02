
import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Printer } from 'lucide-react';
import EmployeeExportActions from '../EmployeeExportActions';

const EmployeeRecordsHeader = ({ onRefresh, onPrint, records }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <CardTitle className="text-lg font-bold">Employee Records</CardTitle>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
        <Button onClick={onPrint} variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print Records
        </Button>
        <EmployeeExportActions records={records} fileName="employee_records" />
      </div>
    </div>
  );
};

export default EmployeeRecordsHeader;
