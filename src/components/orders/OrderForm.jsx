import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COMPANY_DETAILS = {
  'Grand Berna Dairies': {
    addressLine1: 'Dwanilo, kyiboga district',
    addressLine2: '',
    cityStateZip: 'Kamapala, Uganda, 256',
    email: 'grandbernadairies.sales@gmail.com',
    contact: '+256 776 670680 / +256 757 757517 / +256 787 121022'
  },
  'KAJON Coffee Limited': {
    addressLine1: 'Kanoni, Kazo District, Uganda',
    addressLine2: '6th floor, Arie Towers, Mackinnon Road, Nakasero',
    cityStateZip: 'Kampala, Uganda, 256',
    email: 'kajoncoffeelimited@gmail.com',
    contact: '+256 776 670680 / +256 757 757517'
  },
  'Kyalima Farmers Limited': {
    addressLine1: 'Dwanilo, kyiboga district',
    addressLine2: '',
    cityStateZip: 'Kamapala, Uganda, 256',
    email: 'kyalimafarmersdirectors@gmail.com',
    contact: '+256 776 670680 / +256 757 757517'
  }
};

const PRODUCT_PRICES = {
  'Screen 18': { USD: 4.69, UGX: 17200 },
  'Screen 15': { USD: 4.63, UGX: 17000 },
  'Arabica AA': { USD: 5.86, UGX: 21500 },
  'DRUGAR': { USD: 4.63, UGX: 17000 }
};

const EXCHANGE_RATE = 3668.12; // USD to UGX rate as of Dec 10

const OrderForm = ({ company }) => {
  const [currency, setCurrency] = useState('USD');
  const [quantity, setQuantity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [shipping, setShipping] = useState(0);

  const companyDetails = COMPANY_DETAILS[company];

  const calculateTotal = () => {
    if (!selectedProduct || !quantity) return 0;
    const price = PRODUCT_PRICES[selectedProduct][currency];
    const total = price * parseFloat(quantity);
    const tax = (total * taxRate) / 100;
    return total + tax + shipping;
  };

  useEffect(() => {
    if (selectedProduct && quantity) {
      const price = PRODUCT_PRICES[selectedProduct][currency];
      setSubtotal(price * parseFloat(quantity));
    }
  }, [selectedProduct, quantity, currency]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Purchase Order</Button>
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
                <Input value={company} readOnly />
                <Input value={companyDetails.addressLine1} readOnly />
                {companyDetails.addressLine2 && (
                  <Input value={companyDetails.addressLine2} readOnly />
                )}
                <Input value={companyDetails.cityStateZip} readOnly />
                <Input value={companyDetails.email} type="email" readOnly />
                <Input value={companyDetails.contact} readOnly />
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
          <div className="mb-4">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="UGX">UGX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PRODUCT</TableHead>
                <TableHead>DESCRIPTION</TableHead>
                <TableHead>QTY (Tons)</TableHead>
                <TableHead>UNIT PRICE ({currency})</TableHead>
                <TableHead>TOTAL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PRODUCT_PRICES).map(product => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{selectedProduct}</TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  {selectedProduct ? PRODUCT_PRICES[selectedProduct][currency].toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  {(selectedProduct && quantity) 
                    ? (PRODUCT_PRICES[selectedProduct][currency] * parseFloat(quantity)).toLocaleString() 
                    : '-'}
                </TableCell>
              </TableRow>
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
              <span>{currency} {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Rate:</span>
              <Input 
                type="number" 
                min="0" 
                max="100" 
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                className="w-24"
              />
              <span>%</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{currency} {((subtotal * taxRate) / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <Input 
                type="number"
                min="0"
                value={shipping}
                onChange={(e) => setShipping(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>{currency} {calculateTotal().toLocaleString()}</span>
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