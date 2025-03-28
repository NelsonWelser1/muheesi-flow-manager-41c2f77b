
import React from 'react';

const CoffeeComplianceTemplate = ({ isEditing, documentData }) => {
  // Sample data to display in the template
  const companyInfo = {
    name: "KAJON Coffee Limited",
    address: "123 Coffee Way, Kampala, Uganda",
    phone: "+256 782 123456",
    email: "info@kajoncoffee.com",
    website: "www.kajoncoffee.com"
  };

  const sampleCoffeeData = {
    batchNumber: "BATCH-2024-0568",
    variety: "Arabica - Bourbon",
    grade: "AA",
    origin: "Mount Elgon, Uganda",
    harvestDate: "March 2024",
    processingMethod: "Fully Washed",
    flavorProfile: "Bright acidity with notes of citrus, caramel, and blackberry",
    certifications: ["Organic", "Rainforest Alliance", "Fair Trade"],
    screenSize: "16+",
    moisture: "10.5%",
    density: "0.68 g/ml"
  };

  return (
    <div className="coffee-certificate">
      {/* Header with logo and certificate title */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center">
          {/* You can add a company logo here */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            LOGO
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-blue-800">
              {isEditing ? (
                <input 
                  type="text" 
                  className="editable-field border px-2 py-1 w-full" 
                  defaultValue={documentData.title || "Coffee Certificate of Origin"}
                />
              ) : (
                documentData.title || "Coffee Certificate of Origin"
              )}
            </h1>
            <p className="text-sm text-gray-600">{companyInfo.name}</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p><strong>Certificate No:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="COO-2024-0123" /> : "COO-2024-0123"}</p>
          <p><strong>Issue Date:</strong> {isEditing ? <input type="date" className="editable-field border px-2 py-1" defaultValue="2024-03-26" /> : "26-Mar-2024"}</p>
          <p><strong>Valid Until:</strong> {isEditing ? <input type="date" className="editable-field border px-2 py-1" defaultValue="2025-03-26" /> : "26-Mar-2025"}</p>
        </div>
      </div>

      {/* Company Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">Company Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Company:</strong> {companyInfo.name}</p>
            <p><strong>Address:</strong> {companyInfo.address}</p>
            <p><strong>Contact:</strong> {companyInfo.phone}</p>
          </div>
          <div>
            <p><strong>Email:</strong> {companyInfo.email}</p>
            <p><strong>Website:</strong> {companyInfo.website}</p>
            <p><strong>Tax ID:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="TAX-12345-UG" /> : "TAX-12345-UG"}</p>
          </div>
        </div>
      </div>

      {/* Coffee Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">Product Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Product:</strong> {isEditing ? (
              <select className="editable-field border px-2 py-1">
                <option>Coffee Beans</option>
                <option>Green Coffee</option>
                <option>Roasted Coffee</option>
              </select>
            ) : "Coffee Beans"}</p>
            <p><strong>Variety:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleCoffeeData.variety} /> : sampleCoffeeData.variety}</p>
            <p><strong>Grade:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleCoffeeData.grade} /> : sampleCoffeeData.grade}</p>
            <p><strong>Origin:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleCoffeeData.origin} /> : sampleCoffeeData.origin}</p>
            <p><strong>Harvest Date:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleCoffeeData.harvestDate} /> : sampleCoffeeData.harvestDate}</p>
          </div>
          <div>
            <p><strong>Batch Number:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleCoffeeData.batchNumber} /> : sampleCoffeeData.batchNumber}</p>
            <p><strong>Processing:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleCoffeeData.processingMethod} /> : sampleCoffeeData.processingMethod}</p>
            <p><strong>Screen Size:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleCoffeeData.screenSize} /> : sampleCoffeeData.screenSize}</p>
            <p><strong>Moisture:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleCoffeeData.moisture} /> : sampleCoffeeData.moisture}</p>
            <p><strong>Density:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={sampleCoffeeData.density} /> : sampleCoffeeData.density}</p>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">Certifications</h2>
        {isEditing ? (
          <div className="flex flex-wrap gap-2">
            {["Organic", "Rainforest Alliance", "Fair Trade", "UTZ", "4C", "Direct Trade"].map(cert => (
              <label key={cert} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  defaultChecked={sampleCoffeeData.certifications.includes(cert)} 
                  className="rounded border-gray-300"
                />
                <span>{cert}</span>
              </label>
            ))}
          </div>
        ) : (
          <ul className="list-disc pl-5">
            {sampleCoffeeData.certifications.map(cert => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Flavor Profile */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">Flavor Profile</h2>
        {isEditing ? (
          <textarea
            className="editable-field border px-2 py-1 w-full h-20"
            defaultValue={sampleCoffeeData.flavorProfile}
          />
        ) : (
          <p>{sampleCoffeeData.flavorProfile}</p>
        )}
      </div>

      {/* Shipment Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">Shipment Information</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Quantity</th>
              <th className="border p-2 text-left">Net Weight</th>
              <th className="border p-2 text-left">Packaging</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">
                {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue="Green Coffee Beans" /> : "Green Coffee Beans"}
              </td>
              <td className="border p-2">
                {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue="320 Bags" /> : "320 Bags"}
              </td>
              <td className="border p-2">
                {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue="19,200 kg" /> : "19,200 kg"}
              </td>
              <td className="border p-2">
                {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue="60kg GrainPro Bags" /> : "60kg GrainPro Bags"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Declaration */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">Declaration</h2>
        {isEditing ? (
          <textarea
            className="editable-field border px-2 py-1 w-full h-20"
            defaultValue="We hereby certify that the coffee described above is of Uganda origin, produced and processed under our supervision according to international standards and complies with all export requirements of the Republic of Uganda."
          />
        ) : (
          <p>We hereby certify that the coffee described above is of Uganda origin, produced and processed under our supervision according to international standards and complies with all export requirements of the Republic of Uganda.</p>
        )}
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-blue-700">Authorized Signatory</h2>
          <div className="h-16 mb-2 border-b border-black"></div>
          <p><strong>Name:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Sarah Kimani" /> : "Sarah Kimani"}</p>
          <p><strong>Position:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Export Manager" /> : "Export Manager"}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-blue-700">Quality Control</h2>
          <div className="h-16 mb-2 border-b border-black"></div>
          <p><strong>Name:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Robert Mukasa" /> : "Robert Mukasa"}</p>
          <p><strong>Position:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Quality Assurance Manager" /> : "Quality Assurance Manager"}</p>
        </div>
      </div>

      {/* Official Seal */}
      <div className="text-center mb-4">
        <div className="inline-block border-2 border-blue-700 rounded-full p-6 mb-2">
          <p className="font-bold text-blue-700">OFFICIAL SEAL</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
        <p>This certificate is electronically generated and valid without signature.</p>
        <p>Verify authenticity at {companyInfo.website}/verify</p>
        <p>Certificate ID: {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="COO-2024-0123-VERIFY" /> : "COO-2024-0123-VERIFY"}</p>
      </div>
    </div>
  );
};

export default CoffeeComplianceTemplate;
