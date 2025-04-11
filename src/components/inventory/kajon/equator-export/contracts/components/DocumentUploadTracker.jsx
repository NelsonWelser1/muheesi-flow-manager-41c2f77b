
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, File, FileText, Search, ExternalLink, 
  Trash2, AlertCircle, Check, Clock, Loader2, X,
  ChevronDown, ChevronUp, Filter, Download, Eye
} from "lucide-react";
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/supabase';
import SupabaseDocumentTester from '../utils/SupabaseDocumentTester';

const statusColors = {
  'pending_verification': 'bg-yellow-100 text-yellow-800',
  'verified': 'bg-green-100 text-green-800',
  'rejected': 'bg-red-100 text-red-800',
  'archived': 'bg-gray-100 text-gray-800'
};

const DocumentUploadTracker = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDebugger, setShowDebugger] = useState(false);
  
  // Form state
  const [file, setFile] = useState(null);
  const [contractId, setContractId] = useState('');
  const [client, setClient] = useState('');
  const [notes, setNotes] = useState('');
  const [keywords, setKeywords] = useState('');
  const [signedBy, setSignedBy] = useState('');
  
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  
  // Load documents on component mount
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      
      // Get documents from Supabase
      const { data, error } = await supabase
        .from('contract_documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading documents:', error);
        toast({
          title: "Error loading documents",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setContractId('');
    setClient('');
    setNotes('');
    setKeywords('');
    setSignedBy('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    if (!contractId.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a contract ID",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    setUploadSuccess(false);
    
    try {
      console.log('Starting document upload process...');
      
      // 1. Check if bucket exists or create it
      console.log('Checking documents bucket...');
      setUploadProgress(20);
      
      try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.warn('Unable to list buckets, will try to create directly:', bucketsError);
          
          // Create the bucket if it doesn't exist
          const { error: createError } = await supabase.storage.createBucket('documents', {
            public: true
          });
          
          if (createError && !createError.message.includes('already exists')) {
            console.error('Error creating bucket:', createError);
            throw new Error(`Unable to create storage bucket: ${createError.message}`);
          }
        } else {
          const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
          if (!documentsBucket) {
            console.log('Documents bucket not found, creating it...');
            const { error: createError } = await supabase.storage.createBucket('documents', {
              public: true
            });
            
            if (createError && !createError.message.includes('already exists')) {
              console.error('Error creating bucket:', createError);
              throw new Error(`Unable to create storage bucket: ${createError.message}`);
            }
          }
        }
      } catch (bucketError) {
        console.warn('Bucket check/creation error, will try upload anyway:', bucketError);
        // Continue with upload attempt despite bucket error
      }
      
      // 2. Upload file to Supabase Storage
      console.log('Uploading file to Supabase Storage...');
      setUploadProgress(40);
      
      const timestamp = Date.now();
      const filePath = `contracts/${contractId}/${timestamp}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('File upload failed:', uploadError);
        
        // Try alternative upload path if the folder structure caused issues
        if (uploadError.message.includes('not found') || uploadError.statusCode === 404) {
          console.log('Trying alternative upload path...');
          const simplePath = `contracts/${timestamp}_${file.name}`;
          
          const { data: retryData, error: retryError } = await supabase.storage
            .from('documents')
            .upload(simplePath, file, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (retryError) {
            console.error('Retry upload also failed:', retryError);
            throw new Error(`File upload failed: ${retryError.message}`);
          } else {
            console.log('Retry upload succeeded with simplified path');
            // Update the file path for database record
            filePath = simplePath;
          }
        } else {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }
      }
      
      console.log('File uploaded successfully');
      setUploadProgress(70);
      
      // 3. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      const publicUrl = publicUrlData?.publicUrl || '';
      console.log('Public URL generated:', publicUrl);
      
      // 4. Insert record into database
      console.log('Creating database record...');
      setUploadProgress(80);
      
      // Prepare the document record
      const documentRecord = {
        filename: file.name,
        file_path: filePath,
        file_url: publicUrl,
        contract_id: contractId,
        file_type: file.type,
        file_size: file.size,
        status: 'pending_verification',
        client: client,
        notes: notes,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        signed_by: signedBy.split(',').map(s => s.trim()).filter(s => s),
        upload_date: new Date().toISOString()
      };
      
      console.log('Document record to insert:', documentRecord);
      
      const { data: insertData, error: insertError } = await supabase
        .from('contract_documents')
        .insert([documentRecord])
        .select();
      
      if (insertError) {
        console.error('Database insert failed:', insertError);
        
        // Try direct insert without RLS
        console.log('Attempting alternative insert method...');
        
        try {
          // Direct insert using the fetch API
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/contract_documents`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify([documentRecord])
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Alternative insert failed:', errorData);
            throw new Error(`Database insert failed: ${insertError.message}`);
          }
          
          console.log('Alternative insert succeeded');
          const altInsertData = await response.json();
          console.log('Insert response:', altInsertData);
          
          // Success path
          setUploadProgress(100);
          setUploadSuccess(true);
          
          toast({
            title: "Document uploaded successfully",
            description: "The document was saved to the database"
          });
          
          resetForm();
          await loadDocuments();
          setActiveTab('documents');
          return;
          
        } catch (altError) {
          console.error('Alternative insert method also failed:', altError);
          throw new Error(`Database insert failed: ${insertError.message}`);
        }
      }
      
      console.log('Database insert successful:', insertData);
      setUploadProgress(100);
      setUploadSuccess(true);
      
      toast({
        title: "Document uploaded successfully",
        description: "The document was saved to the database"
      });
      
      // Reset form and refresh documents
      resetForm();
      await loadDocuments();
      setActiveTab('documents');
      
    } catch (error) {
      console.error('Upload process error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleClearForm = () => {
    resetForm();
  };
  
  const handleDeleteDocument = async (id, filePath) => {
    try {
      setIsLoading(true);
      
      // Delete from storage if path exists
      if (filePath) {
        await supabase.storage
          .from('documents')
          .remove([filePath]);
      }
      
      // Delete from database
      const { error } = await supabase
        .from('contract_documents')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Document deleted",
        description: "The document was deleted successfully"
      });
      
      // Refresh documents
      await loadDocuments();
      
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearchDocuments = async () => {
    if (!searchQuery.trim()) {
      await loadDocuments();
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('contract_documents')
        .select('*')
        .or(`contract_id.ilike.%${searchQuery}%,client.ilike.%${searchQuery}%,filename.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setDocuments(data || []);
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredDocuments = searchQuery.trim() 
    ? documents.filter(doc => 
        doc.contract_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.filename?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documents;
  
  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Contract Documents</span>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => setShowDebugger(!showDebugger)}
            >
              {showDebugger ? 'Hide Debugger' : 'Show Debugger'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {showDebugger && (
          <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium mb-2">Supabase Document Uploader Debugger</h3>
            <SupabaseDocumentTester />
          </div>
        )}
        
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1">
              <File className="h-4 w-4" />
              <span>View Documents</span>
              {documents.length > 0 && (
                <Badge variant="outline" className="ml-2">{documents.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Document File</label>
                <Input 
                  type="file" 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  disabled={isUploading}
                />
                {file && (
                  <p className="mt-1 text-sm">Selected: {file.name} ({Math.round(file.size / 1024)} KB)</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Contract ID</label>
                <Input 
                  placeholder="e.g., CNT-1001" 
                  value={contractId}
                  onChange={(e) => setContractId(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <Input 
                  placeholder="Client name" 
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Signed By</label>
                <Input 
                  placeholder="Names separated by commas" 
                  value={signedBy}
                  onChange={(e) => setSignedBy(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Keywords</label>
                <Input 
                  placeholder="Keywords separated by commas" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Textarea 
                  placeholder="Additional notes about this document" 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isUploading}
                />
              </div>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading document...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            {uploadSuccess && (
              <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Document uploaded successfully!</span>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleUpload} 
                disabled={isUploading || !file}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload Document</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleClearForm}
                disabled={isUploading}
              >
                <X className="mr-2 h-4 w-4" />
                <span>Clear Form</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="mb-4 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by contract ID, client, or filename..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchDocuments();
                    }
                  }}
                />
              </div>
              <Button 
                variant="outline"
                onClick={handleSearchDocuments}
                disabled={isLoading}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredDocuments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead>Contract</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map(doc => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium truncate max-w-[200px]">
                          {doc.filename}
                        </TableCell>
                        <TableCell>{doc.contract_id || '-'}</TableCell>
                        <TableCell>{doc.client || '-'}</TableCell>
                        <TableCell>
                          {doc.upload_date 
                            ? format(new Date(doc.upload_date), 'MMM d, yyyy')
                            : format(new Date(doc.created_at), 'MMM d, yyyy')
                          }
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[doc.status] || 'bg-gray-100'}>
                            {doc.status?.replace('_', ' ') || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {doc.file_url && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => window.open(doc.file_url, '_blank')}
                                title="View Document"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteDocument(doc.id, doc.file_path)}
                              title="Delete Document"
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p>No documents found</p>
                <p className="text-sm">
                  {searchQuery.trim() 
                    ? `No results for "${searchQuery}". Try a different search term.` 
                    : 'Upload some documents to get started.'
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadTracker;
