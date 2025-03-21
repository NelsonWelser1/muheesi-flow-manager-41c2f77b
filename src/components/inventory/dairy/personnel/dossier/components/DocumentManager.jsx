
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Trash2, File, FileImage, FileArchive, FilePlus } from "lucide-react";
import { useDocuments } from '../hooks/useDocuments';
import { format } from 'date-fns';

const DOCUMENT_CATEGORIES = [
  "General", 
  "ID Documents", 
  "Contracts", 
  "Certifications", 
  "Performance Reviews", 
  "Training Records",
  "Health & Safety",
  "Other"
];

const DocumentManager = ({ employeeId }) => {
  const fileInputRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [fileError, setFileError] = useState('');
  
  const { 
    documents, 
    isLoading, 
    error, 
    uploading, 
    uploadFile, 
    deleteDocument, 
    getFileUrl,
    isDeleting
  } = useDocuments(employeeId);

  // Handle file submission
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setFileError('');
    
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setFileError('Please select a file to upload');
      return;
    }
    
    const file = fileInput.files[0];
    
    // Debugging log for file upload
    console.log('File upload submission:', { 
      file, 
      employeeId, 
      category: selectedCategory, 
      description 
    });
    
    await uploadFile(file, employeeId, selectedCategory, description);
    
    // Reset form
    fileInput.value = '';
    setDescription('');
    setSelectedCategory('General');
  };

  // Get appropriate icon for file type
  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) return <FileImage className="h-4 w-4" />;
    if (fileType?.includes('pdf')) return <FileText className="h-4 w-4" />;
    if (fileType?.includes('zip') || fileType?.includes('compressed')) return <FileArchive className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  // Format file size
  const formatFileSize = (sizeStr) => {
    if (!sizeStr) return 'Unknown';
    // If it's just a number without units, assume KB
    if (!isNaN(sizeStr) && typeof sizeStr === 'string' && !sizeStr.includes(' ')) {
      return `${sizeStr} KB`;
    }
    return sizeStr;
  };

  // Format date string
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  // Handle file download
  const handleDownload = (document) => {
    const url = getFileUrl(document.file_path);
    if (url) {
      // Log download attempt for debugging
      console.log('Downloading file:', document.filename, 'URL:', url);
      
      // Create temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = document.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Handle file deletion
  const handleDelete = (document) => {
    if (window.confirm(`Are you sure you want to delete "${document.filename}"?`)) {
      deleteDocument(document.id, document.file_path);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" /> Upload Document
          </CardTitle>
          <CardDescription>
            Upload documents related to this employee. Max file size: 5MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Category</label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select File</label>
                <Input 
                  ref={fileInputRef} 
                  type="file" 
                  className="cursor-pointer"
                />
                {fileError && <p className="text-xs text-red-500">{fileError}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this document"
                rows={2}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={uploading || isLoading || !employeeId}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
            
            {!employeeId && (
              <p className="text-sm text-amber-600">
                Please save the employee dossier before uploading documents.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Employee Documents
          </CardTitle>
          <CardDescription>
            Manage documents uploaded for this employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading documents...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading documents: {error.message}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FilePlus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="font-medium">No documents</p>
              <p className="text-sm">Upload a document using the form above.</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead className="hidden lg:table-cell">Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.file_type)}
                          <span className="font-medium truncate max-w-[140px]">
                            {doc.filename}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 md:hidden">
                          {doc.category} • {formatFileSize(doc.file_size)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatFileSize(doc.file_size)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-500 text-sm">
                        {formatDate(doc.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(doc)}
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(doc)}
                            disabled={isDeleting}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            title="Delete file"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManager;
