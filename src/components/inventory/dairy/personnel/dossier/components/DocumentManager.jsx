
import React, { useState, useRef } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, FileText, FileImage, Trash2, 
  Eye, Loader2, RefreshCw, File, AlertCircle
} from "lucide-react";

const FILE_CATEGORIES = [
  "General",
  "ID Document",
  "Contract",
  "Resume/CV",
  "Certificate",
  "Performance Review",
  "Training Record",
  "Medical Record",
  "Other"
];

const DocumentManager = ({ employeeId }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState(FILE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const {
    documents,
    isLoading,
    uploadFile,
    deleteDocument,
    getFileUrl,
    refetchDocuments,
    isDeleting
  } = useDocuments(employeeId);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name, file.type, file.size);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    
    // Debug information before upload
    console.log('Upload requested with:', {
      file: selectedFile,
      employeeId,
      category,
      description
    });
    
    try {
      await uploadFile(selectedFile, employeeId, category, description);
      // Reset form after successful upload
      setSelectedFile(null);
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (document) => {
    // Debug information before delete
    console.log('Delete requested for document:', document);
    
    if (confirm(`Are you sure you want to delete "${document.filename}"?`)) {
      await deleteDocument(document.id, document.file_path);
    }
  };

  const handleView = (document) => {
    // Debug information before view
    console.log('View requested for document:', document);
    
    const url = getFileUrl(document.file_path);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const isImageFile = (fileType) => {
    return fileType && fileType.startsWith('image/');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Attached Documents</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetchDocuments()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Upload Form */}
        <div className="border rounded-md p-4 bg-gray-50 mb-6">
          <h3 className="font-medium mb-3">Upload New Document</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">Select File (Max 5MB)</Label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" /> 
                    {selectedFile ? selectedFile.name : "Choose File"}
                  </Button>
                  
                  {selectedFile && (
                    <div className="p-2 bg-blue-50 rounded-md flex items-center gap-2 text-sm">
                      {isImageFile(selectedFile.type) ? 
                        <FileImage className="h-4 w-4" /> : 
                        <FileText className="h-4 w-4" />
                      }
                      <span>
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="mb-1 block">Document Category</Label>
                <Select 
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="mb-1 block">Description (Optional)</Label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the document"
              />
            </div>
            
            <Button 
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading || !employeeId}
              className="w-full flex items-center justify-center gap-2"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} 
              {uploading ? "Uploading..." : "Upload Document"}
            </Button>
            
            {!employeeId && (
              <div className="text-amber-600 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                <span>Save employee information first to enable document uploads</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Document List */}
        <div className="space-y-3">
          <h3 className="font-medium">Document List</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : documents.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="py-3 flex items-center justify-between hover:bg-gray-50 rounded-md p-2"
                >
                  <div className="flex items-center gap-3">
                    {isImageFile(doc.file_type) ? (
                      <FileImage className="h-8 w-8 p-1 bg-blue-50 text-blue-500 rounded" />
                    ) : (
                      <File className="h-8 w-8 p-1 bg-gray-50 text-gray-500 rounded" />
                    )}
                    
                    <div className="overflow-hidden">
                      <p className="font-medium truncate" title={doc.filename}>
                        {doc.filename}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{doc.category || 'General'}</span>
                        <span>•</span>
                        <span>{doc.file_size} KB</span>
                        <span>•</span>
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-gray-600 truncate" title={doc.description}>
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(doc)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      {isDeleting ? 
                        <Loader2 className="h-4 w-4 animate-spin" /> : 
                        <Trash2 className="h-4 w-4" />
                      }
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No documents have been uploaded yet.</p>
              {employeeId && (
                <p className="text-sm mt-1">
                  Use the form above to upload your first document.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentManager;
