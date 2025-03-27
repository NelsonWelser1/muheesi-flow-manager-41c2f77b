
import React from 'react';

const CoffeeContractTemplate = () => {
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
          <p className="text-sm text-gray-600 mt-2">Contract #: KCL-2024-[XXXX]</p>
          <p className="text-sm text-gray-600">Date: [Current Date]</p>
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
            <p className="text-sm">[Buyer Company Name]</p>
            <p className="text-sm">[Buyer Address]</p>
            <p className="text-sm">[Buyer Registration #]</p>
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
              <td className="border border-gray-300 p-2">Arabica Coffee Beans</td>
              <td className="border border-gray-300 p-2">Kazo, Uganda</td>
              <td className="border border-gray-300 p-2">18,000</td>
              <td className="border border-gray-300 p-2">Screen 18, AA</td>
              <td className="border border-gray-300 p-2">USD 5.86</td>
              <td className="border border-gray-300 p-2">USD 105,480.00</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Robusta Coffee Beans</td>
              <td className="border border-gray-300 p-2">Kanoni, Uganda</td>
              <td className="border border-gray-300 p-2">7,000</td>
              <td className="border border-gray-300 p-2">Screen 15</td>
              <td className="border border-gray-300 p-2">USD 4.63</td>
              <td className="border border-gray-300 p-2">USD 32,410.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-blue-50">
              <td colSpan="5" className="border border-gray-300 p-2 font-bold text-right">Total Contract Value:</td>
              <td className="border border-gray-300 p-2 font-bold">USD 137,890.00</td>
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
            <ul className="text-sm list-disc pl-4">
              <li>Moisture content: 10-12%</li>
              <li>Defect count: Max 5 per 300g</li>
              <li>Cup score: 84+ points</li>
              <li>Processing: Fully washed</li>
              <li>Flavor profile: Citrus, floral, medium body</li>
            </ul>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Robusta (Screen 15):</p>
            <ul className="text-sm list-disc pl-4">
              <li>Moisture content: 11-13%</li>
              <li>Defect count: Max 15 per 300g</li>
              <li>Cup score: 80+ points</li>
              <li>Processing: Natural</li>
              <li>Flavor profile: Chocolate, nutty, full body</li>
            </ul>
          </div>
        </div>
        <p className="text-sm">
          Quality to be verified by SGS or equivalent third-party inspector at loading. Buyer has the right to reject shipment if quality parameters are not met.
        </p>
      </div>

      {/* Shipping Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">SHIPPING TERMS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Incoterm:</p>
            <p className="text-sm">FOB Mombasa</p>
            
            <p className="font-semibold mt-2">Packaging:</p>
            <p className="text-sm">60kg jute bags with GrainPro liners</p>
            
            <p className="font-semibold mt-2">Loading Port:</p>
            <p className="text-sm">Mombasa, Kenya</p>
          </div>
          <div>
            <p className="font-semibold">Destination:</p>
            <p className="text-sm">Hamburg, Germany</p>
            
            <p className="font-semibold mt-2">Latest Shipment Date:</p>
            <p className="text-sm">October 15, 2024</p>
            
            <p className="font-semibold mt-2">Delivery Timeline:</p>
            <p className="text-sm">30-45 days from loading</p>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">PAYMENT TERMS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <ul className="text-sm list-disc pl-4">
            <li>30% advance payment upon contract signing</li>
            <li>70% balance payment by irrevocable Letter of Credit at sight</li>
            <li>L/C to be issued by buyer's bank within 14 days of contract signing</li>
            <li>L/C to be confirmed by Standard Chartered Bank, Kampala</li>
            <li>All banking charges outside Uganda to be borne by the Buyer</li>
          </ul>
        </div>
      </div>

      {/* Certificates & Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">CERTIFICATES & REQUIRED DOCUMENTS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ul className="text-sm list-disc pl-4">
              <li>Certificate of Origin</li>
              <li>Phytosanitary Certificate</li>
              <li>Weight Certificate</li>
              <li>Quality Certificate by SGS</li>
            </ul>
          </div>
          <div>
            <ul className="text-sm list-disc pl-4">
              <li>ICO Certificate</li>
              <li>Packing List</li>
              <li>Commercial Invoice</li>
              <li>Bill of Lading</li>
            </ul>
          </div>
        </div>
      </div>

      {/* General Terms & Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-blue-800">GENERAL TERMS & CONDITIONS</h3>
        <p className="text-sm mb-2">This contract is subject to the following terms:</p>
        <ol className="text-sm list-decimal pl-4">
          <li>This contract is governed by the laws of Uganda.</li>
          <li>Any dispute arising out of this contract shall be settled by arbitration in Kampala under the rules of the Uganda Center for Arbitration.</li>
          <li>Force Majeure clause applies for events beyond reasonable control of either party.</li>
          <li>Seller guarantees the produce is free from any liens and encumbrances.</li>
          <li>Neither party may assign this contract without prior written consent of the other party.</li>
          <li>Any amendments to this contract must be in writing and signed by both parties.</li>
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

export default CoffeeContractTemplate;
