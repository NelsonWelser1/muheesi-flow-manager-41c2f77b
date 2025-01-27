import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/supabase';

const AddCleaningRecord = ({ tankId, onRecordAdded }) => {
  const [cleanedAt, setCleanedAt] = React.useState(new Date());
  const [notes, setNotes] = React.useState('');
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('cleaning_records')
        .insert([{
          tank_id: tankId,
          cleaned_at: cleanedAt.toISOString(),
          notes,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cleaning record added successfully",
      });

      // Update tank's last cleaned timestamp
      await supabase
        .from('storage_tanks')
        .update({ last_cleaned_at: cleanedAt.toISOString() })
        .eq('id', tankId);

      onRecordAdded?.();
      setNotes('');
    } catch (error) {
      console.error('Error adding cleaning record:', error);
      toast({
        title: "Error",
        description: "Failed to add cleaning record",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cleaned-at">Cleaning Date & Time</Label>
        <DatePicker
          date={cleanedAt}
          onDateChange={setCleanedAt}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter cleaning notes"
        />
      </div>

      <Button type="submit">Add Cleaning Record</Button>
    </form>
  );
};

export default AddCleaningRecord;