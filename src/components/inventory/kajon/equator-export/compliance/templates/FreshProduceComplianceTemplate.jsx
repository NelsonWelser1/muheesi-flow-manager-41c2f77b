
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const FreshProduceComplianceTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
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

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 border border-gray-200 shadow-sm print:shadow-none print:border-none">
      {/* Document Header */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <img 
            src="/combined-logo.png" 
            alt="KAJON Limited" 
            className="h-16 w-auto mb-2"
          />
          <h2 className="text-lg font-bold">KAJON Limited</h2>
          <p className="text-sm text-gray-600">Kanoni, Kazo District, Uganda</p>
          <p className="text-sm text-gray-600">6th floor, Arie Towers, Mackinnon Road, Nakasero</p>
          <p className="text-sm text-gray-600">Kampala, Uganda, 256</p>
          <p className="text-sm text-gray-600">Tel: +256 776 670680 / +256 757 757517</p>
          <p className="text-sm text-gray-600">Email: kajonlimited@gmail.com</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-amber-800">FRESH PRODUCE CERTIFICATE</h1>
          <p className="text-sm text-gray-600 mt-2">
            Certificate #: <EditableField field="documentNumber" defaultValue="KL-FPC-2024-001" />
          </p>
          <p className="text-sm text-gray-600">
            Date Issued: <EditableField field="issueDate" defaultValue="2024-05-01" />
          </p>
          <p className="text-sm text-gray-600">
            Valid Until: <EditableField field="expiryDate" defaultValue="2024-05-15" />
          </p>
        </div>
      </div>

      {/* Product Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-800">PRODUCT INFORMATION</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th className="border border-gray-300 p-2 text-left">Product Name</th>
              <th className="border border-gray-300 p-2 text-left">Variety</th>
              <th className="border border-gray-300 p-2 text-left">Growing Region</th>
              <th className="border border-gray-300 p-2 text-left">Harvest Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="productName" defaultValue="Passion Fruit" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="productVariety" defaultValue="Purple Granadilla" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="growingRegion" defaultValue="Central Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestDate" defaultValue="April 25-28, 2024" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="productName2" defaultValue="Pineapple" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="productVariety2" defaultValue="Sweet Cayenne" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="growingRegion2" defaultValue="Eastern Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestDate2" defaultValue="April 22-24, 2024" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quality Parameters */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-800">QUALITY PARAMETERS</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border rounded p-3 bg-amber-50">
            <p className="font-semibold">Passion Fruit:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="passionFruitParams" 
                defaultValue="Size: 8-10 cm diameter
Color: Deep purple, uniform
Freshness: Harvested within 72 hours
Brix level: 14-16°
Skin condition: Firm, no wrinkles
Post-harvest treatment: Natural cooling
Cold chain maintained: 8-10°C" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-amber-50">
            <p className="font-semibold">Pineapple:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="pineappleParams" 
                defaultValue="Size: Medium-Large (1.5-2kg)
Color: Golden yellow, uniform
Maturity: 3/4 yellow
Crown: Green, trimmed 1-2cm
Brix level: 13-15°
Freshness: Harvested within 48 hours
Post-harvest treatment: Natural cooling
Cold chain maintained: 7-10°C" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Packaging & Storage Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-800">PACKAGING & STORAGE INFORMATION</h3>
        <table className="w-full border-collapse">
          <tbody>
            <tr className="bg-amber-50">
              <td className="border border-gray-300 p-2 font-medium w-1/4">Packaging Type:</td>
              <td className="border border-gray-300 p-2">
                <EditableField field="packagingType" defaultValue="Single-wall corrugated cartons with product-specific inserts and ventilation holes" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-medium">Package Markings:</td>
              <td className="border border-gray-300 p-2">
                <EditableField field="packagingMarkings" defaultValue="Product name, variety, origin, quantity, handling instructions, traceability code, production date" />
              </td>
            </tr>
            <tr className="bg-amber-50">
              <td className="border border-gray-300 p-2 font-medium">Temperature Control:</td>
              <td className="border border-gray-300 p-2">
                <EditableField field="temperatureControl" defaultValue="Cold chain maintained at 7-10°C from harvest to export" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-medium">Shelf Life:</td>
              <td className="border border-gray-300 p-2">
                <EditableField field="shelfLife" defaultValue="Passion Fruit: 14 days under optimal conditions; Pineapple: 21 days under optimal conditions" />
              </td>
            </tr>
            <tr className="bg-amber-50">
              <td className="border border-gray-300 p-2 font-medium">Storage Instructions:</td>
              <td className="border border-gray-300 p-2">
                <EditableField field="storageInstructions" defaultValue="Store in refrigerated conditions (7-10°C). Avoid exposure to ethylene-producing fruits. Maintain 85-90% relative humidity." />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Shipment Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-800">SHIPMENT DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Total Quantity:</p>
            <p className="text-sm">
              <EditableField field="passionFruitQty" defaultValue="Passion Fruit: 2,400 kg (240 cartons × 10kg)" />
            </p>
            <p className="text-sm">
              <EditableField field="pineappleQty" defaultValue="Pineapple: 3,600 kg (300 cartons × 12kg)" />
            </p>
            
            <p className="font-semibold mt-2">Shipment Reference:</p>
            <p className="text-sm"><EditableField field="shipmentRef" defaultValue="SHP-2024-FP002" /></p>
            
            <p className="font-semibold mt-2">AWB/BL Number:</p>
            <p className="text-sm"><EditableField field="awbNumber" defaultValue="125-97865432" /></p>
          </div>
          <div>
            <p className="font-semibold">Loading Terminal:</p>
            <p className="text-sm"><EditableField field="loadingTerminal" defaultValue="Entebbe International Airport, Uganda" /></p>
            
            <p className="font-semibold mt-2">Final Destination:</p>
            <p className="text-sm"><EditableField field="destination" defaultValue="Dubai, UAE" /></p>
            
            <p className="font-semibold mt-2">Flight Information:</p>
            <p className="text-sm"><EditableField field="transportVessel" defaultValue="Emirates Sky Cargo EK9902, May 2, 2024" /></p>
          </div>
        </div>
      </div>

      {/* Compliance & Certification */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-800">COMPLIANCE & CERTIFICATION</h3>
        <div className="border rounded p-3 bg-amber-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Food Safety Certifications:</p>
              <ul className="text-sm list-disc pl-4">
                <li><EditableField field="cert1" defaultValue="GLOBALG.A.P. Certification" /></li>
                <li><EditableField field="cert2" defaultValue="HACCP Compliant" /></li>
                <li><EditableField field="cert3" defaultValue="ISO 22000 Food Safety Management" /></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Export Compliance:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Phytosanitary Certificate: <EditableField field="phytoNumber" defaultValue="UG-PHY-24-0892" /></li>
                <li>Certificate of Origin: <EditableField field="originCertNumber" defaultValue="UG-CO-24-1075" /></li>
                <li>Inspection Certificate: <EditableField field="inspectionNumber" defaultValue="UNBS-FP-24-0346" /></li>
              </ul>
            </div>
          </div>
          <p className="text-sm mt-4">
            <EditableField 
              field="complianceInfo" 
              defaultValue="All products comply with maximum residue limits (MRLs) as per EU regulations. Products are free from quarantine pests and diseases as certified by the Ministry of Agriculture, Uganda. Complete traceability from farm to export is maintained and documented." 
              isMultiline={true}
            />
          </p>
        </div>
      </div>
      
      {/* Declaration */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-amber-800">DECLARATION</h3>
        <div className="border rounded p-3 bg-amber-50">
          <p className="text-sm">
            <EditableField 
              field="declaration" 
              defaultValue="We hereby certify that the fresh produce described in this certificate has been grown, harvested, packed, and prepared for export in accordance with international food safety standards and the importing country requirements. The produce is of merchantable quality, free from prohibited pests and diseases, and complies with the Maximum Residue Limits for pesticides as specified by the destination market." 
              isMultiline={true}
            />
          </p>
        </div>
      </div>

      {/* Authorized Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">QUALITY ASSURANCE MANAGER</p>
          <p className="text-sm">Name: <EditableField field="qaManagerName" defaultValue="Grace Nakimuli" /></p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">EXPORT DIRECTOR</p>
          <p className="text-sm">Name: <EditableField field="exportDirName" defaultValue="David Ssempa" /></p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
      </div>

      {/* Official Stamps */}
      <div className="mt-12 grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-sm text-gray-500">[Ministry of Agriculture Stamp]</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">[Company Seal]</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">[UNBS Quality Mark]</p>
        </div>
      </div>

      {/* QR Code */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 mb-1">Scan to verify certificate authenticity</p>
        <div className="inline-block p-4 bg-gray-100 rounded-md">
          <div className="w-24 h-24 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-xs">QR Code</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreshProduceComplianceTemplate;
