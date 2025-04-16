
import React from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
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
import { cn } from "@/lib/utils";

const entities = [
  { value: "all", label: "All Entities" },
  { value: "grand-berna", label: "Grand Berna Dairies" },
  { value: "kajon-coffee", label: "KAJON Coffee Limited" },
  { value: "kazo-coffee", label: "Kazo Coffee Development Association" },
  { value: "kyalima-farmers", label: "Kyalima Farmers" },
  { value: "bukomero-dairy", label: "Bukomero Dairy Farm" },
  { value: "kakyinga-farm", label: "Kakyinga Mixed Farm" },
  { value: "fresheco", label: "Fresheco Farming Limited" },
  { value: "personal", label: "Personal Ventures" },
];

const EntitySelector = ({ selectedEntity, onEntityChange }) => {
  const [open, setOpen] = React.useState(false);
  
  const selectedEntityName = entities.find(entity => entity.value === selectedEntity)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedEntityName || "Select entity..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search entity..." />
          <CommandEmpty>No entity found.</CommandEmpty>
          <CommandGroup>
            {entities.map((entity) => (
              <CommandItem
                key={entity.value}
                value={entity.value}
                onSelect={(currentValue) => {
                  onEntityChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedEntity === entity.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {entity.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EntitySelector;
