
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, Download, Eye, FileText, 
  CheckCircle, XCircle, Clock, Upload, Plus
} from 'lucide-react';

const ComplianceDocuments = () => {
  // Sample documents data
  const documents = [
    {
      id: 'DOC-1001',
      name: 'Certificate of Origin',
      shipment: 'EQ-2453',
      type: 'export',
      status: 'approved',
      date: '2023-12-01',
      expiry: '2024-12-01',
      issuer: 'Ministry of Agriculture'
    },
    {
      id: 'DOC-1002',
      name: 'ICO Certificate of Origin',
      shipment: 'EQ-2453',
      type: 'export',
      status: 'approved',
      date: '2023-12-02',
      expiry: '2024-12-02',
      issuer: 'International Coffee Organization'
    },
    {
      id: 'DOC-1003',
      name: 'Phytosanitary Certificate',
      shipment: 'EQ-2453',
      type: 'export',
      status: 'approved',
      date: '2023-12-03',
      expiry: '2024-01-03',
      issuer: 'Plant Health Inspection Service'
    },
    {
      id: 'DOC-1004',
      name: 'Bill of Lading',
      shipment: 'EQ-2453',
      type: 'shipping',
      status: 'approved',
      date: '2023-12-05',
      expiry: 'N/A',
      issuer: 'Maersk Line'
    },
    {
      id: 'DOC-1005',
      name: 'Commercial Invoice',
      shipment: 'EQ-2453',
      type: 'commercial',
      status: 'approved',
      date: '2023-12-04',
      expiry: 'N/A',
      issuer: 'Equator Coffee Exports'
    },
    {
      id: 'DOC-1006',
      name: 'Certificate of Analysis',
      shipment: 'EQ-2453',
      type: 'quality',
      status: 'approved',
      date: '2023-11-29',
      expiry: '2024-11-29',
      issuer: 'Coffee Quality Institute'
    },
    {
      id: 'DOC-1007',
      name: 'Fair Trade Certificate',
      shipment: 'EQ-2455',
      type: 'ethical',
      status: 'pending',
      date: '2023-12-10',
      expiry: '2024-12-10',
      issuer: 'Fair Trade International'
    },
    {
      id: 'DOC-1008',
      name: 'Organic Certificate',
      shipment: 'EQ-2455',
      type: 'ethical',
      status: 'pending',
      date: '2023-12-11',
      expiry: '2024-12-11',
      issuer: 'Organic Certification Body'
    }
  ];

  const statusColors = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-amber-100 text-amber-800",
    expired: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Compliance Documents</h2>
          <p className="text-gray-500 text-sm">Manage export documentation and compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Document</span>
          </Button>
        </div>
      </div>
      
      {/* Document Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700">Total Documents</p>
                <p className="text-2xl font-bold text-blue-900">24</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-700">Approved</p>
                <p className="text-2xl font-bold text-green-900">18</p>
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
                <p className="text-sm text-amber-700">Pending</p>
                <p className="text-2xl font-bold text-amber-900">4</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-red-700">Issues</p>
                <p className="text-2xl font-bold text-red-900">2</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                <XCircle className="h-5 w-5 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Documents Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Export Documents</span>
            </CardTitle>
            <div className="flex items-center relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search documents..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Document ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Shipment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.id}</TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.shipment}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>{doc.expiry}</TableCell>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Compliance Requirements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Export Compliance Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>European Union Requirements</span>
              </h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                  Certificate of Origin
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                  Phytosanitary Certificate
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                  Health Certificate
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                  Commercial Invoice
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-medium flex items-center">
                <Clock className="h-4 w-4 text-amber-600 mr-2" />
                <span>US Market Requirements</span>
              </h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                  FDA Registration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                  Certificate of Origin
                </li>
                <li className="flex items-center">
                  <Clock className="h-3 w-3 text-amber-600 mr-2" />
                  USDA Import Permit (Pending)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                  Commercial Invoice
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium flex items-center">
                <FileText className="h-4 w-4 text-blue-600 mr-2" />
                <span>Specialty Coffee Certifications</span>
              </h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                  Quality Analysis Certificate
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                  Fair Trade Certificate
                </li>
                <li className="flex items-center">
                  <Clock className="h-3 w-3 text-amber-600 mr-2" />
                  Organic Certification (In Process)
                </li>
                <li className="flex items-center">
                  <Clock className="h-3 w-3 text-amber-600 mr-2" />
                  Rainforest Alliance (In Process)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceDocuments;
