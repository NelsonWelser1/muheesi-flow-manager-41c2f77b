
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Truck } from "lucide-react";

const SalesOrderFormActions = ({ deliveryRequired }) => {
  return (
    <div className="flex gap-4">
      <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Submit Order</Button>
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => console.log("Saving draft...")}
      >
        <Save className="h-4 w-4" />
        Save Draft
      </Button>
      {deliveryRequired === "yes" && (
        <Button 
          type="button" 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => console.log("Creating delivery note...")}
        >
          <Truck className="h-4 w-4" />
          Create Delivery Note
        </Button>
      )}
    </div>
  );
};

export default SalesOrderFormActions;
