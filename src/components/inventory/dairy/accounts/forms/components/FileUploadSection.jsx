
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Check } from "lucide-react";

const FileUploadSection = ({ 
  fileInputRef, 
  fileSelected, 
  handleFileUpload, 
  isUploading, 
  uploadedFileUrl 
}) => {
  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="space-y-2">
        <Label className="block mb-2">Attach Invoice/Receipt</Label>
        
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex-1">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
            
            <div 
              className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {fileSelected ? fileSelected.name : "Click to select file"}
              </p>
            </div>
          </div>
          
          <Button 
            type="button"
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleFileUpload}
            disabled={!fileSelected || isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
        
        {uploadedFileUrl && (
          <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span className="text-sm">File uploaded successfully</span>
            </div>
            <a 
              href={uploadedFileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm underline"
            >
              View File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;
