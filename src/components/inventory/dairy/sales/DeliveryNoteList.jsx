
import React, { useState, useEffect, useRef } from 'react';
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
import { useToast } from "@/components/ui/use-toast";
import { 
  Eye, 
  ArrowUpDown, 
  RefreshCw,
  Printer, 
  Share2, 
  FileSpreadsheet, 
  FileText,
  QrCode,
  ArrowLeft,
  Download,
  Image
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import QRCodeGenerator from "../qr/QRCodeGenerator";
import SearchToolbar from "./forms/components/SearchToolbar";
import ExportActions from "./forms/components/ExportActions";
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useDeliveryNotes } from '@/integrations/supabase/hooks/sales/useDeliveryNotes';

const DeliveryNoteList = ({ isOpen, onClose, deliveryData, refreshData }) => {
  // State
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [timeRange, setTimeRange] = useState('all');
  const [selectedNote, setSelectedNote] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const qrCodeRef = useRef(null);
  
  // Use the Supabase hook to get delivery notes data
  const { deliveryNotes: supabaseNotes, fetchDeliveryNotes, loading } = useDeliveryNotes();
  
  // Normalize notes to handle both camelCase and snake_case fields
  const normalizeNotes = (notes) => {
    if (!notes || !Array.isArray(notes)) return [];
    
    return notes.map(note => ({
      id: note.id,
      orderReference: note.order_reference || note.orderReference || '',
      receiverName: note.receiver_name || note.receiverName || '',
      receiverContact: note.receiver_contact || note.receiverContact || '',
      deliveryDate: note.delivery_date || note.deliveryDate || '',
      deliveryLocation: note.delivery_location || note.deliveryLocation || '',
      deliveryPerson: note.delivery_person || note.deliveryPerson || '',
      deliveryStatus: note.delivery_status || note.deliveryStatus || 'pending',
      items: note.delivered_items || note.deliveredItems || [],
      created_at: note.created_at || '',
      updated_at: note.updated_at || ''
    }));
  };
  
  // Initialize with data from props or from Supabase
  useEffect(() => {
    if (isOpen) {
      handleRefresh();
    }
  }, [isOpen]);
  
  // Handle refreshing data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log('Refreshing delivery notes...');
      await fetchDeliveryNotes();
      
      toast({
        title: "Refresh Complete",
        description: "Delivery notes have been refreshed",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh delivery notes",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Update deliveryNotes when Supabase data changes
  useEffect(() => {
    if (supabaseNotes?.length > 0) {
      const normalized = normalizeNotes(supabaseNotes);
      setDeliveryNotes(normalized);
      setFilteredNotes(normalized);
      console.log('Normalized delivery notes:', normalized);
    }
  }, [supabaseNotes]);
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredNotes].sort((a, b) => {
      if (key === 'deliveryDate' || key === 'created_at') {
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
  
  // Handle search and tab filtering
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
  
  // Export QR Code as PNG
  const exportQrCodeAsPng = async () => {
    if (!qrCodeRef.current) return;
    
    try {
      const dataUrl = await toPng(qrCodeRef.current);
      const link = document.createElement('a');
      link.download = `delivery-note-qr-${selectedNote?.id || 'code'}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "QR Code Exported",
        description: "QR Code saved as PNG image"
      });
    } catch (error) {
      console.error('Error exporting QR code as PNG:', error);
      toast({
        title: "Export Failed",
        description: "Could not export QR code as PNG",
        variant: "destructive"
      });
    }
  };
  
  // Export QR Code as PDF
  const exportQrCodeAsPdf = async () => {
    if (!qrCodeRef.current) return;
    
    try {
      const dataUrl = await toPng(qrCodeRef.current);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('Delivery Note QR Code', 105, 20, { align: 'center' });
      
      // Add delivery info
      if (selectedNote) {
        pdf.setFontSize(12);
        pdf.text(`Order Reference: ${selectedNote.orderReference}`, 20, 40);
        pdf.text(`Receiver: ${selectedNote.receiverName}`, 20, 50);
        pdf.text(`Delivery Date: ${new Date(selectedNote.deliveryDate).toLocaleDateString()}`, 20, 60);
        pdf.text(`Status: ${selectedNote.deliveryStatus}`, 20, 70);
      }
      
      // Add QR code image
      const imgWidth = 100;
      const imgHeight = 100;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const x = (pageWidth - imgWidth) / 2;
      pdf.addImage(dataUrl, 'PNG', x, 80, imgWidth, imgHeight);
      
      // Add footer
      pdf.setFontSize(10);
      pdf.text('Generated on ' + new Date().toLocaleString(), 105, 200, { align: 'center' });
      
      pdf.save(`delivery-note-qr-${selectedNote?.id || 'code'}.pdf`);
      
      toast({
        title: "QR Code Exported",
        description: "QR Code saved as PDF document"
      });
    } catch (error) {
      console.error('Error exporting QR code as PDF:', error);
      toast({
        title: "Export Failed",
        description: "Could not export QR code as PDF",
        variant: "destructive"
      });
    }
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
        <div ref={qrCodeRef}>
          <QRCodeGenerator 
            data={selectedNote} 
            title="Delivery Note"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button onClick={exportQrCodeAsPng} className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Save as PNG
          </Button>
          <Button onClick={exportQrCodeAsPdf} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Save as PDF
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto" side="right">
        <SheetHeader className="pb-4">
          <div className="flex justify-between items-center">
            <SheetTitle>Delivery Notes</SheetTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
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
                {isRefreshing || loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading delivery notes...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredNotes && filteredNotes.length > 0 ? (
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
                      <TableCell className="font-mono text-xs">{note.id.slice(0, 8)}...</TableCell>
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
                            <DropdownMenuItem onClick={() => window.print()}>
                              <Printer className="h-4 w-4 mr-2" />
                              Print
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
                  <p className="text-sm font-medium">Contact:</p>
                  <p>{selectedNote.receiverContact}</p>
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
                  <p className="text-sm font-medium">Delivery Person:</p>
                  <p>{selectedNote.deliveryPerson}</p>
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
                    {selectedNote.items && Array.isArray(selectedNote.items) && selectedNote.items.map((item, index) => (
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
                <Button size="sm" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
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
