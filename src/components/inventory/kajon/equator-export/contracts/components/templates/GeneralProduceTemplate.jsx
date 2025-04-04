
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

const GeneralProduceTemplate = ({ editMode = false, data = {}, onDataChange = () => {} }) => {
  // State for seller details
  const [sellerDetails, setSellerDetails] = useState(
    data.sellerDetails || {
      name: "KAJON Coffee Limited",
      address: "Kampala, Uganda",
      registration: "Registration #: UG2023786541"
    }
  );

  // State for buyer details
  const [buyerDetails, setBuyerDetails] = useState(
    data.buyerDetails || {
      name: "[Buyer Company Name]",
      address: "[Buyer Address]",
      registration: "Registration #: [Buyer Registration #]"
    }
  );

  // State for product details including calculations
  const [productDetails, setProductDetails] = useState(
    data.productDetails || [
      { 
        description: "",
        quantity: 0,
        pricePerKg: 0,
        totalValue: 0
      }
    ]
  );

  // Update parent data when details change
  useEffect(() => {
    if (editMode) {
      onDataChange('sellerDetails', sellerDetails);
      onDataChange('buyerDetails', buyerDetails);
      onDataChange('productDetails', productDetails);
    }
  }, [sellerDetails, buyerDetails, productDetails, editMode, onDataChange]);

  // Helper function to handle product detail changes and calculate total value
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...productDetails];
    updatedProducts[index][field] = value;
    
    // Calculate total value whenever quantity or price changes
    if (field === 'quantity' || field === 'pricePerKg') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(updatedProducts[index].quantity) || 0;
      const price = field === 'pricePerKg' ? parseFloat(value) || 0 : parseFloat(updatedProducts[index].pricePerKg) || 0;
      updatedProducts[index].totalValue = quantity * price;
    }
    
    setProductDetails(updatedProducts);
  };

  // Add a new product row
  const handleAddProduct = () => {
    setProductDetails([
      ...productDetails,
      { 
        description: "",
        quantity: 0,
        pricePerKg: 0,
        totalValue: 0
      }
    ]);
  };

  // Remove a product row
  const handleRemoveProduct = (index) => {
    const updatedProducts = [...productDetails];
    updatedProducts.splice(index, 1);
    setProductDetails(updatedProducts);
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
            className="w-full min-h-[80px] border border-green-300 p-2"
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onDataChange(field, e.target.value)}
          className="border border-green-300 p-1"
        />
      );
    }
    
    return isMultiline ? (
      <p className="text-sm">{value}</p>
    ) : (
      <span>{value}</span>
    );
  };

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

  // Format number to currency with 2 decimal places
  const formatCurrency = (value) => {
    return parseFloat(value).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 border border-gray-200 shadow-sm print:shadow-none print:border-none">
      {/* Company Header */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <img 
            src="/combined-logo.png" 
            alt="KAJON Coffee Limited" 
            className="h-16 w-auto mb-2"
          />
          <h2 className="text-lg font-bold">KAJON Coffee Limited</h2>
          <p className="text-sm text-gray-600">Kanoni, Kazo District, Uganda</p>
          <p className="text-sm text-gray-600">6th floor, Arie Towers, Mackinnon Road, Nakasero</p>
          <p className="text-sm text-gray-600">Kampala, Uganda, 256</p>
          <p className="text-sm text-gray-600">Tel: +256 776 670680 / +256 757 757517</p>
          <p className="text-sm text-gray-600">Email: kajoncoffeelimited@gmail.com</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-green-700">GENERAL PRODUCE EXPORT CONTRACT</h1>
          <p className="text-sm text-gray-600 mt-2">
            Contract #: {editMode ? (
              <Input 
                value={data.contractNumber || "KCL-GP-2024-[XXXX]"}
                onChange={(e) => onDataChange('contractNumber', e.target.value)}
                className="border border-green-300 p-1 mt-1 w-full"
                placeholder="Enter contract number"
              />
            ) : (
              <span>{data.contractNumber || "KCL-GP-2024-[XXXX]"}</span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            Date: {editMode ? (
              <Input 
                value={data.currentDate || ""}
                onChange={(e) => onDataChange('currentDate', e.target.value)}
                className="border border-green-300 p-1 mt-1 w-full" 
                placeholder="YYYY-MM-DD"
                type="date"
              />
            ) : (
              <span>{data.currentDate || "[Current Date]"}</span>
            )}
          </p>
        </div>
      </div>

      {/* Parties Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-700">PARTIES</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r pr-4">
            <h4 className="font-semibold">SELLER:</h4>
            {editMode ? (
              <div className="space-y-2 mt-1">
                <Input 
                  value={sellerDetails.name}
                  onChange={(e) => handleSellerChange('name', e.target.value)}
                  placeholder="Company Name"
                  className="w-full border border-green-300 p-1"
                />
                <Input 
                  value={sellerDetails.address}
                  onChange={(e) => handleSellerChange('address', e.target.value)}
                  placeholder="Address"
                  className="w-full border border-green-300 p-1"
                />
                <Input 
                  value={sellerDetails.registration}
                  onChange={(e) => handleSellerChange('registration', e.target.value)}
                  placeholder="Registration Number"
                  className="w-full border border-green-300 p-1"
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
                  className="w-full border border-green-300 p-1"
                />
                <Input 
                  value={buyerDetails.address}
                  onChange={(e) => handleBuyerChange('address', e.target.value)}
                  placeholder="Address"
                  className="w-full border border-green-300 p-1"
                />
                <Input 
                  value={buyerDetails.registration}
                  onChange={(e) => handleBuyerChange('registration', e.target.value)}
                  placeholder="Registration Number"
                  className="w-full border border-green-300 p-1"
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

      {/* Product Details Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 text-green-700">PRODUCT DETAILS</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left">Description</th>
                <th className="border border-gray-300 p-2 text-left">Quantity (Kg)</th>
                <th className="border border-gray-300 p-2 text-left">Price per Kg</th>
                <th className="border border-gray-300 p-2 text-left">Total Value</th>
                {editMode && <th className="border border-gray-300 p-2 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {productDetails.map((product, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    {editMode ? (
                      <Input
                        value={product.description}
                        onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                        placeholder="Product description"
                        className="w-full border border-green-300 p-1"
                      />
                    ) : (
                      product.description || "N/A"
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {editMode ? (
                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                        placeholder="0"
                        className="w-full border border-green-300 p-1"
                      />
                    ) : (
                      product.quantity || "0"
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {editMode ? (
                      <Input
                        type="number"
                        value={product.pricePerKg}
                        onChange={(e) => handleProductChange(index, 'pricePerKg', e.target.value)}
                        placeholder="0.00"
                        className="w-full border border-green-300 p-1"
                      />
                    ) : (
                      product.pricePerKg || "0.00"
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 font-medium">
                    {formatCurrency(product.totalValue)}
                  </td>
                  {editMode && (
                    <td className="border border-gray-300 p-2 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(index)}
                        disabled={productDetails.length === 1}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {editMode && (
                <tr>
                  <td colSpan={5} className="p-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddProduct}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Product
                    </Button>
                  </td>
                </tr>
              )}
              <tr className="bg-gray-50">
                <td colSpan={2} className="border border-gray-300 p-2 text-right font-bold">
                  Total Contract Value:
                </td>
                <td colSpan={editMode ? 3 : 2} className="border border-gray-300 p-2 font-bold">
                  {formatCurrency(productDetails.reduce((sum, product) => sum + (parseFloat(product.totalValue) || 0), 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Signature Block */}
      <div className="grid grid-cols-2 gap-12 mt-12">
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">For and on behalf of SELLER</p>
          <p className="text-sm">Name: ________________________________</p>
          <p className="text-sm mt-2">Title: ________________________________</p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
        <div>
          <p className="font-semibold border-b border-gray-400 pb-8 mb-2">For and on behalf of BUYER</p>
          <p className="text-sm">Name: ________________________________</p>
          <p className="text-sm mt-2">Title: ________________________________</p>
          <p className="text-sm mt-2">Date: ________________________________</p>
          <p className="text-sm mt-2">Signature: ___________________________</p>
        </div>
      </div>

      {/* Company Seal/Stamp Area */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">[Company Seal/Stamp]</p>
      </div>
    </div>
  );
};

export default GeneralProduceTemplate;
