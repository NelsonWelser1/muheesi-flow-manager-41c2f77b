
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import AddHealthRecordForm from './AddHealthRecordForm';

const AddHealthRecordDialog = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Health Record</DialogTitle>
          <DialogDescription>
            Add a new health record for a cattle in your herd.
          </DialogDescription>
        </DialogHeader>
        <AddHealthRecordForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthRecordDialog;
