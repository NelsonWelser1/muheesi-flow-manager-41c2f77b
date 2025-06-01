
import { useState, useRef, useEffect } from 'react';

export const useFileUploadState = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [filePreviewUrl, setFilePreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileSelected(file);
      setUploadedFileUrl("");
      
      // Create preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setFilePreviewUrl(previewUrl);
    }
  };

  const resetFileState = () => {
    setFileSelected(null);
    setUploadedFileUrl("");
    setFilePreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  return {
    isUploading,
    setIsUploading,
    fileSelected,
    uploadedFileUrl,
    setUploadedFileUrl,
    filePreviewUrl,
    fileInputRef,
    handleFileChange,
    resetFileState
  };
};
