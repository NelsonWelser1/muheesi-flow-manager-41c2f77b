
import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, File, X, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/supabase";
import { useQuery } from '@tanstack/react-query';

const FILE_CATEGORIES = [
  "Contract",
  "Resume/CV",
  "ID Document",
  "Certificate",
  "Performance Review",
  "Training Record",
  "Medical Record",
  "Payslip",
  "Letter",
  "Other"
];

const DossierUploader = ({ dossier, onBack }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(dossier?.employee_id || '');
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // Fetch employees for dropdown if no specific dossier provided
  const { data: employees = [] } = useQuery({
    queryKey: ['employeesList'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personnel_employee_records')
        .select('id, employee_id')
        .order('employee_id', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !dossier
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2),
      name: file.name,
      size: (file.size / 1024).toFixed(2), // KB
      type: file.type,
      category: FILE_CATEGORIES[0],
      progress: 0,
      uploaded: false,
      error: null
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    const newFiles = droppedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2),
      name: file.name,
      size: (file.size / 1024).toFixed(2), // KB
      type: file.type,
      category: FILE_CATEGORIES[0],
      progress: 0,
      uploaded: false,
      error: null
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const updateFileCategory = (id, category) => {
    setFiles(files.map(file => 
      file.id === id ? { ...file, category } : file
    ));
  };

  const handleUpload = async () => {
    if (!selectedEmployee) {
      toast({
        title: "Employee Required",
        description: "Please select an employee for these documents.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please add files to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    // Get currently logged in user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload files.",
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    let hasError = false;

    for (const fileData of files) {
      if (fileData.uploaded) continue;
      
      try {
        // Update progress
        setFiles(files.map(f => 
          f.id === fileData.id ? { ...f, progress: 30 } : f
        ));
        
        // Upload to Supabase Storage
        const filename = `${selectedEmployee}/${Date.now()}_${fileData.name}`;
        const { error: uploadError } = await supabase.storage
          .from('employee_documents')
          .upload(filename, fileData.file);
        
        if (uploadError) throw uploadError;
        
        // Update progress
        setFiles(files.map(f => 
          f.id === fileData.id ? { ...f, progress: 70 } : f
        ));
        
        // Create database record
        const { error: dbError } = await supabase
          .from('personnel_documents')
          .insert([{
            employee_id: selectedEmployee,
            filename: fileData.name,
            file_path: filename,
            file_type: fileData.type,
            file_size: fileData.size,
            category: fileData.category,
            uploaded_by: user.id
          }]);
        
        if (dbError) throw dbError;
        
        // Mark as uploaded
        setFiles(files.map(f => 
          f.id === fileData.id ? { ...f, progress: 100, uploaded: true, error: null } : f
        ));
        
      } catch (error) {
        console.error("Upload error:", error);
        hasError = true;
        
        // Mark as failed
        setFiles(files.map(f => 
          f.id === fileData.id ? { ...f, progress: 0, error: error.message } : f
        ));
      }
    }

    setUploading(false);
    
    if (!hasError) {
      toast({
        title: "Files Uploaded",
        description: "All documents have been successfully uploaded.",
      });
    } else {
      toast({
        title: "Upload Issues",
        description: "Some files could not be uploaded. Please check the error messages.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h2 className="text-2xl font-bold">Upload Documents</h2>
        <Button 
          onClick={handleUpload} 
          disabled={uploading || files.length === 0 || !selectedEmployee}
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" /> Upload All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Employee</CardTitle>
        </CardHeader>
        <CardContent>
          {dossier ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <FileText className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">{dossier.employee_id}</p>
                <p className="text-sm text-gray-500">{dossier.job_title}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.employee_id}>
                      {emp.employee_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <h3 className="text-lg font-medium mb-1">Drag & drop files, or click to browse</h3>
            <p className="text-sm text-gray-500">Upload PDF, DOCX, JPG, PNG (max 10MB per file)</p>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Files to upload ({files.length})</h3>
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className={`p-3 rounded-md border flex flex-col md:flex-row md:items-center gap-3 ${
                    file.error ? 'bg-red-50 border-red-200' : 
                    file.uploaded ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-grow">
                    <File className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-grow">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.type.split('/')[1]} · {file.size} KB</p>
                      {file.error && <p className="text-xs text-red-500 mt-1">{file.error}</p>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:ml-auto">
                    <Select
                      value={file.category}
                      onValueChange={(value) => updateFileCategory(file.id, value)}
                      disabled={file.uploaded}
                    >
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {FILE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {file.uploaded ? (
                      <Button variant="ghost" size="icon" className="text-green-500" disabled>
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeFile(file.id)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DossierUploader;
