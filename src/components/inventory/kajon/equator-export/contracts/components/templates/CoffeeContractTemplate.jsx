import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import ProductTable from '../../../../quotations/form-sections/ProductTable';

const CoffeeContractTemplate = ({ editMode = false, data = {}, onDataChange = () => {}, onSave = () => {} }) => {
  // Initialize state for seller details
  const [sellerDetails, setSellerDetails] = useState(
    data.sellerDetails || {
      name: "KAJON Coffee Limited",
      address: "Kampala, Uganda",
      registration: "Registration #: UG2023786541"
    }
  );

  // Initialize state for buyer details
  const [buyerDetails, setBuyerDetails] = useState(
    data.buyerDetails || {
      name: "[Buyer Company Name]",
      address: "[Buyer Address]",
      registration: "[Buyer Registration #]"
    }
  );

  // Initialize state for products
  const [products, setProducts] = useState(
    data.products || []
  );
  
  // Initialize state for payment terms
  const [paymentTermsItems, setPaymentTermsItems] = useState(
    data.paymentTermsItems || []
  );
  
  // Initialize contract number and date
  const [contractNumber, setContractNumber] = useState(
    data.contractNumber || "KCL-2024-"
  );
  
  const [currentDate, setCurrentDate] = useState(
    data.currentDate || new Date().toISOString().split('T')[0]
  );
  
  // Get the current date in YYYY-MM-DD format for the contract date field
  useEffect(() => {
    if (!data.currentDate) {
      const today = new Date().toISOString().split('T')[0];
      setCurrentDate(today);
      // Update parent data
      onDataChange('currentDate', today);
    }
  }, [data.currentDate, onDataChange]);
  
  // Update parent data when seller details change
  useEffect(() => {
    onDataChange('sellerDetails', sellerDetails);
  }, [sellerDetails, onDataChange]);

  // Update parent data when buyer details change
  useEffect(() => {
    onDataChange('buyerDetails', buyerDetails);
  }, [buyerDetails, onDataChange]);

  // Update parent data when products change
  useEffect(() => {
    onDataChange('products', products);
    
    // Calculate and update total contract value
    const totalValue = products.reduce((sum, product) => {
      const quantity = parseFloat(product.quantity) || 0;
      const price = parseFloat(product.pricePerKg) || 0;
      return sum + (quantity * price);
    }, 0);
    
    onDataChange('totalContractValue', totalValue.toFixed(2));
  }, [products, onDataChange]);

  // Update parent data when payment terms change
  useEffect(() => {
    onDataChange('paymentTermsItems', paymentTermsItems);
  }, [paymentTermsItems, onDataChange]);
  
  // Update parent data when contract number changes
  useEffect(() => {
    onDataChange('contractNumber', contractNumber);
  }, [contractNumber, onDataChange]);
  
  // Update parent data when current date changes
  useEffect(() => {
    onDataChange('currentDate', currentDate);
  }, [currentDate, onDataChange]);

  // Helper function to update seller details
  const handleSellerChange = (field, value) => {
    setSellerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to update buyer details
  const handleBuyerChange = (field, value) => {
    setBuyerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to handle product change
  const handleProductChange = (index, event) => {
    const updatedProducts = [...products];
    const { name, value } = event.target;
    
    // If this is a new product being added
    if (name === 'new') {
      updatedProducts.push(value);
      setProducts(updatedProducts);
      return;
    }
    
    // Otherwise update an existing product
    if (!updatedProducts[index]) {
      updatedProducts[index] = {};
    }
    
    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]: value
    };
    
    // Auto-calculate total value when quantity or price changes
    if (name === 'quantity' || name === 'pricePerKg') {
      const product = updatedProducts[index];
      
      // Extract numeric values from the fields
      const quantity = parseFloat(product.quantity || 0);
      const price = parseFloat(product.pricePerKg || 0);
      
      // Calculate total if both quantity and price are valid numbers
      if (!isNaN(quantity) && !isNaN(price)) {
        updatedProducts[index].totalValue = (quantity * price).toFixed(2);
      }
    }
    
    setProducts(updatedProducts);
  };
  
  // Add a new payment term
  const addPaymentTerm = () => {
    setPaymentTermsItems([...paymentTermsItems, { description: '' }]);
  };
  
  // Remove a payment term
  const removePaymentTerm = (index) => {
    const updatedTerms = [...paymentTermsItems];
    updatedTerms.splice(index, 1);
    setPaymentTermsItems(updatedTerms);
  };
  
  // Update a payment term
  const handlePaymentTermChange = (index, value) => {
    const updatedTerms = [...paymentTermsItems];
    updatedTerms[index] = { description: value };
    setPaymentTermsItems(updatedTerms);
  };
  
  // Add a new product
  const addProduct = () => {
    setProducts([...products, { 
      id: `product-${Date.now()}`,
      description: '',
      quantity: '',
      pricePerKg: '',
      totalValue: ''
    }]);
  };
  
  // Remove a product
  const removeProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };
  
  // Prepare contract data for saving
  const prepareContractData = () => {
    // Make sure totalValue is calculated for each product
    const updatedProducts = products.map(product => {
      // If totalValue is not calculated yet, do it now
      if (!product.totalValue) {
        const quantity = parseFloat(product.quantity || 0);
        const price = parseFloat(product.pricePerKg || 0);
        return {
          ...product,
          totalValue: (quantity * price).toFixed(2)
        };
      }
      return product;
    });
    
    // Calculate the total contract value
    const totalContractValue = updatedProducts.reduce((sum, product) => {
      return sum + parseFloat(product.totalValue || 0);
    }, 0);
    
    return {
      contract_number: contractNumber,
      contract_date: currentDate,
      seller_name: sellerDetails.name,
      seller_address: sellerDetails.address,
      seller_registration: sellerDetails.registration,
      buyer_name: buyerDetails.name,
      buyer_address: buyerDetails.address,
      buyer_registration: buyerDetails.registration,
      products: updatedProducts,
      payment_terms_items: paymentTermsItems,
      total_contract_value: totalContractValue.toFixed(2)
    };
  };
  
  // Handle save button click
  const handleSave = () => {
    const contractData = prepareContractData();
    onSave(contractData);
  };

  // Helper function to render editable or display content
  const EditableField = ({ field, defaultValue, isMultiline = false }) => {
    const value = data[field] || defaultValue;
    
    if (editMode) {
      if (isMultiline) {
        return (
          <Textarea
            value={value}
            onChange={(e) => onDataChange(field, e.target.value)}
            className="w-full min-h-[80px] border border-blue-300 p-2"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-blue-300 p-1"
        />
      );
    }
    
    return isMultiline ? (
      <p className="text-sm">{value}</p>
    ) : (
      <span>{value}</span>
    );
  };

  // Render Product Details section
  const renderProductDetails = () => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-700">PRODUCT DETAILS</h3>
        {editMode && (
          <Button
            type="button"
            onClick={addProduct}
            size="sm"
            className="mb-2 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        )}
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-left">Quantity (Kg)</th>
              <th className="border border-gray-300 p-2 text-left">Price per Kg</th>
              <th className="border border-gray-300 p-2 text-left">Total Value</th>
              {editMode && <th className="border border-gray-300 p-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id || index}>
                <td className="border border-gray-300 p-2">
                  {editMode ? (
                    <Input 
                      name="description"
                      value={product.description || ''} 
                      onChange={(e) => handleProductChange(index, e)} 
                      className="w-full border border-blue-300 p-1"
                    />
                  ) : (
                    product.description || ''
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editMode ? (
                    <Input 
                      type="number"
                      name="quantity"
                      value={product.quantity || ''} 
                      onChange={(e) => handleProductChange(index, e)} 
                      className="w-full border border-blue-300 p-1"
                    />
                  ) : (
                    product.quantity || ''
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editMode ? (
                    <Input 
                      type="number"
                      name="pricePerKg"
                      value={product.pricePerKg || ''} 
                      onChange={(e) => handleProductChange(index, e)} 
                      className="w-full border border-blue-300 p-1"
                    />
                  ) : (
                    product.pricePerKg || ''
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editMode ? (
                    <Input 
                      name="totalValue"
                      value={product.totalValue || ''} 
                      readOnly
                      className="w-full border border-blue-300 p-1 bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    product.totalValue || ''
                  )}
                </td>
                {editMode && (
                  <td className="border border-gray-300 p-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeProduct(index)}
                      className="text-red-500 hover:text-red-700 flex items-center"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-blue-50">
              <td colSpan={editMode ? "3" : "3"} className="border border-gray-300 p-2 font-bold text-right">Total Contract Value:</td>
              <td className="border border-gray-300 p-2 font-bold">
                {`USD ${products
                  .reduce((sum, product) => sum + (parseFloat(product.totalValue || 0) || 0), 0)
                  .toFixed(2)}`}
              </td>
              {editMode && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 border border-gray-200 shadow-sm print:shadow-none print:border-none">
      {/* Company Header */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <img 
            src="/lovable-uploads/493ba471-e6fd-4a79-862b-f5d2c974d0d9.png" 
            alt="KAJON Coffee Limited" 
            className="h-24 w-auto mb-2"
          />
          <h2 className="text-lg font-bold">KAJON Coffee Limited</h2>
          <p className="text-sm text-gray-600">Kanoni, Kazo District, Uganda</p>
          <p className="text-sm text-gray-600">6th floor, Arie Towers, Mackinnon Road, Nakasero</p>
          <p className="text-sm text-gray-600">Kampala, Uganda, 256</p>
          <p className="text-sm text-gray-600">Tel: +256 776 670680 / +256 757 757517</p>
          <p className="text-sm text-gray-600">Email: kajoncoffeelimited@gmail.com</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-blue-800">COFFEE EXPORT CONTRACT</h1>
          <p className="text-sm text-gray-600 mt-2">
            Contract #: {editMode ? (
              <Input 
                value={data.contractNumber || "KCL-2024-[XXXX]"}
                onChange={(e) => onDataChange('contractNumber', e.target.value)}
                className="border border-blue-300 p-1 mt-1 w-full"
                placeholder="Enter contract number"
              />
            ) : (
              <span>{data.contractNumber || "KCL-2024-[XXXX]"}</span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            Date: {editMode ? (
              <Input 
                value={data.currentDate || ""}
                onChange={(e) => onDataChange('currentDate', e.target.value)}
                className="border border-blue-300 p-1 mt-1 w-full" 
                placeholder="YYYY-MM-DD"
                type="date"
              />
            ) : (
              <span>{data.currentDate || "[Current Date]"}</span>
            )}
          </p>
        </div>
      </div>

      {/* Parties - Enhanced with editable fields */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">PARTIES</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r pr-4">
            <h4 className="font-semibold">SELLER:</h4>
            {editMode ? (
              <div className="space-y-2 mt-1">
                <Input 
                  value={sellerDetails.name}
                  onChange={(e) => handleSellerChange('name', e.target.value)}
                  placeholder="Company Name"
                  className="w-full border border-blue-300 p-1"
                />
                <Input 
                  value={sellerDetails.address}
                  onChange={(e) => handleSellerChange('address', e.target.value)}
                  placeholder="Address"
                  className="w-full border border-blue-300 p-1"
                />
                <Input 
                  value={sellerDetails.registration}
                  onChange={(e) => handleSellerChange('registration', e.target.value)}
                  placeholder="Registration Number"
                  className="w-full border border-blue-300 p-1"
                />
              </div>
            ) : (
              <>
                <p className="text-sm">{sellerDetails.name}</p>
                <p className="text-sm">{sellerDetails.address}</p>
                <p className="text-sm">{sellerDetails.registration}</p>
              </>
            )}
          </div>
          <div>
            <h4 className="font-semibold">BUYER:</h4>
            {editMode ? (
              <div className="space-y-2 mt-1">
                <Input 
                  value={buyerDetails.name}
                  onChange={(e) => handleBuyerChange('name', e.target.value)}
                  placeholder="Company Name"
                  className="w-full border border-blue-300 p-1"
                />
                <Input 
                  value={buyerDetails.address}
                  onChange={(e) => handleBuyerChange('address', e.target.value)}
                  placeholder="Address"
                  className="w-full border border-blue-300 p-1"
                />
                <Input 
                  value={buyerDetails.registration}
                  onChange={(e) => handleBuyerChange('registration', e.target.value)}
                  placeholder="Registration Number"
                  className="w-full border border-blue-300 p-1"
                />
              </div>
            ) : (
              <>
                <p className="text-sm">{buyerDetails.name}</p>
                <p className="text-sm">{buyerDetails.address}</p>
                <p className="text-sm">{buyerDetails.registration}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Details */}
      {renderProductDetails()}

      {/* Quality Specifications */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">
          <EditableField field="qualitySpecificationsTitle" defaultValue="QUALITY SPECIFICATIONS" />
        </h3>
        <div className="grid grid-cols-1 gap-4 mb-4">
          {products.map((product, index) => (
            <div key={`spec-${product.id}`} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between">
                <p className="font-semibold">{product.description} ({product.grade}):</p>
                {editMode && (
                  <div className="text-xs text-gray-500">
                    Linked to product #{index + 1}
                  </div>
                )}
              </div>
              <div className={editMode ? "space-y-2" : ""}>
                {editMode ? (
                  <Textarea
                    value={product.specs}
                    onChange={(e) => handleProductChange(index, 'specs', e.target.value)}
                    className="w-full min-h-[80px] border border-blue-300 p-2 mt-2"
                  />
                ) : (
                  <p className="text-sm whitespace-pre-line">{product.specs}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">
          <EditableField field="shippingTermsTitle" defaultValue="SHIPPING TERMS" />
        </h3>
        {editMode ? (
          <div className="space-y-4 border border-blue-200 p-4 rounded-md bg-blue-50">
            <p className="text-sm text-blue-600 italic">Edit Shipping Terms Structure:</p>
            
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3].map((index) => (
                <div key={`left-${index}`} className="space-y-1">
                  <Input 
                    className="font-semibold border border-blue-300"
                    value={data[`shippingLeftLabel${index}`] || 
                          (index === 1 ? "Incoterm:" : 
                           index === 2 ? "Packaging:" : "Loading Port:")}
                    onChange={(e) => onDataChange(`shippingLeftLabel${index}`, e.target.value)}
                  />
                  <Input
                    className="border border-blue-300"
                    value={data[`shippingLeftValue${index}`] || 
                          (index === 1 ? "FOB Mombasa" : 
                           index === 2 ? "60kg jute bags with GrainPro liners" : "Mombasa, Kenya")}
                    onChange={(e) => onDataChange(`shippingLeftValue${index}`, e.target.value)}
                  />
                </div>
              ))}
              
              {[1, 2, 3].map((index) => (
                <div key={`right-${index}`} className="space-y-1">
                  <Input 
                    className="font-semibold border border-blue-300"
                    value={data[`shippingRightLabel${index}`] || 
                          (index === 1 ? "Destination:" : 
                           index === 2 ? "Latest Shipment Date:" : "Delivery Timeline:")}
                    onChange={(e) => onDataChange(`shippingRightLabel${index}`, e.target.value)}
                  />
                  <Input
                    className="border border-blue-300"
                    value={data[`shippingRightValue${index}`] || 
                          (index === 1 ? "Hamburg, Germany" : 
                           index === 2 ? "October 15, 2024" : "30-45 days from loading")}
                    onChange={(e) => onDataChange(`shippingRightValue${index}`, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Input 
                className="font-semibold border border-blue-300 mb-1"
                value={data.additionalShippingTermsLabel || "Additional Shipping Terms:"}
                onChange={(e) => onDataChange('additionalShippingTermsLabel', e.target.value)}
              />
              <Textarea 
                className="border border-blue-300"
                value={data.additionalShippingTerms || "Seller is responsible for arranging transportation to the port. Export documentation to be provided by seller. Cost of shipping insurance to be borne by buyer as per Incoterms."}
                onChange={(e) => onDataChange('additionalShippingTerms', e.target.value)}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {[1, 2, 3].map((index) => (
                  <div key={`left-display-${index}`} className="mb-2">
                    <p className="font-semibold">{data[`shippingLeftLabel${index}`] || 
                      (index === 1 ? "Incoterm:" : 
                       index === 2 ? "Packaging:" : "Loading Port:")}</p>
                    <p className="text-sm">{data[`shippingLeftValue${index}`] || 
                      (index === 1 ? "FOB Mombasa" : 
                       index === 2 ? "60kg jute bags with GrainPro liners" : "Mombasa, Kenya")}</p>
                  </div>
                ))}
              </div>
              <div>
                {[1, 2, 3].map((index) => (
                  <div key={`right-display-${index}`} className="mb-2">
                    <p className="font-semibold">{data[`shippingRightLabel${index}`] || 
                      (index === 1 ? "Destination:" : 
                       index === 2 ? "Latest Shipment Date:" : "Delivery Timeline:")}</p>
                    <p className="text-sm">{data[`shippingRightValue${index}`] || 
                      (index === 1 ? "Hamburg, Germany" : 
                       index === 2 ? "October 15, 2024" : "30-45 days from loading")}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <p className="font-semibold">{data.additionalShippingTermsLabel || "Additional Shipping Terms:"}</p>
              <p className="text-sm whitespace-pre-line">{data.additionalShippingTerms || "Seller is responsible for arranging transportation to the port. Export documentation to be provided by seller. Cost of shipping insurance to be borne by buyer as per Incoterms."}</p>
            </div>
          </>
        )}
      </div>

      {/* Payment Terms */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">
          <EditableField field="paymentTermsTitle" defaultValue="PAYMENT TERMS" />
        </h3>
        <div className="border rounded p-3 bg-gray-50">
          {editMode ? (
            <div className="space-y-4">
              {paymentTermsItems.map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <Textarea
                    value={item.text}
                    onChange={(e) => updatePaymentTermItem(item.id, e.target.value)}
                    className="flex-grow border border-blue-300 min-h-[60px]"
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePaymentTermItem(item.id)}
                    className="text-red-500 hover:text-red-700 mt-1"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                onClick={addPaymentTermItem} 
                size="sm" 
                className="flex items-center gap-1 mt-2"
              >
                <Plus className="h-4 w-4" /> Add Payment Term
              </Button>
            </div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {paymentTermsItems.map((item) => (
                <li key={item.id} className="text-sm">{item.text}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Signature Block */}
      <div className="grid grid-cols-2 gap-12 mt-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">
            <EditableField field="forSellerLabel" defaultValue="For and on behalf of SELLER" />
          </p>
          <p className="text-sm">
            <EditableField field="sellerNameLabel" defaultValue="Name:" /> <EditableField field="sellerName" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            <EditableField field="sellerTitleLabel" defaultValue="Title:" /> <EditableField field="sellerTitle" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            <EditableField field="sellerDateLabel" defaultValue="Date:" /> <EditableField field="sellerDate" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            <EditableField field="sellerSignatureLabel" defaultValue="Signature:" /> <EditableField field="sellerSignature" defaultValue="___________________________" />
          </p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">
            <EditableField field="forBuyerLabel" defaultValue="For and on behalf of BUYER" />
          </p>
          <p className="text-sm">
            <EditableField field="buyerSignatureNameLabel" defaultValue="Name:" /> <EditableField field="buyerSignatureName" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            <EditableField field="buyerSignatureTitleLabel" defaultValue="Title:" /> <EditableField field="buyerSignatureTitle" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            <EditableField field="buyerSignatureDateLabel" defaultValue="Date:" /> <EditableField field="buyerSignatureDate" defaultValue="________________________________" />
          </p>
          <p className="text-sm mt-2">
            <EditableField field="buyerSignatureLabel" defaultValue="Signature:" /> <EditableField field="buyerSignature" defaultValue="___________________________" />
          </p>
        </div>
      </div>

      {/* Company Seal/Stamp Area */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          <EditableField field="companyStamp" defaultValue="[Company Seal/Stamp]" />
        </p>
      </div>

      {/* Save button - Shown only in edit mode */}
      {editMode && typeof onSave === 'function' && (
        <div className="mt-8 flex justify-center print:hidden">
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Contract
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoffeeContractTemplate;
