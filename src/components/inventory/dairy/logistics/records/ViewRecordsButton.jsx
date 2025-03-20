
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ViewRecordsButton = ({ recordType, to }) => {
  const navigate = useNavigate();
  
  const handleViewRecords = () => {
    // Ensure we have a valid URL
    const validUrl = to || `/manage-inventory/logistics/records/${recordType || 'deliveries'}`;
    console.log("Navigating to:", validUrl);
    
    // Use setTimeout to ensure the navigation happens after the current event loop
    setTimeout(() => {
      navigate(validUrl);
    }, 0);
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
