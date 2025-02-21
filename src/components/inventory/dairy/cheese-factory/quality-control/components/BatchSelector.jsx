
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
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{selectedBatch.batch_id}</span>
                <span className="text-sm text-muted-foreground">
                  {selectedBatch.source}
                </span>
              </div>
            ) : (
              "Select production batch..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <div className="flex items-center gap-2 p-2 border-b">
              <CommandInput
                placeholder="Search batch ID or production line..."
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
                      className="flex flex-col items-start py-3"
                    >
                      <div className="flex items-center w-full">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedBatch?.batch_id === batch.batch_id 
                              ? "opacity-100" 
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{batch.batch_id}</span>
                            <span className={cn(
                              "text-xs px-2 py-1 rounded",
                              batch.source === 'International' 
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            )}>
                              {batch.source}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {batch.details.type} • {batch.details.date}
                          </div>
                        </div>
                      </div>
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
