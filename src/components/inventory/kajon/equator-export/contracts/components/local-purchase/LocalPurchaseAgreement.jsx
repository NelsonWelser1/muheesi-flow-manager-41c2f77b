
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { useLocalPurchaseAgreements } from '@/hooks/useLocalPurchaseAgreements';
import FileUploadSection from '@/components/inventory/dairy/accounts/forms/components/FileUploadSection';
import { supabase } from '@/integrations/supabase/supabase';
import {
  FileText, Calendar, Upload, Search, Edit, Trash, Plus, 
  ArrowLeft, User, Printer, Download, Save, X, Coffee, 
  DollarSign, Check, AlertCircle, Loader2
} from 'lucide-react';

const statusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'active': 'bg-green-100 text-green-800',
  'completed': 'bg-blue-100 text-blue-800',
  'cancelled': 'bg-red-100 text-red-800'
};

const LocalPurchaseAgreement = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    contract_number: '',
    agreement_date: format(new Date(), 'yyyy-MM-dd'),
    buyer_name: 'KAJON Coffee Limited',
    buyer_address: 'Kanoni, Kazo District, Uganda',
    buyer_contact: '+256 782 123456',
    supplier_name: '',
    supplier_address: '',
    supplier_contact: '',
    payment_terms: 'Payment due within 30 days of delivery',
    delivery_terms: 'Delivery to buyer\'s warehouse',
    contract_status: 'draft',
    quality_requirements: 'Standard coffee quality as per Uganda Coffee Development Authority guidelines',
    special_terms: '',
    notes: '',
    items: [
      { id: 1, description: '', variety: '', quantity: 0, unit: 'Kg', unit_price: 0 }
    ]
  });
  
  // File upload state
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const fileInputRef = React.useRef(null);
  
  const { toast } = useToast();
  const { 
    fetchAgreements, 
    saveAgreement, 
    updateAgreement, 
    deleteAgreement,
    generateContractNumber 
  } = useLocalPurchaseAgreements();
  
  // Load agreements on component mount
  useEffect(() => {
    loadAgreements();
  }, []);
  
  const loadAgreements = async () => {
    setIsLoading(true);
    try {
      const result = await fetchAgreements();
      
      if (result.success) {
        setAgreements(result.data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load agreements",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading agreements:', error);
      toast({
        title: "Error",
        description: "Failed to load agreements",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateNew = () => {
    // Generate a new contract number
    const newContractNumber = generateContractNumber();
    
    // Reset form with default values and new contract number
    setFormData({
      contract_number: newContractNumber,
      agreement_date: format(new Date(), 'yyyy-MM-dd'),
      buyer_name: 'KAJON Coffee Limited',
      buyer_address: 'Kanoni, Kazo District, Uganda',
      buyer_contact: '+256 782 123456',
      supplier_name: '',
      supplier_address: '',
      supplier_contact: '',
      payment_terms: 'Payment due within 30 days of delivery',
      delivery_terms: 'Delivery to buyer\'s warehouse',
      contract_status: 'draft',
      quality_requirements: 'Standard coffee quality as per Uganda Coffee Development Authority guidelines',
      special_terms: '',
      notes: '',
      items: [
        { id: 1, description: '', variety: '', quantity: 0, unit: 'Kg', unit_price: 0 }
      ]
    });
    
    setSelectedAgreement(null);
    setFile(null);
    setUploadedFileUrl('');
    setActiveTab('form');
  };
  
  const handleEditAgreement = (agreement) => {
    setSelectedAgreement(agreement);
    setFormData({
      ...agreement,
      // Ensure items array is properly formatted
      items: Array.isArray(agreement.items) ? agreement.items : [
        { id: 1, description: '', variety: '', quantity: 0, unit: 'Kg', unit_price: 0 }
      ]
    });
    setActiveTab('form');
  };
  
  const handleViewAgreement = (agreement) => {
    setSelectedAgreement(agreement);
    setFormData({
      ...agreement,
      // Ensure items array is properly formatted
      items: Array.isArray(agreement.items) ? agreement.items : [
        { id: 1, description: '', variety: '', quantity: 0, unit: 'Kg', unit_price: 0 }
      ]
    });
    setActiveTab('view');
  };
  
  const handleDeleteAgreement = async (id) => {
    if (!confirm('Are you sure you want to delete this agreement?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await deleteAgreement(id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Agreement deleted successfully"
        });
        
        // Refresh agreements list
        await loadAgreements();
      } else {
        toast({
          title: "Error",
          description: `Failed to delete agreement: ${result.error?.message || 'Unknown error'}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting agreement:', error);
      toast({
        title: "Error",
        description: "Failed to delete agreement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };
  
  const addNewItem = () => {
    const newId = Math.max(0, ...formData.items.map(item => item.id)) + 1;
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: newId, description: '', variety: '', quantity: 0, unit: 'Kg', unit_price: 0 }
      ]
    }));
  };
  
  const removeItem = (id) => {
    if (formData.items.length <= 1) {
      toast({
        title: "Error",
        description: "At least one item is required",
        variant: "destructive"
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };
  
  const calculateTotal = () => {
    return formData.items.reduce(
      (total, item) => total + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0)), 
      0
    );
  };
  
  const validateForm = () => {
    // Required field validation
    if (!formData.supplier_name) {
      toast({
        title: "Missing Information",
        description: "Please provide supplier name",
        variant: "destructive"
      });
      return false;
    }
    
    // Items validation
    if (!formData.items || formData.items.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one item",
        variant: "destructive"
      });
      return false;
    }
    
    // Validate each item
    for (const item of formData.items) {
      if (!item.description) {
        toast({
          title: "Missing Information",
          description: "Please provide a description for all items",
          variant: "destructive"
        });
        return false;
      }
      
      if (!item.quantity || item.quantity <= 0) {
        toast({
          title: "Invalid Information",
          description: "Quantity must be greater than zero for all items",
          variant: "destructive"
        });
        return false;
      }
      
      if (!item.unit_price || item.unit_price <= 0) {
        toast({
          title: "Invalid Information",
          description: "Price must be greater than zero for all items",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    // Calculate total value
    const totalValue = calculateTotal();
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      total_value: totalValue
    };
    
    setIsLoading(true);
    try {
      let result;
      
      if (selectedAgreement) {
        // Update existing agreement
        result = await updateAgreement(selectedAgreement.id, submissionData);
      } else {
        // Create new agreement
        result = await saveAgreement(submissionData);
      }
      
      if (result.success) {
        toast({
          title: "Success",
          description: selectedAgreement 
            ? "Agreement updated successfully" 
            : "Agreement saved successfully"
        });
        
        // Upload document if selected
        if (file) {
          await handleFileUpload(result.data.id, result.data.contract_number);
        }
        
        // Refresh agreements and go back to list
        await loadAgreements();
        setActiveTab('list');
      } else {
        toast({
          title: "Error",
          description: `Failed to save agreement: ${result.error?.message || 'Unknown error'}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving agreement:", error);
      toast({
        title: "Error",
        description: `Failed to save agreement: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleFileUpload = async (agreementId, contractNumber) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Generate file path
      const timestamp = Date.now();
      const filePath = `agreements/${contractNumber || 'unknown'}/${timestamp}_${file.name}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData?.publicUrl || '';
      
      // Create document record in the database
      const { data: docData, error: docError } = await supabase
        .from('contract_documents')
        .insert([{
          filename: file.name,
          file_path: filePath,
          file_url: publicUrl,
          contract_id: contractNumber || 'LPA-' + agreementId,
          file_type: file.type,
          file_size: file.size,
          status: 'pending_verification',
          client: formData.supplier_name,
          notes: `Attached to Local Purchase Agreement ${contractNumber}`,
          keywords: ['agreement', 'local purchase', formData.supplier_name],
          signed_by: [formData.buyer_name, formData.supplier_name]
        }])
        .select();
        
      if (docError) {
        console.error('Document record creation error:', docError);
        // Continue despite error in document record
      } else {
        console.log('Document record created:', docData);
      }
      
      setUploadedFileUrl(publicUrl);
      toast({
        title: "File Uploaded",
        description: "Document was successfully uploaded"
      });
      
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Upload Error",
        description: `Failed to upload file: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSearchAgreements = async () => {
    setIsLoading(true);
    try {
      const result = await fetchAgreements({
        search: searchQuery
      });
      
      if (result.success) {
        setAgreements(result.data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to search agreements",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error searching agreements:', error);
      toast({
        title: "Error",
        description: "Failed to search agreements",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExportPdf = (agreement) => {
    toast({
      title: "Export Feature",
      description: "PDF export will be implemented in the next version"
    });
  };
  
  const renderAgreementsList = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search agreements..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchAgreements();
                  }
                }}
              />
            </div>
            <Button 
              variant="outline"
              onClick={handleSearchAgreements}
              disabled={isLoading}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search</span>
            </Button>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Agreement</span>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : agreements.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agreements.map(agreement => (
                  <TableRow key={agreement.id}>
                    <TableCell className="font-medium">{agreement.contract_number}</TableCell>
                    <TableCell>{agreement.supplier_name}</TableCell>
                    <TableCell>{format(new Date(agreement.agreement_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      {agreement.total_value 
                        ? `UGX ${agreement.total_value.toLocaleString()}`
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[agreement.contract_status] || 'bg-gray-100'}>
                        {agreement.contract_status || 'draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewAgreement(agreement)}
                          title="View Agreement"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditAgreement(agreement)}
                          title="Edit Agreement"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleExportPdf(agreement)}
                          title="Export as PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteAgreement(agreement.id)}
                          title="Delete Agreement"
                        >
                          <Trash className="h-4 w-4" />
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
            <p>No agreements found</p>
            <p className="text-sm">
              {searchQuery 
                ? `No results for "${searchQuery}". Try a different search term.` 
                : 'Click "New Agreement" to create your first local purchase agreement.'
              }
            </p>
          </div>
        )}
      </div>
    );
  };
  
  const renderAgreementForm = (readOnly = false) => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setActiveTab('list')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to List</span>
          </Button>
          <div className="space-x-2">
            {!readOnly && (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <span>Save Agreement</span>
                  </>
                )}
              </Button>
            )}
            {readOnly && (
              <Button
                variant="outline"
                onClick={() => handleExportPdf(selectedAgreement)}
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Export as PDF</span>
              </Button>
            )}
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Local Purchase Agreement</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Contract Number</label>
                  <Input 
                    value={formData.contract_number}
                    onChange={(e) => handleInputChange('contract_number', e.target.value)}
                    disabled={readOnly || isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Agreement Date</label>
                  <Input 
                    type="date"
                    value={formData.agreement_date}
                    onChange={(e) => handleInputChange('agreement_date', e.target.value)}
                    disabled={readOnly || isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select
                    value={formData.contract_status}
                    onValueChange={(value) => handleInputChange('contract_status', value)}
                    disabled={readOnly || isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-medium mb-2">Document Attachment</h3>
                {readOnly ? (
                  uploadedFileUrl ? (
                    <div className="p-3 bg-gray-50 border rounded-md">
                      <a 
                        href={uploadedFileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        <span>View Attached Document</span>
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No document attached</p>
                  )
                ) : (
                  <FileUploadSection
                    fileInputRef={fileInputRef}
                    fileSelected={file}
                    handleFileUpload={() => {}}
                    isUploading={isUploading}
                    uploadedFileUrl={uploadedFileUrl}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="parties">
          <TabsList>
            <TabsTrigger value="parties">
              <User className="h-4 w-4 mr-2" />
              <span>Parties</span>
            </TabsTrigger>
            <TabsTrigger value="items">
              <Coffee className="h-4 w-4 mr-2" />
              <span>Items</span>
            </TabsTrigger>
            <TabsTrigger value="terms">
              <FileText className="h-4 w-4 mr-2" />
              <span>Terms & Conditions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="parties" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium">Buyer Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Buyer Name</label>
                  <Input 
                    value={formData.buyer_name}
                    onChange={(e) => handleInputChange('buyer_name', e.target.value)}
                    disabled={readOnly || isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Buyer Address</label>
                  <Textarea 
                    value={formData.buyer_address}
                    onChange={(e) => handleInputChange('buyer_address', e.target.value)}
                    rows={2}
                    disabled={readOnly || isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Buyer Contact</label>
                  <Input 
                    value={formData.buyer_contact}
                    onChange={(e) => handleInputChange('buyer_contact', e.target.value)}
                    disabled={readOnly || isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Supplier Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier Name*</label>
                  <Input 
                    value={formData.supplier_name}
                    onChange={(e) => handleInputChange('supplier_name', e.target.value)}
                    disabled={readOnly || isLoading}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier Address</label>
                  <Textarea 
                    value={formData.supplier_address}
                    onChange={(e) => handleInputChange('supplier_address', e.target.value)}
                    rows={2}
                    disabled={readOnly || isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier Contact</label>
                  <Input 
                    value={formData.supplier_contact}
                    onChange={(e) => handleInputChange('supplier_contact', e.target.value)}
                    disabled={readOnly || isLoading}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="items" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description*</TableHead>
                    <TableHead>Variety</TableHead>
                    <TableHead>Quantity*</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Unit Price (UGX)*</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>{!readOnly && 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input 
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="E.g., Arabica Coffee"
                          disabled={readOnly || isLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={item.variety}
                          onChange={(e) => handleItemChange(index, 'variety', e.target.value)}
                          placeholder="E.g., AA grade"
                          disabled={readOnly || isLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          disabled={readOnly || isLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.unit}
                          onValueChange={(value) => handleItemChange(index, 'unit', value)}
                          disabled={readOnly || isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Kg">Kg</SelectItem>
                            <SelectItem value="Ton">Ton</SelectItem>
                            <SelectItem value="Bag">Bag</SelectItem>
                            <SelectItem value="Unit">Unit</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          disabled={readOnly || isLoading}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        UGX {((item.quantity || 0) * (item.unit_price || 0)).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {!readOnly && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {!readOnly && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={addNewItem}
                          disabled={isLoading}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          <span>Add Item</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <div className="bg-slate-50 p-4 rounded-md border w-64">
                <div className="flex justify-between font-medium">
                  <span>Total Value:</span>
                  <span>UGX {calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="terms" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Terms</label>
                  <Textarea 
                    value={formData.payment_terms}
                    onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                    rows={3}
                    disabled={readOnly || isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Terms</label>
                  <Textarea 
                    value={formData.delivery_terms}
                    onChange={(e) => handleInputChange('delivery_terms', e.target.value)}
                    rows={3}
                    disabled={readOnly || isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Quality Requirements</label>
                  <Textarea 
                    value={formData.quality_requirements}
                    onChange={(e) => handleInputChange('quality_requirements', e.target.value)}
                    rows={3}
                    disabled={readOnly || isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Special Terms</label>
                  <Textarea 
                    value={formData.special_terms}
                    onChange={(e) => handleInputChange('special_terms', e.target.value)}
                    rows={3}
                    disabled={readOnly || isLoading}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <Textarea 
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                disabled={readOnly || isLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Local Purchase Agreements</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeTab === 'list' && renderAgreementsList()}
        {activeTab === 'form' && renderAgreementForm(false)}
        {activeTab === 'view' && renderAgreementForm(true)}
      </CardContent>
    </Card>
  );
};

export default LocalPurchaseAgreement;
