import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const CoffeeContractTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
  // Helper function to render editable or display content
  const EditableField = ({ field, defaultValue, isMultiline = false }) => {
    const value = data[field] || defaultValue;
    
    if (editMode) {
      if (isMultiline) {
        return (
          <Textarea
            value={value}
            onChange={(e) => onDataChange(field, e.target.value)}
            className="w-full min-h-[80px] border border-blue-300 p-2 rounded"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-blue-300 p-1 rounded"
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
        <div className="bg-blue-100 text-blue-800 p-2 rounded mb-4 print:hidden">
          Editing Mode - Make changes to the template
        </div>
      )}
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold uppercase">COFFEE SALE CONTRACT</h1>
      </div>
      
      {/* Contract Number and Date Section */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="font-semibold mb-1">Contract Number:</p>
          <div className="text-sm">
            <EditableField 
              field="contractNumber" 
              defaultValue="KCL-2024-[XXXX]" 
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
      
      {/* Product Details Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">PRODUCT DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold mb-1">Commodity:</p>
            <div className="text-sm">
              <EditableField 
                field="commodity" 
                defaultValue="Green Arabica Coffee Beans" 
              />
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Origin:</p>
            <div className="text-sm">
              <EditableField 
                field="origin" 
                defaultValue="Uganda" 
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-semibold mb-1">Quantity:</p>
            <div className="text-sm">
              <EditableField 
                field="quantity" 
                defaultValue="10,000 Kgs" 
              />
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Packaging:</p>
            <div className="text-sm">
              <EditableField 
                field="packaging" 
                defaultValue="60kg Jute Bags" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quality Specifications Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">QUALITY SPECIFICATIONS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold mb-1">Moisture:</p>
            <div className="text-sm">
              <EditableField 
                field="moisture" 
                defaultValue="Max 12%" 
              />
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Defects:</p>
            <div className="text-sm">
              <EditableField 
                field="defects" 
                defaultValue="Max 5%" 
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-semibold mb-1">Screen Size:</p>
            <div className="text-sm">
              <EditableField 
                field="screenSize" 
                defaultValue="15+" 
              />
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Cup Score:</p>
            <div className="text-sm">
              <EditableField 
                field="cupScore" 
                defaultValue="80+" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Price and Payment Terms Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">PRICE AND PAYMENT TERMS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold mb-1">Price:</p>
            <div className="text-sm">
              <EditableField 
                field="price" 
                defaultValue="USD 3.00/Kg" 
              />
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Currency:</p>
            <div className="text-sm">
              <EditableField 
                field="currency" 
                defaultValue="USD" 
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-semibold mb-1">Payment Terms:</p>
          <div className="text-sm">
            <EditableField 
              field="paymentTerms" 
              defaultValue="50% Advance, 50% upon Delivery" 
              isMultiline={true}
            />
          </div>
        </div>
      </div>
      
      {/* Delivery Terms Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">DELIVERY TERMS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold mb-1">Incoterms:</p>
            <div className="text-sm">
              <EditableField 
                field="incoterms" 
                defaultValue="FOB Mombasa" 
              />
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Delivery Date:</p>
            <div className="text-sm">
              <EditableField 
                field="deliveryDate" 
                defaultValue="30 Days from Contract Date" 
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-semibold mb-1">Delivery Instructions:</p>
          <div className="text-sm">
            <EditableField 
              field="deliveryInstructions" 
              defaultValue="Ship to [Destination Port] as per Incoterms." 
              isMultiline={true}
            />
          </div>
        </div>
      </div>
      
      {/* Governing Law and Dispute Resolution Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-300">GOVERNING LAW AND DISPUTE RESOLUTION</h3>
        <div className="mt-4">
          <p className="font-semibold mb-1">Governing Law:</p>
          <div className="text-sm">
            <EditableField 
              field="governingLaw" 
              defaultValue="Laws of Uganda" 
            />
          </div>
        </div>
        <div className="mt-4">
          <p className="font-semibold mb-1">Dispute Resolution:</p>
          <div className="text-sm">
            <EditableField 
              field="disputeResolution" 
              defaultValue="Arbitration in Kampala, Uganda" 
              isMultiline={true}
            />
          </div>
        </div>
      </div>
      
      {/* Signatures Section */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Seller:</p>
          <div className="mt-2">
            <EditableField 
              field="sellerSignature" 
              defaultValue="[Authorized Signature]" 
            />
            <p className="text-sm">KAJON Coffee Limited</p>
          </div>
        </div>
        <div>
          <p className="font-semibold">Buyer:</p>
          <div className="mt-2">
            <EditableField 
              field="buyerSignature" 
              defaultValue="[Authorized Signature]" 
            />
            <p className="text-sm"><EditableField field="buyerName" defaultValue="[Buyer Company Name]" /></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeContractTemplate;
