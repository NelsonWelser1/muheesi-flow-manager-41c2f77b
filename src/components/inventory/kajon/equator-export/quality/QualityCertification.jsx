
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  CheckSquare, Search, Plus, Calendar, Info, 
  Award, CheckCircle2, Clock, XCircle, Filter, 
  Coffee, Beaker, FileCheck, ThumbsUp
} from 'lucide-react';

const QualityCertification = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample quality certification data
  const certifications = [
    {
      id: 'QC-001',
      batchId: 'BATCH-2453-A',
      coffeeType: 'Arabica AA Grade',
      shipment: 'EQ-2453',
      destination: 'Hamburg, Germany',
      testDate: '2023-11-25',
      expiryDate: '2024-11-25',
      status: 'approved',
      score: 85,
      certifier: 'Uganda Coffee Development Authority',
      metrics: {
        aroma: 8.5,
        flavor: 8.2,
        acidity: 8.0,
        body: 8.4,
        balance: 8.5,
        uniformity: 10,
        cleanCup: 10,
        sweetness: 10,
        overall: 8.4
      },
      notes: 'Excellent quality with bright acidity and citrus notes. Clean cup with good body and balance.'
    },
    {
      id: 'QC-002',
      batchId: 'BATCH-2453-B',
      coffeeType: 'Arabica AA Grade',
      shipment: 'EQ-2453',
      destination: 'Hamburg, Germany',
      testDate: '2023-11-25',
      expiryDate: '2024-11-25',
      status: 'pending',
      certifier: 'Uganda Coffee Development Authority',
      notes: 'Sample submitted for testing on November 25th. Awaiting results.'
    },
    {
      id: 'QC-003',
      batchId: 'BATCH-2455-A',
      coffeeType: 'Robusta Premium Grade',
      shipment: 'EQ-2455',
      destination: 'New York, USA',
      testDate: '2023-12-01',
      expiryDate: '2024-12-01',
      status: 'pending',
      certifier: 'Coffee Quality Institute',
      notes: 'Sample submitted for testing on December 1st. Awaiting results.'
    },
    {
      id: 'QC-004',
      batchId: 'BATCH-2455-B',
      coffeeType: 'Robusta Standard Grade',
      shipment: 'EQ-2455',
      destination: 'New York, USA',
      testDate: '2023-12-01',
      expiryDate: '2024-12-01',
      status: 'rejected',
      certifier: 'Coffee Quality Institute',
      rejectionReason: 'High moisture content (13.2%). Exceeds maximum allowable limit of 12.5%.',
      notes: 'Batch requires additional drying before resubmission for certification.'
    },
    {
      id: 'QC-005',
      batchId: 'BATCH-2458-A',
      coffeeType: 'Arabica A Grade',
      shipment: 'EQ-2458',
      destination: 'Tokyo, Japan',
      testDate: '2023-12-05',
      expiryDate: '2024-12-05',
      status: 'approved',
      score: 82,
      certifier: 'Uganda Coffee Development Authority',
      metrics: {
        aroma: 8.0,
        flavor: 7.8,
        acidity: 8.2,
        body: 8.0,
        balance: 8.1,
        uniformity: 10,
        cleanCup: 10,
        sweetness: 10,
        overall: 7.9
      },
      notes: 'Good quality with consistent flavor profile. Suitable for Japanese market preferences.'
    }
  ];
  
  // Filter certifications based on active tab and search term
  const filteredCertifications = certifications.filter(cert => {
    // Filter by tab
    if (activeTab === 'pending' && cert.status !== 'pending') {
      return false;
    }
    
    if (activeTab === 'approved' && cert.status !== 'approved') {
      return false;
    }
    
    if (activeTab === 'rejected' && cert.status !== 'rejected') {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !cert.batchId.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !cert.coffeeType.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !cert.shipment.toLowerCase().includes(searchTerm.toLowerCase())) {
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
        return <CheckSquare className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Quality Certification Management</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Certification Request
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search certifications..."
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
                <Coffee className="h-4 w-4" />
                By Coffee Type
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <CheckSquare className="h-4 w-4" />
                All Certifications
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                Rejected
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coffee Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCertifications.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cert.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.batchId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.coffeeType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.shipment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.testDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cert.score ? `${cert.score}/100` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(cert.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileCheck className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Info className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCertifications.map((cert) => (
                  <Card key={cert.id} className="overflow-hidden">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{cert.batchId}</h3>
                          <p className="text-xs text-gray-500">{cert.coffeeType}</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Certificate ID:</span>
                          <span className="font-medium">{cert.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipment:</span>
                          <span className="font-medium">{cert.shipment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Destination:</span>
                          <span className="font-medium">{cert.destination}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Test Date:</span>
                          <span className="font-medium">{cert.testDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Certifying Body:</span>
                          <span className="font-medium">{cert.certifier}</span>
                        </div>
                        <div className="mt-2 p-2 bg-gray-50 border border-gray-100 rounded-md">
                          <p className="text-xs text-gray-700">
                            <span className="font-medium">Notes:</span> {cert.notes}
                          </p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCertifications.map((cert) => (
                  <Card key={cert.id} className="overflow-hidden">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{cert.batchId}</h3>
                          <p className="text-xs text-gray-500">{cert.coffeeType}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Quality Score:</span>
                          <span className="font-medium text-green-700">{cert.score}/100</span>
                        </div>
                        
                        {cert.metrics && (
                          <div className="space-y-2 bg-gray-50 p-3 rounded-lg mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Quality Metrics</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                              {Object.entries(cert.metrics).map(([key, value]) => (
                                <div key={key} className="text-xs">
                                  <div className="flex justify-between mb-1">
                                    <span className="capitalize">{key}:</span>
                                    <span>{value}</span>
                                  </div>
                                  <Progress value={value * 10} className="h-1" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Certificate ID:</span>
                          <span className="font-medium">{cert.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipment:</span>
                          <span className="font-medium">{cert.shipment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Destination:</span>
                          <span className="font-medium">{cert.destination}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Test Date:</span>
                          <span className="font-medium">{cert.testDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Expiry Date:</span>
                          <span className="font-medium">{cert.expiryDate}</span>
                        </div>
                        <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-md">
                          <p className="text-xs text-green-700">
                            <span className="font-medium">Tasting Notes:</span> {cert.notes}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 pt-3 border-t gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Certificate
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="rejected" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCertifications.map((cert) => (
                  <Card key={cert.id} className="overflow-hidden">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{cert.batchId}</h3>
                          <p className="text-xs text-gray-500">{cert.coffeeType}</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Certificate ID:</span>
                          <span className="font-medium">{cert.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Shipment:</span>
                          <span className="font-medium">{cert.shipment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Destination:</span>
                          <span className="font-medium">{cert.destination}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Test Date:</span>
                          <span className="font-medium">{cert.testDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Certifying Body:</span>
                          <span className="font-medium">{cert.certifier}</span>
                        </div>
                        <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md">
                          <p className="text-xs text-red-700">
                            <span className="font-medium">Rejection Reason:</span> {cert.rejectionReason}
                          </p>
                        </div>
                        <div className="mt-2 p-2 bg-gray-50 border border-gray-100 rounded-md">
                          <p className="text-xs text-gray-700">
                            <span className="font-medium">Notes:</span> {cert.notes}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 pt-3 border-t gap-2">
                        <Button variant="outline" size="sm">Resubmit</Button>
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
      
      <Card className="bg-gradient-to-r from-blue-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ThumbsUp className="h-5 w-5 text-blue-600" />
            Quality Certification Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Coffee className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-medium">Sample Preparation</h3>
              </div>
              <p className="text-sm text-gray-600">
                Ensure samples are properly prepared and packaged. Use airtight containers and include at least 300g of green coffee.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Beaker className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-medium">Testing Parameters</h3>
              </div>
              <p className="text-sm text-gray-600">
                Maintain optimal moisture content (9.5-12.5%) and screen size consistency before submitting samples for testing.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-medium">Certification Timeline</h3>
              </div>
              <p className="text-sm text-gray-600">
                Submit samples at least 14 days before required certification date to allow for testing, potential resubmission, and documentation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityCertification;
