
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, List } from "lucide-react";
import CattleList from "@/components/inventory/CattleList";
import CattleRegistration from "@/components/inventory/CattleRegistration";

const CattleInventoryView = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Cattle Inventory</h2>
        <Button 
          onClick={() => setShowRegistrationForm(!showRegistrationForm)}
          className="flex items-center gap-2"
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
      
      {showRegistrationForm ? <CattleRegistration /> : <CattleList />}
    </div>
  );
};

export default CattleInventoryView;
