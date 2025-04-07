
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, FileText, Eye, Download, Trash2, Filter, RefreshCcw } from 'lucide-react';
import { useLocalPurchaseAgreements } from '@/hooks/useLocalPurchaseAgreements';
import { format } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { exportContractToPDF } from '../../utils/contractExportUtils';

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const LocalPurchaseAgreementList = ({ onNewAgreement, onViewAgreement, onEditAgreement }) => {
  const { toast } = useToast();
  const { fetchAgreements, deleteAgreement, loading } = useLocalPurchaseAgreements();
  const [agreements, setAgreements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [agreementToDelete, setAgreementToDelete] = useState(null);
  
  useEffect(() => {
    loadAgreements();
  }, []);
  
  const loadAgreements = async () => {
    const filters = {
      ...(statusFilter && { status: statusFilter }),
      ...(searchTerm && { search: searchTerm })
    };
    
    const result = await fetchAgreements(filters);
    if (result.success) {
      setAgreements(result.data || []);
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadAgreements();
  };
  
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    // Re-fetch with the new filter
    fetchAgreements({ status: value, search: searchTerm }).then(result => {
      if (result.success) {
        setAgreements(result.data || []);
      }
    });
  };
  
  const handleDeleteAgreement = async () => {
    if (!agreementToDelete) return;
    
    const result = await deleteAgreement(agreementToDelete.id);
    if (result.success) {
      // Remove from local state to avoid re-fetching
      setAgreements(prevAgreements => 
        prevAgreements.filter(a => a.id !== agreementToDelete.id)
      );
      setAgreementToDelete(null);
    }
  };
  
  const handleRefresh = () => {
    loadAgreements();
    toast({
      title: "Refreshed",
      description: "Agreement list has been refreshed",
    });
  };
  
  const handleExportPDF = async (agreement) => {
    // Create a hidden div for PDF export
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);
    
    // Format agreement data for export
    tempDiv.innerHTML = `
      <div class="print-container p-6 bg-white">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-blue-800">LOCAL PURCHASE AGREEMENT</h1>
          <div class="text-gray-500">Contract #: ${agreement.contract_number}</div>
          <div class="text-gray-500">Date: ${format(new Date(agreement.agreement_date), 'MMMM dd, yyyy')}</div>
        </div>
        
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2 text-blue-700">BUYER</h2>
          <div>${agreement.buyer_name}</div>
          <div>${agreement.buyer_address || ''}</div>
          <div>${agreement.buyer_contact || ''}</div>
        </div>
        
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2 text-blue-700">SUPPLIER</h2>
          <div>${agreement.supplier_name}</div>
          <div>${agreement.supplier_address || ''}</div>
          <div>${agreement.supplier_contact || ''}</div>
        </div>
        
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2 text-blue-700">ITEMS</h2>
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th class="border p-2 text-left">Description</th>
                <th class="border p-2 text-left">Variety/Type</th>
                <th class="border p-2 text-left">Quantity</th>
                <th class="border p-2 text-left">Unit</th>
                <th class="border p-2 text-left">Price per Unit</th>
                <th class="border p-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(agreement.items || []).map(item => `
                <tr>
                  <td class="border p-2">${item.description || ''}</td>
                  <td class="border p-2">${item.variety || ''}</td>
                  <td class="border p-2">${item.quantity || 0}</td>
                  <td class="border p-2">${item.unit || 'Kg'}</td>
                  <td class="border p-2">${item.unit_price || 0}</td>
                  <td class="border p-2">${((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" class="border p-2 text-right font-bold">TOTAL:</td>
                <td class="border p-2 font-bold">${agreement.total_value || 0}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2 text-blue-700">TERMS</h2>
          <div class="mb-2"><strong>Payment Terms:</strong> ${agreement.payment_terms || ''}</div>
          <div class="mb-2"><strong>Delivery Terms:</strong> ${agreement.delivery_terms || ''}</div>
          <div class="mb-2"><strong>Quality Requirements:</strong> ${agreement.quality_requirements || ''}</div>
          <div class="mb-2"><strong>Special Terms:</strong> ${agreement.special_terms || ''}</div>
          <div class="mb-2"><strong>Notes:</strong> ${agreement.notes || ''}</div>
        </div>
        
        <div class="mt-10">
          <div class="grid grid-cols-2 gap-6">
            <div class="border-t pt-4">
              <p class="font-semibold">For and on behalf of BUYER:</p>
              <div class="mt-6 h-10 border-b border-dashed"></div>
              <p class="text-sm text-gray-500">Authorized Signature, Date</p>
            </div>
            
            <div class="border-t pt-4">
              <p class="font-semibold">For and on behalf of SUPPLIER:</p>
              <div class="mt-6 h-10 border-b border-dashed"></div>
              <p class="text-sm text-gray-500">Authorized Signature, Date</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Export to PDF
    try {
      await exportContractToPDF(
        tempDiv, 
        `local-purchase-${agreement.contract_number}`,
        toast
      );
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString || 'N/A';
    }
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value || 0);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Local Purchase Agreements</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            title="Refresh"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          
          <Select 
            value={statusFilter}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search agreements..." 
                className="pl-8 w-40 sm:w-64" 
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button type="submit" variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <Button 
            variant="default" 
            className="flex items-center gap-1"
            onClick={onNewAgreement}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Agreement</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Agreement ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading agreements...
                    </TableCell>
                  </TableRow>
                ) : agreements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {searchTerm || statusFilter 
                        ? "No agreements match your search criteria" 
                        : "No local purchase agreements found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  agreements.map((agreement) => (
                    <TableRow key={agreement.id}>
                      <TableCell className="font-medium">
                        {agreement.contract_number}
                      </TableCell>
                      <TableCell>
                        {formatDate(agreement.agreement_date)}
                      </TableCell>
                      <TableCell>
                        <div>{agreement.supplier_name}</div>
                        {agreement.supplier_contact && (
                          <div className="text-xs text-gray-500">{agreement.supplier_contact}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {agreement.items && agreement.items.length > 0 ? (
                          <div className="text-sm">
                            {agreement.items.slice(0, 2).map((item, index) => (
                              <div key={index}>
                                {item.description || 'Unnamed item'} ({item.quantity || 0} {item.unit || 'Kg'})
                              </div>
                            ))}
                            {agreement.items.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{agreement.items.length - 2} more items
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">No items</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(agreement.total_value)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[agreement.contract_status] || statusColors.draft}>
                          {agreement.contract_status.charAt(0).toUpperCase() + agreement.contract_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="View Agreement"
                            onClick={() => onViewAgreement(agreement)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Download Agreement"
                            onClick={() => handleExportPDF(agreement)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Edit Agreement"
                            onClick={() => onEditAgreement(agreement)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                title="Delete Agreement"
                                onClick={() => setAgreementToDelete(agreement)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Agreement</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete agreement #{agreement.contract_number}? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setAgreementToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAgreement} className="bg-red-500 hover:bg-red-600">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalPurchaseAgreementList;
