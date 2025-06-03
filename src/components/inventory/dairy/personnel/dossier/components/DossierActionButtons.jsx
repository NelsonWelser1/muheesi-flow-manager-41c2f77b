
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Upload, Calendar, Trash2 } from "lucide-react";

const DossierActionButtons = ({ 
  dossier, 
  onView, 
  onUpload, 
  onSchedule, 
  onDelete, 
  isDeleting,
  compact = false 
}) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the dossier for ${dossier.employee_id}?`)) {
      onDelete(dossier.id, dossier.employee_id);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUpload(dossier)}
          title="Upload documents"
        >
          <Upload className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSchedule(dossier)}
          title="Schedule task"
        >
          <Calendar className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          title="Delete dossier"
          disabled={isDeleting}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView(dossier)}
        title="View details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onUpload(dossier)}
        title="Upload documents"
      >
        <Upload className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSchedule(dossier)}
        title="Schedule task"
      >
        <Calendar className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        title="Delete dossier"
        disabled={isDeleting}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DossierActionButtons;
