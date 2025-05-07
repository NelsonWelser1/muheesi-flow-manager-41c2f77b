
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, FileCheck, Download, Eye, FileEdit } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample contracts data
const contracts = [
  {
    id: "CNT-2023-001",
    type: "Supply Agreement",
    client: "Equata Coffee Limited",
    date: "2023-10-15",
    expiry: "2024-10-15",
    status: "Active",
    documents: 3
  },
  {
    id: "CNT-2023-002",
    type: "Purchase Contract",
    client: "Nordic Roasters Group",
    date: "2023-09-22",
    expiry: "2024-03-22",
    status: "Active",
    documents: 2
  },
  {
    id: "CNT-2023-003",
    type: "Local Purchase Agreement",
    client: "Bukonzo Joint Cooperative",
    date: "2023-11-05",
    expiry: "2024-02-05",
    status: "Pending",
    documents: 1
  },
  {
    id: "CNT-2023-004",
    type: "Export Agreement",
    client: "Coffee Bean Co.",
    date: "2023-07-30",
    expiry: "2024-07-30",
    status: "Active",
    documents: 5
  },
  {
    id: "CNT-2022-012",
    type: "Supply Agreement",
    client: "Global Coffee Solutions",
    date: "2022-12-10",
    expiry: "2023-12-10",
    status: "Expiring",
    documents: 4
  }
];

const ContractManagement = () => {
  const [activeTab, setActiveTab] = React.useState("all");
  
  const filteredContracts = contracts.filter(contract => {
    if (activeTab === "all") return true;
    return contract.status.toLowerCase() === activeTab.toLowerCase();
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <FileCheck className="mr-2 h-6 w-6" />
            Contract Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Create, manage, and monitor coffee export contracts
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View Templates
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Contract
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Contract Documents</CardTitle>
          <CardDescription>
            Manage supply agreements, purchase contracts and other legal documents
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="expiring">Expiring</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Client/Partner</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="8" className="h-24 text-center">
                        No contracts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">{contract.id}</TableCell>
                        <TableCell>{contract.type}</TableCell>
                        <TableCell>{contract.client}</TableCell>
                        <TableCell>{contract.date}</TableCell>
                        <TableCell>{contract.expiry}</TableCell>
                        <TableCell>
                          <Badge className={
                            contract.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                            contract.status === "Expiring" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" :
                            "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          }>
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{contract.documents}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Agreements</CardTitle>
            <CardDescription>Local coffee purchase agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {["Kazo Cooperative Farmers Agreement", "Bukonzo Joint Cooperative", "Rwenzori Mountain Coffee Farmers"].map((item, i) => (
                <li key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{item}</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Export Agreements</CardTitle>
            <CardDescription>International export agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {["Equata Coffee Limited Master Agreement", "Nordic Roasters Group Annual Contract", "Coffee Bean Co. Supply Agreement"].map((item, i) => (
                <li key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{item}</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractManagement;
