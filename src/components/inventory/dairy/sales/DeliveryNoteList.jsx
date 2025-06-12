
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/supabase';
import { Search, Edit, Trash2, Eye, RefreshCw, QrCode, Printer, FileText, Share2, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDeliveryNotes } from '@/integrations/supabase/hooks/sales/useDeliveryNotes';

const DeliveryNoteList = ({ 
  isOpen = true, 
  onClose = () => {}, 
  deliveryData = null,
  refreshData = () => {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [selectedNote, setSelectedNote] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const { 
    deliveryNotes, 
    loading, 
    fetchDeliveryNotes, 
    deleteDeliveryNote 
  } = useDeliveryNotes();

  useEffect(() => {
    if (isOpen) {
      fetchDeliveryNotes();
    }
  }, [isOpen]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDeliveryNotes();
    refreshData();
    setIsRefreshing(false);
    
    toast({
      title: "Refreshed",
      description: "Delivery notes have been refreshed",
    });
  };

  const viewNoteDetails = (note) => {
    setSelectedNote(note);
  };

  const generateQRCode = (note) => {
    toast({
      title: "QR Code",
      description: `QR Code generated for delivery note ${note.id}`,
    });
  };

  const printDeliveryNote = () => {
    if (selectedNote) {
      window.print();
      toast({
        title: "Print",
        description: "Printing delivery note details",
      });
    }
  };

  const exportDeliveryNoteAsPdf = () => {
    if (selectedNote) {
      toast({
        title: "Export",
        description: "Exporting delivery note as PDF",
      });
    }
  };

  const filteredNotes = deliveryNotes?.filter(note => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      note.order_reference?.toLowerCase().includes(searchTerm) ||
      note.receiver_name?.toLowerCase().includes(searchTerm) ||
      note.delivery_location?.toLowerCase().includes(searchTerm) ||
      note.delivery_status?.toLowerCase().includes(searchTerm)
    );
  });

  const sortedNotes = filteredNotes?.sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  if (!isOpen) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Delivery Notes</CardTitle>
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search delivery notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
                    onClick={() => handleSort('order_reference')}
                  >
                    Order Ref
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('receiver_name')}
                  >
                    Receiver
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('delivery_date')}
                  >
                    Date
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center"
                    onClick={() => handleSort('delivery_status')}
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
              ) : sortedNotes && sortedNotes.length > 0 ? (
                sortedNotes.map((note) => (
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
                    <TableCell>{note.order_reference}</TableCell>
                    <TableCell>{note.receiver_name}</TableCell>
                    <TableCell>{new Date(note.delivery_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        note.delivery_status === 'delivered' ? 'default' : 
                        note.delivery_status === 'dispatched' ? 'secondary' : 
                        'outline'
                      }>
                        {note.delivery_status}
                      </Badge>
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

        {selectedNote && (
          <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Delivery Note Details</DialogTitle>
                <DialogDescription>
                  View all the details of this delivery note.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Order Reference</label>
                    <p className="text-sm">{selectedNote.order_reference}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Delivery Date</label>
                    <p className="text-sm">{new Date(selectedNote.delivery_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Receiver Name</label>
                    <p className="text-sm">{selectedNote.receiver_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant={selectedNote.delivery_status === 'delivered' ? 'default' : 'secondary'}>
                      {selectedNote.delivery_status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Delivery Location</label>
                  <p className="text-sm">{selectedNote.delivery_location || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Receiver Contact</label>
                  <p className="text-sm">{selectedNote.receiver_contact || 'N/A'}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryNoteList;
