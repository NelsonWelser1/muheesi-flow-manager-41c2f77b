
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Trash2, Download, Plus, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const DocumentUploadTemplate = () => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [currentUpload, setCurrentUpload] = useState({
    title: '',
    category: '',
    description: '',
    department: '',
    file: null
  });
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const documentCategories = [
    "Standard Operating Procedures",
    "Quality Control Procedures",
    "Safety Guidelines",
    "Equipment Manuals",
    "Training Materials",
    "Compliance Documents",
    "Emergency Procedures",
    "Maintenance Procedures"
  ];

  const departments = [
    "Milk Production",
    "Cheese Production", 
    "Coffee Processing",
    "Quality Assurance",
    "Maintenance",
    "Safety & Health",
    "General Operations"
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a PDF, Word document, or text file.",
          variant: "destructive"
        });
        return;
      }

      setCurrentUpload(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = () => {
    if (!currentUpload.title || !currentUpload.category || !currentUpload.department || !currentUpload.file) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive"
      });
      return;
    }

    const newDocument = {
      id: Date.now(),
      ...currentUpload,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: (currentUpload.file.size / 1024).toFixed(1) + ' KB',
      status: 'Uploaded'
    };

    setUploadedDocuments(prev => [...prev, newDocument]);
    setCurrentUpload({
      title: '',
      category: '',
      description: '',
      department: '',
      file: null
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast({
      title: "Document Uploaded",
      description: "Your operational procedure document has been successfully uploaded.",
    });
  };

  const handleRemoveDocument = (id) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Document Removed",
      description: "The document has been removed from the list.",
    });
  };

  const downloadTemplate = (templateType) => {
    toast({
      title: "Template Downloaded",
      description: `${templateType} template has been downloaded.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-green-600" />
            Document Upload Template - Operational Procedures
          </CardTitle>
          <p className="text-gray-600">
            Use this template to upload additional operational procedures and safety documents for your production areas.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Downloads */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Download Document Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "SOP Template", type: "Standard Operating Procedure" },
                { name: "Safety Checklist", type: "Safety Guidelines" },
                { name: "Quality Control", type: "QC Procedure" },
                { name: "Training Manual", type: "Training Material" }
              ].map((template, index) => (
                <Card key={index} className="border-dashed border-2 hover:border-green-300 transition-colors">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">{template.name}</h4>
                    <p className="text-xs text-gray-600 mb-3">{template.type}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadTemplate(template.name)}
                      className="w-full"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upload Form */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Upload New Document</h3>
            <Card className="border-green-200">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="document-title">Document Title *</Label>
                    <Input
                      id="document-title"
                      placeholder="e.g., Milk Tank Cleaning Procedure"
                      value={currentUpload.title}
                      onChange={(e) => setCurrentUpload(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Document Category *</Label>
                    <Select value={currentUpload.category} onValueChange={(value) => setCurrentUpload(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentCategories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department/Area *</Label>
                    <Select value={currentUpload.department} onValueChange={(value) => setCurrentUpload(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Upload File *</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                    />
                    <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX, TXT (Max 10MB)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the document contents and its purpose..."
                    value={currentUpload.description}
                    onChange={(e) => setCurrentUpload(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                {currentUpload.file && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{currentUpload.file.name}</span>
                        <Badge variant="secondary">{(currentUpload.file.size / 1024).toFixed(1)} KB</Badge>
                      </div>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                )}

                <Button onClick={handleUpload} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Uploaded Documents List */}
          {uploadedDocuments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-900">Document Title</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-900">Category</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-900">Department</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-900">Upload Date</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {uploadedDocuments.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-4 py-3 font-medium">{doc.title}</td>
                            <td className="px-4 py-3">{doc.category}</td>
                            <td className="px-4 py-3">{doc.department}</td>
                            <td className="px-4 py-3">{doc.uploadDate}</td>
                            <td className="px-4 py-3">
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {doc.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Download className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveDocument(doc.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Document Guidelines:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure all procedures follow company standards and regulatory requirements</li>
              <li>• Include version numbers and effective dates in your documents</li>
              <li>• Specify responsible personnel and approval signatures</li>
              <li>• Use clear, step-by-step instructions with safety warnings where applicable</li>
              <li>• Review and update documents annually or when processes change</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUploadTemplate;
