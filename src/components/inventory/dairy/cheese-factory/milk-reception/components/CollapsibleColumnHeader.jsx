
import React from 'react';
import { TableHead } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const CollapsibleColumnHeader = ({ 
  title,
  sortKey,
  sortConfig,
  onSort,
  className = "",
  ...props 
}) => {
  const isActive = sortConfig?.key === sortKey;
  const direction = sortConfig?.direction;

  const handleSort = () => {
    if (onSort && sortKey) {
      onSort(sortKey);
    }
  };

  return (
    <TableHead className={`${className} relative cursor-pointer`} {...props}>
      <div className="flex items-center gap-2" onClick={handleSort}>
        <span className="font-medium">{title}</span>
        {sortKey && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-gray-200"
          >
            {isActive && direction === 'desc' ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronUp className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </TableHead>
  );
};

export default CollapsibleColumnHeader;
