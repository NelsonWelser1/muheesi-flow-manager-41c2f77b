import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Search, 
  Eye, 
  Download,
  Trash2, 
  File, 
  FileImage, 
  Info, 
  AlertCircle, 
  X,
  Check,
  Filter,
  Calendar,
  RotateCcw,
  Tag
} from 'lucide-react';
import { format } from 'date-fns';
import useContractDocuments from '../hooks/useContractDocuments';
import { formatFileSize, getFileIconName } from '../utils/documentUtils';
import { showWarningToast, showSuccessToast, showErrorToast } from '@/components/ui/notifications';

const DocumentUploadTracker = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  const [contractId, setContractId] = useState('');
  const [client, setClient] = useState('');
  const [notes, setNotes] = useState('');
  const [keywords, setKeywords] = useState('');
  const [signedBy, setSignedBy] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    documents,
    loading,
    uploadProgress,
    searchResults,
    searchLoading,
    uploadDocument,
    loadDocuments,
    searchDocuments,
    updateDocument,
    removeDocument
  } = useContractDocuments();

  useEffect(() => {
    // Load documents when component mounts
    loadDocuments();
  }, [loadDocuments]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
        setUploadedFile(file);
        
        // Try to extract contract ID from filename if it follows the pattern
        const match = file.name.match(/^(CNT-\d+)/);
        if (match) {
          setContractId(match[0]);
        }
      } else {
        showErrorToast(toast, "Please upload a PDF, JPEG, PNG, or JPG file.");
        setUploadedFile(null);
      }
    }
  };

  const resetForm = () => {
    setUploadedFile(null);
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
    if (!uploadedFile) {
      showErrorToast(toast, "Please select a file to upload.");
      return;
    }

    setIsUploading(true);

    try {
      const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
      const signersArray = signedBy ? signedBy.split(',').map(s => s.trim()) : [];

      const metadata = {
        client: client || null,
        notes: notes || null,
        keywords: keywordsArray.length > 0 ? keywordsArray : null,
        signed_by: signersArray.length > 0 ? signersArray : null
      };

      console.log('Starting document upload with metadata:', metadata);
      
      const result = await uploadDocument(uploadedFile, contractId || null, metadata);
      
      if (result && result.success) {
        console.log('Document uploaded successfully:', result.data);
        resetForm();
        
        // Wait briefly before switching tabs to allow the user to see the success state
        setTimeout(() => {
          setActiveTab('all');
          showSuccessToast(toast, "Document uploaded successfully");
        }, 1000);
      } else {
        console.error('Upload failed:', result?.error);
        showErrorToast(toast, result?.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error('Upload error:', error);
      showErrorToast(toast, `Upload error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showWarningToast(toast, "Please enter a search term.");
      return;
    }
    
    await searchDocuments(searchQuery);
  };

  const handleViewDocument = (document) => {
    if (document.file_url) {
      window.open(document.file_url, '_blank');
    } else {
      showErrorToast(toast, "The document URL is not available.");
    }
  };

  const handleDownloadDocument = (document) => {
    if (document.file_url) {
      const link = document.createElement('a');
      link.href = document.file_url;
      link.download = document.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      showErrorToast(toast, "The document URL is not available for download.");
    }
  };

  const handleDeleteDocument = async (document) => {
    if (window.confirm(`Are you sure you want to delete "${document.filename}"?`)) {
      await removeDocument(document.id);
    }
  };

  const handleVerifyDocument = async (document) => {
    await updateDocument(document.id, {
      status: 'verified',
      verified_by: 'System Admin',
      verified_at: new Date().toISOString()
    });
  };

  const renderDocumentIcon = (fileType) => {
    const iconName = getFileIconName(fileType);
    
    if (iconName === 'image') {
      return <FileImage className="h-10 w-10 text-blue-500" />;
    } else if (iconName === 'file-text') {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else {
      return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending_verification':
        return <Badge className="bg-amber-100 text-amber-800">Pending Verification</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const renderDocumentItem = (document) => (
    <div key={document.id} className="p-4 border rounded-md flex items-start gap-4">
      {renderDocumentIcon(document.file_type)}
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{document.filename}</h3>
          {renderStatusBadge(document.status)}
        </div>
        
        <div className="text-sm text-gray-500 mt-1">
          Contract: {document.contract_id || 'Unassigned'} 
          {document.client && ` • Client: ${document.client}`}
        </div>
        
        <div className="text-sm text-gray-500 mt-1">
          Uploaded: {format(new Date(document.upload_date || document.created_at), 'yyyy-MM-dd')} 
          • Size: {formatFileSize(document.file_size)}
        </div>
        
        {document.signed_by && document.signed_by.length > 0 && (
          <div className="text-sm text-gray-700 mt-2 flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" />
            <span>Signed by: {document.signed_by.join(', ')}</span>
          </div>
        )}
        
        {document.notes && (
          <div className="text-sm mt-1">
            {document.notes}
          </div>
        )}
        
        {document.keywords && document.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {document.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-100">
                {keyword}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleViewDocument(document)}
          title="View Document"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleDownloadDocument(document)}
          title="Download Document"
        >
          <Download className="h-4 w-4" />
        </Button>
        {document.status === 'pending_verification' && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleVerifyDocument(document)}
            title="Verify Document"
          >
            <Check className="h-4 w-4 text-green-600" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleDeleteDocument(document)}
          title="Delete Document"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );

  const handleRefreshDocuments = async () => {
    await loadDocuments();
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Contract Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upload" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-1">
              <Search className="h-4 w-4" />
              <span>Search Documents</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>All Documents</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="p-4 border rounded-md">
            <div className="space-y-4">
              <div className="text-sm text-gray-500 flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5" />
                <p>Upload signed contract documents (PDF, JPEG, JPG, PNG) for record keeping and tracking. All uploaded documents will be reviewed for verification.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <div className="border-2 border-dashed rounded-md p-6">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/jpg,image/png"
                      onChange={handleFileSelect}
                    />
                    
                    <div className="text-center">
                      <Upload className="h-10 w-10 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drop your file here, or{' '}
                        <button 
                          type="button"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: PDF, JPEG, JPG, PNG
                      </p>
                    </div>
                    
                    {uploadedFile && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {uploadedFile.type === 'application/pdf' 
                            ? <FileText className="h-6 w-6 text-blue-600" />
                            : <FileImage className="h-6 w-6 text-blue-600" />
                          }
                          <div>
                            <p className="text-sm font-medium">{uploadedFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {uploadedFile.type} • {formatFileSize(uploadedFile.size)}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={resetForm}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {uploadProgress > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-3">Document Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Contract ID</label>
                        <Input 
                          value={contractId} 
                          onChange={e => setContractId(e.target.value)}
                          placeholder="e.g., CNT-1001"
                          className="text-sm"
                          disabled={isUploading}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Client</label>
                        <Input 
                          value={client} 
                          onChange={e => setClient(e.target.value)}
                          placeholder="Client name"
                          className="text-sm"
                          disabled={isUploading}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Signed By (comma-separated)</label>
                        <Input 
                          value={signedBy} 
                          onChange={e => setSignedBy(e.target.value)}
                          placeholder="John Doe, Jane Smith"
                          className="text-sm"
                          disabled={isUploading}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Keywords (comma-separated)</label>
                        <Input 
                          value={keywords} 
                          onChange={e => setKeywords(e.target.value)}
                          placeholder="export, coffee, arabica"
                          className="text-sm"
                          disabled={isUploading}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Notes</label>
                        <Input 
                          value={notes} 
                          onChange={e => setNotes(e.target.value)}
                          placeholder="Additional notes"
                          className="text-sm"
                          disabled={isUploading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline"
                  onClick={resetForm}
                  disabled={(!uploadedFile && !contractId && !client && !notes && !keywords && !signedBy) || isUploading}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  <span>Clear Form</span>
                </Button>
                
                <Button 
                  onClick={handleUpload} 
                  disabled={!uploadedFile || isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading || loading ? (
                    <>
                      <span className="animate-spin">
                        <Upload className="h-4 w-4" />
                      </span>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload Document</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="p-4 border rounded-md">
            <div className="space-y-4">
              <div className="text-sm text-gray-500 flex items-start gap-2 mb-4">
                <Info className="h-4 w-4 mt-0.5" />
                <p>
                  Search for specific contract documents by contract ID, client name, or keywords contained in the document.
                </p>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by contract ID, client name, or keywords..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="flex items-center gap-2"
                >
                  {searchLoading ? (
                    <>
                      <span className="animate-spin">
                        <Search className="h-4 w-4" />
                      </span>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Search</span>
                    </>
                  )}
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-4">
                  <div className="text-sm font-medium">Search Results ({searchResults.length}):</div>
                  
                  {searchResults.map(document => renderDocumentItem(document))}
                </div>
              )}
              
              {searchQuery && searchResults.length === 0 && !searchLoading && (
                <div className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-lg font-medium text-gray-600">No documents found</p>
                  <p className="text-sm text-gray-500">
                    Try using different keywords or check the spelling
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <Info className="h-4 w-4" />
                  <span>Showing {documents.length} documents</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={handleRefreshDocuments}
                    disabled={loading}
                  >
                    <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Date Range</span>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>Categories</span>
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin inline-block mb-2">
                    <FileText className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-gray-500">Loading documents...</p>
                </div>
              ) : documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map(document => renderDocumentItem(document))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-300 mb-3" />
                  <p className="text-lg font-medium text-gray-600">No documents found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload signed contracts using the "Upload Document" tab
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadTracker;
