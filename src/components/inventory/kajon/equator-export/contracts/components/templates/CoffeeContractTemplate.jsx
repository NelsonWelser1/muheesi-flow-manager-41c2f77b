import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

const CoffeeContractTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
  // Initial product data
  const initialProducts = [
    {
      id: 'product1',
      description: 'Arabica Coffee Beans',
      origin: 'Kazo, Uganda',
      quantity: '18,000',
      grade: 'Screen 18, AA',
      price: 'USD 5.86',
      total: 'USD 105,480.00',
      specs: 'Moisture content: 10-12%\nDefect count: Max 5 per 300g\nCup score: 84+ points\nProcessing: Fully washed\nFlavor profile: Citrus, floral, medium body'
    },
    {
      id: 'product2',
      description: 'Robusta Coffee Beans',
      origin: 'Kanoni, Uganda',
      quantity: '7,000',
      grade: 'Screen 15',
      price: 'USD 4.63',
      total: 'USD 32,410.00',
      specs: 'Moisture content: 11-13%\nDefect count: Max 15 per 300g\nCup score: 80+ points\nProcessing: Natural\nFlavor profile: Chocolate, nutty, full body'
    }
  ];

  // State to track products
  const [products, setProducts] = useState(
    data.products || initialProducts
  );

  // State for payment terms structure
  const [paymentTermsItems, setPaymentTermsItems] = useState(
    data.paymentTermsItems || [
      { id: 1, text: "30% advance payment upon contract signing" },
      { id: 2, text: "70% balance payment by irrevocable Letter of Credit at sight" },
      { id: 3, text: "L/C to be issued by buyer's bank within 14 days of contract signing" },
      { id: 4, text: "L/C to be confirmed by Standard Chartered Bank, Kampala" },
      { id: 5, text: "All banking charges outside Uganda to be borne by the Buyer" }
    ]
  );

  // Update parent data when products change
  useEffect(() => {
    if (editMode) {
      onDataChange('products', products);
    }
  }, [products, editMode, onDataChange]);

  // Update parent data when payment terms items change
  useEffect(() => {
    if (editMode) {
      onDataChange('paymentTermsItems', paymentTermsItems);
    }
  }, [paymentTermsItems, editMode, onDataChange]);

  // Calculate total contract value
  const totalContractValue = products.reduce((sum, product) => {
    const totalValue = product.total.replace(/[^\d.]/g, '');
    return sum + (parseFloat(totalValue) || 0);
  }, 0);

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

  // Update a product field
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };
    setProducts(updatedProducts);
  };

  // Add a new product
  const addProduct = () => {
    const newProduct = {
      id: `product${products.length + 1}`,
      description: 'New Coffee Product',
      origin: 'Uganda',
      quantity: '0',
      grade: 'Select Grade',
      price: 'USD 0.00',
      total: 'USD 0.00',
      specs: 'Moisture content: \nDefect count: \nCup score: \nProcessing: \nFlavor profile: '
    };
    setProducts([...products, newProduct]);
  };

  // Remove a product
  const removeProduct = (index) => {
    if (products.length <= 1) return; // Keep at least one product
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  // Add a new payment term item
  const addPaymentTermItem = () => {
    const newId = paymentTermsItems.length > 0 ? Math.max(...paymentTermsItems.map(item => item.id)) + 1 : 1;
    setPaymentTermsItems([...paymentTermsItems, { id: newId, text: "New payment term" }]);
  };

  // Update a payment term item
  const updatePaymentTermItem = (id, newText) => {
    setPaymentTermsItems(prevItems => 
      prevItems.map(item => item.id === id ? { ...item, text: newText } : item)
    );
  };

  // Remove a payment term item
  const removePaymentTermItem = (id) => {
    setPaymentTermsItems(prevItems => prevItems.filter(item => item.id !== id));
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
            Contract #: <EditableField field="contractNumber" defaultValue="KCL-2024-[XXXX]" />
          </p>
          <p className="text-sm text-gray-600">
            Date: <EditableField field="currentDate" defaultValue="[Current Date]" />
          </p>
        </div>
      </div>

      {/* Parties */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-blue-800">PARTIES</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r pr-4">
            <h4 className="font-semibold">SELLER:</h4>
            <p className="text-sm">KAJON Coffee Limited</p>
            <p className="text-sm">Kampala, Uganda</p>
            <p className="text-sm">Registration #: UG2023786541</p>
          </div>
          <div>
            <h4 className="font-semibold">BUYER:</h4>
            <p className="text-sm">
              <EditableField field="buyerName" defaultValue="[Buyer Company Name]" />
            </p>
            <p className="text-sm">
              <EditableField field="buyerAddress" defaultValue="[Buyer Address]" />
            </p>
            <p className="text-sm">
              Registration #: <EditableField field="buyerRegistration" defaultValue="[Buyer Registration #]" />
            </p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-blue-800">PRODUCT DETAILS</h3>
          {editMode && (
            <Button 
              type="button" 
              onClick={addProduct} 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          )}
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-left">Origin</th>
              <th className="border border-gray-300 p-2 text-left">Quantity (Kg)</th>
              <th className="border border-gray-300 p-2 text-left">Grade</th>
              <th className="border border-gray-300 p-2 text-left">Price per Kg</th>
              <th className="border border-gray-300 p-2 text-left">Total Value</th>
              {editMode && <th className="border border-gray-300 p-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td className="border border-gray-300 p-2">
                  {editMode ? (
                    <Input 
                      value={product.description} 
                      onChange={(e) => handleProductChange(index, 'description', e.target.value)} 
                      className="w-full border border-blue-300 p-1"
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editMode ? (
                    <Input 
                      value={product.origin} 
                      onChange={(e) => handleProductChange(index, 'origin', e.target.value)} 
                      className="w-full border border-blue-300 p-1"
                    />
                  ) : (
                    product.origin
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editMode ? (
                    <Input 
                      value={product.quantity} 
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)} 
                      className="w-full border border-blue-300 p-1"
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editMode ? (
                    <Input 
                      value={product.grade} 
                      onChange={(e) => handleProductChange(index, 'grade', e.target.value)} 
                      className="w-full border border-blue-300 p-1"
                    />
                  ) : (
                    product.grade
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editMode ? (
                    <Input 
                      value={product.price} 
                      onChange={(e) => handleProductChange(index, 'price', e.target.value)} 
                      className="w-full border border-blue-300 p-1"
                    />
                  ) : (
                    product.price
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editMode ? (
                    <Input 
                      value={product.total} 
                      onChange={(e) => handleProductChange(index, 'total', e.target.value)} 
                      className="w-full border border-blue-300 p-1"
                    />
                  ) : (
                    product.total
                  )}
                </td>
                {editMode && (
                  <td className="border border-gray-300 p-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeProduct(index)}
                      disabled={products.length <= 1}
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
              <td colSpan={editMode ? "6" : "5"} className="border border-gray-300 p-2 font-bold text-right">Total Contract Value:</td>
              <td className="border border-gray-300 p-2 font-bold">
                {editMode ? (
                  <Input 
                    value={data.totalValue || `USD ${totalContractValue.toLocaleString()}`} 
                    onChange={(e) => onDataChange('totalValue', e.target.value)} 
                    className="border border-blue-300 p-1"
                  />
                ) : (
                  data.totalValue || `USD ${totalContractValue.toLocaleString()}`
                )}
              </td>
              {editMode && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>

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
    </div>
  );
};

export default CoffeeContractTemplate;
