
import React from 'react';

const FreshProduceComplianceTemplate = ({ isEditing, documentData }) => {
  // Sample data to display in the template
  const companyInfo = {
    name: "KAJON Coffee Limited",
    address: "123 Coffee Way, Kampala, Uganda",
    phone: "+256 782 123456",
    email: "info@kajoncoffee.com",
    website: "www.kajoncoffee.com"
  };

  const samplePhytoData = {
    applicationNumber: "PHYTO-2024-0075",
    consignee: "Fresh Mart Europe GmbH",
    consigneeAddress: "Fruchtweg 22, 20457 Hamburg, Germany",
    portOfEntry: "Hamburg Port",
    applicationType: "Standard",
    inspectionDate: "10-Apr-2024",
    transportMode: "Sea Freight"
  };

  const sampleProducts = [
    { description: "Fresh Pineapples", scientificName: "Ananas comosus", quantity: "1,800", unit: "kg", packagingType: "Cartons", treatmentType: "Cold Storage" },
    { description: "Fresh Avocados", scientificName: "Persea americana", quantity: "1,200", unit: "kg", packagingType: "Crates", treatmentType: "Controlled Atmosphere" }
  ];

  return (
    <div className="fresh-produce-document">
      {/* Header with logo and document title */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center">
          {/* You can add a company logo here */}
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold">
            LOGO
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-amber-800">
              {isEditing ? (
                <input 
                  type="text" 
                  className="editable-field border px-2 py-1 w-full" 
                  defaultValue={documentData.title || "Phytosanitary Certificate Application"}
                />
              ) : (
                documentData.title || "Phytosanitary Certificate Application"
              )}
            </h1>
            <p className="text-sm text-gray-600">{companyInfo.name}</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p><strong>Application No:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={samplePhytoData.applicationNumber} /> : samplePhytoData.applicationNumber}</p>
          <p><strong>Date:</strong> {isEditing ? <input type="date" className="editable-field border px-2 py-1" defaultValue="2024-04-05" /> : "05-Apr-2024"}</p>
          <p><strong>Status:</strong> {isEditing ? (
            <select className="editable-field border px-2 py-1">
              <option>Pending</option>
              <option>In Process</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          ) : "Pending"}</p>
        </div>
      </div>

      {/* Applicant Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-amber-700">1. Applicant Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Exporter Name:</strong> {companyInfo.name}</p>
            <p><strong>Address:</strong> {companyInfo.address}</p>
            <p><strong>Contact Person:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Sarah Kimani" /> : "Sarah Kimani"}</p>
          </div>
          <div>
            <p><strong>Registration Number:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="EXP-UG-78542" /> : "EXP-UG-78542"}</p>
            <p><strong>Phone:</strong> {companyInfo.phone}</p>
            <p><strong>Email:</strong> {companyInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Consignment Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-amber-700">2. Consignment Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Consignee Name:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={samplePhytoData.consignee} /> : samplePhytoData.consignee}</p>
            <p><strong>Consignee Address:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={samplePhytoData.consigneeAddress} /> : samplePhytoData.consigneeAddress}</p>
            <p><strong>Country of Destination:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Germany" /> : "Germany"}</p>
          </div>
          <div>
            <p><strong>Port of Entry:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={samplePhytoData.portOfEntry} /> : samplePhytoData.portOfEntry}</p>
            <p><strong>Means of Transport:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue={samplePhytoData.transportMode} /> : samplePhytoData.transportMode}</p>
            <p><strong>Expected Shipment Date:</strong> {isEditing ? <input type="date" className="editable-field border px-2 py-1" defaultValue="2024-04-15" /> : "15-Apr-2024"}</p>
          </div>
        </div>
      </div>

      {/* Application Type */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-amber-700">3. Application Type</h2>
        {isEditing ? (
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name="applicationType" defaultChecked={samplePhytoData.applicationType === "Standard"} />
              <span>Standard Certificate</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="applicationType" defaultChecked={samplePhytoData.applicationType === "Re-export"} />
              <span>Re-export Certificate</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="applicationType" defaultChecked={samplePhytoData.applicationType === "Replacement"} />
              <span>Replacement Certificate</span>
            </label>
          </div>
        ) : (
          <p>Application Type: <strong>{samplePhytoData.applicationType}</strong></p>
        )}

        {isEditing && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">If Replacement or Re-export, provide reference number:</p>
            <input type="text" className="editable-field border px-2 py-1 w-full mt-1" placeholder="Reference number of original certificate..." />
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-amber-700">4. Product Information</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-amber-50">
              <th className="border p-2 text-left">Product Name</th>
              <th className="border p-2 text-left">Scientific Name</th>
              <th className="border p-2 text-left">Quantity</th>
              <th className="border p-2 text-left">Unit</th>
              <th className="border p-2 text-left">Packaging</th>
              <th className="border p-2 text-left">Treatment</th>
            </tr>
          </thead>
          <tbody>
            {sampleProducts.map((product, index) => (
              <tr key={index}>
                <td className="border p-2">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={product.description} /> : product.description}
                </td>
                <td className="border p-2">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={product.scientificName} /> : product.scientificName}
                </td>
                <td className="border p-2">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={product.quantity} /> : product.quantity}
                </td>
                <td className="border p-2">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={product.unit} /> : product.unit}
                </td>
                <td className="border p-2">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={product.packagingType} /> : product.packagingType}
                </td>
                <td className="border p-2">
                  {isEditing ? <input type="text" className="editable-field border px-2 py-1 w-full" defaultValue={product.treatmentType} /> : product.treatmentType}
                </td>
              </tr>
            ))}
            {isEditing && (
              <tr>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Product name..." />
                </td>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Scientific name..." />
                </td>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Quantity" />
                </td>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Unit" />
                </td>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Packaging" />
                </td>
                <td className="border p-2">
                  <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Treatment" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Treatment Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-amber-700">5. Treatment Information</h2>
        {isEditing ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm mb-1">Treatment Type:</label>
                <select className="editable-field border px-2 py-1 w-full">
                  <option>Temperature Treatment</option>
                  <option>Chemical Treatment</option>
                  <option>Fumigation</option>
                  <option>Irradiation</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Chemical (if applicable):</label>
                <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Chemical name..." />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Duration:</label>
                <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Duration..." />
              </div>
              <div>
                <label className="block text-sm mb-1">Temperature:</label>
                <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Temperature..." />
              </div>
              <div>
                <label className="block text-sm mb-1">Concentration:</label>
                <input type="text" className="editable-field border px-2 py-1 w-full" placeholder="Concentration..." />
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Treatment Type:</strong> Cold Storage</p>
              <p><strong>Duration:</strong> 14 days</p>
            </div>
            <div>
              <p><strong>Temperature:</strong> 2-4°C</p>
              <p><strong>Additional Info:</strong> Pre-cooling applied</p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-amber-700">6. Additional Information</h2>
        {isEditing ? (
          <textarea
            className="editable-field border px-2 py-1 w-full h-20"
            placeholder="Enter any additional information regarding this shipment..."
            defaultValue="Products have been inspected and found free from quarantine pests. All products are grown in certified farms in Uganda."
          />
        ) : (
          <p>Products have been inspected and found free from quarantine pests. All products are grown in certified farms in Uganda.</p>
        )}
      </div>

      {/* Inspection Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-amber-700">7. Inspection Details (Official Use)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Inspection Date:</strong> {isEditing ? <input type="date" className="editable-field border px-2 py-1" defaultValue="2024-04-10" /> : samplePhytoData.inspectionDate}</p>
            <p><strong>Inspector Name:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Dr. John Mugisha" /> : "Dr. John Mugisha"}</p>
          </div>
          <div>
            <p><strong>Inspection Location:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="KAJON Packing Facility, Kampala" /> : "KAJON Packing Facility, Kampala"}</p>
            <p><strong>Results:</strong> {isEditing ? (
              <select className="editable-field border px-2 py-1">
                <option>Pending</option>
                <option>Pass</option>
                <option>Fail</option>
              </select>
            ) : "Pending"}</p>
          </div>
        </div>
      </div>

      {/* Declaration */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-amber-700">8. Declaration</h2>
        {isEditing ? (
          <textarea
            className="editable-field border px-2 py-1 w-full h-20"
            defaultValue="I, the undersigned, hereby apply for a phytosanitary certificate for the commodities described above and declare that the information provided is true and correct to the best of my knowledge."
          />
        ) : (
          <p>I, the undersigned, hereby apply for a phytosanitary certificate for the commodities described above and declare that the information provided is true and correct to the best of my knowledge.</p>
        )}
      </div>

      {/* Signature */}
      <div className="mb-6 grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-amber-700">Applicant Signature</h2>
          <div className="h-16 mb-2 border-b border-black"></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="Sarah Kimani" /> : "Sarah Kimani"}</p>
            </div>
            <div>
              <p><strong>Date:</strong> {isEditing ? <input type="date" className="editable-field border px-2 py-1" defaultValue="2024-04-05" /> : "05-Apr-2024"}</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-amber-700">Official Use Only</h2>
          <div className="h-16 mb-2 border-b border-black"></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Officer:</strong> {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="" /> : ""}</p>
            </div>
            <div>
              <p><strong>Date:</strong> {isEditing ? <input type="date" className="editable-field border px-2 py-1" /> : ""}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stamp/Seal */}
      <div className="text-right mb-4">
        <div className="inline-block border-2 border-amber-700 rounded-full p-6 mb-2">
          <p className="font-bold text-amber-700">OFFICIAL STAMP</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
        <p>This application must be submitted at least 5 working days before intended shipment date.</p>
        <p>For assistance contact: {companyInfo.phone} | {companyInfo.email}</p>
        <p>Form ID: {isEditing ? <input type="text" className="editable-field border px-2 py-1" defaultValue="PHYTO-APP-2024-0075" /> : "PHYTO-APP-2024-0075"}</p>
      </div>
    </div>
  );
};

export default FreshProduceComplianceTemplate;
