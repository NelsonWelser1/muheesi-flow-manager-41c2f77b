
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

const NotesSection = ({ 
  initialData = {}, 
  onDataChange,
  editMode = true,
  bgColor = "#fff3e0",
  variant = "notes" // "notes", "payment", "shipping", etc.
}) => {
  const [sectionTitle, setSectionTitle] = useState(
    initialData.sectionTitle || 
    (variant === "payment" ? "PAYMENT TERMS" : 
     variant === "shipping" ? "SHIPPING TERMS" : "NOTES")
  );
  
  const [notesItems, setNotesItems] = useState(initialData.notesItems || [
    { 
      id: 1, 
      text: variant === "payment" ? "Payment terms: Net 30 days from date of invoice" : 
            variant === "shipping" ? "Delivery terms: Ex-Works Kampala" :
            "Payment terms: Net 30 days from date of invoice"
    },
    { 
      id: 2, 
      text: variant === "payment" ? "All banking charges outside Uganda to be borne by the Buyer" :
            variant === "shipping" ? "Transportation to be arranged by buyer" :
            "Delivery terms: Ex-Works Kampala" 
    }
  ]);

  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ 
        sectionTitle, 
        notesItems 
      });
    }
  }, [sectionTitle, notesItems, onDataChange]);
  
  // Add a new note item
  const addNoteItem = () => {
    const newId = notesItems.length > 0 ? Math.max(...notesItems.map(item => item.id)) + 1 : 1;
    setNotesItems([...notesItems, { id: newId, text: "New item" }]);
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
      {editMode ? (
        <div className="flex items-center gap-2">
          <Input 
            className={`font-bold text-xl bg-[${bgColor}] px-4 py-2`}
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
          />
        </div>
      ) : (
        <h3 className="text-lg font-bold mb-2 text-blue-800">{sectionTitle}</h3>
      )}
      
      <div className={editMode ? "space-y-3" : "border rounded p-3 bg-gray-50"}>
        {editMode ? (
          <>
            {notesItems.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <Textarea 
                  className="w-full min-h-[80px] p-4 border rounded-md flex-grow" 
                  placeholder="Add text here..."
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
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {notesItems.map((item) => (
              <li key={item.id} className="text-sm">{item.text}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotesSection;
