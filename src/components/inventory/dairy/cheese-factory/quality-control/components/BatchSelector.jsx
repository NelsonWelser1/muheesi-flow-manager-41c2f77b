
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const BatchSelector = ({ 
  fetchingBatches, 
  selectedBatch, 
  open, 
  setOpen, 
  searchQuery = '',
  setSearchQuery,
  filteredBatches = [],
  onSelectBatch,
  refetchBatches
}) => {
  const handleRefresh = async (e) => {
    e.preventDefault();
    await refetchBatches();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="batchId">Production Batch IDs</Label>
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
              "Select production batch..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <div className="flex items-center gap-2 p-2">
              <CommandInput
                placeholder="Search batch ID..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="h-9 flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                className="h-9 w-9"
                disabled={fetchingBatches}
              >
                <RefreshCw className={cn("h-4 w-4", fetchingBatches && "animate-spin")} />
              </Button>
            </div>
            <CommandList>
              {filteredBatches.length === 0 ? (
                <CommandEmpty>
                  {fetchingBatches ? 'Loading batches...' : 'No batch found.'}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredBatches.map((batch) => (
                    <CommandItem
                      key={batch.batch_id}
                      value={batch.batch_id}
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BatchSelector;
