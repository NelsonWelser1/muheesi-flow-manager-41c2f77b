
import React from 'react';
import { Check, ChevronsUpDown, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const entities = [
  { value: "all", label: "All Entities", count: 8 },
  { value: "grand-berna", label: "Grand Berna Dairies", count: 12 },
  { value: "kajon-coffee", label: "KAJON Coffee Limited", count: 8 },
  { value: "kazo-coffee", label: "Kazo Coffee Development Association", count: 5 },
  { value: "kyalima-farmers", label: "Kyalima Farmers", count: 15 },
  { value: "bukomero-dairy", label: "Bukomero Dairy Farm", count: 9 },
  { value: "kakyinga-farm", label: "Kakyinga Mixed Farm", count: 4 },
  { value: "fresheco", label: "Fresheco Farming Limited", count: 7 },
  { value: "personal", label: "Personal Ventures", count: 3 },
];

const EntitySelector = ({ selectedEntity, onEntityChange }) => {
  const [open, setOpen] = React.useState(false);
  
  const selectedEntityName = entities.find(entity => entity.value === selectedEntity)?.label;
  
  const handleEntityChange = (value) => {
    onEntityChange(value);
    toast.success(`Switched to ${entities.find(entity => entity.value === value)?.label || 'All Entities'}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{selectedEntityName || "Select entity..."}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search entity..." />
          <CommandEmpty>No entity found.</CommandEmpty>
          <CommandGroup>
            {entities.map((entity) => (
              <CommandItem
                key={entity.value}
                value={entity.value}
                onSelect={handleEntityChange}
                className="flex justify-between items-center"
              >
                <div className="flex items-center">
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedEntity === entity.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{entity.label}</span>
                </div>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {entity.count}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EntitySelector;
