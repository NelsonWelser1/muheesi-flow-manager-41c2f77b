
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Search, Filter, FileCheck, PenSquare, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ContractManagement = () => {
  const [activeContractTab, setActiveContractTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  
  const contracts = [
    { 
      id: 'CON-2023-001', 
      buyer: 'European Coffee Imports Ltd', 
      date: '2023-10-15', 
      quantity: '50 tons', 
      value: '$175,000', 
      status: 'active',
      delivery: '2024-01-15',
      type: 'Arabica - AA Grade'
    },
    { 
      id: 'CON-2023-002', 
      buyer: 'North American Roasters', 
      date: '2023-09-22', 
      quantity: '35 tons', 
      value: '$122,500', 
      status: 'active',
      delivery: '2023-12-22',
      type: 'Arabica - AA Grade, Robusta Blend'
    },
    { 
      id: 'CON-2023-003', 
      buyer: 'Asian Coffee Trading Co.', 
      date: '2023-11-05', 
      quantity: '40 tons', 
      value: '$140,000', 
      status: 'pending',
      delivery: '2024-02-05',
      type: 'Robusta - Premium Grade'
    },
    { 
      id: 'CON-2023-004', 
      buyer: 'Middle East Distributors', 
      date: '2023-10-30', 
      quantity: '25 tons', 
      value: '$87,500', 
      status: 'completed',
      delivery: '2023-11-30',
      type: 'Arabica - A Grade'
    },
    { 
      id: 'CON-2023-005', 
      buyer: 'Premium Roasters GmbH', 
      date: '2023-08-15', 
      quantity: '45 tons', 
      value: '$157,500', 
      status: 'completed',
      delivery: '2023-10-15',
      type: 'Arabica - AA Grade, Organic Certified'
    }
  ];
  
  const filteredContracts = contracts.filter(contract => {
    // Filter by status
    if (activeContractTab !== 'all' && contract.status !== activeContractTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !contract.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !contract.buyer.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contract Management</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Contract
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search contracts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          
          <Tabs value={activeContractTab} onValueChange={setActiveContractTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                All Contracts
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Active
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-1">
                <FileCheck className="h-4 w-4" />
                Completed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coffee Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.buyer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(contract.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <PenSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileCheck className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coffee Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.buyer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.delivery}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <PenSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileCheck className="h-4 w-4" />
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
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coffee Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.buyer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <PenSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coffee Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.buyer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
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
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-blue-800">Contract Renewal Alert</p>
            <p className="text-sm text-blue-700 mt-1">
              3 contracts are due for renewal in the next 30 days. Review and take action to maintain business continuity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractManagement;
