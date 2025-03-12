
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import QRCodeGenerator from '../../../qr/QRCodeGenerator';

const DeliveryQRCodeDisplay = ({ deliveryData, onBack }) => {
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Form
      </Button>
      <QRCodeGenerator 
        data={deliveryData}
        title="Delivery Note"
      />
    </div>
  );
};

export default DeliveryQRCodeDisplay;
