
import React from 'react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getStatusColor } from '../utils/statusUtils';

const RecordDetailsDialog = ({ record, open, onOpenChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recruitment Record Details</DialogTitle>
          <DialogDescription>
            Complete information for this recruitment record.
          </DialogDescription>
        </DialogHeader>
        
        {record && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Candidate:</span>
              <span className="col-span-3">{record.candidate_name}</span>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Job Title:</span>
              <span className="col-span-3">{record.job_title}</span>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Interview:</span>
              <span className="col-span-3">{formatDate(record.interview_date_time)}</span>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Manager ID:</span>
              <span className="col-span-3">{record.hiring_manager_id}</span>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Status:</span>
              <span className="col-span-3">
                <Badge className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </span>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Feedback:</span>
              <span className="col-span-3">{record.feedback || "No feedback provided"}</span>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Created:</span>
              <span className="col-span-3">{formatDate(record.created_at)}</span>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-1">Updated:</span>
              <span className="col-span-3">{formatDate(record.updated_at)}</span>
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordDetailsDialog;
