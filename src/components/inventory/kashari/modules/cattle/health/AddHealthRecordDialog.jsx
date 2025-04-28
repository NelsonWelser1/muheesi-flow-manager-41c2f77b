
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const AddHealthRecordDialog = () => {
  return (
    <Button 
      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90"
    >
      <PlusCircle className="h-4 w-4" />
      Add Health Record
    </Button>
  );
};

export default AddHealthRecordDialog;
