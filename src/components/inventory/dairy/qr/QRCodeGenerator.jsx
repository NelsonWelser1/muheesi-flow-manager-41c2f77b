
import React from 'react';
import { QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = ({ data, title }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-6 w-6" />
          {title} QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG value={JSON.stringify(data)} size={200} />
        </div>
        <Button onClick={() => window.print()}>Print QR Code</Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
