
import React from 'react';
import { Input } from "@/components/ui/input";

const VENDOR_INFO = {
  'Grand Berna Dairies': {
    name: 'Grand Berna Dairies',
    address: 'Dwanilo, Kyitobga district',
    city: 'Kamapala, Uganda, 256',
    email: 'grandbernadairies.sales@gmail.com',
    phone: '+256 776 670680 / +256 757 757517 / +256 787 121022'
  },
  'KAJON Coffee Limited': {
    name: 'KAJON Coffee Limited',
    address: 'Kanoni, Kazo District, Uganda',
    city: '6th floor, Arie Towers, Mackinnon Road, Nakasero\nKampala, Uganda, 256',
    email: 'kajoncoffeelimited@gmail.com',
    phone: '+256 776 670680 / +256 757 757517'
  },
  'Kyalima Farmers Limited': {
    name: 'Kyalima Farmers Limited',
    address: 'Dwanilo, kyitobga district',
    city: 'Kamapala, Uganda, 256',
    email: 'kyalimafarmersdirectors@gmail.com',
    phone: '+256 776 670680 / +256 757 757517'
  }
};

const VendorSection = ({ selectedCompany }) => {
  const vendorInfo = VENDOR_INFO[selectedCompany] || {};

  return (
    <div className="bg-blue-100 p-4 rounded">
      <h3 className="font-bold mb-2">VENDOR</h3>
      <div className="space-y-2">
        <Input value={vendorInfo.name || ''} readOnly />
        <Input value={vendorInfo.address || ''} readOnly />
        <Input value={vendorInfo.city || ''} readOnly />
        <Input value={vendorInfo.email || ''} readOnly />
        <Input value={vendorInfo.phone || ''} readOnly />
      </div>
    </div>
  );
};

export default VendorSection;
