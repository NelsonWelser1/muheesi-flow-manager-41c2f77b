
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDeliveryNotes } from '@/integrations/supabase/hooks/sales/useDeliveryNotes';

// Import our newly created components
import SearchToolbar from "./forms/components/SearchToolbar";
import ExportActions from "./forms/components/ExportActions";
import QRCodeView from "./delivery-note/QRCodeView";
import DeliveryNoteDetails from "./delivery-note/DeliveryNoteDetails";
import DeliveryNotesTable from "./delivery-note/DeliveryNotesTable";
import PrintableContent from "./delivery-note/PrintableContent";
import { useDeliveryNoteUtils } from "./delivery-note/useDeliveryNoteUtils";

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
  
  // Get utility functions for delivery notes
  const { 
    exportQrCodeAsPng, 
    exportQrCodeAsPdf, 
    printDeliveryNote, 
    exportDeliveryNoteAsPdf 
  } = useDeliveryNoteUtils(qrCodeRef, selectedNote, setSelectedNote);
  
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
      <QRCodeView 
        qrCodeRef={qrCodeRef}
        selectedNote={selectedNote}
        setShowQRCode={setShowQRCode}
        exportQrCodeAsPng={exportQrCodeAsPng}
        exportQrCodeAsPdf={exportQrCodeAsPdf}
        printDeliveryNote={printDeliveryNote}
      />
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
          <DeliveryNotesTable 
            filteredNotes={filteredNotes}
            isRefreshing={isRefreshing}
            loading={loading}
            handleSort={handleSort}
            viewNoteDetails={viewNoteDetails}
            generateQRCode={generateQRCode}
            setSelectedNote={setSelectedNote}
            printDeliveryNote={printDeliveryNote}
            exportDeliveryNoteAsPdf={exportDeliveryNoteAsPdf}
          />
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredNotes.length} of {deliveryNotes.length} delivery notes
          </div>
          
          {/* Note Details Modal */}
          {selectedNote && !showQRCode && (
            <DeliveryNoteDetails 
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              generateQRCode={generateQRCode}
              printDeliveryNote={printDeliveryNote}
              exportDeliveryNoteAsPdf={exportDeliveryNoteAsPdf}
            />
          )}
          
          {/* Hidden printable content */}
          <PrintableContent 
            printableContentRef={printableContentRef}
            selectedNote={selectedNote}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DeliveryNoteList;
