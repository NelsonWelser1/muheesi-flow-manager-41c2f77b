import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const GeneralProduceTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
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
          <h1 className="text-2xl font-bold text-green-800">GENERAL PRODUCE EXPORT CONTRACT</h1>
          <p className="text-sm text-gray-600 mt-2">
            Contract #: <EditableField field="contractNumber" defaultValue="KCL-GP-2024-[XXXX]" />
          </p>
          <p className="text-sm text-gray-600">
            Date: <EditableField field="currentDate" defaultValue="[Current Date]" />
          </p>
        </div>
      </div>

      {/* Parties */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">PARTIES</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r pr-4">
            <h4 className="font-semibold">SELLER:</h4>
            <p className="text-sm">KAJON Coffee Limited</p>
            <p className="text-sm">Kampala, Uganda</p>
            <p className="text-sm">Registration #: UG2023786541</p>
          </div>
          <div>
            <h4 className="font-semibold">BUYER:</h4>
            <p className="text-sm">
              <EditableField field="buyerName" defaultValue="[Buyer Company Name]" />
            </p>
            <p className="text-sm">
              <EditableField field="buyerAddress" defaultValue="[Buyer Address]" />
            </p>
            <p className="text-sm">
              Registration #: <EditableField field="buyerRegistration" defaultValue="[Buyer Registration #]" />
            </p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">PRODUCT DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-left">Origin</th>
              <th className="border border-gray-300 p-2 text-left">Quantity (MT)</th>
              <th className="border border-gray-300 p-2 text-left">Grade/Type</th>
              <th className="border border-gray-300 p-2 text-left">Price per MT</th>
              <th className="border border-gray-300 p-2 text-left">Total Value</th>
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
              <td colSpan="5" className="border border-gray-300 p-2 font-bold text-right">Total Contract Value:</td>
              <td className="border border-gray-300 p-2 font-bold">
                <EditableField field="totalValue" defaultValue="USD 103,500.00" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Quality Specifications */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">QUALITY SPECIFICATIONS</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Sesame Seeds:</p>
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
            <p className="font-semibold">Soybean:</p>
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
            <p className="font-semibold">Maize:</p>
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
          Quality to be verified by an independent surveyor at loading point. Both parties may appoint representatives to witness quality inspection.
        </p>
      </div>

      {/* Shipping Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">SHIPPING TERMS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Incoterm:</p>
            <p className="text-sm">
              <EditableField field="incoterm" defaultValue="CIF Rotterdam" />
            </p>
            
            <p className="font-semibold mt-2">Packaging:</p>
            <p className="text-sm">
              <EditableField field="packaging" defaultValue="25kg/50kg polypropylene bags in container" />
            </p>
            
            <p className="font-semibold mt-2">Loading Port:</p>
            <p className="text-sm">
              <EditableField field="loadingPort" defaultValue="Mombasa, Kenya" />
            </p>
          </div>
          <div>
            <p className="font-semibold">Destination:</p>
            <p className="text-sm">
              <EditableField field="destination" defaultValue="Rotterdam, Netherlands" />
            </p>
            
            <p className="font-semibold mt-2">Latest Shipment Date:</p>
            <p className="text-sm">
              <EditableField field="shipmentDate" defaultValue="November 30, 2024" />
            </p>
            
            <p className="font-semibold mt-2">Delivery Timeline:</p>
            <p className="text-sm">
              <EditableField field="deliveryTimeline" defaultValue="35-50 days from loading" />
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="font-semibold">Additional Shipping Terms:</p>
          <EditableField 
            field="additionalShippingTerms" 
            defaultValue="Seller is responsible for arranging transportation to the port. Export documentation to be provided by seller. Cost of shipping insurance to be borne by buyer as per Incoterms."
            isMultiline={true}
          />
        </div>
      </div>

      {/* Payment Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">PAYMENT TERMS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className={editMode ? "space-y-2" : ""}>
            <EditableField 
              field="paymentTerms" 
              defaultValue="20% advance payment upon contract signing
80% balance against presentation of shipping documents
Payment by irrevocable Letter of Credit at sight
L/C to be issued by buyer's bank within 14 days of contract signing
L/C to be confirmed by Stanbic Bank, Kampala
All banking charges outside Uganda to be borne by the Buyer" 
              isMultiline={true}
            />
          </div>
        </div>
      </div>

      {/* Certificates & Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">CERTIFICATES & REQUIRED DOCUMENTS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ul className="text-sm list-disc pl-4">
              <li>Certificate of Origin</li>
              <li>Phytosanitary Certificate</li>
              <li>Weight Certificate</li>
              <li>Fumigation Certificate</li>
            </ul>
          </div>
          <div>
            <ul className="text-sm list-disc pl-4">
              <li>Quality/Inspection Certificate</li>
              <li>Packing List</li>
              <li>Commercial Invoice</li>
              <li>Bill of Lading</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Special Conditions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">SPECIAL CONDITIONS</h3>
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
        <h3 className="text-lg font-bold mb-2 text-green-800">GENERAL TERMS & CONDITIONS</h3>
        <ol className="text-sm list-decimal pl-4">
          <li>This contract is governed by the laws of Uganda.</li>
          <li>Any dispute arising out of this contract shall be settled by arbitration in Kampala under UNCITRAL rules.</li>
          <li>Force Majeure clause applies for events beyond reasonable control of either party.</li>
          <li>Seller guarantees the produce is free from any liens and encumbrances.</li>
          <li>Title and risk pass to Buyer as per the agreed Incoterms.</li>
          <li>Any amendments to this contract must be in writing and signed by both parties.</li>
          <li>This contract supersedes all prior agreements and represents the entire agreement between parties.</li>
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

export default GeneralProduceTemplate;
