import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrderManagement = () => {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold italic">Purchase Order</h1>
          <div className="text-sm">
            <p>KAJON Coffee Limited</p>
            <p>8339 Entebbe Town</p>
            <p>(+774) 449035</p>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="flex gap-2">
            <span className="font-semibold">PURCHASE ORDER #:</span>
            <Input className="w-32" placeholder="123456/22" />
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">DATE:</span>
            <Input type="date" className="w-40" />
          </div>
        </div>
      </div>

      {/* Client Information Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">CLIENT INFORMATION</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="Client name" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input placeholder="Client address" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="client@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="Phone number" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Information Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">ORDER INFORMATION</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PRODUCT NAME</TableHead>
              <TableHead>ITEM #</TableHead>
              <TableHead>PRICE</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>SIZE</TableHead>
              <TableHead>GRADE</TableHead>
              <TableHead>TOTAL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Input placeholder="Product name" />
              </TableCell>
              <TableCell>
                <Input placeholder="Item #" />
              </TableCell>
              <TableCell>
                <Input type="number" placeholder="0.00" />
              </TableCell>
              <TableCell>
                <Input type="number" placeholder="0" />
              </TableCell>
              <TableCell>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>$0.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Shipping and Payment Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">SHIPPING INFO</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Method</Label>
              <Input placeholder="Shipping method" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input placeholder="Shipping company" />
            </div>
            <div className="space-y-2">
              <Label>Track #</Label>
              <Input placeholder="Tracking number" />
            </div>
            <div className="space-y-2">
              <Label>Arrival Date</Label>
              <Input type="date" />
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">PAYMENT INFO</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Subtotal:</Label>
              <Input className="w-32" readOnly value="$0.00" />
            </div>
            <div className="flex justify-between items-center">
              <Label>Taxes (%):</Label>
              <Input type="number" className="w-32" placeholder="0" />
            </div>
            <div className="flex justify-between items-center">
              <Label>Shipping:</Label>
              <Input type="number" className="w-32" placeholder="0.00" />
            </div>
            <div className="flex justify-between items-center">
              <Label>Discount (%):</Label>
              <Input type="number" className="w-32" placeholder="0" />
            </div>
            <div className="flex justify-between items-center font-bold">
              <Label>TOTAL:</Label>
              <Input className="w-32" readOnly value="$0.00" />
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold bg-[#fff3e0] px-4 py-2">NOTES</h2>
        <textarea 
          className="w-full min-h-[100px] p-4 border rounded-md" 
          placeholder="Add any additional notes or terms here..."
        />
      </div>

      <Button className="w-full">Create Purchase Order</Button>
    </div>
  );
};

export default OrderManagement;