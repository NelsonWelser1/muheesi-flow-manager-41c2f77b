
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, ArrowUpDown, Download, FileCheck } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Sample data for certificates
const sampleCertificates = [
  { 
    id: 'COO-2024-001', 
    type: 'Certificate of Origin',
    date: '2024-05-16', 
    shipment: 'DN-2024-001',
    customer: 'Starbucks Corp.', 
    destination: 'United States',
    issuer: 'Uganda Export Promotion Board',
    status: 'Issued'
  },
  { 
    id: 'PHY-2024-002', 
    type: 'Phytosanitary Certificate',
    date: '2024-05-15', 
    shipment: 'DN-2024-002',
    customer: 'Dunkin Donuts', 
    destination: 'United States',
    issuer: 'Ministry of Agriculture',
    status: 'Draft'
  },
  { 
    id: 'QCC-2024-003', 
    type: 'Quality Control Certificate',
    date: '2024-04-28', 
    shipment: 'DN-2024-003',
    customer: 'Peet\'s Coffee', 
    destination: 'United States',
    issuer: 'UCDA',
    status: 'Issued'
  },
  { 
    id: 'ICO-2024-004', 
    type: 'ICO Certificate',
    date: '2024-05-14', 
    shipment: 'DN-2024-004',
    customer: 'Blue Bottle Coffee', 
    destination: 'United States',
    issuer: 'ICO',
    status: 'Pending'
  }
];

const CertificatesList = ({ onCreateNew }) => {
  const [certificates] = useState(sampleCertificates);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusStyles = {
      'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
      'Pending': 'bg-blue-100 text-blue-800 border-blue-200',
      'Issued': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge variant="outline" className={statusStyles[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('id')}>
                Certificate #
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('type')}>
                Type
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('date')}>
                Date
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('shipment')}>
                Shipment
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('customer')}>
                Customer
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Issuer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((certificate) => (
            <TableRow key={certificate.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{certificate.id}</TableCell>
              <TableCell>{certificate.type}</TableCell>
              <TableCell>{certificate.date}</TableCell>
              <TableCell>{certificate.shipment}</TableCell>
              <TableCell>{certificate.customer}</TableCell>
              <TableCell>{certificate.destination}</TableCell>
              <TableCell>{certificate.issuer}</TableCell>
              <TableCell>{renderStatusBadge(certificate.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex space-x-1 justify-end">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileCheck className="h-4 w-4 mr-2" />
                        Mark as Issued
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Send to Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CertificatesList;
