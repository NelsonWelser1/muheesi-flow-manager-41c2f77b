import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

const FreshProduceTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
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
            className="w-full min-h-[80px] border border-amber-300 p-2"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-amber-300 p-1"
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
      { id: 1, text: "First shipment: 100% payment upon receipt and inspection at destination" },
      { id: 2, text: "Subsequent shipments: 50% advance payment, 50% within 7 days of receipt" },
      { id: 3, text: "Payment by telegraphic transfer to seller's designated account" },
      { id: 4, text: "All bank charges outside Uganda to be borne by the buyer" },
      { id: 5, text: "Late payment subject to 1.5% interest per month on outstanding amount" }
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
          <h1 className="text-2xl font-bold text-amber-700">FRESH PRODUCE EXPORT CONTRACT</h1>
          <p className="text-sm text-gray-600 mt-2">
            Contract #: {editMode ? (
              <Input 
                value={data.contractNumber || "KCL-FP-2024-[XXXX]"}
                onChange={(e) => onDataChange('contractNumber', e.target.value)}
                className="border border-amber-300 p-1 mt-1 w-full"
                placeholder="Enter contract number"
              />
            ) : (
              <span>{data.contractNumber || "KCL-FP-2024-[XXXX]"}</span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            Date: {editMode ? (
              <Input 
                value={data.currentDate || "[Current Date]"}
                onChange={(e) => onDataChange('currentDate', e.target.value)}
                className="border border-amber-300 p-1 mt-1 w-full" 
                placeholder="Enter date"
                type="text"
              />
            ) : (
              <span>{data.currentDate || "[Current Date]"}</span>
            )}
          </p>
        </div>
      </div>

      {/* Parties - Enhanced with editable fields */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">PARTIES</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r pr-4">
            <h4 className="font-semibold">SELLER:</h4>
            {editMode ? (
              <div className="space-y-2 mt-1">
                <Input 
                  value={sellerDetails.name}
                  onChange={(e) => handleSellerChange('name', e.target.value)}
                  placeholder="Company Name"
                  className="w-full border border-amber-300 p-1"
                />
                <Input 
                  value={sellerDetails.address}
                  onChange={(e) => handleSellerChange('address', e.target.value)}
                  placeholder="Address"
                  className="w-full border border-amber-300 p-1"
                />
                <Input 
                  value={sellerDetails.registration}
                  onChange={(e) => handleSellerChange('registration', e.target.value)}
                  placeholder="Registration Number"
                  className="w-full border border-amber-300 p-1"
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
                  className="w-full border border-amber-300 p-1"
                />
                <Input 
                  value={buyerDetails.address}
                  onChange={(e) => handleBuyerChange('address', e.target.value)}
                  placeholder="Address"
                  className="w-full border border-amber-300 p-1"
                />
                <Input 
                  value={buyerDetails.registration}
                  onChange={(e) => handleBuyerChange('registration', e.target.value)}
                  placeholder="Registration Number"
                  className="w-full border border-amber-300 p-1"
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

      {/* Product Details - Making table cells editable */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">PRODUCT DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-left">Variety</th>
              <th className="border border-gray-300 p-2 text-left">Quantity (Kg)</th>
              <th className="border border-gray-300 p-2 text-left">Grade/Size</th>
              <th className="border border-gray-300 p-2 text-left">Price per Kg</th>
              <th className="border border-gray-300 p-2 text-left">Total Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Description" defaultValue="Pineapples" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Variety" defaultValue="Sweet Gold" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Quantity" defaultValue="8,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Grade" defaultValue="Grade A, Size 7-8" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Price" defaultValue="USD 1.15" />
              </td>
              <td className="border border-gray-300 p-2">
                {editMode ? (
                  <Input 
                    value={data.product1Total || "USD 9,200.00"} 
                    readOnly
                    className="w-full border border-amber-300 p-1 bg-gray-100 cursor-not-allowed"
                  />
                ) : (
                  <span>{data.product1Total || "USD 9,200.00"}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Description" defaultValue="Hot Peppers" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Variety" defaultValue="Scotch Bonnet" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Quantity" defaultValue="3,500" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Grade" defaultValue="Export Quality" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Price" defaultValue="USD 2.40" />
              </td>
              <td className="border border-gray-300 p-2">
                {editMode ? (
                  <Input 
                    value={data.product2Total || "USD 8,400.00"} 
                    readOnly
                    className="w-full border border-amber-300 p-1 bg-gray-100 cursor-not-allowed"
                  />
                ) : (
                  <span>{data.product2Total || "USD 8,400.00"}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Description" defaultValue="Passion Fruits" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Variety" defaultValue="Purple Granadilla" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Quantity" defaultValue="5,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Grade" defaultValue="Grade A" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Price" defaultValue="USD 2.80" />
              </td>
              <td className="border border-gray-300 p-2">
                {editMode ? (
                  <Input 
                    value={data.product3Total || "USD 14,000.00"} 
                    readOnly
                    className="w-full border border-amber-300 p-1 bg-gray-100 cursor-not-allowed"
                  />
                ) : (
                  <span>{data.product3Total || "USD 14,000.00"}</span>
                )}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-amber-50">
              <td colSpan="5" className="border border-gray-300 p-2 font-bold text-right">Total Contract Value:</td>
              <td className="border border-gray-300 p-2 font-bold">
                {editMode ? (
                  <Input 
                    value={data.totalValue || "USD 31,600.00"} 
                    readOnly
                    className="w-full border border-amber-300 p-1 bg-gray-100 cursor-not-allowed"
                  />
                ) : (
                  <span>{data.totalValue || "USD 31,600.00"}</span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Make some key sections editable - just as examples */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">QUALITY & PACKAGING SPECIFICATIONS</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Pineapples:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="pineapplesSpecs" 
                defaultValue="Maturity: 1/4 to 1/2 shell color
Brix level: min 13°
Free from damage and decay
Packaging: Single-layer cartons
Units per carton: 6-8 based on size" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Hot Peppers:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="peppersSpecs" 
                defaultValue="Bright, firm, well-formed
Free from damage and decay
Size: 4-6 cm in length
Packaging: 5kg cartons
Lined with perforated plastic" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Passion Fruits:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="passionFruitSpecs" 
                defaultValue="Maturity: 80-100%
Size: 45-65mm diameter
Smooth skin, minimal wrinkles
Packaging: 2kg plastic clamshells
12 clamshells per carton" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
        <p className="text-sm mt-4 font-semibold">Special Packaging Requirements:</p>
        <ul className="text-sm list-disc pl-4">
          <li>All cartons to be food-grade and sturdy enough for air transport</li>
          <li>Temperature indicators to be placed in each pallet</li>
          <li>Each carton to be labeled with product details, traceability code, and handling instructions</li>
          <li>All packaging materials must comply with EU packaging regulations</li>
        </ul>
      </div>

      {/* Temperature & Handling Requirements */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">TEMPERATURE & HANDLING REQUIREMENTS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-semibold">Pineapples:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Storage temp: 8-10°C</li>
                <li>Humidity: 85-90%</li>
                <li>Shelf life at proper temp: 14 days</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Hot Peppers:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Storage temp: 7-10°C</li>
                <li>Humidity: 90-95%</li>
                <li>Shelf life at proper temp: 10-14 days</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Passion Fruits:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Storage temp: 8-12°C</li>
                <li>Humidity: 85-90%</li>
                <li>Shelf life at proper temp: 21-28 days</li>
              </ul>
            </div>
          </div>
          <p className="text-sm mt-4">
            Seller shall ensure proper pre-cooling prior to loading. Cold chain must be maintained throughout
            the transport process. Temperature loggers will be included with each pallet.
          </p>
        </div>
      </div>

      {/* Shipping & Logistics - Making everything editable */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">
          <EditableField field="shippingTermsTitle" defaultValue="SHIPPING & LOGISTICS" />
        </h3>
        {editMode ? (
          <div className="space-y-4 border border-amber-200 p-4 rounded-md bg-amber-50">
            <p className="text-sm text-amber-600 italic">Edit Shipping & Logistics Structure:</p>
            
            {/* Editable grid structure */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left column labels and values */}
              {[1, 2, 3].map((index) => (
                <div key={`left-${index}`} className="space-y-1">
                  <Input 
                    className="font-semibold border border-amber-300"
                    value={data[`shippingLeftLabel${index}`] || 
                          (index === 1 ? "Shipping Method:" : 
                           index === 2 ? "Departure Airport:" : "Transit Time:") || 
                          (index === 1 ? "Air Freight" : 
                           index === 2 ? "Entebbe International Airport, Uganda" : "24-48 hours from departure")}
                    onChange={(e) => onDataChange(`shippingLeftLabel${index}`, e.target.value)}
                  />
                  <Input
                    className="border border-amber-300"
                    value={data[`shippingLeftValue${index}`] || 
                          (index === 1 ? "Air Freight" : 
                           index === 2 ? "Entebbe International Airport, Uganda" : "24-48 hours from departure")}
                    onChange={(e) => onDataChange(`shippingLeftValue${index}`, e.target.value)}
                  />
                </div>
              ))}
              
              {/* Right column labels and values */}
              {[1, 2, 3].map((index) => (
                <div key={`right-${index}`} className="space-y-1">
                  <Input 
                    className="font-semibold border border-amber-300"
                    value={data[`shippingRightLabel${index}`] || 
                          (index === 1 ? "Incoterm:" : 
                           index === 2 ? "Shipment Schedule:" : "First Shipment Date:") || 
                          (index === 1 ? "CIP London Heathrow" : 
                           index === 2 ? "Every Tuesday and Friday" : "August 15, 2024")}
                    onChange={(e) => onDataChange(`shippingRightLabel${index}`, e.target.value)}
                  />
                  <Input
                    className="border border-amber-300"
                    value={data[`shippingRightValue${index}`] || 
                          (index === 1 ? "CIP London Heathrow" : 
                           index === 2 ? "Every Tuesday and Friday" : "August 15, 2024")}
                    onChange={(e) => onDataChange(`shippingRightValue${index}`, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            {/* Bottom section */}
            <div className="mt-4">
              <Input 
                className="font-semibold border border-amber-300 mb-1"
                value={data.additionalShippingTermsLabel || "Additional Shipping & Logistics Terms:"}
                onChange={(e) => onDataChange('additionalShippingTermsLabel', e.target.value)}
              />
              <Textarea 
                className="border border-amber-300"
                value={data.additionalShippingTerms || "Seller arranges air freight booking and customs clearance at origin. Buyer responsible for import clearance at destination. Temperature-controlled handling required throughout transport chain. Tracking information to be provided to buyer upon departure."}
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
                      (index === 1 ? "Shipping Method:" : 
                       index === 2 ? "Departure Airport:" : "Transit Time:")}</p>
                    <p className="text-sm">{data[`shippingLeftValue${index}`] || 
                      (index === 1 ? "Air Freight" : 
                       index === 2 ? "Entebbe International Airport, Uganda" : "24-48 hours from departure")}</p>
                  </div>
                ))}
              </div>
              <div>
                {[1, 2, 3].map((index) => (
                  <div key={`right-display-${index}`} className="mb-2">
                    <p className="font-semibold">{data[`shippingRightLabel${index}`] || 
                      (index === 1 ? "Incoterm:" : 
                       index === 2 ? "Shipment Schedule:" : "First Shipment Date:")}</p>
                    <p className="text-sm">{data[`shippingRightValue${index}`] || 
                      (index === 1 ? "CIP London Heathrow" : 
                       index === 2 ? "Every Tuesday and Friday" : "August 15, 2024")}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <p className="font-semibold">{data.additionalShippingTermsLabel || "Additional Shipping & Logistics Terms:"}</p>
              <p className="text-sm whitespace-pre-line">{data.additionalShippingTerms || "Seller arranges air freight booking and customs clearance at origin. Buyer responsible for import clearance at destination. Temperature-controlled handling required throughout transport chain. Tracking information to be provided to buyer upon departure."}</p>
            </div>
          </>
        )}
      </div>

      {/* Payment Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">PAYMENT TERMS</h3>
        <div className="border rounded p-3 bg-gray-50">
          {editMode ? (
            <div className="space-y-4">
              {paymentTermsItems.map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <Textarea
                    value={item.text}
                    onChange={(e) => updatePaymentTermItem(item.id, e.target.value)}
                    className="flex-grow border border-amber-300 min-h-[60px]"
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
        <h3 className="text-lg font-bold mb-2 text-amber-700">CERTIFICATES & REQUIRED DOCUMENTS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ul className="text-sm list-disc pl-4">
              <li>Certificate of Origin</li>
              <li>Phytosanitary Certificate</li>
              <li>GLOBALG.A.P. Certificate</li>
              <li>Packing List</li>
            </ul>
          </div>
          <div>
            <ul className="text-sm list-disc pl-4">
              <li>Commercial Invoice</li>
              <li>Airway Bill</li>
              <li>Quality Inspection Report</li>
              <li>Temperature Log Records</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Claims & Returns */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">CLAIMS & RETURNS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="text-sm">
            Any claims related to quality must be made within 24 hours of receipt by the buyer. Claims must be substantiated with photographic evidence and inspection reports. The buyer must segregate any rejected product for possible inspection by the seller's representative or a third-party surveyor.
          </p>
          <p className="text-sm mt-2">
            If quality defects are proven to be the responsibility of the seller, either replacement or credit note will be provided at seller's discretion. Transportation failures (temperature breaches) documented by temperature loggers will be covered by insurance.
          </p>
        </div>
      </div>

      {/* General Terms & Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-amber-700">GENERAL TERMS & CONDITIONS</h3>
        <ol className="text-sm list-decimal pl-4">
          <li>This contract is governed by the laws of Uganda.</li>
          <li>Any dispute arising out of this contract shall be settled by arbitration in London under ICC rules.</li>
          <li>Force Majeure clause applies for events beyond reasonable control of either party.</li>
          <li>The contract may be terminated by either party with 30 days written notice.</li>
          <li>Any amendments to this contract must be in writing and signed by both parties.</li>
          <li>This contract represents the entire agreement between the parties.</li>
        </ol>
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

export default FreshProduceTemplate;
