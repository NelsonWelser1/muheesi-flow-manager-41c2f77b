
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Check, FileText, Image } from "lucide-react";

const FileUploadSection = ({ 
  fileInputRef, 
  fileSelected, 
  handleFileUpload, 
  isUploading, 
  uploadedFileUrl 
}) => {
  const getFileIcon = (fileName) => {
    if (!fileName) return <Upload className="h-8 w-8 text-gray-400" />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-green-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
      <Label className="text-sm font-medium">Attach Invoice/Receipt</Label>
      
      <div className="space-y-4">
        {/* File input and drop zone */}
        <div className="w-full">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors min-h-[120px] flex flex-col justify-center items-center"
            onClick={() => fileInputRef.current?.click()}
          >
            {getFileIcon(fileSelected?.name)}
            <div className="mt-3 space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {fileSelected ? fileSelected.name : "Click to select file"}
              </p>
              {fileSelected && (
                <p className="text-xs text-gray-500">
                  {formatFileSize(fileSelected.size)}
                </p>
              )}
              {!fileSelected && (
                <p className="text-xs text-gray-500">
                  Supports: Images, PDF, DOC, DOCX
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Upload button and status */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Button 
            type="button"
            variant="outline" 
            className="flex items-center gap-2 w-full sm:w-auto"
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
          
          {uploadedFileUrl && (
            <div className="flex-1 p-3 bg-green-50 text-green-700 rounded-md">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">File uploaded successfully</span>
                </div>
                <a 
                  href={uploadedFileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm underline hover:no-underline whitespace-nowrap"
                >
                  View File
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Upload progress or error states */}
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;
