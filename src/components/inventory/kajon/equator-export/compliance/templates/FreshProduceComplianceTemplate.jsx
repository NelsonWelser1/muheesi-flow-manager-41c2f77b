
import React from 'react';

const FreshProduceComplianceTemplate = ({ editMode, data, onDataChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onDataChange(name, value);
  };
  
  // Default values
  const defaultValues = {
    certificateNumber: "KCL-FPC-2023-003",
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    exporter: "KAJON Fresh Produce Division",
    exporterAddress: "Plot 345, Industrial Area, Kampala, Uganda",
    buyerName: "Fresh Imports Co., Ltd.",
    buyerAddress: "25-7 Shinbashi, Minato-ku, Tokyo, Japan",
    destination: "Japan",
    transportMethod: "Air Freight (Temperature Controlled)",
    portOfLoading: "Entebbe International Airport",
    portOfDischarge: "Narita International Airport",
    invoiceNumber: "INV-2023-7890",
    invoiceDate: new Date().toISOString().split('T')[0],
    productName: "Fresh Pineapples",
    variety: "Smooth Cayenne",
    productClass: "Class 1 - Premium",
    productSize: "Size B (1.5-1.8 kg)",
    totalQuantity: "5,000 kg",
    packagingType: "Single-layer corrugated cartons with ventilation",
    packagingUnits: "500 cartons of 10 kg each",
    storageTemp: "7-10°C",
    harvestDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    shelfLife: "14 days from harvest under proper storage conditions",
    pestVerification: "Visual inspection and sampling conducted as per ISO 7558",
    pestResult: "No harmful organisms detected",
    residueAnalysis: "Conducted by Central Testing Laboratory (Ref: LAB-2023-456)",
    residueResult: "Complies with Japan MRLs for all tested parameters",
    treatmentType: "Post-harvest dip treatment",
    treatmentDetails: "Approved food-grade sanitizer (100 ppm, 2 minutes)",
    treatmentDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    foodSafetyCert: "GLOBAL G.A.P. Certificate GGN: 4052852192734",
    traceabilityInfo: "Lot Number: FP-23082023-001 | Farm ID: KJN-PINE-005",
    authorizedSignature: "Robert Johnson",
    authorizedPosition: "Quality Control & Compliance Manager",
    signatureDate: new Date().toISOString().split('T')[0],
    documentTitle: data?.documentTitle || "Fresh Produce Quality Certificate"
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
          className="editable-field border border-amber-300 px-2 py-1 w-full"
        />
      );
    }
    return <span>{value || ""}</span>;
  };
  
  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg fresh-template">
      {editMode && <div className="edit-mode-indicator">EDIT MODE</div>}
      
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-amber-700">{templateData.documentTitle}</h1>
        <p className="text-gray-600">Certificate Number: <EditableField name="certificateNumber" value={templateData.certificateNumber} /></p>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-amber-700 font-bold">Certificate Validity</h3>
          <p><strong>Issue Date:</strong> <EditableField type="date" name="issueDate" value={templateData.issueDate} /></p>
          <p><strong>Expiry Date:</strong> <EditableField type="date" name="expiryDate" value={templateData.expiryDate} /></p>
          <p><strong>Harvest Date:</strong> <EditableField type="date" name="harvestDate" value={templateData.harvestDate} /></p>
        </div>
        <div>
          <h3 className="text-amber-700 font-bold">Commercial Documents</h3>
          <p><strong>Invoice Number:</strong> <EditableField name="invoiceNumber" value={templateData.invoiceNumber} /></p>
          <p><strong>Invoice Date:</strong> <EditableField type="date" name="invoiceDate" value={templateData.invoiceDate} /></p>
          <p><strong>Traceability:</strong> <EditableField name="traceabilityInfo" value={templateData.traceabilityInfo} /></p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-amber-700 font-bold">Exporter</h3>
          <p><EditableField name="exporter" value={templateData.exporter} /></p>
          <p><EditableField name="exporterAddress" value={templateData.exporterAddress} /></p>
        </div>
        <div>
          <h3 className="text-amber-700 font-bold">Importer</h3>
          <p><EditableField name="buyerName" value={templateData.buyerName} /></p>
          <p><EditableField name="buyerAddress" value={templateData.buyerAddress} /></p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-amber-700 font-bold border-b border-amber-200 pb-2">Shipping Information</h3>
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
        <h3 className="text-amber-700 font-bold border-b border-amber-200 pb-2">Product Details</h3>
        <table className="w-full mt-3">
          <tbody>
            <tr>
              <td className="font-semibold w-1/3">Product Name:</td>
              <td><EditableField name="productName" value={templateData.productName} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Variety:</td>
              <td><EditableField name="variety" value={templateData.variety} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Class/Grade:</td>
              <td><EditableField name="productClass" value={templateData.productClass} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Size:</td>
              <td><EditableField name="productSize" value={templateData.productSize} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Total Quantity:</td>
              <td><EditableField name="totalQuantity" value={templateData.totalQuantity} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Packaging Type:</td>
              <td><EditableField name="packagingType" value={templateData.packagingType} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Packaging Units:</td>
              <td><EditableField name="packagingUnits" value={templateData.packagingUnits} /></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mb-6">
        <h3 className="text-amber-700 font-bold border-b border-amber-200 pb-2">Storage & Handling Requirements</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p><strong>Storage Temperature:</strong> <EditableField name="storageTemp" value={templateData.storageTemp} /></p>
          </div>
          <div>
            <p><strong>Shelf Life:</strong> <EditableField name="shelfLife" value={templateData.shelfLife} /></p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-amber-700 font-bold border-b border-amber-200 pb-2">Phytosanitary Information</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p><strong>Pest Verification:</strong> <EditableField name="pestVerification" value={templateData.pestVerification} /></p>
            <p><strong>Results:</strong> <EditableField name="pestResult" value={templateData.pestResult} /></p>
          </div>
          <div>
            <p><strong>Residue Analysis:</strong> <EditableField name="residueAnalysis" value={templateData.residueAnalysis} /></p>
            <p><strong>Results:</strong> <EditableField name="residueResult" value={templateData.residueResult} /></p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-amber-700 font-bold border-b border-amber-200 pb-2">Post-Harvest Treatment</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p><strong>Treatment Type:</strong> <EditableField name="treatmentType" value={templateData.treatmentType} /></p>
            <p><strong>Treatment Details:</strong> <EditableField name="treatmentDetails" value={templateData.treatmentDetails} /></p>
          </div>
          <div>
            <p><strong>Treatment Date:</strong> <EditableField type="date" name="treatmentDate" value={templateData.treatmentDate} /></p>
            <p><strong>Food Safety Certification:</strong> <EditableField name="foodSafetyCert" value={templateData.foodSafetyCert} /></p>
          </div>
        </div>
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

export default FreshProduceComplianceTemplate;
