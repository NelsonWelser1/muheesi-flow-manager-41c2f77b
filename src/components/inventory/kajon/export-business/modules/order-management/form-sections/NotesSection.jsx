
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NotesSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input 
          className="font-bold text-xl bg-[#fff3e0] px-4 py-2"
          defaultValue="NOTES" 
        />
      </div>
      <Textarea 
        className="w-full min-h-[100px] p-4 border rounded-md" 
        placeholder="Add any additional notes or terms here..."
      />
    </div>
  );
};

export default NotesSection;
