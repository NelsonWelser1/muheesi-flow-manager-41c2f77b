
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const BatchSelector = ({ 
  fetchingBatches, 
  selectedBatch, 
  open, 
  setOpen, 
  searchQuery = '',
  setSearchQuery,
  filteredBatches = [],
  onSelectBatch
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="batchId">Batch ID</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={fetchingBatches}
          >
            {fetchingBatches ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading batches...
              </div>
            ) : selectedBatch ? (
              selectedBatch.label
            ) : (
              "Select batch..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search batch ID..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            {filteredBatches.length === 0 ? (
              <CommandEmpty>No batch found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredBatches.map((batch) => (
                  <CommandItem
                    key={batch.batch_id}
                    onSelect={() => {
                      onSelectBatch(batch);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBatch?.batch_id === batch.batch_id 
                          ? "opacity-100" 
                          : "opacity-0"
                      )}
                    />
                    {batch.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BatchSelector;
