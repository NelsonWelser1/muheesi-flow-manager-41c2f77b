
import React from 'react';

const FreshProduceTemplate = () => {
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
          <h1 className="text-2xl font-bold text-amber-700">FRESH PRODUCE EXPORT CONTRACT</h1>
          <p className="text-sm text-gray-600 mt-2">Contract #: KCL-FP-2024-[XXXX]</p>
          <p className="text-sm text-gray-600">Date: [Current Date]</p>
        </div>
      </div>

      {/* Parties */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">PARTIES</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r pr-4">
            <h4 className="font-semibold">SELLER:</h4>
            <p className="text-sm">KAJON Coffee Limited</p>
            <p className="text-sm">Kampala, Uganda</p>
            <p className="text-sm">Registration #: UG2023786541</p>
          </div>
          <div>
            <h4 className="font-semibold">BUYER:</h4>
            <p className="text-sm">[Buyer Company Name]</p>
            <p className="text-sm">[Buyer Address]</p>
            <p className="text-sm">[Buyer Registration #]</p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">PRODUCT DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-left">Variety</th>
              <th className="border border-gray-300 p-2 text-left">Quantity (Kg)</th>
              <th className="border border-gray-300 p-2 text-left">Grade/Size</th>
              <th className="border border-gray-300 p-2 text-left">Price per Kg</th>
              <th className="border border-gray-300 p-2 text-left">Total Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Pineapples</td>
              <td className="border border-gray-300 p-2">Sweet Gold</td>
              <td className="border border-gray-300 p-2">8,000</td>
              <td className="border border-gray-300 p-2">Grade A, Size 7-8</td>
              <td className="border border-gray-300 p-2">USD 1.15</td>
              <td className="border border-gray-300 p-2">USD 9,200.00</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Hot Peppers</td>
              <td className="border border-gray-300 p-2">Scotch Bonnet</td>
              <td className="border border-gray-300 p-2">3,500</td>
              <td className="border border-gray-300 p-2">Export Quality</td>
              <td className="border border-gray-300 p-2">USD 2.40</td>
              <td className="border border-gray-300 p-2">USD 8,400.00</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Passion Fruits</td>
              <td className="border border-gray-300 p-2">Purple Granadilla</td>
              <td className="border border-gray-300 p-2">5,000</td>
              <td className="border border-gray-300 p-2">Grade A</td>
              <td className="border border-gray-300 p-2">USD 2.80</td>
              <td className="border border-gray-300 p-2">USD 14,000.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-amber-50">
              <td colSpan="5" className="border border-gray-300 p-2 font-bold text-right">Total Contract Value:</td>
              <td className="border border-gray-300 p-2 font-bold">USD 31,600.00</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Quality & Packaging Specifications */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">QUALITY & PACKAGING SPECIFICATIONS</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Pineapples:</p>
            <ul className="text-sm list-disc pl-4">
              <li>Maturity: 1/4 to 1/2 shell color</li>
              <li>Brix level: min 13°</li>
              <li>Free from damage and decay</li>
              <li>Packaging: Single-layer cartons</li>
              <li>Units per carton: 6-8 based on size</li>
            </ul>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Hot Peppers:</p>
            <ul className="text-sm list-disc pl-4">
              <li>Bright, firm, well-formed</li>
              <li>Free from damage and decay</li>
              <li>Size: 4-6 cm in length</li>
              <li>Packaging: 5kg cartons</li>
              <li>Lined with perforated plastic</li>
            </ul>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Passion Fruits:</p>
            <ul className="text-sm list-disc pl-4">
              <li>Maturity: 80-100%</li>
              <li>Size: 45-65mm diameter</li>
              <li>Smooth skin, minimal wrinkles</li>
              <li>Packaging: 2kg plastic clamshells</li>
              <li>12 clamshells per carton</li>
            </ul>
          </div>
        </div>
        <p className="text-sm mt-4 font-semibold">Special Packaging Requirements:</p>
        <ul className="text-sm list-disc pl-4">
          <li>All cartons to be food-grade and sturdy enough for air transport</li>
          <li>Temperature indicators to be placed in each pallet</li>
          <li>Each carton to be labeled with product details, traceability code, and handling instructions</li>
          <li>All packaging materials must comply with EU packaging regulations</li>
        </ul>
      </div>

      {/* Temperature & Handling Requirements */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">TEMPERATURE & HANDLING REQUIREMENTS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-semibold">Pineapples:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Storage temp: 8-10°C</li>
                <li>Humidity: 85-90%</li>
                <li>Shelf life at proper temp: 14 days</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Hot Peppers:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Storage temp: 7-10°C</li>
                <li>Humidity: 90-95%</li>
                <li>Shelf life at proper temp: 10-14 days</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">Passion Fruits:</p>
              <ul className="text-sm list-disc pl-4">
                <li>Storage temp: 8-12°C</li>
                <li>Humidity: 85-90%</li>
                <li>Shelf life at proper temp: 21-28 days</li>
              </ul>
            </div>
          </div>
          <p className="text-sm mt-4">
            Seller shall ensure proper pre-cooling prior to loading. Cold chain must be maintained throughout
            the transport process. Temperature loggers will be included with each pallet.
          </p>
        </div>
      </div>

      {/* Shipping & Logistics */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">SHIPPING & LOGISTICS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Shipping Method:</p>
            <p className="text-sm">Air Freight</p>
            
            <p className="font-semibold mt-2">Departure Airport:</p>
            <p className="text-sm">Entebbe International Airport, Uganda</p>
            
            <p className="font-semibold mt-2">Transit Time:</p>
            <p className="text-sm">24-48 hours from departure</p>
          </div>
          <div>
            <p className="font-semibold">Incoterm:</p>
            <p className="text-sm">CIP London Heathrow</p>
            
            <p className="font-semibold mt-2">Shipment Schedule:</p>
            <p className="text-sm">Every Tuesday and Friday</p>
            
            <p className="font-semibold mt-2">First Shipment Date:</p>
            <p className="text-sm">August 15, 2024</p>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">PAYMENT TERMS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <ul className="text-sm list-disc pl-4">
            <li>First shipment: 100% payment upon receipt and inspection at destination</li>
            <li>Subsequent shipments: 50% advance payment, 50% within 7 days of receipt</li>
            <li>Payment by telegraphic transfer to seller's designated account</li>
            <li>All bank charges outside Uganda to be borne by the buyer</li>
            <li>Late payment subject to 1.5% interest per month on outstanding amount</li>
          </ul>
        </div>
      </div>

      {/* Certificates & Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">CERTIFICATES & REQUIRED DOCUMENTS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ul className="text-sm list-disc pl-4">
              <li>Certificate of Origin</li>
              <li>Phytosanitary Certificate</li>
              <li>GLOBALG.A.P. Certificate</li>
              <li>Packing List</li>
            </ul>
          </div>
          <div>
            <ul className="text-sm list-disc pl-4">
              <li>Commercial Invoice</li>
              <li>Airway Bill</li>
              <li>Quality Inspection Report</li>
              <li>Temperature Log Records</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Claims & Returns */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-amber-700">CLAIMS & RETURNS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <p className="text-sm">
            Any claims related to quality must be made within 24 hours of receipt by the buyer. Claims must be substantiated with photographic evidence and inspection reports. The buyer must segregate any rejected product for possible inspection by the seller's representative or a third-party surveyor.
          </p>
          <p className="text-sm mt-2">
            If quality defects are proven to be the responsibility of the seller, either replacement or credit note will be provided at seller's discretion. Transportation failures (temperature breaches) documented by temperature loggers will be covered by insurance.
          </p>
        </div>
      </div>

      {/* General Terms & Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-amber-700">GENERAL TERMS & CONDITIONS</h3>
        <ol className="text-sm list-decimal pl-4">
          <li>This contract is governed by the laws of Uganda.</li>
          <li>Any dispute arising out of this contract shall be settled by arbitration in London under ICC rules.</li>
          <li>Force Majeure clause applies for events beyond reasonable control of either party.</li>
          <li>The contract may be terminated by either party with 30 days written notice.</li>
          <li>Any amendments to this contract must be in writing and signed by both parties.</li>
          <li>This contract represents the entire agreement between the parties.</li>
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

export default FreshProduceTemplate;
