
import React from 'react';

const GeneralProduceComplianceTemplate = ({ editMode, data, onDataChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onDataChange(name, value);
  };
  
  // Default values
  const defaultValues = {
    certificateNumber: "KCL-GPC-2023-002",
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    exporter: "KAJON Limited",
    exporterAddress: "Plot 123, Kampala Industrial Area, Uganda",
    buyerName: "Global Food Distributors Inc.",
    buyerAddress: "123 Market St, New York, USA",
    destination: "United States",
    transportMethod: "Air Freight",
    portOfLoading: "Entebbe, Uganda",
    portOfDischarge: "JFK, New York",
    invoiceNumber: "INV-2023-9012",
    invoiceDate: new Date().toISOString().split('T')[0],
    productName: "Maize Grains",
    productType: "Cereal, Non-GMO",
    productQuantity: "15 Metric Tons",
    packaging: "25 kg Polypropylene Bags",
    totalPackages: "600 Bags",
    hsCode: "1005.90.00",
    grainSize: "Medium",
    moisture: "12.5%",
    foreignMatter: "<0.5%",
    brokenGrains: "<2%",
    pest: "None",
    testMethod: "ISO 6639-4",
    treatment: "Fumigation with Phosphine",
    treatmentDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
    treatmentDosage: "2g/m³ for 120 hours",
    storageConditions: "Cool, dry place away from direct sunlight",
    additionalDeclaration: "This shipment complies with all USDA import requirements.",
    authorizedSignature: "Jane Smith",
    authorizedPosition: "Quality Control Manager",
    signatureDate: new Date().toISOString().split('T')[0],
    documentTitle: data?.documentTitle || "Phytosanitary Certificate - General Produce"
  };
  
  // Merge default values with provided data
  const templateData = { ...defaultValues, ...data };
  
  // Determine if field is editable
  const EditableField = ({ name, value, type = "text" }) => {
    if (editMode) {
      return (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={handleChange}
          className="editable-field border border-green-300 px-2 py-1 w-full"
        />
      );
    }
    return <span>{value || ""}</span>;
  };
  
  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg general-template">
      {editMode && <div className="edit-mode-indicator">EDIT MODE</div>}
      
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">{templateData.documentTitle}</h1>
        <p className="text-gray-600">Certificate Number: <EditableField name="certificateNumber" value={templateData.certificateNumber} /></p>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-green-800 font-bold">Certificate Validity</h3>
          <p><strong>Issue Date:</strong> <EditableField type="date" name="issueDate" value={templateData.issueDate} /></p>
          <p><strong>Expiry Date:</strong> <EditableField type="date" name="expiryDate" value={templateData.expiryDate} /></p>
        </div>
        <div>
          <h3 className="text-green-800 font-bold">Reference Documents</h3>
          <p><strong>Invoice Number:</strong> <EditableField name="invoiceNumber" value={templateData.invoiceNumber} /></p>
          <p><strong>Invoice Date:</strong> <EditableField type="date" name="invoiceDate" value={templateData.invoiceDate} /></p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-green-800 font-bold">Exporter</h3>
          <p><EditableField name="exporter" value={templateData.exporter} /></p>
          <p><EditableField name="exporterAddress" value={templateData.exporterAddress} /></p>
        </div>
        <div>
          <h3 className="text-green-800 font-bold">Importer</h3>
          <p><EditableField name="buyerName" value={templateData.buyerName} /></p>
          <p><EditableField name="buyerAddress" value={templateData.buyerAddress} /></p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-green-800 font-bold border-b border-green-200 pb-2">Shipping Information</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p><strong>Destination:</strong> <EditableField name="destination" value={templateData.destination} /></p>
            <p><strong>Transport Method:</strong> <EditableField name="transportMethod" value={templateData.transportMethod} /></p>
          </div>
          <div>
            <p><strong>Port of Loading:</strong> <EditableField name="portOfLoading" value={templateData.portOfLoading} /></p>
            <p><strong>Port of Discharge:</strong> <EditableField name="portOfDischarge" value={templateData.portOfDischarge} /></p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-green-800 font-bold border-b border-green-200 pb-2">Product Details</h3>
        <table className="w-full mt-3">
          <tbody>
            <tr>
              <td className="font-semibold w-1/3">Product Name:</td>
              <td><EditableField name="productName" value={templateData.productName} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Type:</td>
              <td><EditableField name="productType" value={templateData.productType} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Quantity:</td>
              <td><EditableField name="productQuantity" value={templateData.productQuantity} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Packaging:</td>
              <td><EditableField name="packaging" value={templateData.packaging} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Total Packages:</td>
              <td><EditableField name="totalPackages" value={templateData.totalPackages} /></td>
            </tr>
            <tr>
              <td className="font-semibold">HS Code:</td>
              <td><EditableField name="hsCode" value={templateData.hsCode} /></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mb-6">
        <h3 className="text-green-800 font-bold border-b border-green-200 pb-2">Quality Parameters</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p><strong>Grain Size:</strong> <EditableField name="grainSize" value={templateData.grainSize} /></p>
            <p><strong>Moisture Content:</strong> <EditableField name="moisture" value={templateData.moisture} /></p>
            <p><strong>Foreign Matter:</strong> <EditableField name="foreignMatter" value={templateData.foreignMatter} /></p>
          </div>
          <div>
            <p><strong>Broken Grains:</strong> <EditableField name="brokenGrains" value={templateData.brokenGrains} /></p>
            <p><strong>Pest Damage:</strong> <EditableField name="pest" value={templateData.pest} /></p>
            <p><strong>Test Method:</strong> <EditableField name="testMethod" value={templateData.testMethod} /></p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-green-800 font-bold border-b border-green-200 pb-2">Treatment Information</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p><strong>Treatment:</strong> <EditableField name="treatment" value={templateData.treatment} /></p>
            <p><strong>Treatment Date:</strong> <EditableField type="date" name="treatmentDate" value={templateData.treatmentDate} /></p>
          </div>
          <div>
            <p><strong>Dosage:</strong> <EditableField name="treatmentDosage" value={templateData.treatmentDosage} /></p>
            <p><strong>Storage Requirements:</strong> <EditableField name="storageConditions" value={templateData.storageConditions} /></p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-green-800 font-bold border-b border-green-200 pb-2">Additional Declaration</h3>
        <p className="mt-3"><EditableField name="additionalDeclaration" value={templateData.additionalDeclaration} /></p>
      </div>
      
      <div className="mt-8 flex justify-between">
        <div>
          <p className="font-bold">Certified By:</p>
          <p><EditableField name="authorizedSignature" value={templateData.authorizedSignature} /></p>
          <p className="text-sm"><EditableField name="authorizedPosition" value={templateData.authorizedPosition} /></p>
          <p className="text-sm">Date: <EditableField type="date" name="signatureDate" value={templateData.signatureDate} /></p>
        </div>
        <div className="text-center">
          <div className="w-32 h-16 border border-gray-300 mx-auto mb-2"></div>
          <p className="text-sm">Official Stamp & Signature</p>
        </div>
      </div>
    </div>
  );
};

export default GeneralProduceComplianceTemplate;
