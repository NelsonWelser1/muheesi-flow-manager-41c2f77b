
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Download, FileSpreadsheet, FileText, Share2, Mail, Send, Printer 
} from "lucide-react";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useDeliveryNotes } from '@/hooks/useDeliveryNotes';

const DeliveryNoteList = ({ isOpen, onClose }) => {
  const { deliveryNotes, isLoading, updateDeliveryNoteStatus } = useDeliveryNotes();
  const [sortField, setSortField] = useState('deliveryDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getFilteredDeliveryNotes = () => {
    if (!deliveryNotes || !Array.isArray(deliveryNotes)) return [];

    let filtered = [...deliveryNotes];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(note => 
        note.order_reference?.toLowerCase().includes(term) ||
        note.receiver_name?.toLowerCase().includes(term) ||
        note.delivery_location?.toLowerCase().includes(term)
      );
    }

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let dateFrom = new Date();

      switch (dateRange) {
        case 'today':
          dateFrom.setHours(0, 0, 0, 0);
          break;
        case 'week':
          dateFrom.setDate(now.getDate() - 7);
          break;
        case 'month':
          dateFrom.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          dateFrom.setFullYear(now.getFullYear() - 1);
          break;
        case 'custom':
          if (startDate) {
            dateFrom = new Date(startDate);
          }
          break;
        default:
          break;
      }

      let dateTo = new Date();
      if (dateRange === 'custom' && endDate) {
        dateTo = new Date(endDate);
        dateTo.setHours(23, 59, 59, 999);
      }

      filtered = filtered.filter(note => {
        const noteDate = new Date(note.delivery_date);
        return noteDate >= dateFrom && noteDate <= dateTo;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA = a[sortField] || '';
      let valueB = b[sortField] || '';

      // Handle dates
      if (sortField === 'delivery_date' || sortField === 'created_at') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  };

  const handleStatusChange = (id, status) => {
    updateDeliveryNoteStatus({ id, status });
  };

  const exportToExcel = () => {
    const filteredData = getFilteredDeliveryNotes();
    const worksheet = XLSX.utils.json_to_sheet(filteredData.map(note => ({
      'Order Reference': note.order_reference,
      'Delivery Date': format(new Date(note.delivery_date), 'yyyy-MM-dd'),
      'Receiver': note.receiver_name,
      'Location': note.delivery_location,
      'Status': note.delivery_status,
      'Created At': format(new Date(note.created_at), 'yyyy-MM-dd HH:mm')
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Delivery Notes');
    XLSX.writeFile(workbook, 'delivery_notes.xlsx');
  };

  const exportToCSV = () => {
    const filteredData = getFilteredDeliveryNotes();
    const worksheet = XLSX.utils.json_to_sheet(filteredData.map(note => ({
      'Order Reference': note.order_reference,
      'Delivery Date': format(new Date(note.delivery_date), 'yyyy-MM-dd'),
      'Receiver': note.receiver_name,
      'Location': note.delivery_location,
      'Status': note.delivery_status,
      'Created At': format(new Date(note.created_at), 'yyyy-MM-dd HH:mm')
    })));
    
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'delivery_notes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const filteredData = getFilteredDeliveryNotes();
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Delivery Notes', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 14, 30);
    
    const tableColumn = ["Order Ref", "Date", "Receiver", "Location", "Status"];
    const tableRows = filteredData.map(note => [
      note.order_reference,
      format(new Date(note.delivery_date), 'yyyy-MM-dd'),
      note.receiver_name,
      note.delivery_location,
      note.delivery_status
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 }
    });
    
    doc.save('delivery_notes.pdf');
  };

  const shareViaWhatsApp = (note) => {
    const text = `Delivery Note - Order: ${note.order_reference}, Date: ${format(new Date(note.delivery_date), 'yyyy-MM-dd')}, Receiver: ${note.receiver_name}, Location: ${note.delivery_location}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaEmail = (note) => {
    const subject = `Delivery Note - ${note.order_reference}`;
    const body = `
      Delivery Note Details:
      Order Reference: ${note.order_reference}
      Delivery Date: ${format(new Date(note.delivery_date), 'yyyy-MM-dd')}
      Receiver: ${note.receiver_name}
      Contact: ${note.receiver_contact}
      Location: ${note.delivery_location}
      Status: ${note.delivery_status}
    `;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const saveLocally = (note) => {
    const noteData = JSON.stringify(note, null, 2);
    const blob = new Blob([noteData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `delivery_note_${note.id}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredNotes = getFilteredDeliveryNotes();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Delivery Notes</SheetTitle>
        </SheetHeader>
        
        <div className="my-4 space-y-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-52"
              />
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
              
              {dateRange === 'custom' && (
                <>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToCSV}
                className="flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToExcel}
                className="flex items-center gap-1"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToPDF}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading delivery notes...</div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-8">No delivery notes found</div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer" 
                          onClick={() => {
                            if (sortField === 'order_reference') {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortField('order_reference');
                              setSortDirection('asc');
                            }
                          }}
                        >
                          Order Ref {sortField === 'order_reference' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => {
                            if (sortField === 'delivery_date') {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortField('delivery_date');
                              setSortDirection('asc');
                            }
                          }}
                        >
                          Date {sortField === 'delivery_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead>Receiver</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNotes.map((note) => (
                        <TableRow key={note.id}>
                          <TableCell>{note.order_reference}</TableCell>
                          <TableCell>{format(new Date(note.delivery_date), 'yyyy-MM-dd')}</TableCell>
                          <TableCell>{note.receiver_name}</TableCell>
                          <TableCell>{note.delivery_location}</TableCell>
                          <TableCell>
                            <Select 
                              value={note.delivery_status} 
                              onValueChange={(value) => handleStatusChange(note.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="dispatched">Dispatched</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => shareViaWhatsApp(note)}
                                title="Share via WhatsApp"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => shareViaEmail(note)}
                                title="Share via Email"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => saveLocally(note)}
                                title="Save locally"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  const doc = new jsPDF();
                                  doc.setFontSize(18);
                                  doc.text(`Delivery Note: ${note.order_reference}`, 14, 22);
                                  
                                  doc.setFontSize(12);
                                  doc.text(`Date: ${format(new Date(note.delivery_date), 'yyyy-MM-dd')}`, 14, 32);
                                  doc.text(`Receiver: ${note.receiver_name}`, 14, 38);
                                  doc.text(`Contact: ${note.receiver_contact}`, 14, 44);
                                  doc.text(`Location: ${note.delivery_location}`, 14, 50);
                                  doc.text(`Status: ${note.delivery_status}`, 14, 56);
                                  
                                  if (note.items && note.items.length > 0) {
                                    doc.text('Items:', 14, 66);
                                    autoTable(doc, {
                                      head: [['Item', 'Quantity', 'Unit']],
                                      body: note.items.map(item => [
                                        item.name,
                                        item.quantity,
                                        item.unit
                                      ]),
                                      startY: 70
                                    });
                                  }
                                  
                                  doc.save(`delivery_note_${note.order_reference}.pdf`);
                                }}
                                title="Print"
                              >
                                <Printer className="h-4 w-4" />
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
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DeliveryNoteList;
