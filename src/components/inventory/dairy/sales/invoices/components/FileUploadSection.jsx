
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

const FileUploadSection = ({ filePreview, handleFileChange }) => {
  return (
    <div className="space-y-2">
      <Label>Attach Payment Proof (JPG, PNG, PDF, max 5MB)</Label>
      <div className="flex flex-col gap-3">
        <Input 
          type="file" 
          accept=".jpg,.jpeg,.png,.pdf" 
          onChange={handleFileChange}
          className="max-w-md"
        />
        
        {filePreview && (
          <div className="p-2 border rounded-md max-w-md">
            {filePreview.startsWith('data:image') ? (
              <img 
                src={filePreview} 
                alt="Payment proof preview" 
                className="h-24 object-contain"
              />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Upload className="h-4 w-4" />
                {filePreview}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;
