
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const NotesField = ({ register }) => {
  return (
    <div className="space-y-2">
      <Label>Notes</Label>
      <Textarea 
        {...register("notes")} 
        placeholder="Additional notes (optional)"
        rows={3}
      />
    </div>
  );
};

export default NotesField;
