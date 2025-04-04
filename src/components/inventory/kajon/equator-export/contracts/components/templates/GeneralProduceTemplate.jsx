
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

  // New state for payment terms structure
  const [paymentTermsItems, setPaymentTermsItems] = useState(
    data.paymentTermsItems || [
      { id: 1, text: "20% advance payment upon contract signing" },
      { id: 2, text: "80% balance against presentation of shipping documents" },
      { id: 3, text: "Payment by irrevocable Letter of Credit at sight" },
      { id: 4, text: "L/C to be issued by buyer's bank within 14 days of contract signing" },
      { id: 5, text: "L/C to be confirmed by Stanbic Bank, Kampala" },
      { id: 6, text: "All banking charges outside Uganda to be borne by the Buyer" }
    ]
  );

  // Update parent data when payment terms items change
  useEffect(() => {
    if (editMode) {
      onDataChange('paymentTermsItems', paymentTermsItems);
    }
  }, [paymentTermsItems, editMode, onDataChange]);

  // Add a new payment term item
  const addPaymentTermItem = () => {
    const newId = paymentTermsItems.length > 0 ? Math.max(...paymentTermsItems.map(item => item.id)) + 1 : 1;
    setPaymentTermsItems([...paymentTermsItems, { id: newId, text: "New payment term" }]);
  };

  // Update a payment term item
  const updatePaymentTermItem = (id, newText) => {
    setPaymentTermsItems(prevItems => 
      prevItems.map(item => item.id === id ? { ...item, text: newText } : item)
    );
  };

  // Remove a payment term item
  const removePaymentTermItem = (id) => {
    setPaymentTermsItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 border border-gray-200 shadow-sm print:shadow-none print:border-none">
      {/* Company Header */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <img 
            src="/lovable-uploads/493ba471-e6fd-4a79-862b-f5d2c974d0d9.png" 
            alt="KAJON Coffee Limited" 
            className="h-16 w-auto mb-2"
          />
          <h2 className="text-lg font-bold">
            <EditableField field="companyName" defaultValue="KAJON Coffee Limited" />
          </h2>
          <p className="text-sm text-gray-600">
            <EditableField field="companyAddress1" defaultValue="Kanoni, Kazo District, Uganda" />
          </p>
          <p className="text-sm text-gray-600">
            <EditableField field="companyAddress2" defaultValue="6th floor, Arie Towers, Mackinnon Road, Nakasero" />
          </p>
          <p className="text-sm text-gray-600">
            <EditableField field="companyAddress3" defaultValue="Kampala, Uganda, 256" />
          </p>
          <p className="text-sm text-gray-600">
            <EditableField field="companyPhone" defaultValue="Tel: +256 776 670680 / +256 757 757517" />
          </p>
          <p className="text-sm text-gray-600">
            <EditableField field="companyEmail" defaultValue="Email: kajoncoffeelimited@gmail.com" />
          </p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-green-800">
            <EditableField field="documentTitle" defaultValue="GENERAL PRODUCE EXPORT CONTRACT" />
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Contract #: <EditableField field="contractNumber" defaultValue="KCL-GP-2024-[XXXX]" />
          </p>
          <p className="text-sm text-gray-600">
            Date: <EditableField field="currentDate" defaultValue="[Current Date]" />
          </p>
        </div>
      </div>

      {/* Parties - Enhanced with editable fields */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">
          <EditableField field="partiesTitle" defaultValue="PARTIES" />
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r pr-4">
            <h4 className="font-semibold">
              <EditableField field="sellerLabel" defaultValue="SELLER:" />
            </h4>
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
            <h4 className="font-semibold">
              <EditableField field="buyerLabel" defaultValue="BUYER:" />
            </h4>
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

      {/* Product Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">
          <EditableField field="productDetailsTitle" defaultValue="PRODUCT DETAILS" />
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="border border-gray-300 p-2 text-left">
                <EditableField field="descriptionHeader" defaultValue="Description" />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <EditableField field="originHeader" defaultValue="Origin" />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <EditableField field="quantityHeader" defaultValue="Quantity (MT)" />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <EditableField field="gradeHeader" defaultValue="Grade/Type" />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <EditableField field="priceHeader" defaultValue="Price per MT" />
              </th>
              <th className="border border-gray-300 p-2 text-left">
                <EditableField field="totalHeader" defaultValue="Total Value" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Description" defaultValue="Sesame Seeds" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Origin" defaultValue="Northern Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Quantity" defaultValue="25" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Grade" defaultValue="Hulled White" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Price" defaultValue="USD 1,850" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Total" defaultValue="USD 46,250.00" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Description" defaultValue="Soybean" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Origin" defaultValue="Eastern Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Quantity" defaultValue="35" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Grade" defaultValue="Grade A" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Price" defaultValue="USD 950" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Total" defaultValue="USD 33,250.00" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Description" defaultValue="Maize" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Origin" defaultValue="Central Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Quantity" defaultValue="50" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Grade" defaultValue="Grade 1" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Price" defaultValue="USD 480" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Total" defaultValue="USD 24,000.00" />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-green-50">
              <td colSpan="5" className="border border-gray-300 p-2 font-bold text-right">
                <EditableField field="totalValueLabel" defaultValue="Total Contract Value:" />
              </td>
              <td className="border border-gray-300 p-2 font-bold">
                <EditableField field="totalValue" defaultValue="USD 103,500.00" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Quality Specifications */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">
          <EditableField field="qualitySpecificationsTitle" defaultValue="QUALITY SPECIFICATIONS" />
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">
              <EditableField field="sesameLabel" defaultValue="Sesame Seeds:" />
            </p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="sesameSpecs" 
                defaultValue="Moisture content: max 8%
Purity: min 99.5%
Foreign matter: max 0.5%
Oil content: min 50%
Free from live insects" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">
              <EditableField field="soybeanLabel" defaultValue="Soybean:" />
            </p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="soybeanSpecs" 
                defaultValue="Moisture content: max 12%
Foreign matter: max 1%
Damaged beans: max 2%
Protein content: min 36%
Free from GMO" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">
              <EditableField field="maizeLabel" defaultValue="Maize:" />
            </p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="maizeSpecs" 
                defaultValue="Moisture content: max 13.5%
Foreign matter: max 1%
Broken kernels: max 3%
Discolored: max 2%
Aflatoxin: max 10 ppb" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
        <p className="text-sm">
          <EditableField 
            field="qualityVerificationText" 
            defaultValue="Quality to be verified by an independent surveyor at loading point. Both parties may appoint representatives to witness quality inspection."
            isMultiline={true}
          />
        </p>
      </div>

      {/* Shipping Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">
          <EditableField field="shippingTermsTitle" defaultValue="SHIPPING TERMS" />
        </h3>
        {editMode ? (
          <div className="space-y-4 border border-green-200 p-4 rounded-md bg-green-50">
            <p className="text-sm text-green-600 italic">Edit Shipping Terms Structure:</p>
            
            {/* Editable grid structure */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left column labels and values */}
              {[1, 2, 3].map((index) => (
                <div key={`left-${index}`} className="space-y-1">
                  <Input 
                    className="font-semibold border border-green-300"
                    value={data[`shippingLeftLabel${index}`] || 
                          (index === 1 ? "Incoterm:" : 
                           index === 2 ? "Packaging:" : "Loading Port:")}
                    onChange={(e) => onDataChange(`shippingLeftLabel${index}`, e.target.value)}
                  />
                  <Input
                    className="border border-green-300"
                    value={data[`shippingLeftValue${index}`] || 
                          (index === 1 ? "CIF Rotterdam" : 
                           index === 2 ? "25kg/50kg polypropylene bags in container" : "Mombasa, Kenya")}
                    onChange={(e) => onDataChange(`shippingLeftValue${index}`, e.target.value)}
                  />
                </div>
              ))}
              
              {/* Right column labels and values */}
              {[1, 2, 3].map((index) => (
                <div key={`right-${index}`} className="space-y-1">
                  <Input 
                    className="font-semibold border border-green-300"
                    value={data[`shippingRightLabel${index}`] || 
                          (index === 1 ? "Destination:" : 
                           index === 2 ? "Latest Shipment Date:" : "Delivery Timeline:")}
                    onChange={(e) => onDataChange(`shippingRightLabel${index}`, e.target.value)}
                  />
                  <Input
                    className="border border-green-300"
                    value={data[`shippingRightValue${index}`] || 
                          (index === 1 ? "Rotterdam, Netherlands" : 
                           index === 2 ? "November 30, 2024" : "35-50 days from loading")}
                    onChange={(e) => onDataChange(`shippingRightValue${index}`, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            {/* Bottom section */}
            <div className="mt-4">
              <Input 
                className="font-semibold border border-green-300 mb-1"
                value={data.additionalShippingTermsLabel || "Additional Shipping Terms:"}
                onChange={(e) => onDataChange('additionalShippingTermsLabel', e.target.value)}
              />
              <Textarea 
                className="border border-green-300"
                value={data.additionalShippingTerms || "Seller is responsible for arranging transportation to the port. Export documentation to be provided by seller. Cost of shipping insurance to be borne by buyer as per Incoterms."}
                onChange={(e) => onDataChange('additionalShippingTerms', e.target.value)}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {[1, 2, 3].map((index) => (
                  <div key={`left-display-${index}`} className="mb-2">
                    <p className="font-semibold">{data[`shippingLeftLabel${index}`] || 
                      (index === 1 ? "Incoterm:" : 
                       index === 2 ? "Packaging:" : "Loading Port:")}</p>
                    <p className="text-sm">{data[`shippingLeftValue${index}`] || 
                      (index === 1 ? "CIF Rotterdam" : 
                       index === 2 ? "25kg/50kg polypropylene bags in container" : "Mombasa, Kenya")}</p>
                  </div>
                ))}
              </div>
              <div>
                {[1, 2, 3].map((index) => (
                  <div key={`right-display-${index}`} className="mb-2">
                    <p className="font-semibold">{data[`shippingRightLabel${index}`] || 
                      (index === 1 ? "Destination:" : 
                       index === 2 ? "Latest Shipment Date:" : "Delivery Timeline:")}</p>
                    <p className="text-sm">{data[`shippingRightValue${index}`] || 
                      (index === 1 ? "Rotterdam, Netherlands" : 
                       index === 2 ? "November 30, 2024" : "35-50 days from loading")}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <p className="font-semibold">{data.additionalShippingTermsLabel || "Additional Shipping Terms:"}</p>
              <p className="text-sm whitespace-pre-line">{data.additionalShippingTerms || "Seller is responsible for arranging transportation to the port. Export documentation to be provided by seller. Cost of shipping insurance to be borne by buyer as per Incoterms."}</p>
            </div>
          </>
        )}
      </div>

      {/* Payment Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">
          <EditableField field="paymentTermsTitle" defaultValue="PAYMENT TERMS" />
        </h3>
        <div className="border rounded p-3 bg-gray-50">
          {editMode ? (
            <div className="space-y-4">
              {paymentTermsItems.map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <Textarea
                    value={item.text}
                    onChange={(e) => updatePaymentTermItem(item.id, e.target.value)}
                    className="flex-grow border border-green-300 min-h-[60px]"
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePaymentTermItem(item.id)}
                    className="text-red-500 hover:text-red-700 mt-1"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                onClick={addPaymentTermItem} 
                size="sm" 
                className="flex items-center gap-1 mt-2"
              >
                <Plus className="h-4 w-4" /> Add Payment Term
              </Button>
            </div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {paymentTermsItems.map((item) => (
                <li key={item.id} className="text-sm">{item.text}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Certificates & Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">
          <EditableField field="certificatesTitle" defaultValue="CERTIFICATES & REQUIRED DOCUMENTS" />
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ul className="text-sm list-disc pl-4">
              <li><EditableField field="certificate1" defaultValue="Certificate of Origin" /></li>
              <li><EditableField field="certificate2" defaultValue="Phytosanitary Certificate" /></li>
              <li><EditableField field="certificate3" defaultValue="Weight Certificate" /></li>
              <li><EditableField field="certificate4" defaultValue="Fumigation Certificate" /></li>
            </ul>
          </div>
          <div>
            <ul className="text-sm list-disc pl-4">
              <li><EditableField field="certificate5" defaultValue="Quality/Inspection Certificate" /></li>
              <li><EditableField field="certificate6" defaultValue="Packing List" /></li>
              <li><EditableField field="certificate7" defaultValue="Commercial Invoice" /></li>
              <li><EditableField field="certificate8" defaultValue="Bill of Lading" /></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Special Conditions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">
          <EditableField field="specialConditionsTitle" defaultValue="SPECIAL CONDITIONS" />
        </h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className={editMode ? "space-y-2" : ""}>
            <EditableField 
              field="specialConditions" 
              defaultValue="Seller guarantees products are grown in compliance with Global GAP standards
Products are certified free from GMO content
Products comply with maximum residue limits (MRLs) as per EU regulations
Organic certification provided where applicable
Traceability information to be provided with shipment" 
              isMultiline={true}
            />
          </div>
        </div>
      </div>

      {/* General Terms & Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-green-800">
          <EditableField field="generalTermsTitle" defaultValue="GENERAL TERMS & CONDITIONS" />
        </h3>
        <ol className="text-sm list-decimal pl-4">
          <li><EditableField field="term1" defaultValue="This contract is governed by the laws of Uganda." /></li>
          <li><EditableField field="term2" defaultValue="Any dispute arising out of this contract shall be settled by arbitration in Kampala under UNCITRAL rules." /></li>
          <li><EditableField field="term3" defaultValue="Force Majeure clause applies for events beyond reasonable control of either party." /></li>
          <li><EditableField field="term4" defaultValue="Seller guarantees the produce is free from any liens and encumbrances." /></li>
          <li><EditableField field="term5" defaultValue="Title and risk pass to Buyer as per the agreed Incoterms." /></li>
          <li><EditableField field="term6" defaultValue="Any amendments to this contract must be in writing and signed by both parties." /></li>
          <li><EditableField field="term7" defaultValue="This contract supersedes all prior agreements and represents the entire agreement between parties." /></li>
        </ol>
      </div>

      {/* Signature Block */}
      <div className="grid grid-cols-2 gap-12 mt-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">
            <EditableField field="sellerSignatureLabel" defaultValue="For and on behalf of SELLER" />
          </p>
          <p className="text-sm">
            Name: <EditableField field="sellerSignatureName" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            Title: <EditableField field="sellerSignatureTitle" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            Date: <EditableField field="sellerSignatureDate" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            Signature: <EditableField field="sellerSignature" defaultValue="___________________________" />
          </p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">
            <EditableField field="buyerSignatureLabel" defaultValue="For and on behalf of BUYER" />
          </p>
          <p className="text-sm">
            Name: <EditableField field="buyerSignatureName" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            Title: <EditableField field="buyerSignatureTitle" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            Date: <EditableField field="buyerSignatureDate" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            Signature: <EditableField field="buyerSignature" defaultValue="___________________________" />
          </p>
        </div>
      </div>

      {/* Company Seal/Stamp Area */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          <EditableField field="companyStamp" defaultValue="[Company Seal/Stamp]" />
        </p>
      </div>
    </div>
  );
};

export default GeneralProduceTemplate;
