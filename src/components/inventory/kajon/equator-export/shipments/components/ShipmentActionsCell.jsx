
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Download, Printer, MoreHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ShipmentActionsCell = ({ shipment, readOnly = false }) => {
  const [viewOpen, setViewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleView = () => {
    setViewOpen(true);
  };

  const handleDownload = async () => {
    try {
      setIsProcessing(true);
      
      // Create a file with shipment details
      const shipmentText = Object.entries(shipment)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      
      const blob = new Blob([shipmentText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `shipment-${shipment.shipment_id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading shipment details:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsProcessing(true);
      
      // Create a PDF with shipment details
      const pdf = new jsPDF();
      
      pdf.setFontSize(16);
      pdf.text(`Shipment: ${shipment.shipment_id}`, 20, 20);
      
      pdf.setFontSize(12);
      let y = 30;
      const lineHeight = 7;
      
      Object.entries(shipment).forEach(([key, value]) => {
        if (value && key !== 'id') {
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          pdf.text(`${formattedKey}: ${value}`, 20, y);
          y += lineHeight;
        }
      });
      
      pdf.save(`shipment-${shipment.shipment_id}.pdf`);
    } catch (error) {
      console.error("Error printing shipment details:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="focus:outline-none">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleView} disabled={isProcessing} className="flex items-center gap-2 cursor-pointer">
            <Eye size={16} />
            <span>View</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload} disabled={isProcessing} className="flex items-center gap-2 cursor-pointer">
            <Download size={16} />
            <span>Download</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handlePrint} disabled={isProcessing} className="flex items-center gap-2 cursor-pointer">
            <Printer size={16} />
            <span>Print</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Shipment Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Shipment Details: {shipment.shipment_id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Object.entries(shipment).map(([key, value]) => {
              if (value && key !== 'id') {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return (
                  <div key={key} className="border-b pb-2">
                    <p className="text-sm font-medium text-gray-500">{formattedKey}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShipmentActionsCell;
