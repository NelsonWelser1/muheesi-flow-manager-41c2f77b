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
            className="w-full min-h-[80px] border border-green-300 p-2 rounded"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-green-300 p-1 rounded"
        />
      );
    }
    
    return isMultiline ? (
      <div className="whitespace-pre-line">{value}</div>
    ) : (
      <span>{value}</span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 border border-gray-200 shadow-sm print:shadow-none print:border-none">
      {/* Edit Mode Indicator */}
      {editMode && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4 print:hidden">
          Editing Mode - Make changes to the template
        </div>
      )}
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold uppercase">AGRICULTURAL PRODUCE SALE CONTRACT</h1>
      </div>
      
      {/* Contract Number and Date Section */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="font-semibold mb-1">Contract Number:</p>
          <div className="text-sm">
            <EditableField 
              field="contractNumber" 
              defaultValue="KCL-GP-2024-[XXXX]" 
            />
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold mb-1">Date:</p>
          <div className="text-sm">
            <EditableField 
              field="contractDate" 
              defaultValue={new Date().toLocaleDateString()} 
            />
          </div>
        </div>
      </div>
      
      {/* Parties Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">PARTIES</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold mb-1">Seller:</p>
            <div className="text-sm space-y-1">
              <p>KAJON Coffee Limited</p>
              <p>Kanoni, Kazo District, Uganda</p>
              <p>6th floor, Arie Towers, Mackinnon Road, Nakasero</p>
              <p>Kampala, Uganda, 256</p>
              <p>Tel: +256 776 670680 / +256 757 757517</p>
              <p>Email: kajoncoffeelimited@gmail.com</p>
              <p>TIN: 1009836578</p>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Buyer:</p>
            <div className="text-sm space-y-1">
              <div className={editMode ? "space-y-2" : "space-y-1"}>
                <EditableField 
                  field="buyerName" 
                  defaultValue="[Buyer Company Name]" 
                />
                <EditableField 
                  field="buyerAddress" 
                  defaultValue="[Buyer Address]" 
                  isMultiline={true}
                />
                <EditableField 
                  field="buyerRegistration" 
                  defaultValue="[Buyer Registration #]" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">PRODUCT DETAILS</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-1">Product:</p>
              <div className="text-sm">
                <EditableField 
                  field="productName" 
                  defaultValue="[Product Name/Type]" 
                />
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">Crop Year:</p>
              <div className="text-sm">
                <EditableField 
                  field="cropYear" 
                  defaultValue="[Crop Year]" 
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-1">Quantity:</p>
              <div className="text-sm">
                <EditableField 
                  field="quantity" 
                  defaultValue="[Quantity] Metric Tons" 
                />
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">Unit Price:</p>
              <div className="text-sm">
                <EditableField 
                  field="unitPrice" 
                  defaultValue="USD [Price] per Metric Ton" 
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-1">Total Contract Value:</p>
              <div className="text-sm">
                <EditableField 
                  field="totalValue" 
                  defaultValue="USD [Total Value]" 
                />
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">Packaging:</p>
              <div className="text-sm">
                <EditableField 
                  field="packaging" 
                  defaultValue="[Packaging Details]" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quality Specifications */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">QUALITY SPECIFICATIONS</h3>
        <div className="text-sm">
          <EditableField 
            field="qualitySpecs" 
            defaultValue="1. Moisture Content: [Specify]
2. Foreign Matter: [Specify]
3. Damaged Grains: [Specify]
4. Pest Damage: [Specify]
5. Size/Grade: [Specify]
6. Color: [Specify]
7. Odor: [Specify]
8. Other Specifications: [Specify]" 
            isMultiline={true}
          />
        </div>
      </div>
      
      {/* Delivery Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">DELIVERY TERMS</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-1">Incoterm:</p>
              <div className="text-sm">
                <EditableField 
                  field="incoterm" 
                  defaultValue="[FOB/CIF/CFR/etc.] [Port]" 
                />
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">Shipment Period:</p>
              <div className="text-sm">
                <EditableField 
                  field="shipmentPeriod" 
                  defaultValue="[Start Date] to [End Date]" 
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-1">Port of Loading:</p>
              <div className="text-sm">
                <EditableField 
                  field="loadingPort" 
                  defaultValue="[Port Name], [Country]" 
                />
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">Port of Destination:</p>
              <div className="text-sm">
                <EditableField 
                  field="destinationPort" 
                  defaultValue="[Port Name], [Country]" 
                />
              </div>
            </div>
          </div>
          
          <div>
            <p className="font-semibold mb-1">Delivery Instructions:</p>
            <div className="text-sm">
              <EditableField 
                field="deliveryInstructions" 
                defaultValue="[Special delivery instructions or requirements]" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">PAYMENT TERMS</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-1">Payment Method:</p>
              <div className="text-sm">
                <EditableField 
                  field="paymentMethod" 
                  defaultValue="[Letter of Credit/T/T/etc.]" 
                />
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">Payment Terms:</p>
              <div className="text-sm">
                <EditableField 
                  field="paymentTerms" 
                  defaultValue="[e.g., 100% against shipping documents]" 
                />
              </div>
            </div>
          </div>
          
          <div>
            <p className="font-semibold mb-1">Banking Details:</p>
            <div className="text-sm">
              <EditableField 
                field="bankingDetails" 
                defaultValue="Bank: [Bank Name]
Account Name: KAJON Coffee Limited
Account Number: [Account Number]
Swift Code: [Swift Code]
Bank Address: [Bank Address]" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Documentation */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">REQUIRED DOCUMENTATION</h3>
        <div className="text-sm">
          <EditableField 
            field="requiredDocs" 
            defaultValue="1. Commercial Invoice
2. Packing List
3. Certificate of Origin
4. Phytosanitary Certificate
5. Weight Certificate
6. Quality/Inspection Certificate
7. Bill of Lading
8. [Other required documents]" 
            isMultiline={true}
          />
        </div>
      </div>
      
      {/* Inspection & Quality Control */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">INSPECTION & QUALITY CONTROL</h3>
        <div className="text-sm">
          <EditableField 
            field="inspectionTerms" 
            defaultValue="1. Pre-shipment inspection shall be conducted by [Inspection Company].
2. Buyer reserves the right to inspect the goods upon arrival at destination.
3. In case of quality disputes, [Specify resolution process].
4. Sampling and testing procedures shall follow [Specify standards].
5. Costs of inspection shall be borne by [Seller/Buyer/Both parties]." 
            isMultiline={true}
          />
        </div>
      </div>
      
      {/* General Terms & Conditions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">GENERAL TERMS & CONDITIONS</h3>
        <div className="text-sm">
          <EditableField 
            field="generalTerms" 
            defaultValue="1. This contract is subject to Force Majeure conditions.
2. Any disputes arising from this contract shall be resolved through arbitration in [Location] under the rules of [Arbitration Body].
3. This contract shall be governed by the laws of [Country].
4. Any amendments to this contract must be made in writing and signed by both parties.
5. Neither party may assign this contract without the written consent of the other party." 
            isMultiline={true}
          />
        </div>
      </div>
      
      {/* Signatures */}
      <div className="mt-12 grid grid-cols-2 gap-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">FOR AND ON BEHALF OF SELLER</p>
          <p className="text-sm">Name: ________________________________</p>
          <p className="text-sm mt-2">Title: ________________________________</p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">FOR AND ON BEHALF OF BUYER</p>
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
