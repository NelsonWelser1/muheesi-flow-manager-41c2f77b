import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertCircle, FileText, Upload, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NewCertificationDialog from './certifications/NewCertificationDialog';
import { useToast } from "@/components/ui/use-toast";
import { useCertifications } from "@/integrations/supabase/hooks/associations/useCertifications";

const AssociationCertifications = ({ isKazo, selectedAssociation }) => {
  const { toast } = useToast();
  const [activeCertTab, setActiveCertTab] = useState('current');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { 
    certifications, 
    loading, 
    error, 
    fetchCertifications, 
    createCertification,
    updateCertification,
    deleteCertification
  } = useCertifications();
  
  useEffect(() => {
    fetchCertifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleAddCertification = (newCertification) => {
    setDialogOpen(false);
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case 'expiring-soon':
        return <Badge className="bg-amber-100 text-amber-800">Expiring Soon</Badge>;
      case 'in-process':
        return <Badge className="bg-blue-100 text-blue-800">In Process</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };
  
  const getRequirementIcon = (status) => {
    switch(status) {
      case 'complete':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'in-process':
        return <AlertCircle size={18} className="text-amber-600" />;
      case 'pending':
        return <XCircle size={18} className="text-slate-400" />;
      default:
        return <AlertCircle size={18} className="text-red-600" />;
    }
  };
  
  const filteredCertifications = certifications.filter(cert => {
    if (activeCertTab === 'current') {
      return cert.status === 'valid' || cert.status === 'expiring-soon';
    } else if (activeCertTab === 'in-process') {
      return cert.status === 'in-process';
    } else if (activeCertTab === 'expired') {
      return cert.status === 'expired';
    }
    return true;
  });

  if (loading && certifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Certifications Management</CardTitle>
          <CardDescription>Loading certifications...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !loading && certifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Certifications Management</CardTitle>
          <CardDescription>Error loading certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-center items-center h-64">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchCertifications} className="mt-4">Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications Management</CardTitle>
        <CardDescription>
          Manage association certifications, standards compliance and documentation
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements Tracking</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="inspections">Audits & Inspections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <Tabs value={activeCertTab} onValueChange={setActiveCertTab} className="w-full">
                  <TabsList>
                    <TabsTrigger value="current">Current</TabsTrigger>
                    <TabsTrigger value="in-process">In Process</TabsTrigger>
                    <TabsTrigger value="expired">Expired</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <Button onClick={() => setDialogOpen(true)}>Apply for New Certification</Button>
            </div>
            
            {filteredCertifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No certifications found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeCertTab === 'current' 
                    ? "There are no current certifications." 
                    : activeCertTab === 'in-process'
                    ? "There are no certifications in process."
                    : "There are no expired certifications."}
                </p>
                <Button onClick={() => setDialogOpen(true)}>Apply for New Certification</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCertifications.map(cert => (
                  <Card key={cert.id} className="overflow-hidden">
                    <div className={`h-2 ${cert.status === 'valid' ? 'bg-green-500' : cert.status === 'expiring-soon' ? 'bg-amber-500' : cert.status === 'in-process' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{cert.name}</h3>
                          <p className="text-sm text-muted-foreground">Issued by: {cert.issuer}</p>
                        </div>
                        {getStatusBadge(cert.status)}
                      </div>
                      
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Issue Date: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'Pending'}</span>
                          <span>Expiry Date: {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : 'Pending'}</span>
                        </div>
                        
                        {cert.status === 'in-process' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Application Progress</span>
                              <span>{cert.progress}%</span>
                            </div>
                            <Progress value={cert.progress} className="h-2" />
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="mr-2">
                            <FileText size={16} className="mr-2" />
                            View Details
                          </Button>
                          
                          {cert.status === 'expiring-soon' && (
                            <Button size="sm">Renew Certification</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="requirements" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Certification Requirements Tracking</h3>
              <Button variant="outline">
                <Calendar size={16} className="mr-2" />
                View Calendar
              </Button>
            </div>
            
            <div className="space-y-6">
              {certifications.map(cert => (
                <Card key={cert.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{cert.name}</CardTitle>
                      {getStatusBadge(cert.status)}
                    </div>
                    <CardDescription>Progress: {cert.progress}%</CardDescription>
                    <Progress value={cert.progress} className="h-2 mt-2" />
                  </CardHeader>
                  
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Status</TableHead>
                          <TableHead>Requirement</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cert.requirements.map(req => (
                          <TableRow key={req.id}>
                            <TableCell>{getRequirementIcon(req.status)}</TableCell>
                            <TableCell>{req.name}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">Update</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="documentation" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Certification Documentation</h3>
              <Button>
                <Upload size={16} className="mr-2" />
                Upload New Document
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Certification</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Organic Inspection Report</TableCell>
                    <TableCell>Organic Certification</TableCell>
                    <TableCell>2024-03-10</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800">Valid</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Farm Management Plan</TableCell>
                    <TableCell>Multiple</TableCell>
                    <TableCell>2024-02-15</TableCell>
                    <TableCell><Badge className="bg-green-100 text-green-800">Valid</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Rainforest Alliance Application</TableCell>
                    <TableCell>Rainforest Alliance</TableCell>
                    <TableCell>2024-01-30</TableCell>
                    <TableCell><Badge className="bg-blue-100 text-blue-800">In Review</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Association Member List</TableCell>
                    <TableCell>Fair Trade</TableCell>
                    <TableCell>2023-12-05</TableCell>
                    <TableCell><Badge className="bg-amber-100 text-amber-800">Update Required</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="inspections" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Upcoming Audits & Inspections</h3>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Schedule Inspection</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Schedule New Inspection</h4>
                        <p className="text-sm text-muted-foreground">
                          Contact certification body to arrange inspection dates.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline">Contact</Button>
                        <Button>Schedule</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Organic Annual Inspection</h3>
                      <p className="text-sm text-muted-foreground">ECOCERT</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Inspection Date</p>
                      <p className="text-sm">2025-02-15</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Inspector</p>
                      <p className="text-sm">John Mukasa</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Preparation Status</p>
                      <p className="text-sm">75% Complete</p>
                    </div>
                  </div>
                  <Progress value={75} className="h-2 mt-4" />
                  <div className="mt-4">
                    <Button variant="outline" size="sm">View Checklist</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Fair Trade Audit</h3>
                      <p className="text-sm text-muted-foreground">FLO-CERT</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Preparation</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Inspection Date</p>
                      <p className="text-sm">2025-05-20</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Inspector</p>
                      <p className="text-sm">Not assigned yet</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Preparation Status</p>
                      <p className="text-sm">45% Complete</p>
                    </div>
                  </div>
                  <Progress value={45} className="h-2 mt-4" />
                  <div className="mt-4">
                    <Button variant="outline" size="sm">View Checklist</Button>
                  </div>
                </CardContent>
              </Card>
              
              <h3 className="text-lg font-medium mt-6">Past Inspections</h3>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Certification</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Inspector</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Organic Certification</TableCell>
                      <TableCell>2024-02-15</TableCell>
                      <TableCell>Mary Atwine</TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-800">Passed</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Report</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fair Trade</TableCell>
                      <TableCell>2023-11-10</TableCell>
                      <TableCell>Robert Kigozi</TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-800">Passed</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Report</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>UTZ Certification</TableCell>
                      <TableCell>2023-05-03</TableCell>
                      <TableCell>James Okello</TableCell>
                      <TableCell><Badge className="bg-amber-100 text-amber-800">Conditional</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Report</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <NewCertificationDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSave={handleAddCertification}
      />
    </Card>
  );
};

export default AssociationCertifications;
