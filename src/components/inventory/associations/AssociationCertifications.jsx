import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertCircle, FileText, Upload, Calendar, ChevronDown, ChevronRight, Eye, Pencil, Trash2, Save } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewCertificationDialog from './certifications/NewCertificationDialog';
import { useToast } from "@/components/ui/use-toast";
import { useCertifications } from "@/integrations/supabase/hooks/associations/useCertifications";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

const AssociationCertifications = ({ isKazo, selectedAssociation }) => {
  const { toast } = useToast();
  const [activeCertTab, setActiveCertTab] = useState('current');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedCertification, setEditedCertification] = useState(null);
  
  const { 
    certifications, 
    loading, 
    error, 
    fetchCertifications, 
    createCertification,
    updateCertification,
    deleteCertification,
    updateRequirementStatus
  } = useCertifications();
  
  useEffect(() => {
    fetchCertifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleAddCertification = async (newCertification) => {
    await createCertification(newCertification);
    setDialogOpen(false);
  };

  const handleViewDetails = (certification) => {
    setSelectedCertification(certification);
    setEditedCertification(null);
    setEditMode(false);
    setDetailsDialogOpen(true);
  };

  const handleEditClick = () => {
    setEditedCertification({
      ...selectedCertification,
      requirements: selectedCertification.requirements ? [...selectedCertification.requirements] : []
    });
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedCertification(null);
  };

  const handleSaveEdit = async () => {
    try {
      const result = await updateCertification(selectedCertification.id, editedCertification);
      if (result.success) {
        setSelectedCertification(result.data);
        setEditMode(false);
        setEditedCertification(null);
        showSuccessToast(toast, "Certification details updated successfully");
      }
    } catch (error) {
      showErrorToast(toast, `Error updating certification: ${error.message}`);
    }
  };

  const handleRequirementChange = (reqId, field, value) => {
    if (!editedCertification) return;
    
    setEditedCertification(prev => ({
      ...prev,
      requirements: prev.requirements.map(req => 
        req.id === reqId ? { ...req, [field]: value } : req
      )
    }));
  };

  const handleAddRequirement = () => {
    if (!editedCertification) return;
    
    const newRequirement = {
      id: Date.now(),
      name: "",
      status: "pending"
    };
    
    setEditedCertification(prev => ({
      ...prev,
      requirements: [...prev.requirements, newRequirement]
    }));
  };

  const handleRemoveRequirement = (reqId) => {
    if (!editedCertification) return;
    
    setEditedCertification(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req.id !== reqId)
    }));
  };

  const handleUpdateRequirement = async (reqId, status) => {
    if (!selectedCertification) return;
    
    const result = await updateRequirementStatus(selectedCertification.id, reqId, status);
    if (result.success) {
      setSelectedCertification(result.data);
    }
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
      case 'pending':
        return <Badge className="bg-purple-100 text-purple-800">Pending</Badge>;
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
      return cert.status === 'in-process' || cert.status === 'pending';
    } else if (activeCertTab === 'expired') {
      return cert.status === 'expired';
    }
    return true;
  });

  const getNextRequirementStatus = (currentStatus) => {
    const statusCycle = {
      'pending': 'in-process',
      'in-process': 'complete',
      'complete': 'pending'
    };
    return statusCycle[currentStatus] || 'pending';
  };

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
    <>
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
                      <div className={`h-2 ${cert.status === 'valid' ? 'bg-green-500' : cert.status === 'expiring-soon' ? 'bg-amber-500' : cert.status === 'in-process' ? 'bg-blue-500' : cert.status === 'pending' ? 'bg-purple-500' : 'bg-red-500'}`}></div>
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
                          
                          {(cert.status === 'in-process' || cert.status === 'pending') && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Application Progress</span>
                                <span>{cert.progress}%</span>
                              </div>
                              <Progress value={cert.progress} className="h-2" />
                            </div>
                          )}
                          
                          <div className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mr-2"
                              onClick={() => handleViewDetails(cert)}
                            >
                              <Eye size={16} className="mr-2" />
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
                          {Array.isArray(cert.requirements) && cert.requirements.map(req => (
                            <TableRow key={req.id}>
                              <TableCell>{getRequirementIcon(req.status)}</TableCell>
                              <TableCell>{req.name}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateRequirement(req.id, getNextRequirementStatus(req.status))}
                                >
                                  Update Status
                                </Button>
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
      </Card>
      
      <NewCertificationDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSave={handleAddCertification}
      />

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Edit Certification Details' : (selectedCertification?.name + ' - Certification Details')}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCertification && !editMode && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Certification Name</h3>
                  <p>{selectedCertification.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Issuer</h3>
                  <p>{selectedCertification.issuer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div>{getStatusBadge(selectedCertification.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
                  <Progress value={selectedCertification.progress} className="h-2 mt-2" />
                  <p className="text-xs mt-1">{selectedCertification.progress}% Complete</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Issue Date</h3>
                  <p>{selectedCertification.issueDate ? new Date(selectedCertification.issueDate).toLocaleDateString() : 'Not issued yet'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Expiry Date</h3>
                  <p>{selectedCertification.expiryDate ? new Date(selectedCertification.expiryDate).toLocaleDateString() : 'No expiry date set'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <p className="text-sm bg-gray-50 p-3 rounded">{selectedCertification.notes || 'No notes available'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Requirements</h3>
                {Array.isArray(selectedCertification.requirements) && selectedCertification.requirements.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Status</TableHead>
                        <TableHead>Requirement</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCertification.requirements.map(req => (
                        <TableRow key={req.id}>
                          <TableCell>{getRequirementIcon(req.status)}</TableCell>
                          <TableCell>{req.name}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUpdateRequirement(req.id, getNextRequirementStatus(req.status))}
                            >
                              Update Status
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">No requirements specified for this certification.</p>
                )}
              </div>
            </div>
          )}

          {selectedCertification && editMode && editedCertification && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Certification Name</Label>
                  <Input 
                    id="name" 
                    value={editedCertification.name || ''} 
                    onChange={(e) => setEditedCertification({...editedCertification, name: e.target.value})} 
                  />
                </div>
                <div>
                  <Label htmlFor="issuer">Issuer</Label>
                  <Input 
                    id="issuer" 
                    value={editedCertification.issuer || ''} 
                    onChange={(e) => setEditedCertification({...editedCertification, issuer: e.target.value})} 
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={editedCertification.status} 
                    onValueChange={(value) => setEditedCertification({...editedCertification, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valid">Valid</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                      <SelectItem value="in-process">In Process</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input 
                    id="progress"
                    type="number"
                    min="0"
                    max="100" 
                    value={editedCertification.progress || 0} 
                    onChange={(e) => setEditedCertification({
                      ...editedCertification, 
                      progress: Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                    })} 
                  />
                  <Progress value={editedCertification.progress} className="h-2 mt-2" />
                </div>
                <div>
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input 
                    id="issueDate" 
                    type="date"
                    value={editedCertification.issueDate ? new Date(editedCertification.issueDate).toISOString().split('T')[0] : ''} 
                    onChange={(e) => setEditedCertification({...editedCertification, issueDate: e.target.value})} 
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input 
                    id="expiryDate" 
                    type="date"
                    value={editedCertification.expiryDate ? new Date(editedCertification.expiryDate).toISOString().split('T')[0] : ''} 
                    onChange={(e) => setEditedCertification({...editedCertification, expiryDate: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={editedCertification.notes || ''} 
                  onChange={(e) => setEditedCertification({...editedCertification, notes: e.target.value})}
                  className="min-h-[100px]" 
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Requirements</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddRequirement}
                  >
                    Add Requirement
                  </Button>
                </div>
                
                {editedCertification.requirements.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead>Requirement</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editedCertification.requirements.map(req => (
                        <TableRow key={req.id}>
                          <TableCell>
                            <Select 
                              value={req.status} 
                              onValueChange={(value) => handleRequirementChange(req.id, 'status', value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-process">In Process</SelectItem>
                                <SelectItem value="complete">Complete</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={req.name} 
                              onChange={(e) => handleRequirementChange(req.id, 'name', e.target.value)}
                              placeholder="Requirement description" 
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRemoveRequirement(req.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-4 border border-dashed rounded-md">
                    <p className="text-sm text-muted-foreground">No requirements added yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={handleAddRequirement}
                    >
                      Add Your First Requirement
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            {!editMode ? (
              <>
                <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>Close</Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleEditClick}>
                    <Pencil size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive">
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                <Button onClick={handleSaveEdit}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssociationCertifications;
