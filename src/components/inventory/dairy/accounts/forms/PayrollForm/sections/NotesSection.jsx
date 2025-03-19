
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const NotesSection = ({ register }) => {
  return (
    <div className="space-y-2">
      <Label>Notes</Label>
      <Input {...register("notes")} placeholder="Additional notes (optional)" />
    </div>
  );
};

export default NotesSection;
