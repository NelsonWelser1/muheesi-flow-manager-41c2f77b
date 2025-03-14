
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image, FileText, Printer } from "lucide-react";
import QRCodeGenerator from "../../qr/QRCodeGenerator";

const QRCodeView = ({ 
  qrCodeRef, 
  selectedNote, 
  setShowQRCode, 
  exportQrCodeAsPng, 
  exportQrCodeAsPdf, 
  printDeliveryNote 
}) => {
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
};

export default QRCodeView;
