
import React from 'react';
import { Button } from "@/components/ui/button";
import { QrCode, Printer, FileText } from "lucide-react";

const DeliveryNoteDetails = ({ 
  selectedNote, 
  setSelectedNote, 
  generateQRCode, 
  printDeliveryNote, 
  exportDeliveryNoteAsPdf 
}) => {
  if (!selectedNote) return null;

  return (
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
  );
};

export default DeliveryNoteDetails;
