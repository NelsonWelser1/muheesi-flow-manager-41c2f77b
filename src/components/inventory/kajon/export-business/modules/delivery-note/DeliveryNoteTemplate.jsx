import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DeliveryNoteTemplate = ({ data }) => {
  return (
    <Card className="w-full bg-white p-8 print:shadow-none">
      <CardContent className="p-0">
        <h1 className="text-2xl font-bold text-center mb-8">Delivery Note Online</h1>
        
        {/* To Section */}
        <div className="mb-6">
          <h2 className="font-bold mb-2">To:</h2>
          <div className="space-y-2">
            <div>
              <Label>Company Name:</Label>
              <Input value={data?.toCompany || ''} readOnly />
            </div>
            <div>
              <Label>Address:</Label>
              <Input value={data?.toAddress || ''} readOnly />
            </div>
            <div>
              <Label>Contact Person:</Label>
              <Input value={data?.toContact || ''} readOnly />
            </div>
            <div>
              <Label>Phone Number:</Label>
              <Input value={data?.toPhone || ''} readOnly />
            </div>
            <div>
              <Label>Email:</Label>
              <Input value={data?.toEmail || ''} readOnly />
            </div>
          </div>
        </div>

        {/* From Section */}
        <div className="mb-6">
          <h2 className="font-bold mb-2">From:</h2>
          <div className="space-y-2">
            <div>
              <Label>Company Name:</Label>
              <Input value="KAJON Coffee Limited" readOnly />
            </div>
            <div>
              <Label>Address:</Label>
              <Input value="8339 Entebbe Town" readOnly />
            </div>
            <div>
              <Label>Contact Person:</Label>
              <Input value={data?.fromContact || ''} readOnly />
            </div>
            <div>
              <Label>Phone Number:</Label>
              <Input value="+256 757 757 517 / +256 776 670680" readOnly />
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Delivery Date:</Label>
              <Input type="date" value={data?.deliveryDate || ''} readOnly />
            </div>
            <div>
              <Label>Delivery Note Number:</Label>
              <Input value={data?.deliveryNoteNumber || ''} readOnly />
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Order Number:</Label>
              <Input value={data?.orderNumber || ''} readOnly />
            </div>
            <div>
              <Label>Order Date:</Label>
              <Input type="date" value={data?.orderDate || ''} readOnly />
            </div>
          </div>
        </div>

        {/* Item Details Table */}
        <div className="mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item No.</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.itemNo}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Special Instructions */}
        <div className="mb-6">
          <Label>Special Instructions:</Label>
          <Input value={data?.specialInstructions || ''} readOnly className="h-24" />
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-4">Delivery Confirmation:</h3>
            <p className="mb-4">We acknowledge the receipt of the above goods in good condition as per the listed descriptions and quantities.</p>
            <div className="space-y-4">
              <div>
                <Label>Receiver's Signature:</Label>
                <div className="border-b border-black h-8"></div>
              </div>
              <div>
                <Label>Print Name:</Label>
                <Input value={data?.receiverName || ''} readOnly />
              </div>
              <div>
                <Label>Date:</Label>
                <Input type="date" value={data?.receiverDate || ''} readOnly />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Sender's Confirmation:</h3>
            <p className="mb-4">We confirm that the goods were handed over to the recipient as described above.</p>
            <div className="space-y-4">
              <div>
                <Label>Sender's Signature:</Label>
                <div className="border-b border-black h-8"></div>
              </div>
              <div>
                <Label>Print Name:</Label>
                <Input value={data?.senderName || ''} readOnly />
              </div>
              <div>
                <Label>Date:</Label>
                <Input type="date" value={data?.senderDate || ''} readOnly />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryNoteTemplate;