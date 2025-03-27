
import React from 'react';

const CoffeeComplianceTemplate = ({ editMode, data, onDataChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onDataChange(name, value);
  };
  
  // Default values
  const defaultValues = {
    certificateNumber: "KCL-CO-2023-001",
    issueDate: new Date().toISOString().split('T')[0],
    exporter: "KAJON Coffee Limited",
    exporterAddress: "Plot 123, Kampala Industrial Area, Uganda",
    buyerName: "European Coffee Importers GmbH",
    buyerAddress: "Kaffestrasse 45, Berlin, Germany",
    destination: "Germany",
    transportMethod: "Sea Freight",
    portOfLoading: "Mombasa, Kenya",
    portOfDischarge: "Hamburg, Germany",
    invoiceNumber: "INV-2023-5678",
    invoiceDate: new Date().toISOString().split('T')[0],
    productDescription: "Arabica Coffee Beans, Grade AA",
    hsCode: "0901.11.00",
    netWeight: "18,000 kg",
    grossWeight: "18,500 kg",
    numberOfBags: "300 bags",
    bagType: "Jute bags, 60kg each",
    originPlace: "Mount Elgon, Uganda",
    processingMethod: "Fully washed",
    certifications: "Organic, Rainforest Alliance, Fair Trade",
    declarations: "I, the undersigned, declare that the above information is true and correct to the best of my knowledge.",
    authorizedSignature: "John Doe",
    authorizedPosition: "Export Manager",
    signatureDate: new Date().toISOString().split('T')[0],
    documentTitle: data?.documentTitle || "Certificate of Origin - Coffee"
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
          className="editable-field border border-blue-300 px-2 py-1 w-full"
        />
      );
    }
    return <span>{value || ""}</span>;
  };
  
  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg coffee-template">
      {editMode && <div className="edit-mode-indicator">EDIT MODE</div>}
      
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">{templateData.documentTitle}</h1>
        <p className="text-gray-600">Certificate: <EditableField name="certificateNumber" value={templateData.certificateNumber} /></p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-purple-800 font-bold">Exporter</h3>
            <p><EditableField name="exporter" value={templateData.exporter} /></p>
            <p><EditableField name="exporterAddress" value={templateData.exporterAddress} /></p>
          </div>
          <div>
            <h3 className="text-purple-800 font-bold">Certificate Details</h3>
            <p><strong>Issue Date:</strong> <EditableField type="date" name="issueDate" value={templateData.issueDate} /></p>
            <p><strong>Invoice:</strong> <EditableField name="invoiceNumber" value={templateData.invoiceNumber} /></p>
            <p><strong>Invoice Date:</strong> <EditableField type="date" name="invoiceDate" value={templateData.invoiceDate} /></p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-purple-800 font-bold">Buyer</h3>
            <p><EditableField name="buyerName" value={templateData.buyerName} /></p>
            <p><EditableField name="buyerAddress" value={templateData.buyerAddress} /></p>
          </div>
          <div>
            <h3 className="text-purple-800 font-bold">Shipping Details</h3>
            <p><strong>Destination:</strong> <EditableField name="destination" value={templateData.destination} /></p>
            <p><strong>Transport:</strong> <EditableField name="transportMethod" value={templateData.transportMethod} /></p>
            <p><strong>Loading Port:</strong> <EditableField name="portOfLoading" value={templateData.portOfLoading} /></p>
            <p><strong>Discharge Port:</strong> <EditableField name="portOfDischarge" value={templateData.portOfDischarge} /></p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-purple-800 font-bold border-b pb-2">Coffee Details</h3>
        <table className="w-full mt-3">
          <tbody>
            <tr>
              <td className="font-semibold w-1/3">Product Description:</td>
              <td><EditableField name="productDescription" value={templateData.productDescription} /></td>
            </tr>
            <tr>
              <td className="font-semibold">HS Code:</td>
              <td><EditableField name="hsCode" value={templateData.hsCode} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Net Weight:</td>
              <td><EditableField name="netWeight" value={templateData.netWeight} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Gross Weight:</td>
              <td><EditableField name="grossWeight" value={templateData.grossWeight} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Number of Bags:</td>
              <td><EditableField name="numberOfBags" value={templateData.numberOfBags} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Bag Type:</td>
              <td><EditableField name="bagType" value={templateData.bagType} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Origin:</td>
              <td><EditableField name="originPlace" value={templateData.originPlace} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Processing Method:</td>
              <td><EditableField name="processingMethod" value={templateData.processingMethod} /></td>
            </tr>
            <tr>
              <td className="font-semibold">Certifications:</td>
              <td><EditableField name="certifications" value={templateData.certifications} /></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mb-6">
        <h3 className="text-purple-800 font-bold border-b pb-2">Declaration</h3>
        <p className="mt-3"><EditableField name="declarations" value={templateData.declarations} /></p>
      </div>
      
      <div className="mt-8 flex justify-between">
        <div>
          <p className="font-bold">Authorized By:</p>
          <p><EditableField name="authorizedSignature" value={templateData.authorizedSignature} /></p>
          <p className="text-sm"><EditableField name="authorizedPosition" value={templateData.authorizedPosition} /></p>
          <p className="text-sm">Date: <EditableField type="date" name="signatureDate" value={templateData.signatureDate} /></p>
        </div>
        <div className="text-center">
          <div className="w-32 h-16 border border-gray-300 mx-auto mb-2"></div>
          <p className="text-sm">Official Stamp</p>
        </div>
      </div>
    </div>
  );
};

export default CoffeeComplianceTemplate;
