
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  FileText, 
  FilePlus, 
  FileImage, 
  FileSpreadsheet, 
  FilePdf, 
  Download, 
  Share2, 
  Eye, 
  Trash, 
  Calendar,
  User,
  Users,
  Link,
  Upload
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const DocumentsView = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Contract_KAJON_Coffee_2025.pdf',
      type: 'contract',
      fileType: 'pdf',
      size: '2.3 MB',
      uploadDate: '2025-04-10',
      uploadedBy: 'Admin User',
      relatedTo: 'KAJON Coffee Limited',
      tags: ['contract', 'client'],
      description: 'Annual service contract with KAJON Coffee Limited'
    },
    {
      id: 2,
      name: 'Grand_Berna_Invoice_1042.xlsx',
      type: 'invoice',
      fileType: 'excel',
      size: '1.1 MB',
      uploadDate: '2025-04-15',
      uploadedBy: 'Finance Manager',
      relatedTo: 'Grand Berna Dairies',
      tags: ['invoice', 'payment'],
      description: 'Invoice #1042 for dairy product delivery'
    },
    {
      id: 3,
      name: 'Meeting_Notes_FreshEco.docx',
      type: 'notes',
      fileType: 'word',
      size: '0.5 MB',
      uploadDate: '2025-04-17',
      uploadedBy: 'Admin User',
      relatedTo: 'FreshEco Farms',
      tags: ['meeting', 'notes'],
      description: 'Discussion about upcoming partnership opportunities'
    },
    {
      id: 4,
      name: 'Product_Catalog_2025.pdf',
      type: 'marketing',
      fileType: 'pdf',
      size: '5.2 MB',
      uploadDate: '2025-03-28',
      uploadedBy: 'Marketing Manager',
      relatedTo: 'All Clients',
      tags: ['marketing', 'catalog'],
      description: 'Updated product catalog for 2025'
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'contract',
    relatedTo: '',
    description: '',
    tags: ''
  });

  const handleSelectDocument = (doc) => {
    setSelectedDocument(doc);
  };

  const handleUploadDocument = () => {
    const newDoc = {
      id: documents.length > 0 ? Math.max(...documents.map(doc => doc.id)) + 1 : 1,
      ...newDocument,
      fileType: getFileType(newDocument.name),
      size: '1.0 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      tags: newDocument.tags.split(',').map(tag => tag.trim())
    };
    
    setDocuments([newDoc, ...documents]);
    setIsUploadDialogOpen(false);
    setNewDocument({
      name: '',
      type: 'contract',
      relatedTo: '',
      description: '',
      tags: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewDocument(prev => ({ ...prev, [name]: value }));
  };

  const getFileType = (filename) => {
    if (!filename) return '';
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'doc':
      case 'docx': return 'word';
      case 'xls':
      case 'xlsx': return 'excel';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'image';
      default: return 'other';
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FilePdf className="h-5 w-5 text-red-500" />;
      case 'word':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'image':
        return <FileImage className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDocumentTypeBadge = (type) => {
    switch (type) {
      case 'contract':
        return <Badge className="bg-blue-100 text-blue-800">Contract</Badge>;
      case 'invoice':
        return <Badge className="bg-green-100 text-green-800">Invoice</Badge>;
      case 'notes':
        return <Badge className="bg-purple-100 text-purple-800">Notes</Badge>;
      case 'marketing':
        return <Badge className="bg-orange-100 text-orange-800">Marketing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-280px)]">
      {/* Documents List */}
      <Card className="md:col-span-1">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Documents</CardTitle>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <FilePlus className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Drag and drop files here or click to browse</p>
                    <Input
                      type="file"
                      className="hidden"
                      id="document-upload"
                    />
                    <Button variant="outline" size="sm" className="mt-2">
                      Browse Files
                    </Button>
                  </div>
                
                  <div className="space-y-2">
                    <label htmlFor="document-name" className="text-sm font-medium">Document Name</label>
                    <Input 
                      id="document-name" 
                      name="name"
                      placeholder="Enter document name" 
                      value={newDocument.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="document-type" className="text-sm font-medium">Document Type</label>
                    <Select 
                      value={newDocument.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="document-type">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="notes">Notes</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="related-to" className="text-sm font-medium">Related To</label>
                    <Input 
                      id="related-to" 
                      name="relatedTo"
                      placeholder="Enter related company/contact" 
                      value={newDocument.relatedTo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="document-tags" className="text-sm font-medium">Tags (comma separated)</label>
                    <Input 
                      id="document-tags" 
                      name="tags"
                      placeholder="E.g. contract, client, important" 
                      value={newDocument.tags}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="document-description" className="text-sm font-medium">Description</label>
                    <Textarea 
                      id="document-description" 
                      name="description"
                      placeholder="Enter document description" 
                      value={newDocument.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleUploadDocument}>Upload Document</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search documents..."
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 p-0 h-10 rounded-none border-b">
              <TabsTrigger value="all" className="rounded-none">All</TabsTrigger>
              <TabsTrigger value="contracts" className="rounded-none">Contracts</TabsTrigger>
              <TabsTrigger value="invoices" className="rounded-none">Invoices</TabsTrigger>
              <TabsTrigger value="other" className="rounded-none">Other</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100vh-380px)]">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedDocument?.id === doc.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handleSelectDocument(doc)}
                >
                  <div className="flex items-start gap-3">
                    {getFileIcon(doc.fileType)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{doc.name}</h3>
                      <div className="flex items-center mt-1">
                        {getDocumentTypeBadge(doc.type)}
                        <span className="text-xs text-gray-500 ml-2">{doc.size}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 truncate flex items-center">
                          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                          {doc.uploadDate}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {doc.relatedTo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      {/* Document Details */}
      <Card className="md:col-span-2">
        {selectedDocument ? (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="bg-gray-100 p-4 rounded-lg mr-4">
                  {getFileIcon(selectedDocument.fileType)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedDocument.name}</h2>
                  <div className="flex items-center mt-1 gap-2">
                    {getDocumentTypeBadge(selectedDocument.type)}
                    <span className="text-sm text-gray-500">{selectedDocument.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Document Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Upload Date</p>
                      <p>{selectedDocument.uploadDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Uploaded By</p>
                      <p>{selectedDocument.uploadedBy}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Related To</p>
                      <p>{selectedDocument.relatedTo}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Description</h3>
                <div className="border rounded-md p-4 bg-gray-50">
                  <p>{selectedDocument.description || 'No description available.'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Document Actions</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <Button variant="outline" className="flex flex-col items-center py-4 h-auto">
                  <Share2 className="h-5 w-5 mb-2" />
                  <span>Share</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center py-4 h-auto">
                  <Link className="h-5 w-5 mb-2" />
                  <span>Copy Link</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center py-4 h-auto">
                  <Upload className="h-5 w-5 mb-2" />
                  <span>Replace</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center py-4 h-auto text-red-500 border-red-200 hover:bg-red-50">
                  <Trash className="h-5 w-5 mb-2" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <FileText className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">Document Details</h3>
              <p className="mt-2 text-sm text-gray-500">Select a document to view details or upload a new one</p>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <FilePlus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DocumentsView;
