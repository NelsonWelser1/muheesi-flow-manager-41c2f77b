
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddHealthRecordForm from './AddHealthRecordForm';
import { useToast } from "@/components/ui/use-toast";

const AddHealthRecordDialog = ({ cattleData = [] }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button 
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90"
          disabled={cattleData.length === 0}
        >
          <PlusCircle className="h-4 w-4" />
          Add Health Record
        </Button>
      </Dialog.Trigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Add Health Record
          </DialogTitle>
        </DialogHeader>
        <AddHealthRecordForm
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
          cattleData={cattleData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthRecordDialog;
