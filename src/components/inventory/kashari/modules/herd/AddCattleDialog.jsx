
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CattleRegistrationForm from './CattleRegistrationForm';

const AddCattleDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Cattle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Register New Cattle</DialogTitle>
        </DialogHeader>
        <CattleRegistrationForm onDialogClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddCattleDialog;
