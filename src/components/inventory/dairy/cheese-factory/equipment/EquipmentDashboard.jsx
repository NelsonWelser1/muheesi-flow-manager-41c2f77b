
import React from 'react';
import { Card } from "@/components/ui/card";
import EquipmentList from './list/EquipmentList';

const EquipmentDashboard = () => {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <EquipmentList />
      </Card>
    </div>
  );
};

export default EquipmentDashboard;
