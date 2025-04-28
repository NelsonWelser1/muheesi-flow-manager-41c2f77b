
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, List } from "lucide-react";
import { useCattleInventory } from '@/hooks/useCattleInventory';
import CattleRegistrationForm from "@/components/inventory/kashari/modules/herd/CattleRegistrationForm";
import CattleList from "@/components/inventory/kashari/modules/herd/CattleList";

const CattleInventoryView = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { cattleList, isLoading, error } = useCattleInventory('kashari');
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Cattle Inventory</h2>
        <Button 
          onClick={() => setShowRegistrationForm(!showRegistrationForm)}
          className="flex items-center gap-2"
          variant="default"
        >
          {showRegistrationForm ? (
            <>
              <List className="h-4 w-4" />
              View Inventory
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Register New Cattle
            </>
          )}
        </Button>
      </div>
      
      {showRegistrationForm ? <CattleRegistrationForm /> : <CattleList />}
    </div>
  );
};

export default CattleInventoryView;
