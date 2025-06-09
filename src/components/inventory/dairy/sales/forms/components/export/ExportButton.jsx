
import React from 'react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const ExportButton = ({ icon: Icon, label, onClick, disabled = false }) => {
  return (
    <DropdownMenuItem 
      onClick={onClick} 
      disabled={disabled}
      className="flex items-center gap-2 cursor-pointer"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </DropdownMenuItem>
  );
};

export default ExportButton;
