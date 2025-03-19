
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import BulkPayrollTabs from './BulkPayrollTabs';
import { BulkPayrollProvider } from './BulkPayrollContext';

const BulkPayrollModal = ({ isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Payroll Processing</DialogTitle>
        </DialogHeader>
        
        <BulkPayrollProvider>
          <BulkPayrollTabs onClose={handleClose} />
        </BulkPayrollProvider>
      </DialogContent>
    </Dialog>
  );
};

export default BulkPayrollModal;
