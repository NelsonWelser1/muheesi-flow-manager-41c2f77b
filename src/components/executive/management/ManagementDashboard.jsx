
import React from 'react';
import { useCompanyManagement } from '@/hooks/useCompanyManagement';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Users, Eye } from "lucide-react";
import { format } from 'date-fns';

const ManagementDashboard = () => {
  const { inventoryData, personnelData, approvalsData, isLoading } = useCompanyManagement();

  if (isLoading) {
    return <div>Loading management data...</div>;
  }

  const renderInventorySection = () => {
    const allInventory = [
      ...(inventoryData?.dairy_inventory || []),
      ...(inventoryData?.yogurt_inventory || []),
      ...(inventoryData?.cheese_inventory || []),
      ...(inventoryData?.cold_room_inventory || [])
    ];

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Inventory Overview
            </CardTitle>
            <Badge variant="secondary">
              {allInventory.length} Items
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allInventory.slice(0, 5).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product_name || item.product_type}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.quantity || item.current_stock}</TableCell>
                  <TableCell>
                    {item.updated_at ? format(new Date(item.updated_at), 'PP') : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderPersonnelSection = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Personnel Overview
            </CardTitle>
            <Badge variant="secondary">
              {personnelData?.length || 0} Members
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(personnelData || []).slice(0, 5).map((person, index) => (
                <TableRow key={index}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.role}</TableCell>
                  <TableCell>{person.department}</TableCell>
                  <TableCell>
                    <Badge variant={person.status === 'active' ? 'success' : 'warning'}>
                      {person.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderApprovalsSection = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Pending Approvals
            </CardTitle>
            <Badge variant="secondary">
              {approvalsData?.length || 0} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Type</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(approvalsData || []).slice(0, 5).map((approval, index) => (
                <TableRow key={index}>
                  <TableCell>{approval.type}</TableCell>
                  <TableCell>{approval.requester}</TableCell>
                  <TableCell>
                    {approval.created_at ? format(new Date(approval.created_at), 'PP') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        approval.priority === 'high' ? 'destructive' :
                        approval.priority === 'medium' ? 'warning' : 'default'
                      }
                    >
                      {approval.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6">
      {renderInventorySection()}
      {renderPersonnelSection()}
      {renderApprovalsSection()}
    </div>
  );
};

export default ManagementDashboard;
