
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DeliveryNoteTemplate = ({ data = {}, isEditing = true }) => {
  const [templateData, setTemplateData] = useState({
    // Header
    title: data.title || "Delivery Note Online",
    
    // To Section
    toTitle: data.toTitle || "To:",
    toCompanyLabel: data.toCompanyLabel || "Company Name:",
    toAddressLabel: data.toAddressLabel || "Address:",
    toContactLabel: data.toContactLabel || "Contact Person:",
    toPhoneLabel: data.toPhoneLabel || "Phone Number:",
    toEmailLabel: data.toEmailLabel || "Email:",
    toCompany: data.toCompany || '',
    toAddress: data.toAddress || '',
    toContact: data.toContact || '',
    toPhone: data.toPhone || '',
    toEmail: data.toEmail || '',
    
    // From Section
    fromTitle: data.fromTitle || "From:",
    fromCompanyLabel: data.fromCompanyLabel || "Company Name:",
    fromAddressLabel: data.fromAddressLabel || "Address:",
    fromContactLabel: data.fromContactLabel || "Contact Person:",
    fromPhoneLabel: data.fromPhoneLabel || "Phone Number:",
    fromCompany: data.fromCompany || "KAJON Coffee Limited",
    fromAddress: data.fromAddress || "8339 Entebbe Town",
    fromContact: data.fromContact || '',
    fromPhone: data.fromPhone || "+256 757 757 517 / +256 776 670680",
    
    // Delivery Details
    deliveryDateLabel: data.deliveryDateLabel || "Delivery Date:",
    deliveryNoteNumberLabel: data.deliveryNoteNumberLabel || "Delivery Note Number:",
    deliveryDate: data.deliveryDate || '',
    deliveryNoteNumber: data.deliveryNoteNumber || '',
    
    // Order Details
    orderNumberLabel: data.orderNumberLabel || "Order Number:",
    orderDateLabel: data.orderDateLabel || "Order Date:",
    orderNumber: data.orderNumber || '',
    orderDate: data.orderDate || '',
    
    // Item Details Table
    itemNoHeader: data.itemNoHeader || "Item No.",
    descriptionHeader: data.descriptionHeader || "Description",
    quantityHeader: data.quantityHeader || "Quantity",
    unitHeader: data.unitHeader || "Unit",
    
    // Special Instructions
    specialInstructionsLabel: data.specialInstructionsLabel || "Special Instructions:",
    specialInstructions: data.specialInstructions || '',
    
    // Signatures
    deliveryConfirmationTitle: data.deliveryConfirmationTitle || "Delivery Confirmation:",
    deliveryConfirmationText: data.deliveryConfirmationText || "We acknowledge the receipt of the above goods in good condition as per the listed descriptions and quantities.",
    receiverSignatureLabel: data.receiverSignatureLabel || "Receiver's Signature:",
    receiverNameLabel: data.receiverNameLabel || "Print Name:",
    receiverDateLabel: data.receiverDateLabel || "Date:",
    receiverName: data.receiverName || '',
    receiverDate: data.receiverDate || '',
    
    senderConfirmationTitle: data.senderConfirmationTitle || "Sender's Confirmation:",
    senderConfirmationText: data.senderConfirmationText || "We confirm that the goods were handed over to the recipient as described above.",
    senderSignatureLabel: data.senderSignatureLabel || "Sender's Signature:",
    senderNameLabel: data.senderNameLabel || "Print Name:",
    senderDateLabel: data.senderDateLabel || "Date:",
    senderName: data.senderName || '',
    senderDate: data.senderDate || '',
  });
  
  // State for items in the table
  const [items, setItems] = useState(data.items || [
    { itemNo: '', description: '', quantity: '', unit: '' }
  ]);

  // Handle input changes for template data
  const handleInputChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle changes to item table rows
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setItems(updatedItems);
  };

  return (
    <Card className="w-full bg-white p-8 print:shadow-none">
      <CardContent className="p-0">
        <h1 className="text-2xl font-bold text-center mb-8">
          {isEditing ? (
            <Input
              value={templateData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="text-2xl font-bold text-center"
            />
          ) : templateData.title}
        </h1>
        
        {/* To Section */}
        <div className="mb-6">
          <h2 className="font-bold mb-2">
            {isEditing ? (
              <Input
                value={templateData.toTitle}
                onChange={(e) => handleInputChange('toTitle', e.target.value)}
                className="font-bold"
              />
            ) : templateData.toTitle}
          </h2>
          <div className="space-y-2">
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.toCompanyLabel}
                    onChange={(e) => handleInputChange('toCompanyLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.toCompanyLabel}
              </Label>
              <Input 
                value={templateData.toCompany} 
                onChange={(e) => handleInputChange('toCompany', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.toAddressLabel}
                    onChange={(e) => handleInputChange('toAddressLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.toAddressLabel}
              </Label>
              <Input 
                value={templateData.toAddress} 
                onChange={(e) => handleInputChange('toAddress', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.toContactLabel}
                    onChange={(e) => handleInputChange('toContactLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.toContactLabel}
              </Label>
              <Input 
                value={templateData.toContact} 
                onChange={(e) => handleInputChange('toContact', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.toPhoneLabel}
                    onChange={(e) => handleInputChange('toPhoneLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.toPhoneLabel}
              </Label>
              <Input 
                value={templateData.toPhone} 
                onChange={(e) => handleInputChange('toPhone', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.toEmailLabel}
                    onChange={(e) => handleInputChange('toEmailLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.toEmailLabel}
              </Label>
              <Input 
                value={templateData.toEmail} 
                onChange={(e) => handleInputChange('toEmail', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* From Section */}
        <div className="mb-6">
          <h2 className="font-bold mb-2">
            {isEditing ? (
              <Input
                value={templateData.fromTitle}
                onChange={(e) => handleInputChange('fromTitle', e.target.value)}
                className="font-bold"
              />
            ) : templateData.fromTitle}
          </h2>
          <div className="space-y-2">
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.fromCompanyLabel}
                    onChange={(e) => handleInputChange('fromCompanyLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.fromCompanyLabel}
              </Label>
              <Input 
                value={templateData.fromCompany}
                onChange={(e) => handleInputChange('fromCompany', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.fromAddressLabel}
                    onChange={(e) => handleInputChange('fromAddressLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.fromAddressLabel}
              </Label>
              <Input 
                value={templateData.fromAddress}
                onChange={(e) => handleInputChange('fromAddress', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.fromContactLabel}
                    onChange={(e) => handleInputChange('fromContactLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.fromContactLabel}
              </Label>
              <Input 
                value={templateData.fromContact} 
                onChange={(e) => handleInputChange('fromContact', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.fromPhoneLabel}
                    onChange={(e) => handleInputChange('fromPhoneLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.fromPhoneLabel}
              </Label>
              <Input 
                value={templateData.fromPhone}
                onChange={(e) => handleInputChange('fromPhone', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.deliveryDateLabel}
                    onChange={(e) => handleInputChange('deliveryDateLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.deliveryDateLabel}
              </Label>
              <Input 
                type="date" 
                value={templateData.deliveryDate} 
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.deliveryNoteNumberLabel}
                    onChange={(e) => handleInputChange('deliveryNoteNumberLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.deliveryNoteNumberLabel}
              </Label>
              <Input 
                value={templateData.deliveryNoteNumber} 
                onChange={(e) => handleInputChange('deliveryNoteNumber', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.orderNumberLabel}
                    onChange={(e) => handleInputChange('orderNumberLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.orderNumberLabel}
              </Label>
              <Input 
                value={templateData.orderNumber} 
                onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Label>
                {isEditing ? (
                  <Input
                    value={templateData.orderDateLabel}
                    onChange={(e) => handleInputChange('orderDateLabel', e.target.value)}
                    className="mb-1"
                  />
                ) : templateData.orderDateLabel}
              </Label>
              <Input 
                type="date" 
                value={templateData.orderDate} 
                onChange={(e) => handleInputChange('orderDate', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Item Details Table */}
        <div className="mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {isEditing ? (
                    <Input
                      value={templateData.itemNoHeader}
                      onChange={(e) => handleInputChange('itemNoHeader', e.target.value)}
                      className="bg-transparent"
                    />
                  ) : templateData.itemNoHeader}
                </TableHead>
                <TableHead>
                  {isEditing ? (
                    <Input
                      value={templateData.descriptionHeader}
                      onChange={(e) => handleInputChange('descriptionHeader', e.target.value)}
                      className="bg-transparent"
                    />
                  ) : templateData.descriptionHeader}
                </TableHead>
                <TableHead>
                  {isEditing ? (
                    <Input
                      value={templateData.quantityHeader}
                      onChange={(e) => handleInputChange('quantityHeader', e.target.value)}
                      className="bg-transparent"
                    />
                  ) : templateData.quantityHeader}
                </TableHead>
                <TableHead>
                  {isEditing ? (
                    <Input
                      value={templateData.unitHeader}
                      onChange={(e) => handleInputChange('unitHeader', e.target.value)}
                      className="bg-transparent"
                    />
                  ) : templateData.unitHeader}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={item.itemNo}
                        onChange={(e) => handleItemChange(index, 'itemNo', e.target.value)}
                      />
                    ) : item.itemNo}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      />
                    ) : item.description}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      />
                    ) : item.quantity}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                      />
                    ) : item.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Special Instructions */}
        <div className="mb-6">
          <Label>
            {isEditing ? (
              <Input
                value={templateData.specialInstructionsLabel}
                onChange={(e) => handleInputChange('specialInstructionsLabel', e.target.value)}
                className="mb-1"
              />
            ) : templateData.specialInstructionsLabel}
          </Label>
          <Textarea
            value={templateData.specialInstructions}
            onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
            className="h-24"
            readOnly={!isEditing}
          />
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-4">
              {isEditing ? (
                <Input
                  value={templateData.deliveryConfirmationTitle}
                  onChange={(e) => handleInputChange('deliveryConfirmationTitle', e.target.value)}
                  className="font-bold"
                />
              ) : templateData.deliveryConfirmationTitle}
            </h3>
            <p className="mb-4">
              {isEditing ? (
                <Textarea
                  value={templateData.deliveryConfirmationText}
                  onChange={(e) => handleInputChange('deliveryConfirmationText', e.target.value)}
                />
              ) : templateData.deliveryConfirmationText}
            </p>
            <div className="space-y-4">
              <div>
                <Label>
                  {isEditing ? (
                    <Input
                      value={templateData.receiverSignatureLabel}
                      onChange={(e) => handleInputChange('receiverSignatureLabel', e.target.value)}
                      className="mb-1"
                    />
                  ) : templateData.receiverSignatureLabel}
                </Label>
                <div className="border-b border-black h-8"></div>
              </div>
              <div>
                <Label>
                  {isEditing ? (
                    <Input
                      value={templateData.receiverNameLabel}
                      onChange={(e) => handleInputChange('receiverNameLabel', e.target.value)}
                      className="mb-1"
                    />
                  ) : templateData.receiverNameLabel}
                </Label>
                <Input
                  value={templateData.receiverName}
                  onChange={(e) => handleInputChange('receiverName', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>
              <div>
                <Label>
                  {isEditing ? (
                    <Input
                      value={templateData.receiverDateLabel}
                      onChange={(e) => handleInputChange('receiverDateLabel', e.target.value)}
                      className="mb-1"
                    />
                  ) : templateData.receiverDateLabel}
                </Label>
                <Input
                  type="date"
                  value={templateData.receiverDate}
                  onChange={(e) => handleInputChange('receiverDate', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">
              {isEditing ? (
                <Input
                  value={templateData.senderConfirmationTitle}
                  onChange={(e) => handleInputChange('senderConfirmationTitle', e.target.value)}
                  className="font-bold"
                />
              ) : templateData.senderConfirmationTitle}
            </h3>
            <p className="mb-4">
              {isEditing ? (
                <Textarea
                  value={templateData.senderConfirmationText}
                  onChange={(e) => handleInputChange('senderConfirmationText', e.target.value)}
                />
              ) : templateData.senderConfirmationText}
            </p>
            <div className="space-y-4">
              <div>
                <Label>
                  {isEditing ? (
                    <Input
                      value={templateData.senderSignatureLabel}
                      onChange={(e) => handleInputChange('senderSignatureLabel', e.target.value)}
                      className="mb-1"
                    />
                  ) : templateData.senderSignatureLabel}
                </Label>
                <div className="border-b border-black h-8"></div>
              </div>
              <div>
                <Label>
                  {isEditing ? (
                    <Input
                      value={templateData.senderNameLabel}
                      onChange={(e) => handleInputChange('senderNameLabel', e.target.value)}
                      className="mb-1"
                    />
                  ) : templateData.senderNameLabel}
                </Label>
                <Input
                  value={templateData.senderName}
                  onChange={(e) => handleInputChange('senderName', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>
              <div>
                <Label>
                  {isEditing ? (
                    <Input
                      value={templateData.senderDateLabel}
                      onChange={(e) => handleInputChange('senderDateLabel', e.target.value)}
                      className="mb-1"
                    />
                  ) : templateData.senderDateLabel}
                </Label>
                <Input
                  type="date"
                  value={templateData.senderDate}
                  onChange={(e) => handleInputChange('senderDate', e.target.value)}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryNoteTemplate;
