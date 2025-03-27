
import React from 'react';

const GeneralProduceTemplate = () => {
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
          <h1 className="text-2xl font-bold text-green-800">GENERAL PRODUCE EXPORT CONTRACT</h1>
          <p className="text-sm text-gray-600 mt-2">Contract #: KCL-GP-2024-[XXXX]</p>
          <p className="text-sm text-gray-600">Date: [Current Date]</p>
        </div>
      </div>

      {/* Parties */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">PARTIES</h3>
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
        <h3 className="text-lg font-bold mb-2 text-green-800">PRODUCT DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-left">Origin</th>
              <th className="border border-gray-300 p-2 text-left">Quantity (MT)</th>
              <th className="border border-gray-300 p-2 text-left">Grade/Type</th>
              <th className="border border-gray-300 p-2 text-left">Price per MT</th>
              <th className="border border-gray-300 p-2 text-left">Total Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Sesame Seeds</td>
              <td className="border border-gray-300 p-2">Northern Uganda</td>
              <td className="border border-gray-300 p-2">25</td>
              <td className="border border-gray-300 p-2">Hulled White</td>
              <td className="border border-gray-300 p-2">USD 1,850</td>
              <td className="border border-gray-300 p-2">USD 46,250.00</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Soybean</td>
              <td className="border border-gray-300 p-2">Eastern Uganda</td>
              <td className="border border-gray-300 p-2">35</td>
              <td className="border border-gray-300 p-2">Grade A</td>
              <td className="border border-gray-300 p-2">USD 950</td>
              <td className="border border-gray-300 p-2">USD 33,250.00</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Maize</td>
              <td className="border border-gray-300 p-2">Central Uganda</td>
              <td className="border border-gray-300 p-2">50</td>
              <td className="border border-gray-300 p-2">Grade 1</td>
              <td className="border border-gray-300 p-2">USD 480</td>
              <td className="border border-gray-300 p-2">USD 24,000.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-green-50">
              <td colSpan="5" className="border border-gray-300 p-2 font-bold text-right">Total Contract Value:</td>
              <td className="border border-gray-300 p-2 font-bold">USD 103,500.00</td>
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
            <ul className="text-sm list-disc pl-4">
              <li>Moisture content: max 8%</li>
              <li>Purity: min 99.5%</li>
              <li>Foreign matter: max 0.5%</li>
              <li>Oil content: min 50%</li>
              <li>Free from live insects</li>
            </ul>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Soybean:</p>
            <ul className="text-sm list-disc pl-4">
              <li>Moisture content: max 12%</li>
              <li>Foreign matter: max 1%</li>
              <li>Damaged beans: max 2%</li>
              <li>Protein content: min 36%</li>
              <li>Free from GMO</li>
            </ul>
          </div>
          <div className="border rounded p-3 bg-gray-50">
            <p className="font-semibold">Maize:</p>
            <ul className="text-sm list-disc pl-4">
              <li>Moisture content: max 13.5%</li>
              <li>Foreign matter: max 1%</li>
              <li>Broken kernels: max 3%</li>
              <li>Discolored: max 2%</li>
              <li>Aflatoxin: max 10 ppb</li>
            </ul>
          </div>
        </div>
        <p className="text-sm">
          Quality to be verified by an independent surveyor at loading point. Both parties may appoint representatives to witness quality inspection.
        </p>
      </div>

      {/* Shipping Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">SHIPPING TERMS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Incoterm:</p>
            <p className="text-sm">CIF Rotterdam</p>
            
            <p className="font-semibold mt-2">Packaging:</p>
            <p className="text-sm">25kg/50kg polypropylene bags in container</p>
            
            <p className="font-semibold mt-2">Loading Port:</p>
            <p className="text-sm">Mombasa, Kenya</p>
          </div>
          <div>
            <p className="font-semibold">Destination:</p>
            <p className="text-sm">Rotterdam, Netherlands</p>
            
            <p className="font-semibold mt-2">Latest Shipment Date:</p>
            <p className="text-sm">November 30, 2024</p>
            
            <p className="font-semibold mt-2">Delivery Timeline:</p>
            <p className="text-sm">35-50 days from loading</p>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">PAYMENT TERMS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <ul className="text-sm list-disc pl-4">
            <li>20% advance payment upon contract signing</li>
            <li>80% balance against presentation of shipping documents</li>
            <li>Payment by irrevocable Letter of Credit at sight</li>
            <li>L/C to be issued by buyer's bank within 14 days of contract signing</li>
            <li>L/C to be confirmed by Stanbic Bank, Kampala</li>
            <li>All banking charges outside Uganda to be borne by the Buyer</li>
          </ul>
        </div>
      </div>

      {/* Certificates & Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">CERTIFICATES & REQUIRED DOCUMENTS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ul className="text-sm list-disc pl-4">
              <li>Certificate of Origin</li>
              <li>Phytosanitary Certificate</li>
              <li>Weight Certificate</li>
              <li>Fumigation Certificate</li>
            </ul>
          </div>
          <div>
            <ul className="text-sm list-disc pl-4">
              <li>Quality/Inspection Certificate</li>
              <li>Packing List</li>
              <li>Commercial Invoice</li>
              <li>Bill of Lading</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Special Conditions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-800">SPECIAL CONDITIONS</h3>
        <div className="border rounded p-3 bg-gray-50">
          <ul className="text-sm list-disc pl-4">
            <li>Seller guarantees products are grown in compliance with Global GAP standards</li>
            <li>Products are certified free from GMO content</li>
            <li>Products comply with maximum residue limits (MRLs) as per EU regulations</li>
            <li>Organic certification provided where applicable</li>
            <li>Traceability information to be provided with shipment</li>
          </ul>
        </div>
      </div>

      {/* General Terms & Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-green-800">GENERAL TERMS & CONDITIONS</h3>
        <ol className="text-sm list-decimal pl-4">
          <li>This contract is governed by the laws of Uganda.</li>
          <li>Any dispute arising out of this contract shall be settled by arbitration in Kampala under UNCITRAL rules.</li>
          <li>Force Majeure clause applies for events beyond reasonable control of either party.</li>
          <li>Seller guarantees the produce is free from any liens and encumbrances.</li>
          <li>Title and risk pass to Buyer as per the agreed Incoterms.</li>
          <li>Any amendments to this contract must be in writing and signed by both parties.</li>
          <li>This contract supersedes all prior agreements and represents the entire agreement between parties.</li>
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

export default GeneralProduceTemplate;
