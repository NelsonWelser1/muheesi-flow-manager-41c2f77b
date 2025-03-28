
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileCheck } from 'lucide-react';
import ComplianceDocuments from './ComplianceDocuments';

const ComplianceButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button 
        onClick={handleOpen} 
        variant="outline"
        className="flex items-center gap-2"
      >
        <FileCheck className="h-4 w-4" />
        <span>Compliance Documents</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compliance Document Management</DialogTitle>
          </DialogHeader>
          <ComplianceDocuments onBack={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComplianceButton;
