
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, Trash2, Edit, MoreHorizontal } from "lucide-react";

const DeliveryActionsMenu = ({ delivery, handleDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          <span>View Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(delivery.id)}>
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          <span className="text-red-500">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeliveryActionsMenu;
