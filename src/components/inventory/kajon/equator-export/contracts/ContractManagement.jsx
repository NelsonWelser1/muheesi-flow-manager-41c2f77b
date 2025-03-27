
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, Plus, FileText, Download, Eye, Briefcase, 
  Filter, Calendar, ArrowUpDown, FileCode
} from 'lucide-react';
import ContractTemplates from './components/ContractTemplates';

const contractStatusColors = {
  active: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  completed: "bg-blue-100 text-blue-800",
  draft: "bg-gray-100 text-gray-800",
  negotiation: "bg-purple-100 text-purple-800"
};

const ContractManagement = () => {
  const [showTemplates, setShowTemplates] = useState(false);

  // Sample contracts data
  const contracts = [
    {
      id: 'CNT-1001',
      client: 'European Coffee Roasters GmbH',
      country: 'Germany',
      date: '2023-10-15',
      value: '$145,000',
      status: 'active',
      type: 'Export',
      coffeeType: 'Arabica',
      quantity: '25 tons'
    },
    {
      id: 'CNT-1002',
      client: 'Artisan Bean Co.',
      country: 'USA',
      date: '2023-11-02',
      value: '$92,500',
      status: 'pending',
      type: 'Export',
      coffeeType: 'Arabica, Robusta',
      quantity: '15 tons'
    },
    {
      id: 'CNT-1003',
      client: 'Tokyo Coffee Imports',
      country: 'Japan',
      date: '2023-11-20',
      value: '$78,300',
      status: 'negotiation',
      type: 'Export',
      coffeeType: 'Robusta',
      quantity: '18 tons'
    },
    {
      id: 'CNT-1004',
      client: 'Middle East Coffee Trading LLC',
      country: 'UAE',
      date: '2023-12-05',
      value: '$115,000',
      status: 'active',
      type: 'Export',
      coffeeType: 'Arabica (Premium)',
      quantity: '20 tons'
    },
    {
      id: 'CNT-1005',
      client: 'Nordic Coffee Collective',
      country: 'Sweden',
      date: '2023-12-18',
      value: '$65,200',
      status: 'draft',
      type: 'Export',
      coffeeType: 'Arabica',
      quantity: '10 tons'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Contract Management</h2>
          <p className="text-gray-500 text-sm">Manage export contracts and agreements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setShowTemplates(true)}
          >
            <FileCode className="h-4 w-4" />
            <span>Contract Templates</span>
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>New Contract</span>
          </Button>
        </div>
      </div>
      
      {showTemplates ? (
        <ContractTemplates onBack={() => setShowTemplates(false)} />
      ) : (
        <>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span>Export Contracts</span>
                </CardTitle>
                <div className="flex items-center relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search contracts..." className="pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Contract ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Coffee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">{contract.id}</TableCell>
                        <TableCell>{contract.client}</TableCell>
                        <TableCell>{contract.country}</TableCell>
                        <TableCell>
                          <div className="text-sm">{contract.coffeeType}</div>
                          <div className="text-xs text-gray-500">{contract.quantity}</div>
                        </TableCell>
                        <TableCell>{contract.date}</TableCell>
                        <TableCell>{contract.value}</TableCell>
                        <TableCell>
                          <Badge className={contractStatusColors[contract.status]}>
                            {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Contract Analytics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Contract Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-700">Total Contracts</div>
                  <div className="text-2xl font-bold text-blue-900">24</div>
                  <div className="text-xs text-blue-700">Last 12 months</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-700">Active Value</div>
                  <div className="text-2xl font-bold text-green-900">$1.2M</div>
                  <div className="text-xs text-green-700">15% above target</div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="text-sm text-amber-700">Avg. Fulfillment Time</div>
                  <div className="text-2xl font-bold text-amber-900">45 days</div>
                  <div className="text-xs text-amber-700">5 days faster than 2022</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-700">Compliance Rate</div>
                  <div className="text-2xl font-bold text-purple-900">98.5%</div>
                  <div className="text-xs text-purple-700">+2.1% vs industry avg</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Contract Activities */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Recent Contract Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: '2023-12-20', activity: 'Contract CNT-1004 amended with additional quality requirements', user: 'Jane Smith' },
                  { date: '2023-12-18', activity: 'New contract CNT-1005 created with Nordic Coffee Collective', user: 'John Doe' },
                  { date: '2023-12-15', activity: 'Contract CNT-1002 status updated to "Pending Approval"', user: 'Jane Smith' },
                  { date: '2023-12-10', activity: 'Contract CNT-1003 pricing terms renegotiated', user: 'Michael Chen' },
                ].map((activity, index) => (
                  <div key={index} className="flex gap-4 pb-3 border-b last:border-0">
                    <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <div className="font-medium">{activity.activity}</div>
                      <div className="text-sm text-gray-500">
                        {activity.date} • {activity.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ContractManagement;
