import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClientInformation from './form-sections/ClientInformation';
import OrderInformation from './form-sections/OrderInformation';
import ShippingInfo from './form-sections/ShippingInfo';
import PaymentInfo from './form-sections/PaymentInfo';
import NotesSection from './form-sections/NotesSection';

const OrderForm = ({ onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
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
              <span className="font-semibold">ORDER TYPE:</span>
              <Select defaultValue="lpo">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lpo">LPO (Local)</SelectItem>
                  <SelectItem value="epo">EPO (External)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

        <ClientInformation />
        <OrderInformation />
        <ShippingInfo />
        <PaymentInfo />
        <NotesSection />

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>Back to List</Button>
          <Button type="submit">Create Purchase Order</Button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;