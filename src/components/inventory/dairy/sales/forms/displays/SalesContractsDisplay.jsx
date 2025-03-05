
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Search, 
  MoreHorizontal,
  Trash2, 
  Edit, 
  Eye,
  Download,
  FileText,
  FileSpreadsheet,
  Share2,
  Mail,
  Filter
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useSalesContracts } from '../hooks/useSalesContracts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const SalesContractsDisplay = ({ onBack }) => {
  const { contracts, isLoading, deleteContract, fetchContracts } = useSalesContracts();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  // Filter contracts based on search term and active tab
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.contract_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contract_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && contract.status === activeTab;
  });

  const handleDelete = async (contractId) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      const { success } = await deleteContract(contractId);
      if (success) {
        fetchContracts();
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'pending_approval':
        return <Badge variant="warning">Pending</Badge>;
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'terminated':
        return <Badge>Terminated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text('Sales Contracts Report', 14, 16);
      doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 14, 24);
      
      // Extract the data we want to display
      const tableData = filteredContracts.map(contract => [
        contract.contract_id,
        contract.contract_title,
        contract.client_name,
        formatDate(contract.start_date),
        formatDate(contract.end_date),
        formatCurrency(contract.total_value),
        contract.status
      ]);
      
      doc.autoTable({
        head: [['ID', 'Title', 'Client', 'Start Date', 'End Date', 'Value', 'Status']],
        body: tableData,
        startY: 30,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }
      });
      
      doc.save('sales_contracts.pdf');
      
      toast({
        title: "Success",
        description: "PDF exported successfully",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Error",
        description: "Failed to export PDF",
        variant: "destructive"
      });
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      const tableData = filteredContracts.map(contract => ({
        'Contract ID': contract.contract_id,
        'Title': contract.contract_title,
        'Client': contract.client_name,
        'Start Date': formatDate(contract.start_date),
        'End Date': formatDate(contract.end_date),
        'Total Value': contract.total_value,
        'Status': contract.status
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts");
      
      XLSX.writeFile(workbook, 'sales_contracts.xlsx');
      
      toast({
        title: "Success",
        description: "Excel file exported successfully",
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Error",
        description: "Failed to export Excel file",
        variant: "destructive"
      });
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      const tableData = filteredContracts.map(contract => ({
        'Contract ID': contract.contract_id,
        'Title': contract.contract_title,
        'Client': contract.client_name,
        'Start Date': formatDate(contract.start_date),
        'End Date': formatDate(contract.end_date),
        'Total Value': contract.total_value,
        'Status': contract.status
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(tableData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'sales_contracts.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "CSV file exported successfully",
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: "Error",
        description: "Failed to export CSV file",
        variant: "destructive"
      });
    }
  };

  // Share functions
  const shareViaEmail = () => {
    try {
      // Generate the export first
      const doc = new jsPDF();
      doc.text('Sales Contracts Report', 14, 16);
      
      // Extract the data we want to display
      const tableData = filteredContracts.map(contract => [
        contract.contract_id,
        contract.contract_title,
        contract.client_name,
        formatDate(contract.start_date),
        formatDate(contract.end_date),
        formatCurrency(contract.total_value),
        contract.status
      ]);
      
      doc.autoTable({
        head: [['ID', 'Title', 'Client', 'Start Date', 'End Date', 'Value', 'Status']],
        body: tableData,
        startY: 30,
      });
      
      // In a real app, we would send this PDF via email using a backend service
      // For now, we'll just show a toast notification
      toast({
        title: "Email Sharing",
        description: "This would email the PDF in a real application. Feature coming soon.",
      });
    } catch (error) {
      console.error('Error sharing via email:', error);
      toast({
        title: "Error",
        description: "Failed to share via email",
        variant: "destructive"
      });
    }
  };

  const shareViaWhatsApp = () => {
    try {
      // In a real app, we would generate a shareable link to the report
      // For now, we'll just show a toast notification
      toast({
        title: "WhatsApp Sharing",
        description: "This would share a link via WhatsApp in a real application. Feature coming soon.",
      });
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast({
        title: "Error",
        description: "Failed to share via WhatsApp",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Sales Contracts</CardTitle>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search contracts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={shareViaEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Share via Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareViaWhatsApp}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via WhatsApp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="pending_approval">Pending</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Loading contracts...</p>
                </div>
              ) : filteredContracts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No contracts found</h3>
                  <p className="text-sm text-gray-500">
                    {searchTerm 
                      ? "Try adjusting your search term" 
                      : activeTab !== 'all' 
                        ? `No ${activeTab} contracts found` 
                        : "Create your first contract to see it here"}
                  </p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contract ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">{contract.contract_id}</TableCell>
                          <TableCell>{contract.contract_title}</TableCell>
                          <TableCell>{contract.client_name}</TableCell>
                          <TableCell>{formatDate(contract.start_date)}</TableCell>
                          <TableCell>{formatDate(contract.end_date)}</TableCell>
                          <TableCell>{formatCurrency(contract.total_value)}</TableCell>
                          <TableCell>{getStatusBadge(contract.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  <span>Download PDF</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(contract.contract_id)}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                  <span className="text-red-500">Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesContractsDisplay;
