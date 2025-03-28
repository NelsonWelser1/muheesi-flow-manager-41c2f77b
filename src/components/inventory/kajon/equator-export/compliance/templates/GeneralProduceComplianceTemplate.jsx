
import React from 'react';

const GeneralProduceComplianceTemplate = ({ isEditing, documentData }) => {
  // Sample data to display in the template
  const companyInfo = {
    name: "KAJON Coffee Limited",
    address: "123 Coffee Way, Kampala, Uganda",
    phone: "+256 782 123456",
    email: "info@kajoncoffee.com",
    website: "www.kajoncoffee.com"
  };

  const sampleShipmentData = {
    documentNumber: "INV-2024-0432",
    contractReference: "CTR-2024-0128",
    buyer: "Global Foods Imports Ltd.",
    buyerAddress: "14 Market Street, Rotterdam, Netherlands",
    shipmentDate: "15-Apr-2024",
    portOfLoading: "Mombasa, Kenya",
    portOfDischarge: "Rotterdam, Netherlands",
    incoterm: "FOB Mombasa",
    paymentTerms: "Letter of Credit at 60 days"
  };

  const sampleItems = [
    { description: "Robusta Coffee Beans AA", quantity: "180", unit: "60kg bags", unitPrice: "4.20", amount: "45,360.00" },
    { description: "Arabica Coffee Beans SB", quantity: "120", unit: "60kg bags", unitPrice: "5.65", amount: "40,680.00" }
  ];

  return (
    <div className="general-produce-document">
      {/* Header with logo and document title */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center">
          {/* You can add a company logo here */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
            LOGO
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-green-800">
              {isEditing ? (
                <input 
                  type="text" 
                  className="editable-field border px-2 py-1 w-full" 
                  defaultValue={documentData.title || "Commercial Invoice"}
                />
              ) : (
                documentData.title || "Commercial Invoice"
              )}
            </h1>
            <p className="text-sm text-gray-600">{companyInfo.name}</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p><strong>Invoice No:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleShipmentData.documentNumber} /> : sampleShipmentData.documentNumber}</p>
          <p><strong>Date:</strong> {isEditing ? <input type="date" className="editable-field border px-2 py-1" defaultValue="2024-04-01" /> : "01-Apr-2024"}</p>
          <p><strong>Contract Ref:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleShipmentData.contractReference} /> : sampleShipmentData.contractReference}</p>
        </div>
      </div>

      {/* Company and Buyer Information */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-green-700">Exporter</h2>
          <p><strong>Company:</strong> {companyInfo.name}</p>
          <p><strong>Address:</strong> {companyInfo.address}</p>
          <p><strong>Phone:</strong> {companyInfo.phone}</p>
          <p><strong>Email:</strong> {companyInfo.email}</p>
          <p><strong>Tax ID:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="TAX-12345-UG" /> : "TAX-12345-UG"}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-green-700">Buyer</h2>
          <p><strong>Company:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={sampleShipmentData.buyer} /> : sampleShipmentData.buyer}</p>
          <p><strong>Address:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={sampleShipmentData.buyerAddress} /> : sampleShipmentData.buyerAddress}</p>
          <p><strong>Contact:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="+31 10 123 4567" /> : "+31 10 123 4567"}</p>
          <p><strong>Email:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="orders@globalfoods.nl" /> : "orders@globalfoods.nl"}</p>
          <p><strong>Tax ID:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="NL002123456B01" /> : "NL002123456B01"}</p>
        </div>
      </div>

      {/* Shipment Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-green-700">Shipment Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Shipment Date:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleShipmentData.shipmentDate} /> : sampleShipmentData.shipmentDate}</p>
            <p><strong>Port of Loading:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleShipmentData.portOfLoading} /> : sampleShipmentData.portOfLoading}</p>
            <p><strong>Port of Discharge:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleShipmentData.portOfDischarge} /> : sampleShipmentData.portOfDischarge}</p>
          </div>
          <div>
            <p><strong>Incoterm:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleShipmentData.incoterm} /> : sampleShipmentData.incoterm}</p>
            <p><strong>Payment Terms:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleShipmentData.paymentTerms} /> : sampleShipmentData.paymentTerms}</p>
            <p><strong>Currency:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="USD" /> : "USD"}</p>
          </div>
        </div>
      </div>

      {/* Shipment Items */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-green-700">Invoice Items</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50">
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Quantity</th>
              <th className="border p-2 text-left">Unit</th>
              <th className="border p-2 text-right">Unit Price (USD)</th>
              <th className="border p-2 text-right">Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            {sampleItems.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={item.description} /> : item.description}
                </td>
                <td className="border p-2">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={item.quantity} /> : item.quantity}
                </td>
                <td className="border p-2">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={item.unit} /> : item.unit}
                </td>
                <td className="border p-2 text-right">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full text-right" defaultValue={item.unitPrice} /> : item.unitPrice}
                </td>
                <td className="border p-2 text-right">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full text-right" defaultValue={item.amount} /> : item.amount}
                </td>
              </tr>
            ))}
            {isEditing && (
              <tr>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Add item description..." />
                </td>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Quantity" />
                </td>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Unit" />
                </td>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full text-right" placeholder="0.00" />
                </td>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full text-right" placeholder="0.00" />
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-green-50">
              <td colSpan="3" className="border p-2 text-right"><strong>Total:</strong></td>
              <td colSpan="2" className="border p-2 text-right">
                {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full text-right" defaultValue="86,040.00" /> : "USD 86,040.00"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Bank Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-green-700">Banking Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Bank Name:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Uganda International Bank" /> : "Uganda International Bank"}</p>
            <p><strong>Account Name:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="KAJON Coffee Limited" /> : "KAJON Coffee Limited"}</p>
            <p><strong>Account No:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="01234567890" /> : "01234567890"}</p>
          </div>
          <div>
            <p><strong>SWIFT/BIC:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="UGINTBKXXX" /> : "UGINTBKXXX"}</p>
            <p><strong>IBAN:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="UG12 UGIB 1234 5678 9012 34" /> : "UG12 UGIB 1234 5678 9012 34"}</p>
            <p><strong>Bank Address:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="25 Finance Blvd, Kampala, Uganda" /> : "25 Finance Blvd, Kampala, Uganda"}</p>
          </div>
        </div>
      </div>

      {/* Declaration */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-green-700">Declaration</h2>
        {isEditing ? (
          <textarea
            className="editable-field border px-2 py-1 w-full h-20"
            defaultValue="We hereby certify that this invoice shows the actual price of the goods described, that no other invoice has been or will be issued, and that all particulars are true and correct."
          />
        ) : (
          <p>We hereby certify that this invoice shows the actual price of the goods described, that no other invoice has been or will be issued, and that all particulars are true and correct.</p>
        )}
      </div>

      {/* Signature */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-green-700">Authorized Signatory</h2>
        <div className="h-16 mb-2 border-b border-black"></div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Sarah Kimani" /> : "Sarah Kimani"}</p>
            <p><strong>Position:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Export Manager" /> : "Export Manager"}</p>
          </div>
          <div>
            <p><strong>Date:</strong> {isEditing ? <input type="date" className="editable-field border px-2 py-1" defaultValue="2024-04-01" /> : "01-Apr-2024"}</p>
            <p><strong>Place:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Kampala, Uganda" /> : "Kampala, Uganda"}</p>
          </div>
        </div>
      </div>

      {/* Stamp/Seal */}
      <div className="text-right mb-4">
        <div className="inline-block border-2 border-green-700 rounded-full p-6 mb-2">
          <p className="font-bold text-green-700">COMPANY SEAL</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
        <p>This document is electronically generated and valid without signature.</p>
        <p>{companyInfo.name} | {companyInfo.address} | {companyInfo.phone}</p>
        <p>Document ID: {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="INV-2024-0432-AUTH" /> : "INV-2024-0432-AUTH"}</p>
      </div>
    </div>
  );
};

export default GeneralProduceComplianceTemplate;
