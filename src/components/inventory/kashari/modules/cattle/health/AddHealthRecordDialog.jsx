
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddHealthRecordForm from './AddHealthRecordForm';
import { useToast } from "@/components/ui/use-toast";

const AddHealthRecordDialog = ({ cattleData = [] }) => {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement the actual submission logic here
      console.log('Submitting health record:', data);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90"
          disabled={cattleData.length === 0}
          onClick={() => console.log("Add Health Record button clicked")}
        >
          <PlusCircle className="h-4 w-4" />
          Add Health Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <AddHealthRecordForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => setOpen(false)}
          cattleData={cattleData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthRecordDialog;
