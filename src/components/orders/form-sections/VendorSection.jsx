
import React from 'react';

const companyInfo = {
  'Grand Berna Dairies': {
    address1: 'Dwanilo, kyiboga district',
    address2: 'Kamapala, Uganda, 256',
    email: 'grandbernadairies.sales@gmail.com',
    phone: '+256 776 670680 / +256 757 757517 / +256 787 121022'
  },
  'KAJON Coffee Limited': {
    address1: 'Kanoni, Kazo District, Uganda',
    address2: '6th floor, Arie Towers, Mackinnon Road, Nakasero',
    address3: 'Kampala, Uganda, 256',
    email: 'kajoncoffeelimited@gmail.com',
    phone: '+256 776 670680 / +256 757 757517'
  },
  'Kyalima Farmers Limited': {
    address1: 'Dwanilo, kyiboga district',
    address2: 'Kamapala, Uganda, 256',
    email: 'kyalimafarmersdirectors@gmail.com',
    phone: '+256 776 670680 / +256 757 757517'
  }
};

const VendorSection = ({ company }) => {
  const info = companyInfo[company] || {};
  
  return (
    <div className="bg-blue-50 p-4 rounded">
      <h3 className="font-bold mb-2">VENDOR</h3>
      <div className="space-y-2">
        <input 
          className="w-full p-2 border rounded bg-white"
          value={company} 
          readOnly 
        />
        {info.address1 && (
          <input 
            className="w-full p-2 border rounded bg-white"
            value={info.address1} 
            readOnly 
          />
        )}
        {info.address2 && (
          <input 
            className="w-full p-2 border rounded bg-white"
            value={info.address2} 
            readOnly 
          />
        )}
        {info.address3 && (
          <input 
            className="w-full p-2 border rounded bg-white"
            value={info.address3} 
            readOnly 
          />
        )}
        {info.email && (
          <input 
            className="w-full p-2 border rounded bg-white"
            value={info.email} 
            readOnly 
          />
        )}
        {info.phone && (
          <input 
            className="w-full p-2 border rounded bg-white"
            value={info.phone} 
            readOnly 
          />
        )}
      </div>
    </div>
  );
};

export default VendorSection;
