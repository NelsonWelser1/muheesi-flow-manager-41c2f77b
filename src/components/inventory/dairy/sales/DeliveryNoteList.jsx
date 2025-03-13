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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import QRCodeGenerator from "../qr/QRCodeGenerator";
import SearchToolbar from "../forms/components/SearchToolbar";
import ExportActions from "../forms/components/ExportActions";

const DeliveryNoteList = ({ isOpen, onClose, deliveryData }) => {
  // State
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'deliveryDate', direction: 'desc' });
  const [timeRange, setTimeRange] = useState('all');
  const [selectedNote, setSelectedNote] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  // Load delivery notes data from props or mock data for initial demo
  useEffect(() => {
    const mockData = [
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
    ];
    
    // Use real data if available, otherwise use mock data
    setDeliveryNotes(deliveryData?.length > 0 ? deliveryData : mockData);
  }, [deliveryData]);
  
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
    if (!deliveryNotes?.length) return;
    
    const filtered = deliveryNotes.filter(note => {
      const searchLower = searchTerm.toLowerCase();
      return (
        note.receiverName?.toLowerCase().includes(searchLower) ||
        note.orderReference?.toLowerCase().includes(searchLower) ||
        note.deliveryLocation?.toLowerCase().includes(searchLower) ||
        note.deliveryStatus?.toLowerCase().includes(searchLower)
      );
    });
    
    // Apply tab filtering
    const tabFiltered = activeTab === 'all' 
      ? filtered 
      : filtered.filter(note => note.deliveryStatus === activeTab);
    
    setFilteredNotes(tabFiltered);
  }, [searchTerm, deliveryNotes, activeTab]);
  
  // Handle time range filtering
  useEffect(() => {
    if (!deliveryNotes?.length) return;
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'hour':
        startDate.setHours(now.getHours() - 1);
        break;
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
        startDate = new Date(0); // All time
        break;
    }
    
    const filtered = deliveryNotes.filter(note => {
      const deliveryDate = new Date(note.deliveryDate);
      return deliveryDate >= startDate;
    });
    
    // Apply tab and search filters too
    const searchFiltered = searchTerm 
      ? filtered.filter(note => {
          const searchLower = searchTerm.toLowerCase();
          return (
            note.receiverName?.toLowerCase().includes(searchLower) ||
            note.orderReference?.toLowerCase().includes(searchLower) ||
            note.deliveryLocation?.toLowerCase().includes(searchLower) ||
            note.deliveryStatus?.toLowerCase().includes(searchLower)
          );
        }) 
      : filtered;
      
    const tabFiltered = activeTab === 'all' 
      ? searchFiltered 
      : searchFiltered.filter(note => note.deliveryStatus === activeTab);
    
    setFilteredNotes(tabFiltered);
  }, [timeRange, deliveryNotes, searchTerm, activeTab]);
  
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
    // Excel export functionality
    toast({
      title: "Excel Export",
      description: "Excel export initiated"
    });
  };
  
  const exportToPDF = () => {
    // PDF export functionality
    toast({
      title: "PDF Export",
      description: "PDF export initiated"
    });
  };
  
  // View note details
  const viewNoteDetails = (note) => {
    setSelectedNote(note);
  };
  
  // Generate QR code
  const generateQRCode = (note) => {
    setSelectedNote(note);
    setShowQRCode(true);
  };

  // If showing QR Code, render QR code component
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
          {/* Tab filters */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all">All Notes</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="dispatched">Dispatched</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Search and time range filters */}
          <SearchToolbar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            timeRange={timeRange} 
            setTimeRange={setTimeRange} 
          />
          
          {/* Export actions */}
          <div className="flex justify-end">
            <ExportActions data={filteredNotes} title="Delivery Notes" />
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
                            <DropdownMenuItem onClick={() => exportToPDF()}>
                              <FileText className="h-4 w-4 mr-2" />
                              Export as PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportToExcel()}>
                              <FileSpreadsheet className="h-4 w-4 mr-2" />
                              Export as Excel
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
                    {selectedNote.items && selectedNote.items.map((item, index) => (
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
                <Button size="sm" variant="outline" onClick={() => exportToExcel()}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export
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
