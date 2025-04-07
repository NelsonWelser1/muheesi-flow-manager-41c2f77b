
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from 'lucide-react';

const CoffeeContractTemplate = ({ editMode, data, onDataChange }) => {
  // Function to add a new product detail row
  const handleAddProduct = () => {
    const newProductDetails = [...(data.productDetails || []), {
      coffee_type: '',
      quantity: '',
      unit: 'kg',
      price_per_unit: '',
      total_value: ''
    }];
    onDataChange('productDetails', newProductDetails);
  };
  
  // Function to update a product detail row
  const handleUpdateProduct = (index, field, value) => {
    const updatedProducts = [...(data.productDetails || [])];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };
    
    // Calculate total value if quantity and price are set
    if (field === 'quantity' || field === 'price_per_unit') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(updatedProducts[index].quantity) || 0;
      const price = field === 'price_per_unit' ? parseFloat(value) || 0 : parseFloat(updatedProducts[index].price_per_unit) || 0;
      updatedProducts[index].total_value = (quantity * price).toFixed(2);
    }
    
    onDataChange('productDetails', updatedProducts);
  };
  
  // Function to remove a product detail row
  const handleRemoveProduct = (index) => {
    const updatedProducts = [...(data.productDetails || [])];
    updatedProducts.splice(index, 1);
    onDataChange('productDetails', updatedProducts);
  };
  
  // Function to add a new quality specification row
  const handleAddSpecification = () => {
    const newQualitySpecs = [...(data.qualitySpecifications || []), {
      parameter: '',
      requirement: ''
    }];
    onDataChange('qualitySpecifications', newQualitySpecs);
  };
  
  // Function to update a quality specification row
  const handleUpdateSpecification = (index, field, value) => {
    const updatedSpecs = [...(data.qualitySpecifications || [])];
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value
    };
    onDataChange('qualitySpecifications', updatedSpecs);
  };
  
  // Function to remove a quality specification row
  const handleRemoveSpecification = (index) => {
    const updatedSpecs = [...(data.qualitySpecifications || [])];
    updatedSpecs.splice(index, 1);
    onDataChange('qualitySpecifications', updatedSpecs);
  };
  
  // Calculate total contract value
  const getTotalContractValue = () => {
    return (data.productDetails || [])
      .reduce((sum, product) => sum + (parseFloat(product.total_value) || 0), 0)
      .toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm border print:border-0 print:shadow-none">
      {/* Header and Logo */}
      <div className="flex justify-between items-start mb-6 pb-6 border-b">
        <div>
          <div className="flex items-center mb-2">
            <img 
              src="/combined-logo.png" 
              alt="KAJON Coffee Limited" 
              className="h-16 w-auto mr-3"
            />
          </div>
          <h1 className="text-2xl font-bold text-blue-900">COFFEE EXPORT CONTRACT</h1>
          <p className="text-gray-600">KAJON Coffee Limited</p>
          <p className="text-gray-600">Kanoni, Kazo District, Uganda</p>
        </div>
        <div>
          <p className="text-right">
            <span className="font-semibold">Contract No.: </span>
            {editMode ? (
              <Input 
                value={data.contractNumber || ''} 
                onChange={(e) => onDataChange('contractNumber', e.target.value)}
                className="mt-1 inline-block w-40"
              />
            ) : (
              <span>{data.contractNumber}</span>
            )}
          </p>
          <p className="text-right mt-2">
            <span className="font-semibold">Date: </span>
            {editMode ? (
              <Input 
                type="date" 
                value={data.currentDate || ''} 
                onChange={(e) => onDataChange('currentDate', e.target.value)}
                className="mt-1 inline-block w-40"
              />
            ) : (
              <span>{data.currentDate}</span>
            )}
          </p>
        </div>
      </div>
      
      {/* Parties */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">PARTIES TO THE CONTRACT</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Seller:</h3>
            <p>KAJON Coffee Limited</p>
            <p>Kanoni, Kazo District</p>
            <p>Uganda</p>
            <p>Registration No: UG20190034765</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Buyer:</h3>
            {editMode ? (
              <>
                <Input 
                  value={data.buyerName || ''} 
                  onChange={(e) => onDataChange('buyerName', e.target.value)}
                  className="mb-2"
                  placeholder="Buyer Company Name"
                />
                <Input 
                  value={data.buyerAddress || ''} 
                  onChange={(e) => onDataChange('buyerAddress', e.target.value)}
                  className="mb-2"
                  placeholder="Buyer Address"
                />
                <Input 
                  value={data.buyerRegistration || ''} 
                  onChange={(e) => onDataChange('buyerRegistration', e.target.value)}
                  className="mb-2"
                  placeholder="Registration Number"
                />
              </>
            ) : (
              <>
                <p>{data.buyerName}</p>
                <p>{data.buyerAddress}</p>
                <p>Registration No: {data.buyerRegistration}</p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">PRODUCT DETAILS</h2>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border p-2 text-left">Coffee Type</th>
              <th className="border p-2 text-left">Quantity</th>
              <th className="border p-2 text-left">Unit</th>
              <th className="border p-2 text-left">Price per Unit</th>
              <th className="border p-2 text-left">Total Value</th>
              {editMode && <th className="border p-2 text-center w-10">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(data.productDetails || []).map((product, index) => (
              <tr key={index}>
                <td className="border p-2">
                  {editMode ? (
                    <Input 
                      value={product.coffee_type || ''} 
                      onChange={(e) => handleUpdateProduct(index, 'coffee_type', e.target.value)}
                      placeholder="Coffee Type"
                    />
                  ) : (
                    product.coffee_type
                  )}
                </td>
                <td className="border p-2">
                  {editMode ? (
                    <Input 
                      value={product.quantity || ''} 
                      onChange={(e) => handleUpdateProduct(index, 'quantity', e.target.value)}
                      type="number"
                      placeholder="Quantity"
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
                <td className="border p-2">
                  {editMode ? (
                    <Input 
                      value={product.unit || 'kg'} 
                      onChange={(e) => handleUpdateProduct(index, 'unit', e.target.value)}
                      placeholder="Unit"
                    />
                  ) : (
                    product.unit
                  )}
                </td>
                <td className="border p-2">
                  {editMode ? (
                    <Input 
                      value={product.price_per_unit || ''} 
                      onChange={(e) => handleUpdateProduct(index, 'price_per_unit', e.target.value)}
                      type="number"
                      step="0.01"
                      placeholder="Price per Unit"
                    />
                  ) : (
                    `$${product.price_per_unit}`
                  )}
                </td>
                <td className="border p-2">
                  {editMode ? (
                    <Input 
                      value={product.total_value || ''} 
                      readOnly
                      className="bg-gray-50"
                    />
                  ) : (
                    `$${product.total_value}`
                  )}
                </td>
                {editMode && (
                  <td className="border p-2 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            
            {/* Total Row */}
            <tr className="bg-blue-50 font-semibold">
              <td colSpan={editMode ? 4 : 4} className="border p-2 text-right">TOTAL CONTRACT VALUE:</td>
              <td className="border p-2">${getTotalContractValue()}</td>
              {editMode && <td className="border p-2"></td>}
            </tr>
          </tbody>
        </table>
        
        {editMode && (
          <div className="mt-2 text-right">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleAddProduct}
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Quality Specifications */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">QUALITY SPECIFICATIONS</h2>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border p-2 text-left">Parameter</th>
              <th className="border p-2 text-left">Requirement</th>
              {editMode && <th className="border p-2 text-center w-10">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(data.qualitySpecifications || []).map((spec, index) => (
              <tr key={index}>
                <td className="border p-2">
                  {editMode ? (
                    <Input 
                      value={spec.parameter || ''} 
                      onChange={(e) => handleUpdateSpecification(index, 'parameter', e.target.value)}
                      placeholder="Parameter"
                    />
                  ) : (
                    spec.parameter
                  )}
                </td>
                <td className="border p-2">
                  {editMode ? (
                    <Input 
                      value={spec.requirement || ''} 
                      onChange={(e) => handleUpdateSpecification(index, 'requirement', e.target.value)}
                      placeholder="Requirement"
                    />
                  ) : (
                    spec.requirement
                  )}
                </td>
                {editMode && (
                  <td className="border p-2 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveSpecification(index)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {editMode && (
          <div className="mt-2 text-right">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleAddSpecification}
            >
              <Plus className="h-4 w-4" />
              <span>Add Specification</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Terms and Conditions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">TERMS AND CONDITIONS</h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="font-semibold">1. Payment Terms:</h3>
            {editMode ? (
              <Textarea 
                value={data.paymentTerms || ''} 
                onChange={(e) => onDataChange('paymentTerms', e.target.value)}
                className="mt-1"
                rows={2}
              />
            ) : (
              <p className="ml-4">{data.paymentTerms}</p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold">2. Delivery Terms:</h3>
            {editMode ? (
              <Textarea 
                value={data.deliveryTerms || ''} 
                onChange={(e) => onDataChange('deliveryTerms', e.target.value)}
                className="mt-1"
                rows={2}
              />
            ) : (
              <p className="ml-4">{data.deliveryTerms}</p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold">3. Shipping Terms:</h3>
            {editMode ? (
              <Textarea 
                value={data.shippingTerms || ''} 
                onChange={(e) => onDataChange('shippingTerms', e.target.value)}
                className="mt-1"
                rows={2}
              />
            ) : (
              <p className="ml-4">{data.shippingTerms}</p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold">4. Inspection:</h3>
            {editMode ? (
              <Textarea 
                value={data.inspectionTerms || ''} 
                onChange={(e) => onDataChange('inspectionTerms', e.target.value)}
                className="mt-1"
                rows={2}
              />
            ) : (
              <p className="ml-4">{data.inspectionTerms}</p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold">5. Additional Terms:</h3>
            {editMode ? (
              <Textarea 
                value={data.additionalTerms || ''} 
                onChange={(e) => onDataChange('additionalTerms', e.target.value)}
                className="mt-1"
                rows={3}
              />
            ) : (
              <p className="ml-4">{data.additionalTerms}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Signatures */}
      <div className="mt-10 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">SIGNATURES</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="font-semibold">For Seller:</p>
            <div className="mt-10 border-t border-black pt-2">
              <p>Authorized Signature for KAJON Coffee Limited</p>
              {editMode && (
                <Input 
                  value={data.sellerSignature || ''} 
                  onChange={(e) => onDataChange('sellerSignature', e.target.value)}
                  className="mt-1"
                  placeholder="Name and Title"
                />
              )}
            </div>
          </div>
          
          <div>
            <p className="font-semibold">For Buyer:</p>
            <div className="mt-10 border-t border-black pt-2">
              <p>Authorized Signature for {data.buyerName}</p>
              {editMode && (
                <Input 
                  value={data.buyerSignature || ''} 
                  onChange={(e) => onDataChange('buyerSignature', e.target.value)}
                  className="mt-1"
                  placeholder="Name and Title"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeContractTemplate;
