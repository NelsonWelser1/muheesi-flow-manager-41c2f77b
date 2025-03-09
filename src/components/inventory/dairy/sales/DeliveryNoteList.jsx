
import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Eye, 
  ArrowUpDown, 
  Calendar, 
  Download, 
  Printer, 
  Share2, 
  Mail, 
  FileSpreadsheet, 
  FileText,
  QrCode,
  ArrowLeft
} from "lucide-react";
import QRCodeGenerator from '../qr/QRCodeGenerator';

const DeliveryNoteList = ({ isOpen, onClose, deliveryData }) => {
  // Mock data for demonstration - would come from API in production
  const [deliveryNotes, setDeliveryNotes] = useState([
    { 
      id: 'DN001', 
      orderReference: 'SO123', 
      receiverName: 'John Doe', 
      deliveryDate: '2024-05-15', 
      deliveryLocation: 'Kampala City Center',
      deliveryStatus: 'dispatched',
      items: [{ name: 'Milk', quantity: 10, unit: 'Liters' }]
    },
    { 
      id: 'DN002', 
      orderReference: 'SO124', 
      receiverName: 'Jane Smith', 
      deliveryDate: '2024-05-16', 
      deliveryLocation: 'Entebbe Road',
      deliveryStatus: 'pending',
      items: [{ name: 'Yogurt', quantity: 20, unit: 'Packs' }]
    },
  ]);
  
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'deliveryDate', direction: 'desc' });
  const [timeRange, setTimeRange] = useState('all');
  const { toast } = useToast();
  const [selectedNote, setSelectedNote] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  
  // Initialize filtered orders when delivery notes are loaded
  useEffect(() => {
    setFilteredNotes(deliveryNotes);
  }, [deliveryNotes]);
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredNotes].sort((a, b) => {
      if (key === 'deliveryDate') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredNotes(sortedData);
  };
  
  // Handle search
  useEffect(() => {
    if (!deliveryNotes) return;
    
    const filtered = deliveryNotes.filter(note => {
      const searchLower = searchTerm.toLowerCase();
      return (
        note.receiverName?.toLowerCase().includes(searchLower) ||
        note.orderReference?.toLowerCase().includes(searchLower) ||
        note.deliveryLocation?.toLowerCase().includes(searchLower) ||
        note.deliveryStatus?.toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredNotes(filtered);
  }, [searchTerm, deliveryNotes]);
  
  // Handle time range filtering
  useEffect(() => {
    if (!deliveryNotes) return;
    if (timeRange === 'all') {
      setFilteredNotes(deliveryNotes);
      return;
    }
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        break;
    }
    
    const filtered = deliveryNotes.filter(note => {
      const deliveryDate = new Date(note.deliveryDate);
      return deliveryDate >= startDate;
    });
    
    setFilteredNotes(filtered);
  }, [timeRange, deliveryNotes]);
  
  // Export functions
  const exportToCSV = () => {
    const headers = ['ID', 'Order Reference', 'Receiver', 'Date', 'Location', 'Status'];
    
    const csvData = filteredNotes.map(note => [
      note.id,
      note.orderReference,
      note.receiverName,
      new Date(note.deliveryDate).toLocaleDateString(),
      note.deliveryLocation,
      note.deliveryStatus
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `delivery-notes-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    toast({
      title: "Export Successful",
      description: "Delivery notes exported to CSV"
    });
  };
  
  const exportToExcel = () => {
    const headers = ['ID', 'Order Reference', 'Receiver', 'Date', 'Location', 'Status'];
    
    const excelData = filteredNotes.map(note => [
      note.id,
      note.orderReference,
      note.receiverName,
      new Date(note.deliveryDate).toLocaleDateString(),
      note.deliveryLocation,
      note.deliveryStatus
    ]);
    
    // Create a CSV-like format that Excel can open
    const excelContent = [
      headers.join('\t'),
      ...excelData.map(row => row.join('\t'))
    ].join('\n');
    
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `delivery-notes-${new Date().toISOString().split('T')[0]}.xls`);
    link.click();
    
    toast({
      title: "Export Successful",
      description: "Delivery notes exported to Excel format"
    });
  };
  
  const exportToPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality will be implemented with the jspdf library"
    });
  };
  
  // Sharing functions
  const shareByWhatsApp = (note) => {
    const noteDetails = `
      Delivery Note: ${note.id}
      Order Reference: ${note.orderReference}
      Receiver: ${note.receiverName}
      Date: ${new Date(note.deliveryDate).toLocaleDateString()}
      Location: ${note.deliveryLocation}
      Status: ${note.deliveryStatus}
    `;
    
    const encodedText = encodeURIComponent(noteDetails);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };
  
  const shareByEmail = (note) => {
    const subject = `Delivery Note - ${note.id}`;
    const body = `
      Delivery Note: ${note.id}
      Order Reference: ${note.orderReference}
      Receiver: ${note.receiverName}
      Date: ${new Date(note.deliveryDate).toLocaleDateString()}
      Location: ${note.deliveryLocation}
      Status: ${note.deliveryStatus}
    `;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const saveToLocalAccount = (note) => {
    localStorage.setItem(`delivery-note-${note.id}`, JSON.stringify(note));
    
    toast({
      title: "Note Saved",
      description: "Delivery note saved to your local account"
    });
  };
  
  // View order details
  const viewNoteDetails = (note) => {
    setSelectedNote(note);
  };
  
  // Generate QR code
  const generateQRCode = (note) => {
    setSelectedNote(note);
    setShowQRCode(true);
  };

  if (showQRCode && selectedNote) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowQRCode(false)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Delivery Notes
        </Button>
        <QRCodeGenerator 
          data={selectedNote} 
          title="Delivery Note"
        />
      </div>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto" side="right">
        <SheetHeader className="pb-4">
          <SheetTitle>Delivery Notes</SheetTitle>
          <SheetDescription>
            View and manage your delivery notes
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col gap-4">
          {/* Search and filters */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="relative flex-grow max-w-sm">
              <Input
                placeholder="Search delivery notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[150px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportToCSV}>
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToExcel}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF}>
                    <Printer className="h-4 w-4 mr-2" />
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Delivery Notes table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">View</TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('id')}
                    >
                      ID
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('orderReference')}
                    >
                      Order Ref
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('receiverName')}
                    >
                      Receiver
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('deliveryDate')}
                    >
                      Date
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort('deliveryStatus')}
                    >
                      Status
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => viewNoteDetails(note)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>{note.id}</TableCell>
                      <TableCell>{note.orderReference}</TableCell>
                      <TableCell>{note.receiverName}</TableCell>
                      <TableCell>{new Date(note.deliveryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span 
                          className={
                            note.deliveryStatus === 'delivered' 
                              ? 'text-green-600' 
                              : note.deliveryStatus === 'dispatched' 
                              ? 'text-amber-600' 
                              : 'text-blue-600'
                          }
                        >
                          {note.deliveryStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => generateQRCode(note)}>
                              <QrCode className="h-4 w-4 mr-2" />
                              Generate QR Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Share Options</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => shareByWhatsApp(note)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => shareByEmail(note)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => saveToLocalAccount(note)}>
                              <Download className="h-4 w-4 mr-2" />
                              Share Locally
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No delivery notes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredNotes.length} of {deliveryNotes.length} delivery notes
          </div>
          
          {/* Note Details Modal */}
          {selectedNote && !showQRCode && (
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Delivery Note Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedNote(null)}>Close</Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Delivery Note ID:</p>
                  <p>{selectedNote.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Order Reference:</p>
                  <p>{selectedNote.orderReference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Receiver:</p>
                  <p>{selectedNote.receiverName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date:</p>
                  <p>{new Date(selectedNote.deliveryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Location:</p>
                  <p>{selectedNote.deliveryLocation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status:</p>
                  <p className={
                    selectedNote.deliveryStatus === 'delivered' 
                      ? 'text-green-600' 
                      : selectedNote.deliveryStatus === 'dispatched' 
                      ? 'text-amber-600' 
                      : 'text-blue-600'
                  }>
                    {selectedNote.deliveryStatus}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Items:</p>
                  <ul className="list-disc pl-5">
                    {selectedNote.items.map((item, index) => (
                      <li key={index}>
                        {item.name}: {item.quantity} {item.unit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  onClick={() => generateQRCode(selectedNote)}
                  className="flex items-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  Generate QR Code
                </Button>
                <Button size="sm" onClick={() => exportToPDF()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareByEmail(selectedNote)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareByWhatsApp(selectedNote)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DeliveryNoteList;
