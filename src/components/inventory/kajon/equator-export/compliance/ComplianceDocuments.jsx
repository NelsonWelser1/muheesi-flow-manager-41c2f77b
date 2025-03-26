
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Download, Search, Upload, Filter, CheckCircle, AlertCircle,
  Clock, Files, Plus, Eye, Calendar, BookOpen, Clipboard, FileCheck
} from 'lucide-react';

// Sample compliance documents data
const documents = [
  {
    id: 'DOC-001',
    title: 'Certificate of Origin - Germany',
    type: 'certificate',
    country: 'Germany',
    status: 'valid',
    dateIssued: '2023-11-15',
    expiryDate: '2024-11-15',
    issuer: 'Uganda Coffee Development Authority',
    contract: 'CNT-1001',
    lastUpdated: '2023-11-15'
  },
  {
    id: 'DOC-002',
    title: 'Phytosanitary Certificate - USA',
    type: 'phytosanitary',
    country: 'USA',
    status: 'pending',
    dateIssued: '2023-12-05',
    expiryDate: '2024-01-05',
    issuer: 'Ministry of Agriculture',
    contract: 'CNT-1002',
    lastUpdated: '2023-12-05'
  },
  {
    id: 'DOC-003',
    title: 'ICO Certificate of Export',
    type: 'ico',
    country: 'Multiple',
    status: 'valid',
    dateIssued: '2023-10-20',
    expiryDate: '2024-04-20',
    issuer: 'International Coffee Organization',
    contract: 'Multiple',
    lastUpdated: '2023-10-20'
  },
  {
    id: 'DOC-004',
    title: 'Quality Certificate - Japan',
    type: 'quality',
    country: 'Japan',
    status: 'valid',
    dateIssued: '2023-11-25',
    expiryDate: '2024-11-25',
    issuer: 'Uganda Coffee Quality Institute',
    contract: 'CNT-1003',
    lastUpdated: '2023-11-25'
  },
  {
    id: 'DOC-005',
    title: 'Organic Certification',
    type: 'organic',
    country: 'Multiple',
    status: 'expiring',
    dateIssued: '2023-02-10',
    expiryDate: '2024-01-10',
    issuer: 'EcoCert',
    contract: 'Multiple',
    lastUpdated: '2023-10-15'
  },
  {
    id: 'DOC-006',
    title: 'Fair Trade Certification',
    type: 'fairtrade',
    country: 'Multiple',
    status: 'valid',
    dateIssued: '2023-05-18',
    expiryDate: '2025-05-18',
    issuer: 'Fair Trade International',
    contract: 'Multiple',
    lastUpdated: '2023-09-20'
  },
  {
    id: 'DOC-007',
    title: 'Commercial Invoice - UAE',
    type: 'invoice',
    country: 'UAE',
    status: 'valid',
    dateIssued: '2023-12-01',
    expiryDate: 'N/A',
    issuer: 'KAJON Coffee Limited',
    contract: 'CNT-1004',
    lastUpdated: '2023-12-01'
  }
];

// Sample document requirements by country
const countryRequirements = [
  {
    country: 'European Union',
    requirements: [
      'Certificate of Origin',
      'Phytosanitary Certificate',
      'ICO Certificate of Export',
      'Commercial Invoice',
      'Bill of Lading',
      'Packing List',
      'Single Administrative Document (SAD)',
      'EUR.1 Movement Certificate'
    ]
  },
  {
    country: 'United States',
    requirements: [
      'Certificate of Origin',
      'Phytosanitary Certificate',
      'Commercial Invoice',
      'Customs Entry Form 3461',
      'Packing List',
      'Bill of Lading',
      'FDA Prior Notice',
      'Importer Security Filing (10+2)'
    ]
  },
  {
    country: 'Japan',
    requirements: [
      'Certificate of Origin',
      'Phytosanitary Certificate',
      'Quality Certificate',
      'Commercial Invoice',
      'Packing List',
      'Bill of Lading',
      'Customs Declaration',
      'Import Permit'
    ]
  },
  {
    country: 'Middle East',
    requirements: [
      'Certificate of Origin',
      'Phytosanitary Certificate',
      'Commercial Invoice',
      'Packing List',
      'Bill of Lading',
      'Halal Certificate (if required)',
      'Legalized Documents',
      'Quality Certificate'
    ]
  }
];

const statusColors = {
  'valid': "bg-green-100 text-green-800",
  'pending': "bg-amber-100 text-amber-800",
  'expiring': "bg-orange-100 text-orange-800",
  'expired': "bg-red-100 text-red-800",
  'rejected': "bg-red-100 text-red-800"
};

const documentTypeIcons = {
  'certificate': FileText,
  'phytosanitary': FileCheck,
  'ico': BookOpen,
  'quality': CheckCircle,
  'organic': FileText,
  'fairtrade': FileText,
  'invoice': FileText
};

const ComplianceDocuments = () => {
  const [activeTab, setActiveTab] = useState('documents');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Compliance Document Management</h2>
          <p className="text-gray-500 text-sm">Manage export certificates and compliance documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Expiring Soon</span>
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Document</span>
          </Button>
        </div>
      </div>
      
      {/* Document Expiry Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <span className="text-orange-800">
            Organic Certification (DOC-005) expires in 15 days. Please initiate renewal process.
          </span>
          <Button size="sm" variant="outline" className="ml-auto border-orange-300 text-orange-700 hover:bg-orange-100">
            Start Renewal
          </Button>
        </CardContent>
      </Card>
      
      {/* Document Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-700">Valid Documents</p>
                <p className="text-2xl font-bold text-green-900">12</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700">Pending Approval</p>
                <p className="text-2xl font-bold text-amber-900">3</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-orange-700">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-900">2</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-red-700">Expired</p>
                <p className="text-2xl font-bold text-red-900">1</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for Document Management */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
          <TabsTrigger value="requirements">Country Requirements</TabsTrigger>
          <TabsTrigger value="templates">Document Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Files className="h-5 w-5 text-blue-600" />
                  <span>Export Compliance Documents</span>
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search documents..." className="pl-8" />
                  </div>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Document ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Issuer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => {
                      const IconComponent = documentTypeIcons[doc.type] || FileText;
                      return (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4 text-gray-600" />
                              <span>{doc.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{doc.country}</TableCell>
                          <TableCell>{doc.dateIssued}</TableCell>
                          <TableCell>{doc.expiryDate}</TableCell>
                          <TableCell>{doc.issuer}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[doc.status]}>
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clipboard className="h-5 w-5 text-blue-600" />
                <span>Export Documentation Requirements by Country</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {countryRequirements.map((country, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3">{country.country}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {country.requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>Document Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Certificate of Origin Template', icon: FileText },
                  { name: 'Commercial Invoice Template', icon: FileText },
                  { name: 'Packing List Template', icon: FileText },
                  { name: 'Quality Certificate Template', icon: CheckCircle },
                  { name: 'Bill of Lading Template', icon: FileText },
                  { name: 'Phytosanitary Application Form', icon: FileCheck }
                ].map((template, i) => {
                  const TemplateIcon = template.icon;
                  return (
                    <Card key={i} className="flex flex-col items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="bg-blue-100 p-4 rounded-full mb-3">
                        <TemplateIcon className="h-6 w-6 text-blue-700" />
                      </div>
                      <h3 className="text-center font-medium">{template.name}</h3>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceDocuments;
