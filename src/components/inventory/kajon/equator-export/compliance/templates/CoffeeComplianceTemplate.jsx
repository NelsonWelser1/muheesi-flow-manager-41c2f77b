
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const CoffeeComplianceTemplate = ({ isEditing = true, initialData = {} }) => {
  // Default data for the template
  const defaultCompanyInfo = {
    name: "KAJON Coffee Limited",
    address: "123 Coffee Way, Kampala, Uganda",
    phone: "+256 782 123456",
    email: "info@kajoncoffee.com",
    website: "www.kajoncoffee.com"
  };

  const defaultCoffeeData = {
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

  // Initialize state with provided data or defaults
  const [documentData, setDocumentData] = useState({
    title: initialData.title || "Coffee Certificate of Origin",
    certificateNo: initialData.certificateNo || "COO-2024-0123",
    issueDate: initialData.issueDate || "2024-03-26",
    validUntil: initialData.validUntil || "2025-03-26",
    
    // Company info
    companyName: initialData.companyName || defaultCompanyInfo.name,
    companyAddress: initialData.companyAddress || defaultCompanyInfo.address,
    companyPhone: initialData.companyPhone || defaultCompanyInfo.phone,
    companyEmail: initialData.companyEmail || defaultCompanyInfo.email,
    companyWebsite: initialData.companyWebsite || defaultCompanyInfo.website,
    taxId: initialData.taxId || "TAX-12345-UG",
    
    // Product info
    productType: initialData.productType || "Coffee Beans",
    variety: initialData.variety || defaultCoffeeData.variety,
    grade: initialData.grade || defaultCoffeeData.grade,
    origin: initialData.origin || defaultCoffeeData.origin,
    harvestDate: initialData.harvestDate || defaultCoffeeData.harvestDate,
    batchNumber: initialData.batchNumber || defaultCoffeeData.batchNumber,
    processingMethod: initialData.processingMethod || defaultCoffeeData.processingMethod,
    screenSize: initialData.screenSize || defaultCoffeeData.screenSize,
    moisture: initialData.moisture || defaultCoffeeData.moisture,
    density: initialData.density || defaultCoffeeData.density,
    
    // Section headings
    companyInfoTitle: initialData.companyInfoTitle || "Company Information",
    productDetailsTitle: initialData.productDetailsTitle || "Product Details",
    certificationsTitle: initialData.certificationsTitle || "Certifications",
    flavorProfileTitle: initialData.flavorProfileTitle || "Flavor Profile",
    shipmentInfoTitle: initialData.shipmentInfoTitle || "Shipment Information",
    declarationTitle: initialData.declarationTitle || "Declaration",
    
    // Table headers
    descriptionHeader: initialData.descriptionHeader || "Description",
    quantityHeader: initialData.quantityHeader || "Quantity",
    netWeightHeader: initialData.netWeightHeader || "Net Weight",
    packagingHeader: initialData.packagingHeader || "Packaging",
    
    // Table values
    description: initialData.description || "Green Coffee Beans",
    quantity: initialData.quantity || "320 Bags",
    netWeight: initialData.netWeight || "19,200 kg",
    packaging: initialData.packaging || "60kg GrainPro Bags",
    
    // Flavor profile
    flavorProfile: initialData.flavorProfile || defaultCoffeeData.flavorProfile,
    
    // Declaration text
    declarationText: initialData.declarationText || "We hereby certify that the coffee described above is of Uganda origin, produced and processed under our supervision according to international standards and complies with all export requirements of the Republic of Uganda.",
    
    // Signatures
    authSignatoryTitle: initialData.authSignatoryTitle || "Authorized Signatory",
    qualityControlTitle: initialData.qualityControlTitle || "Quality Control",
    signatoryName: initialData.signatoryName || "Sarah Kimani",
    signatoryPosition: initialData.signatoryPosition || "Export Manager",
    qcName: initialData.qcName || "Robert Mukasa",
    qcPosition: initialData.qcPosition || "Quality Assurance Manager",
    
    // Footer
    officialSealText: initialData.officialSealText || "OFFICIAL SEAL",
    footerNote1: initialData.footerNote1 || "This certificate is electronically generated and valid without signature.",
    footerNote2: initialData.footerNote2 || "Verify authenticity at www.kajoncoffee.com/verify",
    verificationId: initialData.verificationId || "COO-2024-0123-VERIFY"
  });

  // Available certifications
  const availableCertifications = ["Organic", "Rainforest Alliance", "Fair Trade", "UTZ", "4C", "Direct Trade"];
  
  // Selected certifications
  const [selectedCertifications, setSelectedCertifications] = useState(
    initialData.certifications || defaultCoffeeData.certifications
  );

  // Handle input changes
  const handleInputChange = (field, value) => {
    setDocumentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle certification checkbox changes
  const handleCertificationChange = (cert, checked) => {
    if (checked) {
      setSelectedCertifications(prev => [...prev, cert]);
    } else {
      setSelectedCertifications(prev => prev.filter(c => c !== cert));
    }
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
                <Input 
                  type="text" 
                  className="editable-field border px-2 py-1 w-full" 
                  value={documentData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              ) : (
                documentData.title
              )}
            </h1>
            <p className="text-sm text-gray-600">
              {isEditing ? (
                <Input 
                  type="text" 
                  className="editable-field border px-2 py-1 w-full" 
                  value={documentData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              ) : (
                documentData.companyName
              )}
            </p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p><strong>Certificate No:</strong> {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1" 
              value={documentData.certificateNo}
              onChange={(e) => handleInputChange('certificateNo', e.target.value)}
            />
          ) : documentData.certificateNo}</p>
          <p><strong>Issue Date:</strong> {isEditing ? (
            <Input 
              type="date" 
              className="editable-field border px-2 py-1"
              value={documentData.issueDate}
              onChange={(e) => handleInputChange('issueDate', e.target.value)}
            />
          ) : documentData.issueDate}</p>
          <p><strong>Valid Until:</strong> {isEditing ? (
            <Input 
              type="date" 
              className="editable-field border px-2 py-1"
              value={documentData.validUntil}
              onChange={(e) => handleInputChange('validUntil', e.target.value)}
            />
          ) : documentData.validUntil}</p>
        </div>
      </div>

      {/* Company Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">
          {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 text-lg font-semibold text-blue-700" 
              value={documentData.companyInfoTitle}
              onChange={(e) => handleInputChange('companyInfoTitle', e.target.value)}
            />
          ) : documentData.companyInfoTitle}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Company:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
            ) : documentData.companyName}</p>
            <p><strong>Address:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.companyAddress}
                onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              />
            ) : documentData.companyAddress}</p>
            <p><strong>Contact:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.companyPhone}
                onChange={(e) => handleInputChange('companyPhone', e.target.value)}
              />
            ) : documentData.companyPhone}</p>
          </div>
          <div>
            <p><strong>Email:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.companyEmail}
                onChange={(e) => handleInputChange('companyEmail', e.target.value)}
              />
            ) : documentData.companyEmail}</p>
            <p><strong>Website:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.companyWebsite}
                onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
              />
            ) : documentData.companyWebsite}</p>
            <p><strong>Tax ID:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
              />
            ) : documentData.taxId}</p>
          </div>
        </div>
      </div>

      {/* Coffee Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">
          {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 text-lg font-semibold text-blue-700" 
              value={documentData.productDetailsTitle}
              onChange={(e) => handleInputChange('productDetailsTitle', e.target.value)}
            />
          ) : documentData.productDetailsTitle}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Product:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.productType}
                onChange={(e) => handleInputChange('productType', e.target.value)}
              />
            ) : documentData.productType}</p>
            <p><strong>Variety:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.variety}
                onChange={(e) => handleInputChange('variety', e.target.value)}
              />
            ) : documentData.variety}</p>
            <p><strong>Grade:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.grade}
                onChange={(e) => handleInputChange('grade', e.target.value)}
              />
            ) : documentData.grade}</p>
            <p><strong>Origin:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
              />
            ) : documentData.origin}</p>
            <p><strong>Harvest Date:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.harvestDate}
                onChange={(e) => handleInputChange('harvestDate', e.target.value)}
              />
            ) : documentData.harvestDate}</p>
          </div>
          <div>
            <p><strong>Batch Number:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.batchNumber}
                onChange={(e) => handleInputChange('batchNumber', e.target.value)}
              />
            ) : documentData.batchNumber}</p>
            <p><strong>Processing:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.processingMethod}
                onChange={(e) => handleInputChange('processingMethod', e.target.value)}
              />
            ) : documentData.processingMethod}</p>
            <p><strong>Screen Size:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.screenSize}
                onChange={(e) => handleInputChange('screenSize', e.target.value)}
              />
            ) : documentData.screenSize}</p>
            <p><strong>Moisture:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.moisture}
                onChange={(e) => handleInputChange('moisture', e.target.value)}
              />
            ) : documentData.moisture}</p>
            <p><strong>Density:</strong> {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 inline-block ml-1" 
                value={documentData.density}
                onChange={(e) => handleInputChange('density', e.target.value)}
              />
            ) : documentData.density}</p>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">
          {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 text-lg font-semibold text-blue-700" 
              value={documentData.certificationsTitle}
              onChange={(e) => handleInputChange('certificationsTitle', e.target.value)}
            />
          ) : documentData.certificationsTitle}
        </h2>
        {isEditing ? (
          <div className="flex flex-wrap gap-2">
            {availableCertifications.map(cert => (
              <div key={cert} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cert-${cert}`} 
                  checked={selectedCertifications.includes(cert)} 
                  onCheckedChange={(checked) => handleCertificationChange(cert, checked)} 
                />
                <Label htmlFor={`cert-${cert}`}>
                  <Input 
                    type="text" 
                    className="editable-field border px-2 py-1" 
                    value={cert}
                    onChange={(e) => {
                      // This would require additional logic to update certification names
                      // For simplicity, we're allowing editing the checkbox label but not updating the array
                    }}
                  />
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <ul className="list-disc pl-5">
            {selectedCertifications.map(cert => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Flavor Profile */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">
          {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 text-lg font-semibold text-blue-700" 
              value={documentData.flavorProfileTitle}
              onChange={(e) => handleInputChange('flavorProfileTitle', e.target.value)}
            />
          ) : documentData.flavorProfileTitle}
        </h2>
        {isEditing ? (
          <Textarea
            className="editable-field border px-2 py-1 w-full h-20"
            value={documentData.flavorProfile}
            onChange={(e) => handleInputChange('flavorProfile', e.target.value)}
          />
        ) : (
          <p>{documentData.flavorProfile}</p>
        )}
      </div>

      {/* Shipment Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">
          {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 text-lg font-semibold text-blue-700" 
              value={documentData.shipmentInfoTitle}
              onChange={(e) => handleInputChange('shipmentInfoTitle', e.target.value)}
            />
          ) : documentData.shipmentInfoTitle}
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border p-2 text-left">
                {isEditing ? (
                  <Input 
                    type="text" 
                    className="editable-field border px-2 py-1 w-full" 
                    value={documentData.descriptionHeader}
                    onChange={(e) => handleInputChange('descriptionHeader', e.target.value)}
                  />
                ) : documentData.descriptionHeader}
              </th>
              <th className="border p-2 text-left">
                {isEditing ? (
                  <Input 
                    type="text" 
                    className="editable-field border px-2 py-1 w-full" 
                    value={documentData.quantityHeader}
                    onChange={(e) => handleInputChange('quantityHeader', e.target.value)}
                  />
                ) : documentData.quantityHeader}
              </th>
              <th className="border p-2 text-left">
                {isEditing ? (
                  <Input 
                    type="text" 
                    className="editable-field border px-2 py-1 w-full" 
                    value={documentData.netWeightHeader}
                    onChange={(e) => handleInputChange('netWeightHeader', e.target.value)}
                  />
                ) : documentData.netWeightHeader}
              </th>
              <th className="border p-2 text-left">
                {isEditing ? (
                  <Input 
                    type="text" 
                    className="editable-field border px-2 py-1 w-full" 
                    value={documentData.packagingHeader}
                    onChange={(e) => handleInputChange('packagingHeader', e.target.value)}
                  />
                ) : documentData.packagingHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">
                {isEditing ? (
                  <Input 
                    type="text" 
                    className="editable-field border px-2 py-1 w-full" 
                    value={documentData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                ) : documentData.description}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <Input 
                    type="text" 
                    className="editable-field border px-2 py-1 w-full" 
                    value={documentData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                ) : documentData.quantity}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <Input 
                    type="text" 
                    className="editable-field border px-2 py-1 w-full" 
                    value={documentData.netWeight}
                    onChange={(e) => handleInputChange('netWeight', e.target.value)}
                  />
                ) : documentData.netWeight}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <Input 
                    type="text" 
                    className="editable-field border px-2 py-1 w-full" 
                    value={documentData.packaging}
                    onChange={(e) => handleInputChange('packaging', e.target.value)}
                  />
                ) : documentData.packaging}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Declaration */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">
          {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 text-lg font-semibold text-blue-700" 
              value={documentData.declarationTitle}
              onChange={(e) => handleInputChange('declarationTitle', e.target.value)}
            />
          ) : documentData.declarationTitle}
        </h2>
        {isEditing ? (
          <Textarea
            className="editable-field border px-2 py-1 w-full h-20"
            value={documentData.declarationText}
            onChange={(e) => handleInputChange('declarationText', e.target.value)}
          />
        ) : (
          <p>{documentData.declarationText}</p>
        )}
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-blue-700">
            {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 text-lg font-semibold text-blue-700" 
                value={documentData.authSignatoryTitle}
                onChange={(e) => handleInputChange('authSignatoryTitle', e.target.value)}
              />
            ) : documentData.authSignatoryTitle}
          </h2>
          <div className="h-16 mb-2 border-b border-black"></div>
          <p><strong>Name:</strong> {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 inline-block ml-1" 
              value={documentData.signatoryName}
              onChange={(e) => handleInputChange('signatoryName', e.target.value)}
            />
          ) : documentData.signatoryName}</p>
          <p><strong>Position:</strong> {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 inline-block ml-1" 
              value={documentData.signatoryPosition}
              onChange={(e) => handleInputChange('signatoryPosition', e.target.value)}
            />
          ) : documentData.signatoryPosition}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-blue-700">
            {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 text-lg font-semibold text-blue-700" 
                value={documentData.qualityControlTitle}
                onChange={(e) => handleInputChange('qualityControlTitle', e.target.value)}
              />
            ) : documentData.qualityControlTitle}
          </h2>
          <div className="h-16 mb-2 border-b border-black"></div>
          <p><strong>Name:</strong> {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 inline-block ml-1" 
              value={documentData.qcName}
              onChange={(e) => handleInputChange('qcName', e.target.value)}
            />
          ) : documentData.qcName}</p>
          <p><strong>Position:</strong> {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 inline-block ml-1" 
              value={documentData.qcPosition}
              onChange={(e) => handleInputChange('qcPosition', e.target.value)}
            />
          ) : documentData.qcPosition}</p>
        </div>
      </div>

      {/* Official Seal */}
      <div className="text-center mb-4">
        <div className="inline-block border-2 border-blue-700 rounded-full p-6 mb-2">
          <p className="font-bold text-blue-700">
            {isEditing ? (
              <Input 
                type="text" 
                className="editable-field border px-2 py-1 font-bold text-blue-700 text-center" 
                value={documentData.officialSealText}
                onChange={(e) => handleInputChange('officialSealText', e.target.value)}
              />
            ) : documentData.officialSealText}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
        <p>
          {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 text-sm text-center" 
              value={documentData.footerNote1}
              onChange={(e) => handleInputChange('footerNote1', e.target.value)}
            />
          ) : documentData.footerNote1}
        </p>
        <p>
          {isEditing ? (
            <Input 
              type="text" 
              className="editable-field border px-2 py-1 text-sm text-center" 
              value={documentData.footerNote2}
              onChange={(e) => handleInputChange('footerNote2', e.target.value)}
            />
          ) : documentData.footerNote2}
        </p>
        <p>Certificate ID: {isEditing ? (
          <Input 
            type="text" 
            className="editable-field border px-2 py-1 text-sm" 
            value={documentData.verificationId}
            onChange={(e) => handleInputChange('verificationId', e.target.value)}
          />
        ) : documentData.verificationId}</p>
      </div>
    </div>
  );
};

export default CoffeeComplianceTemplate;
