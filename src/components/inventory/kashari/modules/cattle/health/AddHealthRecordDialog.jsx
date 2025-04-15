
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddHealthRecordForm from './AddHealthRecordForm';
import { useToast } from "@/components/ui/use-toast";
import { useAddHealthRecord } from '@/hooks/useHealthRecords';

const AddHealthRecordDialog = ({ cattleData = [] }) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const addHealthRecord = useAddHealthRecord();

  const handleSubmit = async (data) => {
    try {
      await addHealthRecord.mutateAsync({
        cattle_id: data.cattleId,
        record_date: data.recordDate,
        record_type: data.recordType,
        description: data.description,
        treatment: data.treatment,
        administered_by: data.administeredBy,
        next_due_date: data.nextDueDate,
        notes: data.notes
      });
      
      toast({
        title: "Success",
        description: "Health record has been saved successfully.",
      });
      setOpen(false);
    } catch (error) {
      console.error('Error saving health record:', error);
      toast({
        title: "Error",
        description: "Failed to save health record. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          onSubmit={handleSubmit}
          isSubmitting={addHealthRecord.isPending}
          onCancel={() => setOpen(false)}
          cattleData={cattleData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthRecordDialog;
