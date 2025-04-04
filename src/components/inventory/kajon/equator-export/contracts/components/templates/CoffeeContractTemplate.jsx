
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CoffeeContractTemplate = ({ 
  editMode = false, 
  data = {}, 
  onDataChange = () => {}, 
  onSave = null,
  isSpecialty = false
}) => {
  // Local state for editable fields
  const [sellerDetails, setSellerDetails] = useState({
    name: data.sellerDetails?.name || 'KAJON Coffee Limited',
    address: data.sellerDetails?.address || 'Kampala, Uganda',
    registration: data.sellerDetails?.registration || 'Registration #: UG2023786541'
  });
  
  const [buyerDetails, setBuyerDetails] = useState({
    name: data.buyerDetails?.name || '',
    address: data.buyerDetails?.address || '',
    registration: data.buyerDetails?.registration || ''
  });
  
  const [contractNumber, setContractNumber] = useState(data.contractNumber || (isSpecialty ? 'KCL-SC-2024-' : 'KCL-2024-') + new Date().getTime().toString().slice(-4));
  const [currentDate, setCurrentDate] = useState(data.currentDate || new Date().toISOString().split('T')[0]);
  
  // Products state - ensure it's an array
  const [products, setProducts] = useState(Array.isArray(data.products) ? data.products : [
    { id: `product-${uuidv4()}`, description: '', quantity: '', pricePerKg: '', totalValue: 0 }
  ]);
  
  // Specialty coffee fields
  const [coffeeOrigin, setCoffeeOrigin] = useState(data.coffeeOrigin || '');
  const [coffeeVariety, setCoffeeVariety] = useState(data.coffeeVariety || '');
  const [coffeeProcess, setCoffeeProcess] = useState(data.coffeeProcess || '');
  const [coffeeGrade, setCoffeeGrade] = useState(data.coffeeGrade || '');
  const [coffeeCertification, setCoffeeCertification] = useState(data.coffeeCertification || '');
  const [cuppingScore, setCuppingScore] = useState(data.cuppingScore || '');
  
  // Payment terms state - ensure it's an array and add unique IDs
  const [paymentTermsItems, setPaymentTermsItems] = useState(
    Array.isArray(data.paymentTermsItems) ? 
      data.paymentTermsItems.map(item => ({
        id: item.id || `term-${uuidv4()}`,
        description: item.description || item.text || ''
      })) : 
      [
        { id: `term-${uuidv4()}`, description: '30% of the contract value paid upon signing this agreement.' },
        { id: `term-${uuidv4()}`, description: '70% of the contract value paid upon presentation of shipping documents.' }
      ]
  );
  
  // Calculate contract total value
  const totalContractValue = products.reduce((sum, product) => {
    if (product.quantity && product.pricePerKg) {
      const totalValue = parseFloat(product.quantity) * parseFloat(product.pricePerKg) * 1000; // convert tons to kg
      return sum + totalValue;
    }
    return sum;
  }, 0);
  
  // Shipping and other details
  const [additionalShippingTerms, setAdditionalShippingTerms] = useState(data.additionalShippingTerms || '');
  
  // Sync changes back to parent component
  useEffect(() => {
    if (!onDataChange) return;
    
    onDataChange('sellerDetails', sellerDetails);
    onDataChange('buyerDetails', buyerDetails);
    onDataChange('contractNumber', contractNumber);
    onDataChange('currentDate', currentDate);
    onDataChange('products', products);
    onDataChange('paymentTermsItems', paymentTermsItems);
    onDataChange('totalContractValue', totalContractValue);
    onDataChange('additionalShippingTerms', additionalShippingTerms);
    
    // Specialty coffee fields
    if (isSpecialty) {
      onDataChange('coffeeOrigin', coffeeOrigin);
      onDataChange('coffeeVariety', coffeeVariety);
      onDataChange('coffeeProcess', coffeeProcess);
      onDataChange('coffeeGrade', coffeeGrade);
      onDataChange('coffeeCertification', coffeeCertification);
      onDataChange('cuppingScore', cuppingScore);
    }
  }, [
    sellerDetails, 
    buyerDetails, 
    contractNumber, 
    currentDate, 
    products, 
    paymentTermsItems, 
    totalContractValue, 
    additionalShippingTerms,
    // Specialty coffee fields
    coffeeOrigin,
    coffeeVariety,
    coffeeProcess,
    coffeeGrade,
    coffeeCertification,
    cuppingScore
  ]);
  
  // Handle changes to products
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };
    
    // Auto-calculate totalValue when quantity or pricePerKg changes
    if (field === 'quantity' || field === 'pricePerKg') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(updatedProducts[index].quantity) || 0;
      const pricePerKg = field === 'pricePerKg' ? parseFloat(value) || 0 : parseFloat(updatedProducts[index].pricePerKg) || 0;
      
      // Calculate total value (tons converted to kg: 1 ton = 1000 kg)
      const totalValue = quantity * pricePerKg * 1000;
      updatedProducts[index].totalValue = totalValue;
    }
    
    setProducts(updatedProducts);
  };
  
  // Add new product
  const addProduct = () => {
    setProducts([
      ...products,
      { id: `product-${uuidv4()}`, description: '', quantity: '', pricePerKg: '', totalValue: 0 }
    ]);
  };
  
  // Remove product
  const removeProduct = (index) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };
  
  // Handle changes to payment terms
  const addPaymentTermItem = () => {
    setPaymentTermsItems([
      ...paymentTermsItems,
      { id: `term-${uuidv4()}`, description: '' }
    ]);
  };
  
  const removePaymentTermItem = (index) => {
    if (paymentTermsItems.length > 1) {
      setPaymentTermsItems(paymentTermsItems.filter((_, i) => i !== index));
    }
  };
  
  const updatePaymentTermItem = (index, description) => {
    const updatedTerms = [...paymentTermsItems];
    updatedTerms[index] = {
      ...updatedTerms[index],
      description
    };
    setPaymentTermsItems(updatedTerms);
  };
  
  // Handle form submission
  const handleSaveContract = () => {
    if (!onSave) return;
    
    // Create data object for submission to the backend
    let contractData = {
      contract_number: contractNumber,
      contract_date: currentDate,
      seller_name: sellerDetails.name,
      seller_address: sellerDetails.address,
      seller_registration: sellerDetails.registration,
      buyer_name: buyerDetails.name,
      buyer_address: buyerDetails.address,
      buyer_registration: buyerDetails.registration,
      products: products,
      payment_terms_items: paymentTermsItems,
      total_contract_value: totalContractValue,
      additional_shipping_terms: additionalShippingTerms,
    };
    
    // Add specialty coffee data if relevant
    if (isSpecialty) {
      contractData = {
        ...contractData,
        coffee_origin: coffeeOrigin,
        coffee_variety: coffeeVariety,
        coffee_process: coffeeProcess,
        coffee_grade: coffeeGrade,
        coffee_certification: coffeeCertification,
        cupping_score: cuppingScore ? parseFloat(cuppingScore) : null
      };
    }
    
    // Call the save function
    onSave(contractData);
  };
  
  // Format as a currency value
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className="flex flex-col space-y-8 max-w-4xl mx-auto bg-white p-8 shadow-sm contract-template">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">{isSpecialty ? 'SPECIALTY COFFEE EXPORT CONTRACT' : 'COFFEE EXPORT CONTRACT'}</h1>
        <p className="text-sm text-gray-500 print:hidden">
          {editMode ? 'Editing Mode - Make changes to fields below' : 'View Mode - Read only'}
        </p>
      </div>
      
      {/* Contract Details Header */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold mb-2">Contract Number:</p>
          {editMode ? (
            <Input 
              value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)}
              className="border border-gray-300 px-2 py-1"
            />
          ) : (
            <p>{contractNumber}</p>
          )}
        </div>
        <div>
          <p className="font-semibold mb-2">Date:</p>
          {editMode ? (
            <Input 
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="border border-gray-300 px-2 py-1"
            />
          ) : (
            <p>{new Date(currentDate).toLocaleDateString()}</p>
          )}
        </div>
      </div>
      
      {/* Seller and Buyer Information */}
      <div className="grid grid-cols-2 gap-8">
        {/* Seller Information */}
        <div className="border p-4">
          <h2 className="font-bold mb-2 text-lg">SELLER:</h2>
          <div className="space-y-2">
            <div>
              <p className="text-sm mb-1">Company Name:</p>
              {editMode ? (
                <Input 
                  value={sellerDetails.name}
                  onChange={(e) => setSellerDetails({...sellerDetails, name: e.target.value})}
                  className="border border-gray-300 px-2 py-1"
                />
              ) : (
                <p className="font-semibold">{sellerDetails.name}</p>
              )}
            </div>
            <div>
              <p className="text-sm mb-1">Address:</p>
              {editMode ? (
                <Input 
                  value={sellerDetails.address}
                  onChange={(e) => setSellerDetails({...sellerDetails, address: e.target.value})}
                  className="border border-gray-300 px-2 py-1"
                />
              ) : (
                <p>{sellerDetails.address}</p>
              )}
            </div>
            <div>
              <p className="text-sm mb-1">Registration:</p>
              {editMode ? (
                <Input 
                  value={sellerDetails.registration}
                  onChange={(e) => setSellerDetails({...sellerDetails, registration: e.target.value})}
                  className="border border-gray-300 px-2 py-1"
                />
              ) : (
                <p>{sellerDetails.registration}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Buyer Information */}
        <div className="border p-4">
          <h2 className="font-bold mb-2 text-lg">BUYER:</h2>
          <div className="space-y-2">
            <div>
              <p className="text-sm mb-1">Company Name:</p>
              {editMode ? (
                <Input 
                  value={buyerDetails.name}
                  onChange={(e) => setBuyerDetails({...buyerDetails, name: e.target.value})}
                  className="border border-gray-300 px-2 py-1"
                  placeholder="Enter buyer company name"
                />
              ) : (
                <p className="font-semibold">{buyerDetails.name || '[Buyer Company Name]'}</p>
              )}
            </div>
            <div>
              <p className="text-sm mb-1">Address:</p>
              {editMode ? (
                <Input 
                  value={buyerDetails.address}
                  onChange={(e) => setBuyerDetails({...buyerDetails, address: e.target.value})}
                  className="border border-gray-300 px-2 py-1"
                  placeholder="Enter buyer address"
                />
              ) : (
                <p>{buyerDetails.address || '[Buyer Address]'}</p>
              )}
            </div>
            <div>
              <p className="text-sm mb-1">Registration:</p>
              {editMode ? (
                <Input 
                  value={buyerDetails.registration}
                  onChange={(e) => setBuyerDetails({...buyerDetails, registration: e.target.value})}
                  className="border border-gray-300 px-2 py-1"
                  placeholder="Enter buyer registration number"
                />
              ) : (
                <p>{buyerDetails.registration || '[Buyer Registration #]'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Specialty Coffee Details - Only show if this is a specialty contract */}
      {isSpecialty && (
        <div className="border p-4">
          <h2 className="font-bold mb-4 text-lg">SPECIALTY COFFEE DETAILS:</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1">Origin:</p>
              {editMode ? (
                <Input 
                  value={coffeeOrigin}
                  onChange={(e) => setCoffeeOrigin(e.target.value)}
                  className="border border-gray-300 px-2 py-1"
                  placeholder="e.g., Mount Elgon, Uganda"
                />
              ) : (
                <p>{coffeeOrigin || 'Not specified'}</p>
              )}
            </div>
            <div>
              <p className="text-sm mb-1">Variety:</p>
              {editMode ? (
                <Input 
                  value={coffeeVariety}
                  onChange={(e) => setCoffeeVariety(e.target.value)}
                  className="border border-gray-300 px-2 py-1"
                  placeholder="e.g., SL28, Bourbon"
                />
              ) : (
                <p>{coffeeVariety || 'Not specified'}</p>
              )}
            </div>
            <div>
              <p className="text-sm mb-1">Processing Method:</p>
              {editMode ? (
                <Input 
                  value={coffeeProcess}
                  onChange={(e) => setCoffeeProcess(e.target.value)}
                  className="border border-gray-300 px-2 py-1"
                  placeholder="e.g., Washed, Natural, Honey"
                />
              ) : (
                <p>{coffeeProcess || 'Not specified'}</p>
              )}
            </div>
            <div>
              <p className="text-sm mb-1">Grade:</p>
              {editMode ? (
                <Input 
                  value={coffeeGrade}
                  onChange={(e) => setCoffeeGrade(e.target.value)}
                  className="border border-gray-300 px-2 py-1"
                  placeholder="e.g., AA, AB"
                />
              ) : (
                <p>{coffeeGrade || 'Not specified'}</p>
              )}
            </div>
            <div>
              <p className="text-sm mb-1">Certification:</p>
              {editMode ? (
                <Input 
                  value={coffeeCertification}
                  onChange={(e) => setCoffeeCertification(e.target.value)}
                  className="border border-gray-300 px-2 py-1"
                  placeholder="e.g., Organic, Fair Trade, Rainforest Alliance"
                />
              ) : (
                <p>{coffeeCertification || 'Not specified'}</p>
              )}
            </div>
            <div>
              <p className="text-sm mb-1">Cupping Score:</p>
              {editMode ? (
                <Input 
                  type="number"
                  value={cuppingScore}
                  onChange={(e) => setCuppingScore(e.target.value)}
                  className="border border-gray-300 px-2 py-1"
                  placeholder="e.g., 85.5"
                  step="0.25"
                  min="0"
                  max="100"
                />
              ) : (
                <p>{cuppingScore || 'Not specified'}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Product Details */}
      <div>
        <h2 className="font-bold mb-4 text-lg">PRODUCT DETAILS:</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-right">Quantity (Tons)</th>
                <th className="border p-2 text-right">Price per Kg (USD)</th>
                <th className="border p-2 text-right">Total Value (USD)</th>
                {editMode && <th className="border p-2 w-10"></th>}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id || index} className="border-b">
                  <td className="border p-2">
                    {editMode ? (
                      <Input 
                        value={product.description}
                        onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                        className="border border-gray-300 px-2 py-1 w-full"
                        placeholder="e.g., Bugisu AA Arabica Coffee"
                      />
                    ) : (
                      <p>{product.description || '-'}</p>
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {editMode ? (
                      <Input 
                        type="number" 
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                        className="border border-gray-300 px-2 py-1 w-full text-right"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      <p>{parseFloat(product.quantity).toFixed(2) || '0.00'}</p>
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {editMode ? (
                      <Input 
                        type="number" 
                        value={product.pricePerKg}
                        onChange={(e) => handleProductChange(index, 'pricePerKg', e.target.value)}
                        className="border border-gray-300 px-2 py-1 w-full text-right"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      <p>{parseFloat(product.pricePerKg).toFixed(2) || '0.00'}</p>
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {formatCurrency(product.totalValue)}
                  </td>
                  {editMode && (
                    <td className="border p-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeProduct(index)}
                        disabled={products.length <= 1}
                        className="p-1 h-8 w-8"
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
              
              {/* Total Row */}
              <tr className="font-bold bg-gray-50">
                <td className="border p-2 text-right" colSpan={2}>
                  TOTAL CONTRACT VALUE:
                </td>
                <td className="border p-2 text-right">
                  {/* Placeholder for alignment */}
                </td>
                <td className="border p-2 text-right">
                  {formatCurrency(totalContractValue)}
                </td>
                {editMode && <td className="border p-2"></td>}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Add Product Button (only in edit mode) */}
        {editMode && (
          <div className="mt-2 flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addProduct}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Product
            </Button>
          </div>
        )}
      </div>
      
      {/* Payment Terms */}
      <div>
        <h2 className="font-bold mb-4 text-lg">PAYMENT TERMS:</h2>
        <div className="space-y-3">
          {paymentTermsItems.map((item, index) => (
            <div key={item.id || index} className="flex items-start">
              <div className="mr-2 mt-1">
                {`${index + 1}.`}
              </div>
              <div className="flex-grow">
                {editMode ? (
                  <Textarea 
                    value={item.description || item.text || ''}
                    onChange={(e) => updatePaymentTermItem(index, e.target.value)}
                    className="border border-gray-300 px-2 py-1 w-full min-h-[60px]"
                    placeholder="Enter payment term"
                  />
                ) : (
                  <p>{item.description || item.text || '-'}</p>
                )}
              </div>
              {editMode && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removePaymentTermItem(index)}
                  disabled={paymentTermsItems.length <= 1}
                  className="ml-2 p-1 h-8 w-8 mt-1"
                >
                  <MinusCircle className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {/* Add Payment Term Button (only in edit mode) */}
        {editMode && (
          <div className="mt-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addPaymentTermItem}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Payment Term
            </Button>
          </div>
        )}
      </div>
      
      {/* Shipping Terms */}
      <div>
        <h2 className="font-bold mb-4 text-lg">SHIPPING AND DELIVERY:</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="font-medium">Incoterm:</p>
              <p>FOB Mombasa</p>
            </div>
            <div>
              <p className="font-medium">Packaging:</p>
              <p>60kg jute bags with GrainPro liners</p>
            </div>
            <div>
              <p className="font-medium">Loading Port:</p>
              <p>Mombasa, Kenya</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-medium">Destination:</p>
              <p>Hamburg, Germany</p>
            </div>
            <div>
              <p className="font-medium">Latest Shipment Date:</p>
              <p>October 15, 2024</p>
            </div>
            <div>
              <p className="font-medium">Delivery Timeline:</p>
              <p>30-45 days from loading</p>
            </div>
          </div>
        </div>
        
        {/* Additional Terms */}
        <div className="mt-4">
          <p className="font-medium mb-2">Additional Shipping Terms:</p>
          {editMode ? (
            <Textarea 
              value={additionalShippingTerms}
              onChange={(e) => setAdditionalShippingTerms(e.target.value)}
              className="border border-gray-300 px-2 py-1 w-full min-h-[80px]"
              placeholder="Enter any additional shipping terms or special conditions"
            />
          ) : (
            <p className="border p-2 min-h-[40px]">{additionalShippingTerms || 'None specified'}</p>
          )}
        </div>
      </div>
      
      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div className="border-t pt-4">
          <p className="font-bold mb-4">For and on behalf of SELLER:</p>
          <div className="space-y-2">
            <p>Name: _______________________</p>
            <p>Title: _______________________</p>
            <p>Date: _______________________</p>
            <p>Signature: __________________</p>
          </div>
        </div>
        <div className="border-t pt-4">
          <p className="font-bold mb-4">For and on behalf of BUYER:</p>
          <div className="space-y-2">
            <p>Name: _______________________</p>
            <p>Title: _______________________</p>
            <p>Date: _______________________</p>
            <p>Signature: __________________</p>
          </div>
        </div>
      </div>
      
      {/* Company Seal/Stamp */}
      <div className="text-center mt-6 border-t pt-4">
        <p>&#91;Company Seal/Stamp&#93;</p>
      </div>
      
      {/* Save Button (only shown in editing mode and when onSave is provided) */}
      {editMode && onSave && (
        <div className="print:hidden mt-8 flex justify-center">
          <Button 
            onClick={handleSaveContract}
            className="px-8 py-2"
          >
            Save Contract
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoffeeContractTemplate;
