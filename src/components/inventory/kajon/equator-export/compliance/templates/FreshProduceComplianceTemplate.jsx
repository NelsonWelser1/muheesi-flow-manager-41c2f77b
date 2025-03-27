
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
          <h1 className="text-2xl font-bold text-amber-700">FRESH PRODUCE CERTIFICATE</h1>
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
        <h3 className="text-lg font-bold mb-2 text-amber-700">PRODUCT INFORMATION</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th className="border border-gray-300 p-2 text-left">Type</th>
              <th className="border border-gray-300 p-2 text-left">Variety</th>
              <th className="border border-gray-300 p-2 text-left">Origin</th>
              <th className="border border-gray-300 p-2 text-left">Harvest Date</th>
              <th className="border border-gray-300 p-2 text-left">Packaging</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceType" defaultValue="Pineapple" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceVariety" defaultValue="Smooth Cayenne" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceOrigin" defaultValue="Kazo, Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestDate" defaultValue="2024-04-28" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="packaging" defaultValue="Cardboard Box, 8 pcs/box" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceType2" defaultValue="Avocado" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceVariety2" defaultValue="Hass" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="produceOrigin2" defaultValue="Mbarara, Uganda" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestDate2" defaultValue="2024-04-29" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="packaging2" defaultValue="Plastic Crate, 24 pcs/crate" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Shipment Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">SHIPMENT DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Total Quantity:</p>
            <p className="text-sm"><EditableField field="totalQuantity" defaultValue="5,000 kg" /></p>
            
            <p className="font-semibold mt-2">Shipment Reference:</p>
            <p className="text-sm"><EditableField field="shipmentRef" defaultValue="SHP-2024-003" /></p>
            
            <p className="font-semibold mt-2">Container Number:</p>
            <p className="text-sm"><EditableField field="containerNumber" defaultValue="REFR5432187" /></p>
          </div>
          <div>
            <p className="font-semibold">Port of Loading:</p>
            <p className="text-sm"><EditableField field="loadingPort" defaultValue="Entebbe Airport, Uganda" /></p>
            
            <p className="font-semibold mt-2">Final Destination:</p>
            <p className="text-sm"><EditableField field="destination" defaultValue="Dubai, UAE" /></p>
            
            <p className="font-semibold mt-2">Vessel/Flight:</p>
            <p className="text-sm"><EditableField field="transportVessel" defaultValue="Emirates EK720" /></p>
          </div>
        </div>
      </div>

      {/* Storage and Transport Conditions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">STORAGE & TRANSPORT CONDITIONS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-3 bg-amber-50">
            <p className="font-semibold">Temperature Requirements:</p>
            <p className="text-sm mt-1">
              <EditableField 
                field="temperatureReqs" 
                defaultValue="Pineapple: 7-10°C (45-50°F)
Avocado: 4-6°C (39-43°F)" 
                isMultiline={true}
              />
            </p>
          </div>
          <div className="border rounded p-3 bg-amber-50">
            <p className="font-semibold">Humidity Requirements:</p>
            <p className="text-sm mt-1">
              <EditableField 
                field="humidityReqs" 
                defaultValue="Pineapple: 85-90% relative humidity
Avocado: 90-95% relative humidity" 
                isMultiline={true}
              />
            </p>
          </div>
        </div>
        <div className="mt-2 border rounded p-3 bg-amber-50">
          <p className="font-semibold">Special Handling Instructions:</p>
          <p className="text-sm mt-1">
            <EditableField 
              field="handlingInstructions" 
              defaultValue="- Maintain cold chain at all times
- Handle with care to prevent bruising
- Stack boxes/crates according to markings
- Do not expose to ethylene-producing fruits
- Ensure proper air circulation during transit
- Keep away from direct sunlight" 
              isMultiline={true}
            />
          </p>
        </div>
      </div>

      {/* Quality Parameters */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">QUALITY PARAMETERS</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Pineapple:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="pineappleParams" 
                defaultValue="Size: Medium-Large (1.2-1.8 kg)
Maturity: 25-50% yellow skin
Brix level: 14-16°
Firmness: Medium-firm
Crown: Green, healthy
Defects: <2% physical damage
Pesticide residue: Within EU MRL limits" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Avocado:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="avocadoParams" 
                defaultValue="Size: 170-210g per fruit
Maturity: Pre-ripened stage
Oil content: 8-10%
Skin color: Dark green to purple
Defects: <3% physical damage
Stem cut: Clean, no tears
Pesticide residue: Within EU MRL limits" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export Compliance */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">EXPORT COMPLIANCE</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th className="border border-gray-300 p-2 text-left">Document Type</th>
              <th className="border border-gray-300 p-2 text-left">Reference Number</th>
              <th className="border border-gray-300 p-2 text-left">Issuing Authority</th>
              <th className="border border-gray-300 p-2 text-left">Date Issued</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="docType1" defaultValue="Phytosanitary Certificate" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docRef1" defaultValue="UG-PHY-24-9876" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docAuth1" defaultValue="Ministry of Agriculture" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docDate1" defaultValue="2024-04-30" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="docType2" defaultValue="Certificate of Origin" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docRef2" defaultValue="UG-CO-24-3456" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docAuth2" defaultValue="Uganda Export Promotion Board" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docDate2" defaultValue="2024-04-30" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="docType3" defaultValue="Food Safety Certificate" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docRef3" defaultValue="UG-FS-24-5678" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docAuth3" defaultValue="Uganda National Bureau of Standards" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="docDate3" defaultValue="2024-04-30" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Certification & Traceability */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">CERTIFICATION & TRACEABILITY</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Certification Standards:</p>
              <ul className="text-sm list-disc pl-4">
                <li><EditableField field="cert1" defaultValue="Global G.A.P" /></li>
                <li><EditableField field="cert2" defaultValue="HACCP" /></li>
                <li><EditableField field="cert3" defaultValue="BRC Global Standard" /></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Traceability Information:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Farm Code: <EditableField field="farmCode" defaultValue="FUG-2024-057" /></li>
                <li>Packing Station: <EditableField field="packingStation" defaultValue="Kazo Fresh Produce Facility" /></li>
                <li>Batch Number: <EditableField field="batchNumber" defaultValue="KZL-FP-24-0078" /></li>
              </ul>
            </div>
          </div>
          <p className="text-sm mt-4">
            <EditableField 
              field="traceabilityInfo" 
              defaultValue="Full farm-to-fork traceability is implemented throughout the supply chain. Each package carries a unique QR code that links to detailed information about farm location, harvest date, and food safety certificates. Cold chain monitoring data is available upon request." 
              isMultiline={true}
            />
          </p>
        </div>
      </div>
      
      {/* Declaration */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-amber-700">DECLARATION</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="text-sm">
            <EditableField 
              field="declaration" 
              defaultValue="We hereby certify that the fresh produce described above is of Uganda origin, harvested during the stated period, and handled according to international food safety standards. The produce meets all quality parameters required for export and complies with the phytosanitary and food safety regulations of both Uganda and the destination country. No prohibited pesticides or chemicals have been used in the production process." 
              isMultiline={true}
            />
          </p>
        </div>
      </div>

      {/* Shelf Life */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-amber-700">SHELF LIFE & STORAGE RECOMMENDATIONS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="text-sm">
            <EditableField 
              field="shelfLife" 
              defaultValue="Pineapple: 14-21 days when stored at optimal conditions (7-10°C, 85-90% RH)
Avocado: 21-28 days at pre-ripened stage (4-6°C, 90-95% RH); 5-7 days when ripened

For best quality, maintain cold chain during transport and storage. Monitor ripening process daily for avocados. Pineapples should be displayed at retail at temperatures above 10°C to reduce chilling injury risk." 
              isMultiline={true}
            />
          </p>
        </div>
      </div>

      {/* Authorized Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">QUALITY CONTROL MANAGER</p>
          <p className="text-sm">Name: <EditableField field="qcManagerName" defaultValue="Daniel Mugisha" /></p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">EXPORT DIRECTOR</p>
          <p className="text-sm">Name: <EditableField field="exportDirName" defaultValue="Sarah Namulondo" /></p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
      </div>

      {/* Official Stamps */}
      <div className="mt-12 grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-sm text-gray-500">[UNBS Stamp]</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">[Company Seal]</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">[Ministry Stamp]</p>
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
