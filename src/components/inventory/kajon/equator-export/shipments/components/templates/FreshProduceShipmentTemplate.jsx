
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const FreshProduceShipmentTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
  // Helper function to render editable or display content
  const EditableField = ({ field, defaultValue, isMultiline = false }) => {
    const value = data[field] || defaultValue;
    
    if (editMode) {
      if (isMultiline) {
        return (
          <Textarea
            value={value}
            onChange={(e) => onDataChange(field, e.target.value)}
            className="w-full min-h-[80px] border border-amber-300 p-2 editable-field"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-amber-300 p-1 editable-field"
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
          <h1 className="text-2xl font-bold text-amber-700">FRESH PRODUCE SHIPMENT DOCUMENT</h1>
          <p className="text-sm text-gray-600 mt-2">
            Shipment #: <EditableField field="shipmentNumber" defaultValue="KCL-FP-SHP-2024-001" />
          </p>
          <p className="text-sm text-gray-600">
            Date: <EditableField field="currentDate" defaultValue="[Current Date]" />
          </p>
        </div>
      </div>

      {/* Shipment Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">SHIPMENT DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Carrier:</p>
            <p className="text-sm">
              <EditableField field="carrier" defaultValue="Emirates SkyCargo" />
            </p>
            
            <p className="font-semibold mt-2">Flight/AWB Number:</p>
            <p className="text-sm">
              <EditableField field="flightNumber" defaultValue="EK9821 / 176-12345678" />
            </p>
            
            <p className="font-semibold mt-2">ULD Numbers:</p>
            <p className="text-sm">
              <EditableField field="uldNumbers" defaultValue="PMC3456EK, PMC3457EK" />
            </p>
            
            <p className="font-semibold mt-2">Total Packages:</p>
            <p className="text-sm">
              <EditableField field="totalPackages" defaultValue="235 cartons (45 pallets)" />
            </p>
          </div>
          <div>
            <p className="font-semibold">Origin Airport:</p>
            <p className="text-sm">
              <EditableField field="originAirport" defaultValue="Entebbe International Airport (EBB)" />
            </p>
            
            <p className="font-semibold mt-2">Destination Airport:</p>
            <p className="text-sm">
              <EditableField field="destinationAirport" defaultValue="London Heathrow (LHR)" />
            </p>
            
            <p className="font-semibold mt-2">Departure Date/Time:</p>
            <p className="text-sm">
              <EditableField field="departureDateTime" defaultValue="2024-04-18 / 23:45 EAT" />
            </p>
            
            <p className="font-semibold mt-2">Estimated Arrival:</p>
            <p className="text-sm">
              <EditableField field="estimatedArrival" defaultValue="2024-04-19 / 07:30 BST" />
            </p>
          </div>
        </div>
      </div>

      {/* Buyer Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">CONSIGNEE INFORMATION</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="font-semibold">Company:</p>
          <p className="text-sm">
            <EditableField field="buyer" defaultValue="Fresh Direct UK Ltd." />
          </p>
          
          <p className="font-semibold mt-2">Address:</p>
          <p className="text-sm">
            <EditableField field="buyerAddress" defaultValue="Unit 5, Langley Distribution Park, Berkshire, SL3 8DS, United Kingdom" />
          </p>
          
          <p className="font-semibold mt-2">Contact Person:</p>
          <p className="text-sm">
            <EditableField field="buyerContact" defaultValue="James Wilson, +44 7700 900123" />
          </p>
          
          <p className="font-semibold mt-2">Incoterm:</p>
          <p className="text-sm">
            <EditableField field="incoterm" defaultValue="CIP London Heathrow" />
          </p>
        </div>
      </div>

      {/* Cargo Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">CARGO DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th className="border border-gray-300 p-2 text-left">Product</th>
              <th className="border border-gray-300 p-2 text-left">Variety</th>
              <th className="border border-gray-300 p-2 text-left">Packaging</th>
              <th className="border border-gray-300 p-2 text-left">Units/Cartons</th>
              <th className="border border-gray-300 p-2 text-left">Net Weight (kg)</th>
              <th className="border border-gray-300 p-2 text-left">Gross Weight (kg)</th>
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
                <EditableField field="packaging1" defaultValue="Single-layer cartons" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="units1" defaultValue="6 per carton, 75 cartons" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="netWeight1" defaultValue="8,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="grossWeight1" defaultValue="8,300" />
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
                <EditableField field="packaging2" defaultValue="5kg cartons" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="units2" defaultValue="70 cartons" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="netWeight2" defaultValue="3,500" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="grossWeight2" defaultValue="3,700" />
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
                <EditableField field="packaging3" defaultValue="2kg clamshells, 12 per carton" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="units3" defaultValue="90 cartons" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="netWeight3" defaultValue="5,000" />
              </td>
              <td className="border border-gray-300 p-2">
                <EditableField field="grossWeight3" defaultValue="5,250" />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-amber-50">
              <td colSpan="4" className="border border-gray-300 p-2 font-bold text-right">Total:</td>
              <td className="border border-gray-300 p-2 font-bold">
                <EditableField field="totalNetWeight" defaultValue="16,500" />
              </td>
              <td className="border border-gray-300 p-2 font-bold">
                <EditableField field="totalGrossWeight" defaultValue="17,250" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Temperature & Handling Requirements */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">TEMPERATURE & HANDLING REQUIREMENTS</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Pineapples:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="pineapplesTemp" 
                defaultValue="Storage temp: 8-10°C
Humidity: 85-90%
Pre-cooling: Required
Shelf life: 14 days
Stack height: Max 4 cartons" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Hot Peppers:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="peppersTemp" 
                defaultValue="Storage temp: 7-10°C
Humidity: 90-95%
Pre-cooling: Required
Shelf life: 10-14 days
Ventilation: Essential" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Passion Fruits:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="passionFruitTemp" 
                defaultValue="Storage temp: 8-12°C
Humidity: 85-90%
Pre-cooling: Required
Shelf life: 21-28 days
Handle with care" 
                isMultiline={true}
              />
            </div>
          </div>
        </div>
        <div className="border rounded p-3 bg-amber-50">
          <p className="font-semibold">Critical Temperature Control Points:</p>
          <div className={editMode ? "space-y-2" : ""}>
            <EditableField 
              field="temperatureControl" 
              defaultValue="1. Pre-cooling completed at origin packhouse to core temperature of 8-10°C.
2. Temperature-controlled transport from packhouse to airport maintained at 8-10°C.
3. Maximum 2-hour break in cold chain allowed during airport handling.
4. Aircraft hold temperature to be set at 8°C.
5. Temperature loggers placed in 6 different positions within the shipment.
6. Threshold alarm set at below 5°C and above 13°C." 
              isMultiline={true}
            />
          </div>
        </div>
      </div>

      {/* Quality Specifications */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">QUALITY SPECIFICATIONS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-semibold">Pineapples:</p>
              <div className={editMode ? "space-y-2" : ""}>
                <EditableField 
                  field="pineapplesQuality" 
                  defaultValue="Maturity: 1/4 to 1/2 shell color
Brix level: min 13°
Size: 6-8 fruits per carton
Free from damage and decay
Crowns intact and green" 
                  isMultiline={true}
                />
              </div>
            </div>
            <div>
              <p className="font-semibold">Hot Peppers:</p>
              <div className={editMode ? "space-y-2" : ""}>
                <EditableField 
                  field="peppersQuality" 
                  defaultValue="Bright, firm, well-formed
Free from damage and decay
Size: 4-6 cm in length
Color: Consistent bright red
Stems intact" 
                  isMultiline={true}
                />
              </div>
            </div>
            <div>
              <p className="font-semibold">Passion Fruits:</p>
              <div className={editMode ? "space-y-2" : ""}>
                <EditableField 
                  field="passionFruitQuality" 
                  defaultValue="Maturity: 80-100%
Size: 45-65mm diameter
Weight: 40-60g each
Smooth skin, minimal wrinkles
Color: Deep purple" 
                  isMultiline={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates & Required Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">CERTIFICATES & DOCUMENTS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Required Documents:</p>
            <ul className="text-sm list-disc ml-5">
              <li>Phytosanitary Certificate</li>
              <li>Certificate of Origin</li>
              <li>GLOBALG.A.P. Certificate</li>
              <li>Quality Inspection Report</li>
              <li>Temperature Records (pre-loading)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Additional Documents:</p>
            <ul className="text-sm list-disc ml-5">
              <li>Air Waybill</li>
              <li>Commercial Invoice</li>
              <li>Packing List</li>
              <li>Export Permit</li>
              <li>Customs Declaration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Shipment Timeline */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">SHIPMENT TIMELINE</h3>
        <div className="border rounded p-3 bg-gray-50">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-amber-100">
                <th className="border border-gray-300 p-2 text-left">Activity</th>
                <th className="border border-gray-300 p-2 text-left">Date</th>
                <th className="border border-gray-300 p-2 text-left">Time</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="activity1" defaultValue="Harvest Completion" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date1" defaultValue="2024-04-17" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="time1" defaultValue="14:00" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status1" defaultValue="Completed" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes1" defaultValue="All products harvested in optimal conditions" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="activity2" defaultValue="Packhouse Processing" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date2" defaultValue="2024-04-17" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="time2" defaultValue="16:00-22:00" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status2" defaultValue="Completed" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes2" defaultValue="Pre-cooling initiated immediately" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="activity3" defaultValue="Quality Inspection" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date3" defaultValue="2024-04-18" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="time3" defaultValue="09:00" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status3" defaultValue="Approved" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes3" defaultValue="All products meet quality specifications" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="activity4" defaultValue="Delivery to Airport" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date4" defaultValue="2024-04-18" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="time4" defaultValue="18:00" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status4" defaultValue="Completed" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes4" defaultValue="Refrigerated transport used" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="activity5" defaultValue="Flight Departure" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date5" defaultValue="2024-04-18" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="time5" defaultValue="23:45" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status5" defaultValue="Scheduled" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes5" defaultValue="On-time departure expected" />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <EditableField field="activity6" defaultValue="Arrival at Destination" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="date6" defaultValue="2024-04-19" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="time6" defaultValue="07:30" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="status6" defaultValue="Scheduled" />
                </td>
                <td className="border border-gray-300 p-2">
                  <EditableField field="notes6" defaultValue="Customs clearance arranged" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">SPECIAL INSTRUCTIONS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className={editMode ? "space-y-2" : ""}>
            <EditableField 
              field="specialInstructions" 
              defaultValue="1. PRIORITY HANDLING REQUIRED - Perishable cargo.
2. Cold chain must be maintained throughout transit.
3. Pallets must not be broken down during transit.
4. Temperature loggers to be checked upon arrival.
5. In case of flight delay exceeding 4 hours, move cargo to refrigerated storage.
6. Notify shipper immediately of any temperature excursions.
7. Handle with care - fragile produce.
8. Keep away from ethylene-producing products." 
              isMultiline={true}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">CONTACT INFORMATION</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Shipper Emergency Contact:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="shipperEmergencyContact" 
                defaultValue="KAJON Coffee Limited
Fresh Produce Division
Contact: Michael Okello
Email: freshproduce@kajoncoffee.com
Phone: +256 776 345678
Available 24/7 for urgent matters" 
                isMultiline={true}
              />
            </div>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Cargo Handler Contacts:</p>
            <div className={editMode ? "space-y-2" : ""}>
              <EditableField 
                field="cargoHandlerContact" 
                defaultValue="Origin: FreshLink Cargo Services
Entebbe Airport
Contact: +256 414 123456

Destination: Perishable Handling Ltd
Heathrow Airport
Contact: +44 208 745 1234" 
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
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">ACCEPTED BY (CARRIER)</p>
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

export default FreshProduceShipmentTemplate;
