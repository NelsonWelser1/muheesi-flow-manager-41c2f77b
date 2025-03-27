
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const GeneralProduceShipmentTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
  // Helper function to render editable or display content
  const EditableField = ({ field, defaultValue, isMultiline = false }) => {
    const value = data[field] || defaultValue;
    
    if (editMode) {
      if (isMultiline) {
        return (
          <Textarea
            value={value}
            onChange={(e) => onDataChange(field, e.target.value)}
            className="w-full min-h-[80px] border border-green-300 p-2 editable-field"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-green-300 p-1 editable-field"
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
      {/* Edit Mode Indicator */}
      {editMode && (
        <div className="edit-mode-indicator">
          Editing Mode - Make changes to the template
        </div>
      )}
      
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
          <h1 className="text-2xl font-bold text-green-800">GENERAL PRODUCE SHIPMENT DOCUMENT</h1>
          <p className="text-sm text-gray-600 mt-2">
            Shipment #: <EditableField field="shipmentNumber" defaultValue="KCL-GP-SHP-2024-001" />
          </p>
          <p className="text-sm text-gray-600">
            Date: <EditableField field="currentDate" defaultValue="[Current Date]" />
          </p>
        </div>
      </div>

      {/* Shipment Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">SHIPMENT DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Vessel/Carrier:</p>
            <p className="text-sm">
              <EditableField field="vessel" defaultValue="Maersk Nebula" />
            </p>
            
            <p className="font-semibold mt-2">Container Number:</p>
            <p className="text-sm">
              <EditableField field="containerNumber" defaultValue="MRKU7654321" />
            </p>
            
            <p className="font-semibold mt-2">Container Type:</p>
            <p className="text-sm">
              <EditableField field="containerType" defaultValue="40ft High Cube" />
            </p>
            
            <p className="font-semibold mt-2">Seal Number:</p>
            <p className="text-sm">
              <EditableField field="sealNumber" defaultValue="KJ45678901" />
            </p>
          </div>
          <div>
            <p className="font-semibold">Origin Port:</p>
            <p className="text-sm">
              <EditableField field="originPort" defaultValue="Mombasa, Kenya" />
            </p>
            
            <p className="font-semibold mt-2">Destination Port:</p>
            <p className="text-sm">
              <EditableField field="destinationPort" defaultValue="Rotterdam, Netherlands" />
            </p>
            
            <p className="font-semibold mt-2">Departure Date:</p>
            <p className="text-sm">
              <EditableField field="departureDate" defaultValue="2024-04-20" />
            </p>
            
            <p className="font-semibold mt-2">Estimated Arrival:</p>
            <p className="text-sm">
              <EditableField field="estimatedArrival" defaultValue="2024-05-25" />
            </p>
          </div>
        </div>
      </div>

      {/* Buyer Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">BUYER INFORMATION</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="font-semibold">Company:</p>
          <p className="text-sm">
            <EditableField field="buyer" defaultValue="Global Commodity Trading B.V." />
          </p>
          
          <p className="font-semibold mt-2">Address:</p>
          <p className="text-sm">
            <EditableField field="buyerAddress" defaultValue="Handelsweg 45, 3088 GH Rotterdam, Netherlands" />
          </p>
          
          <p className="font-semibold mt-2">Contact Person:</p>
          <p className="text-sm">
            <EditableField field="buyerContact" defaultValue="Pieter Van Houten, +31 10 456 7890" />
          </p>
          
          <p className="font-semibold mt-2">Incoterm:</p>
          <p className="text-sm">
            <EditableField field="incoterm" defaultValue="CIF Rotterdam" />
          </p>
        </div>
      </div>

      {/* Cargo Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">CARGO DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-left">Quantity</th>
              <th className="border border-gray-300 p-2 text-left">Packaging</th>
              <th className="border border-gray-300 p-2 text-left">Net Weight (kg)</th>
              <th className="border border-gray-300 p-2 text-left">Gross Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Description" defaultValue="Sesame Seeds (Hulled White)" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Quantity" defaultValue="500 bags" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Packaging" defaultValue="50kg polypropylene bags" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1NetWeight" defaultValue="25,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1GrossWeight" defaultValue="25,500" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Description" defaultValue="Soybean (Grade A)" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Quantity" defaultValue="700 bags" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Packaging" defaultValue="50kg polypropylene bags" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2NetWeight" defaultValue="35,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2GrossWeight" defaultValue="35,700" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Description" defaultValue="Maize (Grade 1)" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Quantity" defaultValue="500 bags" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3Packaging" defaultValue="100kg polypropylene bags" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3NetWeight" defaultValue="50,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product3GrossWeight" defaultValue="50,500" />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-green-50">
              <td colSpan="3" className="border border-gray-300 p-2 font-bold text-right">Total:</td>
              <td className="border border-gray-300 p-2 font-bold">
                <EditableField field="totalNetWeight" defaultValue="110,000" />
              </td>
              <td className="border border-gray-300 p-2 font-bold">
                <EditableField field="totalGrossWeight" defaultValue="111,700" />
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
Free from live insects
Color: Creamy white" 
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
Free from GMO
Oil content: 18-20%" 
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
Aflatoxin: max 10 ppb
GMO free certified" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certificates & Required Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">CERTIFICATES & DOCUMENTS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Required Documents:</p>
            <ul className="text-sm list-disc ml-5">
              <li>Certificate of Origin</li>
              <li>Phytosanitary Certificate</li>
              <li>Weight Certificate</li>
              <li>Fumigation Certificate</li>
              <li>Non-GMO Certificate</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Additional Documents:</p>
            <ul className="text-sm list-disc ml-5">
              <li>Bill of Lading</li>
              <li>Commercial Invoice</li>
              <li>Packing List</li>
              <li>Quality/Inspection Certificate</li>
              <li>Radiation Certificate (if required)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Shipment Route & Status */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">SHIPMENT ROUTE & STATUS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="font-semibold">Route:</p>
          <p className="text-sm">
            <EditableField 
              field="route" 
              defaultValue="Mombasa → Suez Canal → Mediterranean → Rotterdam" 
            />
          </p>
          
          <table className="w-full border-collapse mt-3">
            <thead>
              <tr className="bg-green-100">
                <th className="border border-gray-300 p-2 text-left">Location</th>
                <th className="border border-gray-300 p-2 text-left">Estimated Date</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="location1" defaultValue="Mombasa Port" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date1" defaultValue="2024-04-20" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status1" defaultValue="Loaded" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes1" defaultValue="Customs cleared" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="location2" defaultValue="Suez Canal" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date2" defaultValue="2024-05-05" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status2" defaultValue="In Transit" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes2" defaultValue="Expected transit time: 1-2 days" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="location3" defaultValue="Mediterranean Sea" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date3" defaultValue="2024-05-07" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status3" defaultValue="In Transit" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes3" defaultValue="Weather conditions favorable" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="location4" defaultValue="Rotterdam Port" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date4" defaultValue="2024-05-25" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status4" defaultValue="Scheduled" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes4" defaultValue="Final destination" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">SPECIAL INSTRUCTIONS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className={editMode ? "space-y-2" : ""}>
            <EditableField 
              field="specialInstructions" 
              defaultValue="1. Keep cargo dry at all times, maintain proper ventilation to prevent moisture build-up.
2. Store away from chemicals, fertilizers, and other odorous products.
3. Temperature should not exceed 25°C during transit.
4. Handle with care to prevent bag damage and product spillage.
5. Notify shipper immediately of any significant delays in transit.
6. Container inspection required before loading and after unloading." 
              isMultiline={true}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">CONTACT INFORMATION</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Shipper Contact:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="shipperContact" 
                defaultValue="KAJON Coffee Limited
Agricultural Exports Division
Contact: Sarah Johnson
Email: agriexports@kajoncoffee.com
Phone: +256 776 234567
Available: Mon-Fri, 8am-6pm EAT" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Shipping Line Contact:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="shippingLineContact" 
                defaultValue="Maersk Line
Customer Service: +45 33 63 33 63
Email: support@maersk.com
Vessel Tracking: www.maerskline.com
Booking Reference: MAEU1234567" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">INSURANCE INFORMATION</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Insurance Provider:</p>
              <p className="text-sm">
                <EditableField field="insuranceProvider" defaultValue="Global Cargo Insurance Ltd." />
              </p>
              
              <p className="font-semibold mt-2">Policy Number:</p>
              <p className="text-sm">
                <EditableField field="policyNumber" defaultValue="GCI-2024-78901" />
              </p>
            </div>
            <div>
              <p className="font-semibold">Coverage:</p>
              <p className="text-sm">
                <EditableField field="coverage" defaultValue="All Risk (ICC A)" />
              </p>
              
              <p className="font-semibold mt-2">Insured Value:</p>
              <p className="text-sm">
                <EditableField field="insuredValue" defaultValue="USD 154,000.00" />
              </p>
            </div>
          </div>
          <p className="font-semibold mt-2">Claims Contact:</p>
          <p className="text-sm">
            <EditableField field="claimsContact" defaultValue="claims@globalcargoinsurance.com | +44 20 7946 0234" />
          </p>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-12 mt-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">AUTHORIZED BY (SHIPPER)</p>
          <p className="text-sm">Name: ________________________________</p>
          <p className="text-sm mt-2">Title: ________________________________</p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">RECEIVED BY (CARRIER)</p>
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

export default GeneralProduceShipmentTemplate;
