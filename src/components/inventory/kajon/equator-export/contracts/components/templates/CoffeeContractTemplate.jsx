
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
            className="w-full min-h-[80px] border border-blue-300 p-2"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-blue-300 p-1"
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
          <h1 className="text-2xl font-bold text-blue-800">COFFEE EXPORT CONTRACT</h1>
          <p className="text-sm text-gray-600 mt-2">
            Contract #: <EditableField field="contractNumber" defaultValue="KCL-2024-[XXXX]" />
          </p>
          <p className="text-sm text-gray-600">
            Date: <EditableField field="currentDate" defaultValue="[Current Date]" />
          </p>
        </div>
      </div>

      {/* Parties */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">PARTIES</h3>
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
        <h3 className="text-lg font-bold mb-2 text-blue-800">PRODUCT DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-left">Origin</th>
              <th className="border border-gray-300 p-2 text-left">Quantity (Kg)</th>
              <th className="border border-gray-300 p-2 text-left">Grade</th>
              <th className="border border-gray-300 p-2 text-left">Price per Kg</th>
              <th className="border border-gray-300 p-2 text-left">Total Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Description" defaultValue="Arabica Coffee Beans" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Origin" defaultValue="Kazo, Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Quantity" defaultValue="18,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Grade" defaultValue="Screen 18, AA" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Price" defaultValue="USD 5.86" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Total" defaultValue="USD 105,480.00" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Description" defaultValue="Robusta Coffee Beans" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Origin" defaultValue="Kanoni, Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Quantity" defaultValue="7,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Grade" defaultValue="Screen 15" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Price" defaultValue="USD 4.63" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Total" defaultValue="USD 32,410.00" />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-blue-50">
              <td colSpan="5" className="border border-gray-300 p-2 font-bold text-right">Total Contract Value:</td>
              <td className="border border-gray-300 p-2 font-bold">
                <EditableField field="totalValue" defaultValue="USD 137,890.00" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Quality Specifications */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">QUALITY SPECIFICATIONS</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Arabica (Screen 18, AA):</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="arabicaSpecs" 
                defaultValue="Moisture content: 10-12%
Defect count: Max 5 per 300g
Cup score: 84+ points
Processing: Fully washed
Flavor profile: Citrus, floral, medium body" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Robusta (Screen 15):</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="robustaSpecs" 
                defaultValue="Moisture content: 11-13%
Defect count: Max 15 per 300g
Cup score: 80+ points
Processing: Natural
Flavor profile: Chocolate, nutty, full body" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
        <p className="text-sm">
          <EditableField 
            field="qualityVerification" 
            defaultValue="Quality to be verified by SGS or equivalent third-party inspector at loading. Buyer has the right to reject shipment if quality parameters are not met." 
            isMultiline={true}
          />
        </p>
      </div>

      {/* Shipping Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">SHIPPING TERMS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Incoterm:</p>
            <p className="text-sm">
              <EditableField field="incoterm" defaultValue="FOB Mombasa" />
            </p>
            
            <p className="font-semibold mt-2">Packaging:</p>
            <p className="text-sm">
              <EditableField field="packaging" defaultValue="60kg jute bags with GrainPro liners" />
            </p>
            
            <p className="font-semibold mt-2">Loading Port:</p>
            <p className="text-sm">
              <EditableField field="loadingPort" defaultValue="Mombasa, Kenya" />
            </p>
          </div>
          <div>
            <p className="font-semibold">Destination:</p>
            <p className="text-sm">
              <EditableField field="destination" defaultValue="Hamburg, Germany" />
            </p>
            
            <p className="font-semibold mt-2">Latest Shipment Date:</p>
            <p className="text-sm">
              <EditableField field="shipmentDate" defaultValue="October 15, 2024" />
            </p>
            
            <p className="font-semibold mt-2">Delivery Timeline:</p>
            <p className="text-sm">
              <EditableField field="deliveryTimeline" defaultValue="30-45 days from loading" />
            </p>
          </div>
        </div>
      </div>

      {/* Continue with other sections (Payment Terms, Certificates & Required Documents, etc.) */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">PAYMENT TERMS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className={editMode ? "space-y-2" : ""}>
            <EditableField 
              field="paymentTerms" 
              defaultValue="30% advance payment upon contract signing
70% balance payment by irrevocable Letter of Credit at sight
L/C to be issued by buyer's bank within 14 days of contract signing
L/C to be confirmed by Standard Chartered Bank, Kampala
All banking charges outside Uganda to be borne by the Buyer" 
              isMultiline={true}
            />
          </div>
        </div>
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

export default CoffeeContractTemplate;
