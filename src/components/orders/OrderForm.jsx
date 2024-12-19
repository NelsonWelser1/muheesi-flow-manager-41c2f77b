import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ShipToSection from './form-sections/ShipToSection';
import ProductTable from './form-sections/ProductTable';

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

const OrderForm = ({ company }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [products, setProducts] = useState([{ product: '', quantity: '', price: 0 }]);
  
  const companyDetails = COMPANY_DETAILS[company];

  const calculateTotal = () => {
    return products.reduce((total, item) => {
      if (item.product && item.quantity) {
        // Convert tons to kg (1 ton = 1000 kg) and multiply by price per kg
        return total + (item.price * (parseFloat(item.quantity) * 1000));
      }
      return total;
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Purchase Order</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-blue-600">
            PURCHASE ORDER
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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

          <ShipToSection />
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

          <ProductTable 
            company={company}
            currency={currency}
            products={products}
            onProductsChange={setProducts}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Special Instructions</label>
            <Textarea placeholder="Enter any special instructions or notes" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>{currency} {calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button>Submit Order</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;