import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const mockCustomers = [
  { id: 1, name: 'Customer A', type: 'Wholesale', location: 'Kampala' },
  { id: 2, name: 'Customer B', type: 'Retail', location: 'Mbarara' },
  { id: 3, name: 'Customer C', type: 'Distribution', location: 'Kyiboga' },
];

const CustomerManagement = () => {
  return (
    <div className="space-y-4">
      <Button>Add New Customer</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.type}</TableCell>
              <TableCell>{customer.location}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerManagement;