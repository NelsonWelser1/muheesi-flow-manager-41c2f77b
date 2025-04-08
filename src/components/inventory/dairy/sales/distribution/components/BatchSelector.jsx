
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const BatchSelector = ({ 
  batchEntries, 
  loading, 
  handleBatchSelect, 
  register 
}) => {
  // Filter out any entries with empty or undefined id/display_label
  const validBatchEntries = batchEntries.filter(entry => 
    entry && (entry.id || entry.display_label)
  );
  
  return (
    <div className="space-y-2">
      <Label>Product Batch ID</Label>
      <Select onValueChange={handleBatchSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select a batch from goods issues" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading">Loading...</SelectItem>
          ) : validBatchEntries.length > 0 ? (
            validBatchEntries.map((entry) => (
              <SelectItem 
                key={entry.id || `entry-${entry.display_label}`} 
                value={entry.id || `entry-${entry.display_label}`}
              >
                {entry.display_label || 'Unnamed batch'}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-batches">No available batch entries found</SelectItem>
          )}
        </SelectContent>
      </Select>
      <Input type="hidden" {...register("batch_id")} />
    </div>
  );
};

export default BatchSelector;
