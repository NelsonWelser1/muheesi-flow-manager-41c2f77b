import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileCheck } from 'lucide-react';
import ComplianceDocuments from './ComplianceDocuments';
const ComplianceButton = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return <>
      

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compliance Document Management</DialogTitle>
          </DialogHeader>
          <ComplianceDocuments onBack={handleClose} />
        </DialogContent>
      </Dialog>
    </>;
};
export default ComplianceButton;