
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, FileCheck, Calendar, Search, Plus, AlertTriangle, 
  Download, CheckCircle2, Clock, XCircle, Filter, Upload
} from 'lucide-react';

const ComplianceDocuments = () => {
  const [activeTab, setActiveTab] = useState('required');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample compliance document data
  const documents = [
    {
      id: 'DOC-001',
      name: 'Export Certificate of Origin',
      type: 'Certificate',
      destination: 'Hamburg, Germany',
      shipment: 'EQ-2453',
      status: 'pending',
      expiry: '2023-12-20',
      required: true
    },
    {
      id: 'DOC-002',
      name: 'Phytosanitary Certificate',
      type: 'Certificate',
      destination: 'Hamburg, Germany',
      shipment: 'EQ-2453',
      status: 'approved',
      expiry: '2023-12-25',
      required: true
    },
    {
      id: 'DOC-003',
      name: 'Coffee Quality Assessment Report',
      type: 'Quality Report',
      destination: 'Hamburg, Germany',
      shipment: 'EQ-2453',
      status: 'approved',
      expiry: '2024-01-15',
      required: true
    },
    {
      id: 'DOC-004',
      name: 'Fair Trade Certification',
      type: 'Certification',
      destination: 'Hamburg, Germany',
      shipment: 'EQ-2453',
      status: 'pending',
      expiry: '2024-06-30',
      required: false
    },
    {
      id: 'DOC-005',
      name: 'Bill of Lading',
      type: 'Shipping Document',
      destination: 'New York, USA',
      shipment: 'EQ-2455',
      status: 'pending',
      expiry: '2024-01-15',
      required: true
    },
    {
      id: 'DOC-006',
      name: 'Commercial Invoice',
      type: 'Financial Document',
      destination: 'New York, USA',
      shipment: 'EQ-2455',
      status: 'pending',
      expiry: '2024-01-15',
      required: true
    },
    {
      id: 'DOC-007',
      name: 'Organic Certification',
      type: 'Certification',
      destination: 'New York, USA',
      shipment: 'EQ-2455',
      status: 'rejected',
      expiry: '2023-12-01',
      required: false,
      rejectionReason: 'Documentation incomplete. Missing farm inspection report.'
    },
    {
      id: 'DOC-008',
      name: 'Export License',
      type: 'License',
      destination: 'Global',
      shipment: 'Multiple',
      status: 'approved',
      expiry: '2024-12-31',
      required: true
    }
  ];
  
  // Filter documents based on active tab and search term
  const filteredDocuments = documents.filter(doc => {
    // Filter by tab
    if (activeTab === 'required' && !doc.required) {
      return false;
    }
    
    if (activeTab === 'optional' && doc.required) {
      return false;
    }
    
    if (activeTab === 'pending' && doc.status !== 'pending') {
      return false;
    }
    
    if (activeTab === 'approved' && doc.status !== 'approved') {
      return false;
    }
    
    if (activeTab === 'expiring') {
      const expiryDate = new Date(doc.expiry);
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      if (!(expiryDate <= thirtyDaysFromNow && expiryDate >= today)) {
        return false;
      }
    }
    
    // Filter by search term
    if (searchTerm && !doc.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !doc.shipment.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !doc.destination.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Compliance Documents Management</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Document
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="required" className="flex items-center gap-1">
                <FileCheck className="h-4 w-4" />
                Required
              </TabsTrigger>
              <TabsTrigger value="optional" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Optional
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Approved
              </TabsTrigger>
              <TabsTrigger value="expiring" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Expiring Soon
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                All Documents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.shipment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.destination}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.expiry}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(doc.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="required" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          {getStatusIcon(doc.status)}
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-xs text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Document ID:</span>
                          <span className="font-medium">{doc.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipment:</span>
                          <span className="font-medium">{doc.shipment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Destination:</span>
                          <span className="font-medium">{doc.destination}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Expiry Date:</span>
                          <span className="font-medium">{doc.expiry}</span>
                        </div>
                        {doc.status === 'rejected' && doc.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md">
                            <p className="text-xs text-red-700">
                              <span className="font-medium">Rejection Reason:</span> {doc.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end mt-4 pt-3 border-t gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="optional" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          {getStatusIcon(doc.status)}
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-xs text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Document ID:</span>
                          <span className="font-medium">{doc.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipment:</span>
                          <span className="font-medium">{doc.shipment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Destination:</span>
                          <span className="font-medium">{doc.destination}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Expiry Date:</span>
                          <span className="font-medium">{doc.expiry}</span>
                        </div>
                        {doc.status === 'rejected' && doc.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md">
                            <p className="text-xs text-red-700">
                              <span className="font-medium">Rejection Reason:</span> {doc.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end mt-4 pt-3 border-t gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-xs text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Document ID:</span>
                          <span className="font-medium">{doc.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipment:</span>
                          <span className="font-medium">{doc.shipment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Destination:</span>
                          <span className="font-medium">{doc.destination}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Expiry Date:</span>
                          <span className="font-medium">{doc.expiry}</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 pt-3 border-t gap-2">
                        <Button variant="outline" size="sm">Update Status</Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="approved" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-xs text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Document ID:</span>
                          <span className="font-medium">{doc.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipment:</span>
                          <span className="font-medium">{doc.shipment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Destination:</span>
                          <span className="font-medium">{doc.destination}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Expiry Date:</span>
                          <span className="font-medium">{doc.expiry}</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 pt-3 border-t gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="expiring" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <div className="flex items-center justify-between border-b p-4 bg-amber-50">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-xs text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">Expiring Soon</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Document ID:</span>
                          <span className="font-medium">{doc.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipment:</span>
                          <span className="font-medium">{doc.shipment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Destination:</span>
                          <span className="font-medium">{doc.destination}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Expiry Date:</span>
                          <span className="font-medium text-amber-700">{doc.expiry}</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 pt-3 border-t gap-2">
                        <Button variant="outline" size="sm">Renew Document</Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-full">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-amber-800">Document Compliance Alert</p>
            <p className="text-sm text-amber-700 mt-1">
              There are 3 pending documents that require attention, including Export Certificate of Origin for Shipment EQ-2453 due in 48 hours.
            </p>
            <Button size="sm" variant="outline" className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100">
              View Urgent Documents
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDocuments;
