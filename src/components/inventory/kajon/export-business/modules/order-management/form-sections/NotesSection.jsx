import React from 'react';

const NotesSection = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">NOTES</h2>
      <textarea 
        className="w-full min-h-[100px] p-4 border rounded-md" 
        placeholder="Add any additional notes or terms here..."
      />
    </div>
  );
};

export default NotesSection;