
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ProformaInvoiceTemplate = ({ data = {}, isEditing = true }) => {
  // State for all editable fields
  const [templateData, setTemplateData] = useState({
    companyName: data?.companyName || "My Company name",
    companySlogan: data?.companySlogan || "My company slogan",
    documentTitle: data?.documentTitle || "PRO FORMA INVOICE",
    invoiceNumber: data?.invoiceNumber || "[TBD]",
    customerId: data?.customerId || "[ABC12345]",
    
    // Bill To
    billToCompany: data?.billToCompany || "[Company Name]",
    billToAddress: data?.billToAddress || "[Street Address]",
    billToCity: data?.billToCity || "[City, ST ZIP Code]",
    billToPhone: data?.billToPhone || "[Phone]",
    
    // Ship To
    shipToCompany: data?.shipToCompany || "[Company Name]",
    shipToAddress: data?.shipToAddress || "[Street Address]",
    shipToCity: data?.shipToCity || "[City, ST ZIP Code]",
    shipToPhone: data?.shipToPhone || "[Phone]",
    
    // Section Titles
    billToTitle: data?.billToTitle || "Bill To:",
    shipToTitle: data?.shipToTitle || "Ship To:",
    shipmentInfoTitle: data?.shipmentInfoTitle || "Shipment Information",
    customsInfoTitle: data?.customsInfoTitle || "Additional Information for Customs",
    
    // Shipment Fields Labels
    poNumberLabel: data?.poNumberLabel || "P.O. #:",
    poDateLabel: data?.poDateLabel || "P.O. Date:",
    letterOfCreditLabel: data?.letterOfCreditLabel || "Letter of Credit #:",
    currencyLabel: data?.currencyLabel || "Currency:",
    paymentTermsLabel: data?.paymentTermsLabel || "Payment Terms:",
    estShipDateLabel: data?.estShipDateLabel || "Est. Ship Date:",
    
    modeOfTransportLabel: data?.modeOfTransportLabel || "Mode of Transportation:",
    transportTermsLabel: data?.transportTermsLabel || "Transportation Terms:",
    packagesLabel: data?.packagesLabel || "Number of Packages:",
    grossWeightLabel: data?.grossWeightLabel || "Est. Gross Weight:",
    carrierLabel: data?.carrierLabel || "Carrier:",
    
    // Customs Fields Labels
    embarkationLabel: data?.embarkationLabel || "Port of Embarkation:",
    dischargeLabel: data?.dischargeLabel || "Port of Discharge:",
    originCountryLabel: data?.originCountryLabel || "Country of Origin:",
    awbblLabel: data?.awbblLabel || "AWBBL #:",
    
    // Table Headers
    itemHeader: data?.itemHeader || "Item/Part #",
    uomHeader: data?.uomHeader || "UOM",
    descriptionHeader: data?.descriptionHeader || "Description",
    unitPriceHeader: data?.unitPriceHeader || "Unit Price",
    qtyHeader: data?.qtyHeader || "Qty",
    salesTaxHeader: data?.salesTaxHeader || "Sales Tax",
    lineTotalHeader: data?.lineTotalHeader || "Line Total",
    
    // Notes and Terms
    notesTermsTitle: data?.notesTermsTitle || "Special Notes, Terms of Sale",
    declarationText: data?.declarationText || "I declare that the information mentioned above is true and correct to the best of my knowledge.",
    signatureLabel: data?.signatureLabel || "Signature",
    dateLabel: data?.dateLabel || "Date",
    
    // Totals Labels
    subtotalLabel: data?.subtotalLabel || "Subtotal",
    salesTaxSubjectLabel: data?.salesTaxSubjectLabel || "Subject to Sales Tax",
    salesTaxRateLabel: data?.salesTaxRateLabel || "Sales Tax Rate",
    salesTaxLabel: data?.salesTaxLabel || "Sales Tax",
    shippingHandlingLabel: data?.shippingHandlingLabel || "S & H",
    insuranceLabel: data?.insuranceLabel || "Insurance",
    other1Label: data?.other1Label || "[Other] specify",
    other2Label: data?.other2Label || "[Other] specify",
    other3Label: data?.other3Label || "[Other] specify",
    totalLabel: data?.totalLabel || "Total",
    
    // Footer
    footerEnquiries: data?.footerEnquiries || "Should you have any enquiries concerning this invoice, please contact John Doe on 0-000-000-0000",
    footerAddress: data?.footerAddress || "111 Street, Town/City, County, ST, 00000",
    footerContact: data?.footerContact || "Tel: 0-000-000-0000 Fax: 0-000-000-0000 Email: info@yourcompanysite.com Web: www.yourcompanysite.com",
  });
  
  // Handle input changes
  const handleInputChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full bg-white p-8 print:shadow-none">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? (
                <Input 
                  value={templateData.companyName} 
                  onChange={(e) => handleInputChange('companyName', e.target.value)} 
                  className="font-bold text-2xl"
                />
              ) : templateData.companyName}
            </h1>
            <p className="text-sm text-gray-600">
              {isEditing ? (
                <Input 
                  value={templateData.companySlogan} 
                  onChange={(e) => handleInputChange('companySlogan', e.target.value)}
                  className="text-sm"
                />
              ) : templateData.companySlogan}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[#003366]">
              {isEditing ? (
                <Input 
                  value={templateData.documentTitle} 
                  onChange={(e) => handleInputChange('documentTitle', e.target.value)}
                  className="font-bold text-2xl text-right text-[#003366]"
                />
              ) : templateData.documentTitle}
            </h2>
            <div className="text-sm mt-2">
              <p>Page: 1 of 1</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Date of Expiry: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
              <p>Invoice #: {isEditing ? (
                <Input 
                  value={templateData.invoiceNumber} 
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  className="inline w-auto"
                />
              ) : templateData.invoiceNumber}</p>
              <p>Customer ID: {isEditing ? (
                <Input 
                  value={templateData.customerId} 
                  onChange={(e) => handleInputChange('customerId', e.target.value)}
                  className="inline w-auto"
                />
              ) : templateData.customerId}</p>
            </div>
          </div>
        </div>

        {/* Bill To & Ship To Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="bg-[#003366] text-white px-4 py-2 mb-2">
              <h3 className="font-bold">
                {isEditing ? (
                  <Input 
                    value={templateData.billToTitle} 
                    onChange={(e) => handleInputChange('billToTitle', e.target.value)}
                    className="font-bold text-white bg-transparent"
                  />
                ) : templateData.billToTitle}
              </h3>
            </div>
            <div className="text-sm space-y-1 px-4">
              <p>
                {isEditing ? (
                  <Input 
                    value={templateData.billToCompany} 
                    onChange={(e) => handleInputChange('billToCompany', e.target.value)}
                  />
                ) : templateData.billToCompany}
              </p>
              <p>
                {isEditing ? (
                  <Input 
                    value={templateData.billToAddress} 
                    onChange={(e) => handleInputChange('billToAddress', e.target.value)}
                  />
                ) : templateData.billToAddress}
              </p>
              <p>
                {isEditing ? (
                  <Input 
                    value={templateData.billToCity} 
                    onChange={(e) => handleInputChange('billToCity', e.target.value)}
                  />
                ) : templateData.billToCity}
              </p>
              <p>
                {isEditing ? (
                  <Input 
                    value={templateData.billToPhone} 
                    onChange={(e) => handleInputChange('billToPhone', e.target.value)}
                  />
                ) : templateData.billToPhone}
              </p>
            </div>
          </div>
          <div>
            <div className="bg-[#003366] text-white px-4 py-2 mb-2">
              <h3 className="font-bold">
                {isEditing ? (
                  <Input 
                    value={templateData.shipToTitle} 
                    onChange={(e) => handleInputChange('shipToTitle', e.target.value)}
                    className="font-bold text-white bg-transparent"
                  />
                ) : templateData.shipToTitle}
              </h3>
            </div>
            <div className="text-sm space-y-1 px-4">
              <p>
                {isEditing ? (
                  <Input 
                    value={templateData.shipToCompany} 
                    onChange={(e) => handleInputChange('shipToCompany', e.target.value)}
                  />
                ) : templateData.shipToCompany}
              </p>
              <p>
                {isEditing ? (
                  <Input 
                    value={templateData.shipToAddress} 
                    onChange={(e) => handleInputChange('shipToAddress', e.target.value)}
                  />
                ) : templateData.shipToAddress}
              </p>
              <p>
                {isEditing ? (
                  <Input 
                    value={templateData.shipToCity} 
                    onChange={(e) => handleInputChange('shipToCity', e.target.value)}
                  />
                ) : templateData.shipToCity}
              </p>
              <p>
                {isEditing ? (
                  <Input 
                    value={templateData.shipToPhone} 
                    onChange={(e) => handleInputChange('shipToPhone', e.target.value)}
                  />
                ) : templateData.shipToPhone}
              </p>
            </div>
          </div>
        </div>

        {/* Shipment Information */}
        <div className="mb-8">
          <div className="bg-[#003366] text-white px-4 py-2 mb-2">
            <h3 className="font-bold">
              {isEditing ? (
                <Input 
                  value={templateData.shipmentInfoTitle} 
                  onChange={(e) => handleInputChange('shipmentInfoTitle', e.target.value)}
                  className="font-bold text-white bg-transparent"
                />
              ) : templateData.shipmentInfoTitle}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 px-4">
              <div className="flex">
                <span className="w-32">
                  {isEditing ? (
                    <Input 
                      value={templateData.poNumberLabel} 
                      onChange={(e) => handleInputChange('poNumberLabel', e.target.value)}
                      className="w-32"
                    />
                  ) : templateData.poNumberLabel}
                </span>
                <span className="border-b border-gray-300 flex-1"></span>
              </div>
              {/* Repeat for other fields, similar to the pattern above */}
              {/* ... */}
            </div>
            <div className="space-y-2 px-4">
              {/* Additional fields follow the same pattern */}
              {/* ... */}
            </div>
          </div>
        </div>

        {/* Continue with similar patterns for all other sections */}
        {/* ... */}
      </CardContent>
    </Card>
  );
};

export default ProformaInvoiceTemplate;
