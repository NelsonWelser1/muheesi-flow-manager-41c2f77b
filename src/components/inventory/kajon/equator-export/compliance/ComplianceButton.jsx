
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ComplianceDocumentManager from './ComplianceDocumentManager';

const ComplianceButton = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2"
        variant="outline"
      >
        <FileText className="h-4 w-4" />
        Compliance Documents
      </Button>

      <Dialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
      >
        <DialogContent className="max-w-5xl w-full p-0 max-h-[90vh] overflow-auto">
          <ComplianceDocumentManager />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComplianceButton;
