import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrderForm = ({ company }) => {
  const getCompanySpecificItems = () => {
    switch (company) {
      case 'Grand Berna Dairies':
        return [
          { code: 'FM-001', description: 'Fresh Milk (1L)', qty: 0, price: 2.50 },
          { code: 'YG-001', description: 'Natural Yogurt (500g)', qty: 0, price: 3.00 },
          { code: 'CH-001', description: 'Cheddar Cheese (250g)', qty: 0, price: 4.50 },
          { code: 'MT-001', description: 'Premium Beef (1kg)', qty: 0, price: 15.00 },
        ];
      case 'KAJON Coffee Limited':
        return [
          { code: 'RC-018', description: 'Robusta Coffee Screen 18 (60kg)', qty: 0, price: 180.00 },
          { code: 'RC-015', description: 'Robusta Coffee Screen 15 (60kg)', qty: 0, price: 165.00 },
          { code: 'AC-BGA', description: 'Arabica Coffee Bugisu AA (60kg)', qty: 0, price: 210.00 },
          { code: 'AC-BGR', description: 'Arabica Coffee DRUGAR (60kg)', qty: 0, price: 195.00 },
        ];
      case 'Kyalima Farmers Limited':
        return [
          { code: 'RC-001', description: 'Premium Rice (50kg)', qty: 0, price: 45.00 },
          { code: 'MZ-001', description: 'Quality Maize (100kg)', qty: 0, price: 35.00 },
          { code: 'SS-001', description: 'White Sesame Seeds (25kg)', qty: 0, price: 60.00 },
          { code: 'SB-001', description: 'Soybean Grade A (100kg)', qty: 0, price: 85.00 },
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Make an Order</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-blue-600">
            PURCHASE ORDER
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-bold mb-2">VENDOR</h3>
              <div className="space-y-2">
                <Input placeholder="Company Name" defaultValue={company} readOnly />
                <Input placeholder="Address Line 1" />
                <Input placeholder="City, State, ZIP" />
                <Input placeholder="Email" type="email" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-bold mb-2">SHIP TO</h3>
              <div className="space-y-2">
                <Input placeholder="Name" />
                <Input placeholder="Address Line 1" />
                <Input placeholder="City, State, ZIP" />
                <Input placeholder="Email" type="email" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ITEM #</TableHead>
                <TableHead>DESCRIPTION</TableHead>
                <TableHead>QTY</TableHead>
                <TableHead>UNIT PRICE</TableHead>
                <TableHead>TOTAL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCompanySpecificItems().map((item) => (
                <TableRow key={item.code}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      min="0" 
                      defaultValue="0"
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>$0.00</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <Label>Special Instructions</Label>
            <Textarea placeholder="Enter any special instructions or notes" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Rate:</span>
              <span>0.00%</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>$0.00</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button>Submit Order</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;