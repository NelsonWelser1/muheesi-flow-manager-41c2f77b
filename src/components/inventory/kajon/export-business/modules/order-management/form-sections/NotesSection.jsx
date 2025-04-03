
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

const NotesSection = ({ initialData = {} }) => {
  const [sectionTitle, setSectionTitle] = useState(initialData.sectionTitle || "NOTES");
  const [notesItems, setNotesItems] = useState(initialData.notesItems || [
    { id: 1, text: "Payment terms: Net 30 days from date of invoice" },
    { id: 2, text: "Delivery terms: Ex-Works Kampala" }
  ]);
  
  // Add a new note item
  const addNoteItem = () => {
    const newId = notesItems.length > 0 ? Math.max(...notesItems.map(item => item.id)) + 1 : 1;
    setNotesItems([...notesItems, { id: newId, text: "New note item" }]);
  };

  // Update a note item
  const updateNoteItem = (id, newText) => {
    setNotesItems(prevItems => 
      prevItems.map(item => item.id === id ? { ...item, text: newText } : item)
    );
  };

  // Remove a note item
  const removeNoteItem = (id) => {
    setNotesItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input 
          className="font-bold text-xl bg-[#fff3e0] px-4 py-2"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
        />
      </div>
      
      <div className="space-y-3">
        {notesItems.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <Textarea 
              className="w-full min-h-[80px] p-4 border rounded-md flex-grow" 
              placeholder="Add note text here..."
              value={item.text}
              onChange={(e) => updateNoteItem(item.id, e.target.value)}
            />
            <Button 
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeNoteItem(item.id)}
              className="text-red-500 hover:text-red-700 mt-1"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button 
          type="button" 
          onClick={addNoteItem} 
          size="sm" 
          className="flex items-center gap-1 mt-2"
        >
          <Plus className="h-4 w-4" /> Add Note
        </Button>
      </div>
    </div>
  );
};

export default NotesSection;
