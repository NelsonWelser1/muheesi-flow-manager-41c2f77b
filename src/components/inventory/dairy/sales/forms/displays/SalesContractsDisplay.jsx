
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
  FileText, 
  MoreHorizontal,
  Trash2, 
  Edit, 
  Eye,
  Download
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useSalesContracts } from '../hooks/useSalesContracts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SalesContractsDisplay = ({ onBack }) => {
  const { contracts, isLoading, deleteContract, fetchContracts } = useSalesContracts();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filter contracts based on search term and active tab
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.contract_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contract_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    
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
