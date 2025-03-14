
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Share2,
  ArrowUpDown, 
  RefreshCw,
  QrCode,
  Printer,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const DeliveryNotesTable = ({ 
  filteredNotes,
  isRefreshing,
  loading,
  handleSort,
  viewNoteDetails,
  generateQRCode,
  setSelectedNote,
  printDeliveryNote,
  exportDeliveryNoteAsPdf
}) => {
  return (
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
  );
};

export default DeliveryNotesTable;
