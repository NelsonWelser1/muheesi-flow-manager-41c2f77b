
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
  const printableContentRef = useRef(null);
  
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
  
  // Print delivery note details
  const printDeliveryNote = () => {
    if (!selectedNote) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print Failed",
        description: "Could not open print window. Please check your popup blocker settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a printable HTML document with delivery note details
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Delivery Note - ${selectedNote.orderReference}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 30px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              margin-bottom: 5px;
            }
            .company-info {
              margin-bottom: 20px;
              text-align: center;
              font-size: 14px;
            }
            .delivery-details {
              margin-bottom: 30px;
            }
            .delivery-details h2 {
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .detail-row {
              display: flex;
              margin-bottom: 10px;
            }
            .detail-label {
              font-weight: bold;
              width: 150px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .items-table th, .items-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .items-table th {
              background-color: #f2f2f2;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
            }
            .signature-box {
              width: 45%;
            }
            .signature-line {
              border-top: 1px solid #333;
              margin-top: 50px;
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              @page {
                size: A4;
                margin: 20mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DELIVERY NOTE</h1>
            <p>Document No: DN-${selectedNote.id.slice(0, 8)}</p>
          </div>
          
          <div class="company-info">
            <p><strong>Grand Berna Dairies</strong></p>
            <p>8339 Entebbe Town, Uganda</p>
            <p>Tel: +256 757 757 517 / +256 776 670680</p>
          </div>
          
          <div class="delivery-details">
            <h2>Delivery Information</h2>
            <div class="detail-row">
              <span class="detail-label">Order Reference:</span>
              <span>${selectedNote.orderReference}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Delivery Date:</span>
              <span>${new Date(selectedNote.deliveryDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span>${selectedNote.deliveryStatus}</span>
            </div>
          </div>
          
          <div class="delivery-details">
            <h2>Receiver Information</h2>
            <div class="detail-row">
              <span class="detail-label">Receiver Name:</span>
              <span>${selectedNote.receiverName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Contact:</span>
              <span>${selectedNote.receiverContact}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span>${selectedNote.deliveryLocation}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Delivery Person:</span>
              <span>${selectedNote.deliveryPerson}</span>
            </div>
          </div>
          
          <div class="delivery-details">
            <h2>Delivered Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                ${selectedNote.items && Array.isArray(selectedNote.items) ? 
                  selectedNote.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.unit}</td>
                    </tr>
                  `).join('') : 
                  '<tr><td colspan="3">No items</td></tr>'
                }
              </tbody>
            </table>
          </div>
          
          <div class="signatures">
            <div class="signature-box">
              <p>Delivered by:</p>
              <div class="signature-line"></div>
              <p>Name: ${selectedNote.deliveryPerson}</p>
              <p>Date: ____________________</p>
            </div>
            
            <div class="signature-box">
              <p>Received by:</p>
              <div class="signature-line"></div>
              <p>Name: ${selectedNote.receiverName}</p>
              <p>Date: ____________________</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>This is a system-generated document.</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Let the content load before printing
    setTimeout(() => {
      printWindow.print();
      // Close the window after print dialog is closed (optional)
      // printWindow.onafterprint = function() { printWindow.close(); };
    }, 500);
  };
  
  // Export delivery note as PDF
  const exportDeliveryNoteAsPdf = () => {
    if (!selectedNote) return;
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add header
      pdf.setFontSize(18);
      pdf.text('DELIVERY NOTE', 105, 20, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`Document No: DN-${selectedNote.id.slice(0, 8)}`, 105, 27, { align: 'center' });
      
      // Add company information
      pdf.setFontSize(12);
      pdf.text('Grand Berna Dairies', 105, 40, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text('8339 Entebbe Town, Uganda', 105, 46, { align: 'center' });
      pdf.text('Tel: +256 757 757 517 / +256 776 670680', 105, 52, { align: 'center' });
      
      // Add delivery information
      pdf.setFontSize(14);
      pdf.text('Delivery Information', 20, 65);
      pdf.line(20, 67, 190, 67);
      
      pdf.setFontSize(10);
      pdf.text('Order Reference:', 20, 75);
      pdf.text(selectedNote.orderReference, 70, 75);
      
      pdf.text('Delivery Date:', 20, 82);
      pdf.text(new Date(selectedNote.deliveryDate).toLocaleDateString(), 70, 82);
      
      pdf.text('Status:', 20, 89);
      pdf.text(selectedNote.deliveryStatus, 70, 89);
      
      // Add receiver information
      pdf.setFontSize(14);
      pdf.text('Receiver Information', 20, 100);
      pdf.line(20, 102, 190, 102);
      
      pdf.setFontSize(10);
      pdf.text('Receiver Name:', 20, 110);
      pdf.text(selectedNote.receiverName, 70, 110);
      
      pdf.text('Contact:', 20, 117);
      pdf.text(selectedNote.receiverContact, 70, 117);
      
      pdf.text('Location:', 20, 124);
      pdf.text(selectedNote.deliveryLocation, 70, 124);
      
      pdf.text('Delivery Person:', 20, 131);
      pdf.text(selectedNote.deliveryPerson, 70, 131);
      
      // Add delivered items
      pdf.setFontSize(14);
      pdf.text('Delivered Items', 20, 142);
      pdf.line(20, 144, 190, 144);
      
      // Table headers
      const headers = [['Item', 'Quantity', 'Unit']];
      
      // Table data
      const data = selectedNote.items && Array.isArray(selectedNote.items) 
        ? selectedNote.items.map(item => [item.name, item.quantity, item.unit]) 
        : [['No items', '', '']];
      
      pdf.autoTable({
        startY: 148,
        head: headers,
        body: data,
        theme: 'grid',
        headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        margin: { left: 20, right: 20 }
      });
      
      // Add signatures
      const finalY = pdf.autoTable.previous.finalY + 20;
      
      pdf.text('Delivered by:', 30, finalY);
      pdf.line(30, finalY + 20, 80, finalY + 20);
      pdf.text(`Name: ${selectedNote.deliveryPerson}`, 30, finalY + 25);
      pdf.text('Date: ____________________', 30, finalY + 32);
      
      pdf.text('Received by:', 120, finalY);
      pdf.line(120, finalY + 20, 170, finalY + 20);
      pdf.text(`Name: ${selectedNote.receiverName}`, 120, finalY + 25);
      pdf.text('Date: ____________________', 120, finalY + 32);
      
      // Add footer
      pdf.setFontSize(8);
      pdf.text(`Generated on ${new Date().toLocaleString()}`, 105, 280, { align: 'center' });
      pdf.text('This is a system-generated document.', 105, 285, { align: 'center' });
      
      pdf.save(`delivery-note-${selectedNote.orderReference}.pdf`);
      
      toast({
        title: "Export Successful",
        description: "Delivery note exported as PDF"
      });
    } catch (error) {
      console.error('Error exporting delivery note as PDF:', error);
      toast({
        title: "Export Failed",
        description: "Could not export delivery note as PDF",
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
          <Button variant="outline" onClick={printDeliveryNote} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Details
          </Button>
        </div>
      </div>
    );
  }

  // Create printable content for delivery note details
  const renderPrintableContent = () => {
    if (!selectedNote) return null;
    
    return (
      <div className="hidden">
        <div ref={printableContentRef} className="p-8">
          <h1 className="text-2xl font-bold text-center">DELIVERY NOTE</h1>
          <p className="text-center mb-6">Document No: DN-{selectedNote.id.slice(0, 8)}</p>
          
          <div className="text-center mb-6">
            <p className="font-bold">Grand Berna Dairies</p>
            <p>8339 Entebbe Town, Uganda</p>
            <p>Tel: +256 757 757 517 / +256 776 670680</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b pb-2 mb-4">Delivery Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Order Reference:</p>
                <p>{selectedNote.orderReference}</p>
              </div>
              <div>
                <p className="font-medium">Delivery Date:</p>
                <p>{new Date(selectedNote.deliveryDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium">Status:</p>
                <p>{selectedNote.deliveryStatus}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b pb-2 mb-4">Receiver Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Receiver Name:</p>
                <p>{selectedNote.receiverName}</p>
              </div>
              <div>
                <p className="font-medium">Contact:</p>
                <p>{selectedNote.receiverContact}</p>
              </div>
              <div>
                <p className="font-medium">Location:</p>
                <p>{selectedNote.deliveryLocation}</p>
              </div>
              <div>
                <p className="font-medium">Delivery Person:</p>
                <p>{selectedNote.deliveryPerson}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b pb-2 mb-4">Delivered Items</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-left">Item</th>
                  <th className="border border-gray-300 p-2 text-left">Quantity</th>
                  <th className="border border-gray-300 p-2 text-left">Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedNote.items && Array.isArray(selectedNote.items) && selectedNote.items.length > 0 ? (
                  selectedNote.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{item.name}</td>
                      <td className="border border-gray-300 p-2">{item.quantity}</td>
                      <td className="border border-gray-300 p-2">{item.unit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="border border-gray-300 p-2 text-center">No items</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between mt-12">
            <div className="w-5/12">
              <p>Delivered by:</p>
              <div className="border-t border-black h-8 mt-10"></div>
              <p>Name: {selectedNote.deliveryPerson}</p>
              <p>Date: ____________________</p>
            </div>
            
            <div className="w-5/12">
              <p>Received by:</p>
              <div className="border-t border-black h-8 mt-10"></div>
              <p>Name: {selectedNote.receiverName}</p>
              <p>Date: ____________________</p>
            </div>
          </div>
          
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Generated on {new Date().toLocaleString()}</p>
            <p>This is a system-generated document.</p>
          </div>
        </div>
      </div>
    );
  };

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
                            <DropdownMenuItem onClick={() => {
                              setSelectedNote(note);
                              printDeliveryNote();
                            }}>
                              <Printer className="h-4 w-4 mr-2" />
                              Print Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedNote(note);
                              exportDeliveryNoteAsPdf();
                            }}>
                              <FileText className="h-4 w-4 mr-2" />
                              Export as PDF
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
                <Button 
                  size="sm" 
                  onClick={printDeliveryNote}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button 
                  size="sm" 
                  onClick={exportDeliveryNoteAsPdf}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
              </div>
            </div>
          )}
          
          {/* Hidden printable content */}
          {renderPrintableContent()}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DeliveryNoteList;
