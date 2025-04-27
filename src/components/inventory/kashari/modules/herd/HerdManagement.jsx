import React, { useState } from 'react';
import CattleInventoryTable from './CattleInventoryTable';
import HealthRecordsForm from './HealthRecordsForm';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddCattleDialog from './AddCattleDialog';
import RecentHealthRecordsPreview from './health-records/RecentHealthRecordsPreview';

const HerdManagement = () => {
  const [selectedSection, setSelectedSection] = useState('inventory');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Herd Management</h2>
        <AddCattleDialog />
      </div>

      <div className="p-6 hover:shadow-md transition-all duration-200">
        <CattleInventoryTable />
      </div>
      
      <div className="p-6 hover:shadow-md transition-all duration-200">
        <HealthRecordsForm />
      </div>
      
      <div className="p-6 hover:shadow-md transition-all duration-200">
        <RecentHealthRecordsPreview />
      </div>
    </div>
  );
};

export default HerdManagement;
