
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const DocumentUploadTracker = ({ 
  uploadStatus, 
  progress, 
  error, 
  fileName, 
  onRetry 
}) => {
  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };
  
  // Determine status display
  const getStatusDisplay = () => {
    switch (uploadStatus) {
      case 'uploading':
        return {
          title: 'Uploading document...',
          description: `${progress}% complete`,
          icon: <Clock className="h-5 w-5 text-blue-500" />,
          color: 'border-blue-500 bg-blue-50',
          showProgress: true,
        };
      case 'success':
        return {
          title: 'Upload complete',
          description: 'Document has been successfully uploaded',
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          color: 'border-green-500 bg-green-50',
          showProgress: false,
        };
      case 'error':
        return {
          title: 'Upload failed',
          description: error || 'There was an error uploading your document',
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          color: 'border-red-500 bg-red-50',
          showProgress: false,
        };
      case 'verifying':
        return {
          title: 'Verifying document...',
          description: 'Please wait while we verify your document',
          icon: <RefreshCw className="h-5 w-5 text-amber-500 animate-spin" />,
          color: 'border-amber-500 bg-amber-50',
          showProgress: true,
        };
      default:
        return {
          title: 'Processing...',
          description: 'Please wait',
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          color: 'border-gray-300 bg-gray-50',
          showProgress: true,
        };
    }
  };

  // Get status display information
  const statusDisplay = getStatusDisplay();

  // Handle retry
  const handleRetry = () => {
    if (onRetry) onRetry();
  };

  return (
    <div className="my-4">
      <Alert className={`flex items-start ${statusDisplay.color} shadow-sm`}>
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {statusDisplay.icon}
        </div>
        <div className="flex-grow">
          <AlertTitle className="font-semibold mb-1">{statusDisplay.title}</AlertTitle>
          <AlertDescription className="text-sm">
            {fileName && (
              <div className="font-medium text-gray-700 mb-1">{fileName}</div>
            )}
            <div>{statusDisplay.description}</div>
          </AlertDescription>
          
          {statusDisplay.showProgress && (
            <Progress value={progress} className="h-2 mt-2" />
          )}
          
          {uploadStatus === 'error' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Retry Upload
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};

// This function is for the logic that would typically be in the document upload component
export const uploadFileWithRetry = async (
  supabase,
  file,
  initialFilePath,
  progressCallback = null
) => {
  const maxRetries = 3;
  let attempt = 0;
  let lastError = null;
  let updatedFilePath = initialFilePath; // Use a variable we can update
  
  while (attempt < maxRetries) {
    attempt++;
    
    try {
      console.log(`Upload attempt ${attempt}/${maxRetries} for file: ${updatedFilePath}`);
      
      if (progressCallback) {
        // Update progress based on attempt
        const baseProgress = 20 + (attempt - 1) * 10;
        progressCallback(baseProgress);
      }
      
      // Attempt the upload
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(updatedFilePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        console.warn(`Upload attempt ${attempt} failed:`, error);
        lastError = error;
        
        // If this error indicates the bucket doesn't exist, break and don't retry
        if (error.message.includes('not found') && error.message.includes('bucket')) {
          console.error('Bucket not found, abandoning retry attempts');
          break;
        }
        
        // Try an alternative path if it might be a path issue
        if (error.message.includes('not found') || error.statusCode === 404) {
          console.log('Trying alternative path...');
          
          // Simplify the path by removing subfolders
          const parts = updatedFilePath.split('/');
          const simplePath = parts[parts.length - 1];
          
          const { data: altData, error: altError } = await supabase.storage
            .from('documents')
            .upload(simplePath, file, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (!altError) {
            console.log('Retry upload succeeded with simplified path');
            // Update the file path for database record
            updatedFilePath = simplePath;
          }
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      
      console.log(`Upload succeeded on attempt ${attempt}`);
      
      if (progressCallback) {
        progressCallback(60);
      }
      
      return { success: true, data, path: updatedFilePath };
    } catch (err) {
      console.error(`Unexpected error during upload attempt ${attempt}:`, err);
      lastError = err;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  console.error(`Upload failed after ${maxRetries} attempts`);
  return { success: false, error: lastError };
};

export default DocumentUploadTracker;
