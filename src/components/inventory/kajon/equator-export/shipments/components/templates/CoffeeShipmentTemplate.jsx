
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const CoffeeShipmentTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
  // Helper function to render editable or display content
  const EditableField = ({ field, defaultValue, isMultiline = false }) => {
    const value = data[field] || defaultValue;
    
    if (editMode) {
      if (isMultiline) {
        return (
          <Textarea
            value={value}
            onChange={(e) => onDataChange(field, e.target.value)}
            className="w-full min-h-[80px] border border-blue-300 p-2 editable-field"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-blue-300 p-1 editable-field"
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
          <h1 className="text-2xl font-bold text-blue-800">COFFEE SHIPMENT DOCUMENT</h1>
          <p className="text-sm text-gray-600 mt-2">
            Shipment #: <EditableField field="shipmentNumber" defaultValue="KCL-SHP-2024-001" />
          </p>
          <p className="text-sm text-gray-600">
            Date: <EditableField field="currentDate" defaultValue="[Current Date]" />
          </p>
        </div>
      </div>

      {/* Shipment Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">SHIPMENT DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Vessel/Carrier:</p>
            <p className="text-sm">
              <EditableField field="vessel" defaultValue="MSC Augusta" />
            </p>
            
            <p className="font-semibold mt-2">Container Number:</p>
            <p className="text-sm">
              <EditableField field="containerNumber" defaultValue="MSCU1234567" />
            </p>
            
            <p className="font-semibold mt-2">Container Type:</p>
            <p className="text-sm">
              <EditableField field="containerType" defaultValue="20ft Standard" />
            </p>
            
            <p className="font-semibold mt-2">Seal Number:</p>
            <p className="text-sm">
              <EditableField field="sealNumber" defaultValue="KJ78912345" />
            </p>
          </div>
          <div>
            <p className="font-semibold">Origin Port:</p>
            <p className="text-sm">
              <EditableField field="originPort" defaultValue="Mombasa, Kenya" />
            </p>
            
            <p className="font-semibold mt-2">Destination Port:</p>
            <p className="text-sm">
              <EditableField field="destinationPort" defaultValue="Hamburg, Germany" />
            </p>
            
            <p className="font-semibold mt-2">Departure Date:</p>
            <p className="text-sm">
              <EditableField field="departureDate" defaultValue="2024-04-15" />
            </p>
            
            <p className="font-semibold mt-2">Estimated Arrival:</p>
            <p className="text-sm">
              <EditableField field="estimatedArrival" defaultValue="2024-05-15" />
            </p>
          </div>
        </div>
      </div>

      {/* Buyer Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">BUYER INFORMATION</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="font-semibold">Company:</p>
          <p className="text-sm">
            <EditableField field="buyer" defaultValue="European Coffee Roasters GmbH" />
          </p>
          
          <p className="font-semibold mt-2">Address:</p>
          <p className="text-sm">
            <EditableField field="buyerAddress" defaultValue="Kaffeestraße 123, 20457 Hamburg, Germany" />
          </p>
          
          <p className="font-semibold mt-2">Contact Person:</p>
          <p className="text-sm">
            <EditableField field="buyerContact" defaultValue="Hans Schmidt, +49 123 456789" />
          </p>
          
          <p className="font-semibold mt-2">Incoterm:</p>
          <p className="text-sm">
            <EditableField field="incoterm" defaultValue="FOB Mombasa" />
          </p>
        </div>
      </div>

      {/* Cargo Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">CARGO DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
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
                <EditableField field="product1Description" defaultValue="Arabica Coffee Beans (AA)" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Quantity" defaultValue="300 bags" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1Packaging" defaultValue="60kg jute bags with GrainPro liners" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1NetWeight" defaultValue="18,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product1GrossWeight" defaultValue="18,720" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Description" defaultValue="Robusta Coffee Beans" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Quantity" defaultValue="50 bags" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2Packaging" defaultValue="60kg jute bags with GrainPro liners" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2NetWeight" defaultValue="3,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="product2GrossWeight" defaultValue="3,120" />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-blue-50">
              <td colSpan="3" className="border border-gray-300 p-2 font-bold text-right">Total:</td>
              <td className="border border-gray-300 p-2 font-bold">
                <EditableField field="totalNetWeight" defaultValue="21,000" />
              </td>
              <td className="border border-gray-300 p-2 font-bold">
                <EditableField field="totalGrossWeight" defaultValue="21,840" />
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
            <p className="font-semibold">Arabica (AA):</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="arabicaSpecs" 
                defaultValue="Moisture content: 10-12%
Screen size: 18+
Defect count: Max 5 per 300g
Cup score: 84+ points
Processing: Fully washed
Flavor profile: Citrus, floral, medium body" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Robusta:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="robustaSpecs" 
                defaultValue="Moisture content: 11-13%
Screen size: 15+
Defect count: Max 15 per 300g
Cup score: 80+ points
Processing: Natural
Flavor profile: Chocolate, nutty, full body" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certificates & Required Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">CERTIFICATES & DOCUMENTS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Required Documents:</p>
            <ul className="text-sm list-disc ml-5">
              <li>Certificate of Origin</li>
              <li>Phytosanitary Certificate</li>
              <li>Weight Certificate</li>
              <li>ICO Certificate of Origin</li>
              <li>Quality/Inspection Certificate</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Additional Documents:</p>
            <ul className="text-sm list-disc ml-5">
              <li>Bill of Lading</li>
              <li>Commercial Invoice</li>
              <li>Packing List</li>
              <li>Fumigation Certificate</li>
              <li>Fair Trade / Organic Certificate (if applicable)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Shipment Route & Status */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">SHIPMENT ROUTE & STATUS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="font-semibold">Route:</p>
          <p className="text-sm">
            <EditableField 
              field="route" 
              defaultValue="Mombasa → Suez Canal → Rotterdam → Hamburg" 
            />
          </p>
          
          <table className="w-full border-collapse mt-3">
            <thead>
              <tr className="bg-blue-100">
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
                  <EditableField field="date1" defaultValue="2024-04-15" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status1" defaultValue="Loaded" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes1" defaultValue="On schedule" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="location2" defaultValue="Suez Canal" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date2" defaultValue="2024-04-29" />
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
                  <EditableField field="location3" defaultValue="Rotterdam Port" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date3" defaultValue="2024-05-10" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status3" defaultValue="Scheduled" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes3" defaultValue="Transshipment point" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="location4" defaultValue="Hamburg Port" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date4" defaultValue="2024-05-15" />
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
        <h3 className="text-lg font-bold mb-2 text-blue-800">SPECIAL INSTRUCTIONS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className={editMode ? "space-y-2" : ""}>
            <EditableField 
              field="specialInstructions" 
              defaultValue="1. Maintain proper ventilation throughout transit to prevent condensation.
2. Handle with care to prevent damage to specialty coffee bags.
3. Keep away from strong odors and chemicals during storage and transit.
4. Notify buyer immediately of any delays or issues during transit.
5. Temperature should be maintained between 10-25°C during storage and transit." 
              isMultiline={true}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">CONTACT INFORMATION</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Shipper Contact:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="shipperContact" 
                defaultValue="KAJON Coffee Limited
Logistics Department
Contact: John Doe
Email: logistics@kajoncoffee.com
Phone: +256 776 123456
Available 24/7 for urgent matters" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Shipping Line Contact:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="shippingLineContact" 
                defaultValue="MSC Shipping
Customer Service: +41 22 703 8888
Email: customerservice@msc.com
Vessel Tracking: www.msc.com/track
Reference: KCL-SHP-2024-001" 
                isMultiline={true}
              />
            </div>
          </div>
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

export default CoffeeShipmentTemplate;
