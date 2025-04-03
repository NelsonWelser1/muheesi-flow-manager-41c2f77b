
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const NotesSection = ({ initialData = {} }) => {
  const [sectionTitle, setSectionTitle] = useState(initialData.sectionTitle || "NOTES");
  const [notesContent, setNotesContent] = useState(initialData.notesContent || "");
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input 
          className="font-bold text-xl bg-[#fff3e0] px-4 py-2"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
        />
      </div>
      <Textarea 
        className="w-full min-h-[100px] p-4 border rounded-md" 
        placeholder="Add any additional notes or terms here..."
        value={notesContent}
        onChange={(e) => setNotesContent(e.target.value)}
      />
    </div>
  );
};

export default NotesSection;
