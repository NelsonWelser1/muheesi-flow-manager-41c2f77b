
import React from 'react';
import { Plus, Upload, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const DossierActionButtons = ({ 
  onCreateDossier, 
  onUploadDocuments, 
  onScheduleTask 
}) => {
  const { toast } = useToast();
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will download shortly.",
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onCreateDossier} className="flex items-center gap-2">
        <Plus className="h-4 w-4" /> New Dossier
      </Button>
      <Button variant="outline" onClick={onUploadDocuments} className="flex items-center gap-2">
        <Upload className="h-4 w-4" /> Upload Documents
      </Button>
      <Button variant="outline" onClick={onScheduleTask} className="flex items-center gap-2">
        <Calendar className="h-4 w-4" /> Schedule Task
      </Button>
    </div>
  );
};

export default DossierActionButtons;
