
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ViewRecordsButton = ({ recordType, to }) => {
  const navigate = useNavigate();
  
  const handleViewRecords = () => {
    navigate(to);
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleViewRecords}
      className="flex items-center gap-2"
    >
      <FileText className="h-4 w-4" />
      View Records
    </Button>
  );
};

export default ViewRecordsButton;
