import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, Clock, AlertOctagon, Search, Printer, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import EquipmentEntryForm from '../form/EquipmentEntryForm';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const EquipmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: equipmentList,
    isLoading
  } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('equipment').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching equipment:', error);
        throw error;
      }
      console.log('Fetched equipment:', data);
      return data;
    }
  });

  const getStatusIcon = status => {
    switch (status) {
      case 'operational':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertOctagon className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthScore = (condition) => {
    switch (condition) {
      case 'excellent':
        return 95;
      case 'good':
        return 80;
      case 'fair':
        return 60;
      case 'poor':
        return 40;
      case 'critical':
        return 20;
      default:
        return 70;
    }
  };

  const getEquipmentStatus = (condition) => {
    switch (condition) {
      case 'excellent':
      case 'good':
        return 'operational';
      case 'fair':
        return 'maintenance';
      case 'poor':
      case 'critical':
        return 'critical';
      default:
        return 'operational';
    }
  };

  const generateMaintenanceDates = (purchaseDate, condition) => {
    const purchase = new Date(purchaseDate);
    const lastMaintenance = new Date(purchase);
    lastMaintenance.setDate(lastMaintenance.getDate() + 30);
    
    const nextMaintenance = new Date(lastMaintenance);
    nextMaintenance.setDate(nextMaintenance.getDate() + (condition === 'critical' ? 7 : 30));
    
    return {
      last: lastMaintenance,
      next: nextMaintenance
    };
  };

  const filteredEquipment = equipmentList?.filter(equipment => {
    const status = getEquipmentStatus(equipment.current_condition);
    const matchesSearch = equipment.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) || equipment.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredEquipment?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEquipment = filteredEquipment?.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = () => {
    if (!filteredEquipment || filteredEquipment.length === 0) {
      console.error('No equipment data to export');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Equipment List Report', 14, 15);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
      
      const tableData = filteredEquipment.map(equipment => {
        const status = getEquipmentStatus(equipment.current_condition);
        const healthScore = getHealthScore(equipment.current_condition);
        const maintenanceDates = generateMaintenanceDates(equipment.purchase_date, equipment.current_condition);
        
        return [
          equipment.equipment_name || '',
          status || '',
          equipment.type || '',
          `${healthScore}%`,
          maintenanceDates.last.toLocaleDateString(),
          maintenanceDates.next.toLocaleDateString()
        ];
      });

      doc.autoTable({
        head: [['Machine', 'Status', 'Type', 'Health Score', 'Last Maintenance', 'Next Due']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 }
        }
      });

      doc.save('equipment-list.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const downloadExcel = () => {
    if (!filteredEquipment || filteredEquipment.length === 0) {
      console.error('No equipment data to export');
      return;
    }

    try {
      const excelData = filteredEquipment.map(equipment => {
        const status = getEquipmentStatus(equipment.current_condition);
        const healthScore = getHealthScore(equipment.current_condition);
        const maintenanceDates = generateMaintenanceDates(equipment.purchase_date, equipment.current_condition);
        
        return {
          'Machine': equipment.equipment_name || '',
          'Status': status || '',
          'Type': equipment.type || '',
          'Health Score': `${healthScore}%`,
          'Last Maintenance': maintenanceDates.last.toLocaleDateString(),
          'Next Due': maintenanceDates.next.toLocaleDateString()
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipment List');
      XLSX.writeFile(workbook, 'equipment-list.xlsx');
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-48">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded col-span-1"></div>
            <div className="h-24 bg-gray-200 rounded col-span-1"></div>
            <div className="h-24 bg-gray-200 rounded col-span-1"></div>
          </div>
        </div>
      </div>;
  }

  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Equipment List</h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Hide Form' : 'Add Equipment'}
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={downloadPDF}>
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadExcel}>
                Download Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showForm && <EquipmentEntryForm />}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'operational' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('operational')}
            className="text-green-600"
          >
            Operational
          </Button>
          <Button
            variant={statusFilter === 'maintenance' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('maintenance')}
            className="text-yellow-600"
          >
            Maintenance
          </Button>
          <Button
            variant={statusFilter === 'critical' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('critical')}
            className="text-red-600"
          >
            Critical
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Machine</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Type</TableHead>
                  <TableHead className="whitespace-nowrap">Health Score</TableHead>
                  <TableHead className="whitespace-nowrap">Last Maintenance</TableHead>
                  <TableHead className="whitespace-nowrap">Next Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEquipment?.map(equipment => {
                  const status = getEquipmentStatus(equipment.current_condition);
                  const healthScore = getHealthScore(equipment.current_condition);
                  const maintenanceDates = generateMaintenanceDates(equipment.purchase_date, equipment.current_condition);
                  
                  return (
                    <TableRow key={equipment.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {equipment.equipment_name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status)}
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {equipment.type || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-full rounded-full ${healthScore >= 70 ? 'bg-green-500' : healthScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${healthScore}%` }} 
                            />
                          </div>
                          <span className="font-medium">{healthScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {maintenanceDates.last.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {maintenanceDates.next.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {!filteredEquipment?.length && <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900">No equipment found</p>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'No equipment has been added yet'}
          </p>
        </div>}
    </div>;
};

export default EquipmentList;
