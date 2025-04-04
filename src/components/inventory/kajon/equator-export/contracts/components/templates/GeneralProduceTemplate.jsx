import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

const GeneralProduceTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
  // State for seller details
  const [sellerDetails, setSellerDetails] = useState(
    data.sellerDetails || {
      name: "KAJON Coffee Limited",
      address: "Kampala, Uganda",
      registration: "Registration #: UG2023786541"
    }
  );

  // State for buyer details
  const [buyerDetails, setBuyerDetails] = useState(
    data.buyerDetails || {
      name: "[Buyer Company Name]",
      address: "[Buyer Address]",
      registration: "Registration #: [Buyer Registration #]"
    }
  );

  // Update parent data when seller details change
  useEffect(() => {
    if (editMode) {
      onDataChange('sellerDetails', sellerDetails);
    }
  }, [sellerDetails, editMode, onDataChange]);

  // Update parent data when buyer details change
  useEffect(() => {
    if (editMode) {
      onDataChange('buyerDetails', buyerDetails);
    }
  }, [buyerDetails, editMode, onDataChange]);

  // Helper function to render editable or display content
  const EditableField = ({ field, defaultValue, isMultiline = false }) => {
    const value = data[field] || defaultValue;
    
    if (editMode) {
      if (isMultiline) {
        return (
          <Textarea
            value={value}
            onChange={(e) => onDataChange(field, e.target.value)}
            className="w-full min-h-[80px] border border-green-300 p-2"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-green-300 p-1"
        />
      );
    }
    
    return isMultiline ? (
      <p className="text-sm">{value}</p>
    ) : (
      <span>{value}</span>
    );
  };

  // Helper function to update seller details
  const handleSellerChange = (field, value) => {
    setSellerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to update buyer details
  const handleBuyerChange = (field, value) => {
    setBuyerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 border border-gray-200 shadow-sm print:shadow-none print:border-none">
      {/* Company Header */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <img 
            src="/combined-logo.png" 
            alt="KAJON Coffee Limited" 
            className="h-16 w-auto mb-2"
          />
          <h2 className="text-lg font-bold">KAJON Coffee Limited</h2>
          <p className="text-sm text-gray-600">Kanoni, Kazo District, Uganda</p>
          <p className="text-sm text-gray-600">6th floor, Arie Towers, Mackinnon Road, Nakasero</p>
          <p className="text-sm text-gray-600">Kampala, Uganda, 256</p>
          <p className="text-sm text-gray-600">Tel: +256 776 670680 / +256 757 757517</p>
          <p className="text-sm text-gray-600">Email: kajoncoffeelimited@gmail.com</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-green-700">GENERAL PRODUCE EXPORT CONTRACT</h1>
          <p className="text-sm text-gray-600 mt-2">
            Contract #: {editMode ? (
              <Input 
                value={data.contractNumber || "KCL-GP-2024-[XXXX]"}
                onChange={(e) => onDataChange('contractNumber', e.target.value)}
                className="border border-green-300 p-1 mt-1 w-full"
                placeholder="Enter contract number"
              />
            ) : (
              <span>{data.contractNumber || "KCL-GP-2024-[XXXX]"}</span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            Date: {editMode ? (
              <Input 
                value={data.currentDate || "[Current Date]"}
                onChange={(e) => onDataChange('currentDate', e.target.value)}
                className="border border-green-300 p-1 mt-1 w-full" 
                placeholder="Enter date"
                type="text"
              />
            ) : (
              <span>{data.currentDate || "[Current Date]"}</span>
            )}
          </p>
        </div>
      </div>

      {/* Parties Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-700">PARTIES</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r pr-4">
            <h4 className="font-semibold">SELLER:</h4>
            {editMode ? (
              <div className="space-y-2 mt-1">
                <Input 
                  value={sellerDetails.name}
                  onChange={(e) => handleSellerChange('name', e.target.value)}
                  placeholder="Company Name"
                  className="w-full border border-green-300 p-1"
                />
                <Input 
                  value={sellerDetails.address}
                  onChange={(e) => handleSellerChange('address', e.target.value)}
                  placeholder="Address"
                  className="w-full border border-green-300 p-1"
                />
                <Input 
                  value={sellerDetails.registration}
                  onChange={(e) => handleSellerChange('registration', e.target.value)}
                  placeholder="Registration Number"
                  className="w-full border border-green-300 p-1"
                />
              </div>
            ) : (
              <>
                <p className="text-sm">{sellerDetails.name}</p>
                <p className="text-sm">{sellerDetails.address}</p>
                <p className="text-sm">{sellerDetails.registration}</p>
              </>
            )}
          </div>
          <div>
            <h4 className="font-semibold">BUYER:</h4>
            {editMode ? (
              <div className="space-y-2 mt-1">
                <Input 
                  value={buyerDetails.name}
                  onChange={(e) => handleBuyerChange('name', e.target.value)}
                  placeholder="Company Name"
                  className="w-full border border-green-300 p-1"
                />
                <Input 
                  value={buyerDetails.address}
                  onChange={(e) => handleBuyerChange('address', e.target.value)}
                  placeholder="Address"
                  className="w-full border border-green-300 p-1"
                />
                <Input 
                  value={buyerDetails.registration}
                  onChange={(e) => handleBuyerChange('registration', e.target.value)}
                  placeholder="Registration Number"
                  className="w-full border border-green-300 p-1"
                />
              </div>
            ) : (
              <>
                <p className="text-sm">{buyerDetails.name}</p>
                <p className="text-sm">{buyerDetails.address}</p>
                <p className="text-sm">{buyerDetails.registration}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Placeholder for the rest of the template content */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-700">PRODUCT DETAILS</h3>
        <p>This is a placeholder for the General Produce contract template content.</p>
      </div>

      {/* Signature Block */}
      <div className="grid grid-cols-2 gap-12 mt-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">For and on behalf of SELLER</p>
          <p className="text-sm">Name: ________________________________</p>
          <p className="text-sm mt-2">Title: ________________________________</p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">For and on behalf of BUYER</p>
          <p className="text-sm">Name: ________________________________</p>
          <p className="text-sm mt-2">Title: ________________________________</p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
      </div>

      {/* Company Seal/Stamp Area */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">[Company Seal/Stamp]</p>
      </div>
    </div>
  );
};

export default GeneralProduceTemplate;
