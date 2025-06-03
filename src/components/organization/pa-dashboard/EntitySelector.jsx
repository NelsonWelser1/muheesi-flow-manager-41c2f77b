
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from 'lucide-react';

const EntitySelector = ({ selectedEntity, onEntityChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedEntity} onValueChange={onEntityChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select entity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Companies</SelectItem>
          <SelectItem value="Grand Berna Dairies">Grand Berna Dairies</SelectItem>
          <SelectItem value="KAJON Coffee Limited">KAJON Coffee Limited</SelectItem>
          <SelectItem value="Kyalima Farmers Limited">Kyalima Farmers Limited</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EntitySelector;
