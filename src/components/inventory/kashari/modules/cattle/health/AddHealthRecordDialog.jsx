
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddHealthRecordForm from './AddHealthRecordForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCattleInventory } from '@/hooks/useCattleInventory';

const AddHealthRecordDialog = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { cattleList, isLoading } = useCattleInventory('kashari');

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Health Record
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <AddHealthRecordForm 
            onCancel={() => setIsOpen(false)} 
            onSuccess={() => {
              if (onSuccess) onSuccess();
              setIsOpen(false);
            }}
            cattleData={cattleList || []}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddHealthRecordDialog;
