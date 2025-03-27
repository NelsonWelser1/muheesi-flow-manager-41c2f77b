
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
          <h1 className="text-2xl font-bold text-amber-700">FRESH PRODUCE EXPORT CERTIFICATE</h1>
          <p className="text-sm text-gray-600 mt-2">
            Certificate #: <EditableField field="documentNumber" defaultValue="KCL-FPC-2024-001" />
          </p>
          <p className="text-sm text-gray-600">
            Date Issued: <EditableField field="issueDate" defaultValue="2024-05-01" />
          </p>
          <p className="text-sm text-gray-600">
            Valid Until: <EditableField field="expiryDate" defaultValue="2024-05-15" />
          </p>
        </div>
      </div>

      {/* Exporter & Importer */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">EXPORT & IMPORT DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r pr-4">
            <h4 className="font-semibold">EXPORTER:</h4>
            <p className="text-sm">KAJON Coffee Limited</p>
            <p className="text-sm">Kampala, Uganda</p>
            <p className="text-sm">Export License: UG-EXP-23456</p>
            <p className="text-sm">Fresh Produce Cert: UG-FP-1234</p>
          </div>
          <div>
            <h4 className="font-semibold">CONSIGNEE:</h4>
            <p className="text-sm">
              <EditableField field="consigneeName" defaultValue="Fresh Delights Ltd." />
            </p>
            <p className="text-sm">
              <EditableField field="consigneeAddress" defaultValue="45 Market Street, London E1 6AW, United Kingdom" />
            </p>
            <p className="text-sm">
              Importer ID: <EditableField field="consigneeId" defaultValue="UK-IMP-456789" />
            </p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">PRODUCT DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th className="border border-gray-300 p-2 text-left">Product</th>
              <th className="border border-gray-300 p-2 text-left">Variety</th>
              <th className="border border-gray-300 p-2 text-left">Quantity (kg)</th>
              <th className="border border-gray-300 p-2 text-left">Packaging</th>
              <th className="border border-gray-300 p-2 text-left">Harvest Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1" defaultValue="Pineapples" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="variety1" defaultValue="Sweet Gold" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="quantity1" defaultValue="8,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="packaging1" defaultValue="Single-layer cartons, 6-8 units/carton" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestDate1" defaultValue="2024-04-28" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2" defaultValue="Hot Peppers" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="variety2" defaultValue="Scotch Bonnet" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="quantity2" defaultValue="3,500" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="packaging2" defaultValue="5kg cartons with perforated lining" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestDate2" defaultValue="2024-04-29" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3" defaultValue="Passion Fruits" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="variety3" defaultValue="Purple Granadilla" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="quantity3" defaultValue="5,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="packaging3" defaultValue="2kg clamshells, 12 per carton" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="harvestDate3" defaultValue="2024-04-30" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Shipping & Cold Chain */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">SHIPPING & COLD CHAIN DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Shipment Reference:</p>
            <p className="text-sm"><EditableField field="shipmentRef" defaultValue="SHP-2024-001" /></p>
            
            <p className="font-semibold mt-2">Transport Method:</p>
            <p className="text-sm"><EditableField field="transportMethod" defaultValue="Air Freight" /></p>
            
            <p className="font-semibold mt-2">Flight Details:</p>
            <p className="text-sm"><EditableField field="flightDetails" defaultValue="Emirates EK722, Entebbe to London via Dubai" /></p>
            
            <p className="font-semibold mt-2">Departure Date/Time:</p>
            <p className="text-sm"><EditableField field="departureDateTime" defaultValue="2024-05-02, 15:30 EAT" /></p>
          </div>
          <div>
            <p className="font-semibold">Pre-cooling:</p>
            <p className="text-sm"><EditableField field="precooling" defaultValue="Field heat removed, cooled to 8°C" /></p>
            
            <p className="font-semibold mt-2">Storage Temperature:</p>
            <p className="text-sm"><EditableField field="storageTemp" defaultValue="7-10°C throughout supply chain" /></p>
            
            <p className="font-semibold mt-2">Humidity Requirements:</p>
            <p className="text-sm"><EditableField field="humidity" defaultValue="85-90% relative humidity" /></p>
            
            <p className="font-semibold mt-2">Expected Arrival:</p>
            <p className="text-sm"><EditableField field="expectedArrival" defaultValue="2024-05-03, 09:15 BST" /></p>
          </div>
        </div>
      </div>
      
      {/* Quality Parameters */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">QUALITY PARAMETERS</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Pineapples:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="pineapplesParams" 
                defaultValue="Maturity: 1/4 to 1/2 shell color
Size: Uniform, grade A
Brix level: 13-16°
Free from damage and decay
Crown intact, fresh green color
Flesh firm, no internal browning" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Hot Peppers:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="peppersParams" 
                defaultValue="Bright, firm, well-formed
Uniform in color and size
Size: 4-6 cm in length
No signs of shriveling
Free from sunburn damage
No mechanical injuries" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Passion Fruits:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="passionParams" 
                defaultValue="Maturity: 80-100%
Size: 45-65mm diameter
Smooth skin, minimal wrinkles
Uniform deep purple color
Weight: 40-60g per fruit
Juice content: Min 35%" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Treatments & Food Safety */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">TREATMENTS & FOOD SAFETY</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="font-semibold">Post-harvest Treatments:</p>
          <p className="text-sm">
            <EditableField 
              field="postharvest" 
              defaultValue="All products have been treated according to Good Agricultural Practices (GAP) and Good Handling Practices (GHP). Post-harvest handling includes chlorine wash (100ppm), hot water treatment (Passion fruits only, 55°C for 5 minutes) and natural air drying. No post-harvest fungicides have been applied." 
              isMultiline={true}
            />
          </p>
          
          <p className="font-semibold mt-3">Food Safety Compliance:</p>
          <p className="text-sm">
            <EditableField 
              field="foodSafety" 
              defaultValue="Products comply with EU food safety regulations including EC 852/2004 (hygiene of foodstuffs), EU MRL requirements for pesticide residues, and microbiological criteria established in EC 2073/2005. All handling facilities are GLOBALG.A.P. certified and maintain HACCP-based food safety management systems." 
              isMultiline={true}
            />
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-semibold">Certifications & Standards:</p>
              <ul className="text-sm list-disc pl-4">
                <li><EditableField field="cert1" defaultValue="GLOBALG.A.P. GGN: 4052852000012" /></li>
                <li><EditableField field="cert2" defaultValue="GRASP (GLOBALG.A.P. Risk Assessment on Social Practice)" /></li>
                <li><EditableField field="cert3" defaultValue="BRC Food Safety (Packing facility)" /></li>
                <li><EditableField field="cert4" defaultValue="Organic EU (Passion fruits only)" /></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Laboratory Testing:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Pesticide residue: <EditableField field="pestTest" defaultValue="Compliant with UK/EU MRLs" /></li>
                <li>Heavy metals: <EditableField field="heavyMetals" defaultValue="Below detection limits" /></li>
                <li>Microbiological: <EditableField field="microTest" defaultValue="Satisfactory for all parameters" /></li>
                <li>Test Certificate #: <EditableField field="testCert" defaultValue="LTR-UG-2024-0567" /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Traceability Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">TRACEABILITY INFORMATION</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th className="border border-gray-300 p-2 text-left">Product</th>
              <th className="border border-gray-300 p-2 text-left">Lot Number</th>
              <th className="border border-gray-300 p-2 text-left">Producer Group</th>
              <th className="border border-gray-300 p-2 text-left">Packing Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="traceProduct1" defaultValue="Pineapples" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="traceLot1" defaultValue="PIN-24-0503A" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="traceProducer1" defaultValue="Lugazi Pineapple Growers Association" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="tracePack1" defaultValue="2024-05-01" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="traceProduct2" defaultValue="Hot Peppers" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="traceLot2" defaultValue="PEP-24-0501B" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="traceProducer2" defaultValue="Eastern Uganda Vegetable Farmers" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="tracePack2" defaultValue="2024-05-01" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="traceProduct3" defaultValue="Passion Fruits" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="traceLot3" defaultValue="PAS-24-0502C" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="traceProducer3" defaultValue="Masaka Organic Farmers Cooperative" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="tracePack3" defaultValue="2024-05-01" />
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm mt-3">
          <EditableField 
            field="traceabilityNote" 
            defaultValue="All products are fully traceable from farm to export using QR code technology. Each pallet and carton is labeled with a unique GS1-128 barcode for supply chain traceability. Digital traceability system allows tracking from specific farm blocks to individual shipments." 
            isMultiline={true}
          />
        </p>
      </div>

      {/* Phytosanitary Declaration */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-amber-700">PHYTOSANITARY DECLARATION</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="text-sm">
            <EditableField 
              field="phytosanitaryDeclaration" 
              defaultValue="This is to certify that the plants, plant products or other regulated articles described herein have been inspected and/or tested according to appropriate official procedures and are considered to be free from the quarantine pests specified by the importing country and to conform with the current phytosanitary requirements of the importing country, including those for regulated non-quarantine pests.

The fresh produce in this consignment:
1. Has been grown in pest-free areas
2. Is free from Tephritidae (fruit flies) of economic importance
3. Has undergone appropriate post-harvest treatments
4. Complies with EU Directive 2000/29/EC and UK Plant Health Regulations

Phytosanitary Certificate Reference: UG-PC-2024-0325" 
              isMultiline={true}
            />
          </p>
        </div>
      </div>

      {/* Authorized Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">QUALITY ASSURANCE MANAGER</p>
          <p className="text-sm">Name: <EditableField field="qaManagerName" defaultValue="Rose Namugga" /></p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">MINISTRY AUTHORIZED INSPECTOR</p>
          <p className="text-sm">Name: <EditableField field="inspectorName" defaultValue="Patrick Byaruhanga" /></p>
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
          <p className="text-sm text-gray-500">[Export Authority]</p>
        </div>
      </div>

      {/* QR Code and Notes */}
      <div className="mt-8 flex items-center justify-between">
        <div className="text-xs text-gray-600 max-w-md">
          <p>This certificate is valid for 14 days from date of issue and only for the consignment described herein.</p>
          <p className="mt-1">Temperature monitoring data available through online portal with login credentials provided to consignee.</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Scan for verification</p>
          <div className="inline-block p-4 bg-gray-100 rounded-md">
            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-xs">QR Code</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreshProduceComplianceTemplate;
