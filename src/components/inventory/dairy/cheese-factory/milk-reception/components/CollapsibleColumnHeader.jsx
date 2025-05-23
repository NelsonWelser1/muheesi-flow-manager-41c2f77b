
import React from 'react';
import { TableHead } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CollapsibleColumnHeader = ({ 
  children, 
  isVisible, 
  onToggle, 
  className = "",
  ...props 
}) => {
  return (
    <TableHead className={`${className} relative`} {...props}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-4 w-4 p-0 hover:bg-gray-200"
        >
          {isVisible ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
        <span>{children}</span>
      </div>
    </TableHead>
  );
};

export default CollapsibleColumnHeader;
