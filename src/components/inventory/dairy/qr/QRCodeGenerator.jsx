
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const QRCodeGenerator = ({ data, title }) => {
  const qrData = typeof data === 'string' ? data : JSON.stringify(data);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title || 'QR Code'}</CardTitle>
        <CardDescription>
          Scan this QR code to access the delivery information
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            value={qrData}
            size={250}
            level="H" // High error correction capability
            includeMargin={true}
            className="mx-auto"
          />
        </div>
        
        {data && typeof data === 'object' && (
          <div className="mt-4 text-sm space-y-2 w-full">
            {data.id && <p><strong>ID:</strong> {data.id}</p>}
            {data.orderReference && <p><strong>Order Ref:</strong> {data.orderReference}</p>}
            {data.receiverName && <p><strong>Receiver:</strong> {data.receiverName}</p>}
            {data.deliveryDate && (
              <p><strong>Date:</strong> {new Date(data.deliveryDate).toLocaleDateString()}</p>
            )}
            {data.deliveryStatus && (
              <p><strong>Status:</strong> {data.deliveryStatus}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
