
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Plus, 
  Download, 
  Folder, 
  File, 
  FileImage,
  PlusCircle
} from 'lucide-react';
import ExportButtons from '@/components/ui/data-export/ExportButtons';

const DocumentsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample document data
  const documents = [
    {
      id: 1,
      name: 'Contract_Template_2025.docx',
      type: 'document',
      size: '245 KB',
      lastModified: '2025-04-10',
      category: 'Templates',
      tags: ['contract', 'template']
    },
    {
      id: 2,
      name: 'Client_Meeting_Notes.pdf',
      type: 'pdf',
      size: '120 KB',
      lastModified: '2025-04-15',
      category: 'Meeting Notes',
      tags: ['client', 'meeting']
    },
    {
      id: 3,
      name: 'Product_Brochure.pdf',
      type: 'pdf',
      size: '3.5 MB',
      lastModified: '2025-04-01',
      category: 'Marketing',
      tags: ['product', 'brochure']
    },
    {
      id: 4,
      name: 'Partnership_Agreement.docx',
      type: 'document',
      size: '182 KB',
      lastModified: '2025-03-28',
      category: 'Legal',
      tags: ['partnership', 'agreement']
    },
    {
      id: 5,
      name: 'Office_Floor_Plan.jpg',
      type: 'image',
      size: '1.2 MB',
      lastModified: '2025-03-15',
      category: 'Office',
      tags: ['floor plan', 'office']
    }
  ];

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get document icon based on type
  const getDocumentIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'image':
        return <FileImage className="h-6 w-6 text-blue-500" />;
      case 'document':
        return <File className="h-6 w-6 text-indigo-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Document Management</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Document
          </Button>
          <ExportButtons 
            data={documents} 
            filename="documents_export" 
            type="Documents"
          />
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search documents by name, category or tags..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map(doc => (
          <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {getDocumentIcon(doc.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {doc.size} • {doc.lastModified}
                  </p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mr-1">
                      {doc.category}
                    </span>
                    {doc.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 mr-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredDocuments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Folder className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery 
              ? `No documents match the search "${searchQuery}"`
              : "Upload or create a new document to get started"}
          </p>
          <Button className="mt-4" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentsView;
