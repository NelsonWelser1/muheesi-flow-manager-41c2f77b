
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const ContractActionButton = ({ icon: Icon, label, onClick, ...props }) => {
  return (
    <Button
      variant="default"
      className="flex items-center gap-1 w-full justify-start px-3"
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </Button>
  );
};

export default ContractActionButton;
