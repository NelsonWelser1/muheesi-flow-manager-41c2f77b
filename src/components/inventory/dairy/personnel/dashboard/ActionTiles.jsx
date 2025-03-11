
import React from 'react';
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, UserPlus, FolderIcon } from "lucide-react";

const ActionTiles = ({ onComponentSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Button
        variant="outline"
        className="h-32 flex flex-col items-center justify-center space-y-2 bg-blue-50 hover:bg-blue-100"
        onClick={() => onComponentSelect("Employee Records & Scheduling")}
      >
        <Users className="h-8 w-8" />
        <span className="text-lg font-semibold">Employee Records</span>
      </Button>

      <Button
        variant="outline"
        className="h-32 flex flex-col items-center justify-center space-y-2 bg-green-50 hover:bg-green-100"
        onClick={() => onComponentSelect("Training & Performance")}
      >
        <GraduationCap className="h-8 w-8" />
        <span className="text-lg font-semibold">Training & Performance</span>
      </Button>

      <Button
        variant="outline"
        className="h-32 flex flex-col items-center justify-center space-y-2 bg-purple-50 hover:bg-purple-100"
        onClick={() => onComponentSelect("Recruitment Management")}
      >
        <UserPlus className="h-8 w-8" />
        <span className="text-lg font-semibold">Recruitment</span>
      </Button>

      <Button
        variant="outline"
        className="h-32 flex flex-col items-center justify-center space-y-2 bg-amber-50 hover:bg-amber-100"
        onClick={() => onComponentSelect("Employee Dossiers")}
      >
        <FolderIcon className="h-8 w-8" />
        <span className="text-lg font-semibold">Employee Dossiers</span>
      </Button>
    </div>
  );
};

export default ActionTiles;
