import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const ProformaInvoiceTemplate = ({ data }) => {
  console.log('Rendering ProformaInvoiceTemplate with data:', data);
  
  return (
    <Card className="w-full bg-white p-8 print:shadow-none">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Company name</h1>
            <p className="text-sm text-gray-600">My company slogan</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[#003366]">PRO FORMA INVOICE</h2>
            <div className="text-sm mt-2">
              <p>Page: 1 of 1</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Date of Expiry: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
              <p>Invoice #: {data?.invoiceNumber || '[TBD]'}</p>
              <p>Customer ID: {data?.customerId || '[ABC12345]'}</p>
            </div>
          </div>
        </div>

        {/* Bill To & Ship To Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="bg-[#003366] text-white px-4 py-2 mb-2">
              <h3 className="font-bold">Bill To:</h3>
            </div>
            <div className="text-sm space-y-1 px-4">
              <p>[Company Name]</p>
              <p>[Street Address]</p>
              <p>[City, ST ZIP Code]</p>
              <p>[Phone]</p>
            </div>
          </div>
          <div>
            <div className="bg-[#003366] text-white px-4 py-2 mb-2">
              <h3 className="font-bold">Ship To:</h3>
            </div>
            <div className="text-sm space-y-1 px-4">
              <p>[Company Name]</p>
              <p>[Street Address]</p>
              <p>[City, ST ZIP Code]</p>
              <p>[Phone]</p>
            </div>
          </div>
        </div>

        {/* Shipment Information */}
        <div className="mb-8">
          <div className="bg-[#003366] text-white px-4 py-2 mb-2">
            <h3 className="font-bold">Shipment Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 px-4">
              <div className="flex">
                <span className="w-32">P.O. #:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
              <div className="flex">
                <span className="w-32">P.O. Date:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
              <div className="flex">
                <span className="w-32">Letter of Credit #:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
              <div className="flex">
                <span className="w-32">Currency:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
              <div className="flex">
                <span className="w-32">Payment Terms:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
              <div className="flex">
                <span className="w-32">Est. Ship Date:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
            </div>
            <div className="space-y-2 px-4">
              <div className="flex">
                <span className="w-40">Mode of Transportation:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
              <div className="flex">
                <span className="w-40">Transportation Terms:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
              <div className="flex">
                <span className="w-40">Number of Packages:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
              <div className="flex">
                <span className="w-40">Est. Gross Weight:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
              <div className="flex">
                <span className="w-40">Carrier:</span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <div className="bg-[#003366] text-white px-4 py-2 mb-2">
            <h3 className="font-bold">Additional Information for Customs</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm px-4">
            <div className="flex">
              <span className="w-32">Port of Embarkation:</span>
              <span className="border-b border-gray-300 flex-1"></span>
            </div>
            <div className="flex">
              <span className="w-32">Port of Discharge:</span>
              <span className="border-b border-gray-300 flex-1"></span>
            </div>
            <div className="flex">
              <span className="w-32">Country of Origin:</span>
              <span className="border-b border-gray-300 flex-1"></span>
            </div>
            <div className="flex">
              <span className="w-32">AWBBL #:</span>
              <span className="border-b border-gray-300 flex-1"></span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#003366] text-white">
                <th className="py-2 px-4 text-left">Item/Part #</th>
                <th className="py-2 px-4 text-left">UOM</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Unit Price</th>
                <th className="py-2 px-4 text-right">Qty</th>
                <th className="py-2 px-4 text-right">Sales Tax</th>
                <th className="py-2 px-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">0014</td>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4 text-right">50.00</td>
                <td className="py-2 px-4 text-right">15</td>
                <td className="py-2 px-4 text-right"></td>
                <td className="py-2 px-4 text-right">150.00</td>
              </tr>
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="bg-[#003366] text-white px-4 py-2 mb-2">
              <h3 className="font-bold">Special Notes, Terms of Sale</h3>
            </div>
            <div className="border min-h-[100px] p-4"></div>
            <div className="mt-4">
              <p className="text-sm mb-4">I declare that the information mentioned above is true and correct to the best of my knowledge.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm mb-1">Signature</p>
                  <div className="border-b border-gray-300 h-8"></div>
                </div>
                <div>
                  <p className="text-sm mb-1">Date</p>
                  <div className="border-b border-gray-300 h-8"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>$ 200.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Subject to Sales Tax</span>
              <span>$ 50.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sales Tax Rate</span>
              <span>% 0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sales Tax</span>
              <span>$ -</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>S & H</span>
              <span>$ 10.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Insurance</span>
              <span>$ -</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>[Other] specify</span>
              <span>$ -</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>[Other] specify</span>
              <span>$ -</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>[Other] specify</span>
              <span>$ -</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t">
              <span>Total</span>
              <span>$ 210.00</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center text-sm mt-8 space-y-2 text-gray-600">
          <p>Should you have any enquiries concerning this invoice, please contact John Doe on 0-000-000-0000</p>
          <p>111 Street, Town/City, County, ST, 00000</p>
          <p>Tel: 0-000-000-0000 Fax: 0-000-000-0000 Email: info@yourcompanysite.com Web: www.yourcompanysite.com</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProformaInvoiceTemplate;