
import React from 'react';
import { Card } from "@/components/ui/card";
import CattleRegistration from '@/components/inventory/CattleRegistration';
import CattleList from '@/components/inventory/CattleList';

const Cattle = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cattle Management</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <CattleRegistration />
        <CattleList />
      </div>
    </div>
  );
};

export default Cattle;
