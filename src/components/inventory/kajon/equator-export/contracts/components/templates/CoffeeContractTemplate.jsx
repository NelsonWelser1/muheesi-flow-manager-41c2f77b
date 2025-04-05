
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PenLine, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CoffeeContractTemplate = ({ editMode = false, data = {}, onDataChange, onSave }) => {
  const [contractData, setContractData] = useState({
    contractNumber: '',
    currentDate: new Date().toISOString().split('T')[0],
    sellerDetails: {
      name: 'KAJON Coffee Limited',
      address: 'Kampala, Uganda',
      registration: 'Registration #: UG2023786541'
    },
    buyerDetails: {
      name: '',
      address: '',
      registration: ''
    },
    products: [],
    paymentTermsItems: [],
    ...data
  });

  // Initialize with default product if empty
  useEffect(() => {
    if (contractData.products && contractData.products.length === 0) {
      addProduct();
    }
    
    // Initialize with default payment terms if empty
    if (contractData.paymentTermsItems && contractData.paymentTermsItems.length === 0) {
      addPaymentTerm();
    }
  }, []);

  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange('contractData', contractData);
    }
  }, [contractData, onDataChange]);

  const handleChange = (field, value) => {
    setContractData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setContractData(prevData => ({
      ...prevData,
      [parent]: {
        ...prevData[parent],
        [field]: value
      }
    }));
  };

  const addProduct = () => {
    const newProduct = {
      id: `product-${uuidv4()}`,
      description: 'Arabica Coffee Beans, Grade AA',
      quantity: '20',
      unit: 'MT',
      unitPrice: '4.50',
      currency: 'USD',
      total: '90,000.00'
    };

    setContractData(prevData => ({
      ...prevData,
      products: [...(prevData.products || []), newProduct]
    }));
  };

  const updateProduct = (id, field, value) => {
    setContractData(prevData => {
      const updatedProducts = (prevData.products || []).map(product => {
        if (product.id === id) {
          const updatedProduct = { ...product, [field]: value };
          
          // Auto-calculate total if quantity or unitPrice changes
          if (field === 'quantity' || field === 'unitPrice') {
            const quantity = parseFloat(field === 'quantity' ? value : product.quantity) || 0;
            const unitPrice = parseFloat(field === 'unitPrice' ? value : product.unitPrice) || 0;
            const total = (quantity * unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            updatedProduct.total = total;
          }
          
          return updatedProduct;
        }
        return product;
      });
      
      // Calculate contract total value
      const totalContractValue = updatedProducts.reduce((sum, product) => {
        const productTotal = parseFloat(product.total.replace(/,/g, '')) || 0;
        return sum + productTotal;
      }, 0);
      
      return {
        ...prevData,
        products: updatedProducts,
        totalContractValue: totalContractValue.toFixed(2)
      };
    });
  };

  const removeProduct = (id) => {
    setContractData(prevData => {
      const updatedProducts = (prevData.products || []).filter(product => product.id !== id);
      
      // Recalculate total contract value
      const totalContractValue = updatedProducts.reduce((sum, product) => {
        const productTotal = parseFloat(product.total.replace(/,/g, '')) || 0;
        return sum + productTotal;
      }, 0);
      
      return {
        ...prevData,
        products: updatedProducts,
        totalContractValue: totalContractValue.toFixed(2)
      };
    });
  };

  const addPaymentTerm = () => {
    const newPaymentTerm = {
      id: `payment-${uuidv4()}`,
      term: '100% payment upon loading at origin port'
    };

    setContractData(prevData => ({
      ...prevData,
      paymentTermsItems: [...(prevData.paymentTermsItems || []), newPaymentTerm]
    }));
  };

  const updatePaymentTerm = (id, value) => {
    setContractData(prevData => ({
      ...prevData,
      paymentTermsItems: (prevData.paymentTermsItems || []).map(item => 
        item.id === id ? { ...item, term: value } : item
      )
    }));
  };

  const removePaymentTerm = (id) => {
    setContractData(prevData => ({
      ...prevData,
      paymentTermsItems: (prevData.paymentTermsItems || []).filter(item => item.id !== id)
    }));
  };

  const handleSaveContract = () => {
    // Prepare data for saving
    const contractToSave = {
      contract_number: contractData.contractNumber,
      contract_date: contractData.currentDate,
      seller_name: contractData.sellerDetails.name,
      seller_address: contractData.sellerDetails.address,
      seller_registration: contractData.sellerDetails.registration,
      buyer_name: contractData.buyerDetails.name,
      buyer_address: contractData.buyerDetails.address,
      buyer_registration: contractData.buyerDetails.registration,
      products: contractData.products,
      payment_terms_items: contractData.paymentTermsItems,
      shipping_left_label1: 'Incoterm:',
      shipping_left_value1: 'FOB Mombasa',
      shipping_left_label2: 'Packaging:',
      shipping_left_value2: '60kg jute bags with GrainPro liners',
      shipping_left_label3: 'Loading Port:',
      shipping_left_value3: 'Mombasa, Kenya',
      shipping_right_label1: 'Destination:',
      shipping_right_value1: 'Hamburg, Germany',
      shipping_right_label2: 'Latest Shipment Date:',
      shipping_right_value2: 'October 15, 2024',
      shipping_right_label3: 'Delivery Timeline:',
      shipping_right_value3: '30-45 days from loading',
      additional_shipping_terms_label: 'Additional Shipping Terms:',
      additional_shipping_terms: '',
      total_contract_value: parseFloat(contractData.totalContractValue || 0),
      // Changed from submitted_flag to submission_id to match the database schema
      submission_id: uuidv4()
    };
    
    if (onSave) {
      onSave(contractToSave);
    }
  };

  // Calculate total contract value
  const totalContractValue = contractData.products?.reduce((sum, product) => {
    const productTotal = parseFloat(product.total.replace(/,/g, '')) || 0;
    return sum + productTotal;
  }, 0) || 0;

  return (
    <div className="bg-white p-8 shadow-lg max-w-5xl mx-auto contract-template">
      {/* Contract Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase">Coffee Export Contract</h1>
        <div className="mt-4 flex justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <label className="font-semibold w-40">Contract Number:</label>
              {editMode ? (
                <Input 
                  value={contractData.contractNumber || ''} 
                  onChange={(e) => handleChange('contractNumber', e.target.value)}
                  className="max-w-[200px]"
                  placeholder="KCL-2024-XXXX"
                />
              ) : (
                <span>{contractData.contractNumber || 'KCL-2024-XXXX'}</span>
              )}
            </div>
          </div>
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end mb-2">
              <label className="font-semibold mr-2">Date:</label>
              {editMode ? (
                <Input 
                  type="date" 
                  value={contractData.currentDate || new Date().toISOString().split('T')[0]} 
                  onChange={(e) => handleChange('currentDate', e.target.value)}
                  className="max-w-[200px]"
                />
              ) : (
                <span>{new Date(contractData.currentDate || Date.now()).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Seller */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">SELLER</h2>
          <div className="space-y-2">
            <div className="flex flex-col">
              <label className="font-medium text-sm">Company Name:</label>
              {editMode ? (
                <Input 
                  value={contractData.sellerDetails?.name || ''} 
                  onChange={(e) => handleNestedChange('sellerDetails', 'name', e.target.value)}
                  placeholder="KAJON Coffee Limited"
                />
              ) : (
                <p>{contractData.sellerDetails?.name || 'KAJON Coffee Limited'}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-sm">Address:</label>
              {editMode ? (
                <Input 
                  value={contractData.sellerDetails?.address || ''} 
                  onChange={(e) => handleNestedChange('sellerDetails', 'address', e.target.value)}
                  placeholder="Kampala, Uganda"
                />
              ) : (
                <p>{contractData.sellerDetails?.address || 'Kampala, Uganda'}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-sm">Registration:</label>
              {editMode ? (
                <Input 
                  value={contractData.sellerDetails?.registration || ''} 
                  onChange={(e) => handleNestedChange('sellerDetails', 'registration', e.target.value)}
                  placeholder="Registration #: UG2023786541"
                />
              ) : (
                <p>{contractData.sellerDetails?.registration || 'Registration #: UG2023786541'}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Buyer */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">BUYER</h2>
          <div className="space-y-2">
            <div className="flex flex-col">
              <label className="font-medium text-sm">Company Name:</label>
              {editMode ? (
                <Input 
                  value={contractData.buyerDetails?.name || ''} 
                  onChange={(e) => handleNestedChange('buyerDetails', 'name', e.target.value)}
                  placeholder="Enter buyer name"
                />
              ) : (
                <p>{contractData.buyerDetails?.name || '[Buyer Company Name]'}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-sm">Address:</label>
              {editMode ? (
                <Input 
                  value={contractData.buyerDetails?.address || ''} 
                  onChange={(e) => handleNestedChange('buyerDetails', 'address', e.target.value)}
                  placeholder="Enter buyer address"
                />
              ) : (
                <p>{contractData.buyerDetails?.address || '[Buyer Address]'}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-sm">Registration:</label>
              {editMode ? (
                <Input 
                  value={contractData.buyerDetails?.registration || ''} 
                  onChange={(e) => handleNestedChange('buyerDetails', 'registration', e.target.value)}
                  placeholder="Enter buyer registration"
                />
              ) : (
                <p>{contractData.buyerDetails?.registration || '[Buyer Registration #]'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">PRODUCT DETAILS</h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold text-right">Quantity</TableHead>
              <TableHead className="font-bold text-right">Unit</TableHead>
              <TableHead className="font-bold text-right">Unit Price</TableHead>
              <TableHead className="font-bold text-right">Currency</TableHead>
              <TableHead className="font-bold text-right">Total</TableHead>
              {editMode && <TableHead className="w-16"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(contractData.products || []).map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {editMode ? (
                    <Input 
                      value={product.description} 
                      onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                    />
                  ) : (
                    product.description
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editMode ? (
                    <Input 
                      value={product.quantity} 
                      onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-20 ml-auto"
                    />
                  ) : (
                    product.quantity
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editMode ? (
                    <Input 
                      value={product.unit} 
                      onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                      className="w-16 ml-auto"
                    />
                  ) : (
                    product.unit
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editMode ? (
                    <Input 
                      value={product.unitPrice} 
                      onChange={(e) => updateProduct(product.id, 'unitPrice', e.target.value)}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-24 ml-auto"
                    />
                  ) : (
                    product.unitPrice
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editMode ? (
                    <Input 
                      value={product.currency} 
                      onChange={(e) => updateProduct(product.id, 'currency', e.target.value)}
                      className="w-20 ml-auto"
                    />
                  ) : (
                    product.currency
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {editMode ? (
                    <Input 
                      value={product.total} 
                      onChange={(e) => updateProduct(product.id, 'total', e.target.value)}
                      className="w-32 ml-auto"
                      disabled
                    />
                  ) : (
                    product.total
                  )}
                </TableCell>
                {editMode && (
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeProduct(product.id)}
                      disabled={(contractData.products || []).length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            
            {/* Total Row */}
            <TableRow className="border-t-2 font-bold">
              <TableCell colSpan={4} className="text-right">TOTAL CONTRACT VALUE:</TableCell>
              <TableCell className="text-right">{contractData.products?.[0]?.currency || 'USD'}</TableCell>
              <TableCell className="text-right">{totalContractValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              {editMode && <TableCell></TableCell>}
            </TableRow>
          </TableBody>
        </Table>
        
        {editMode && (
          <div className="mt-2 flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={addProduct}
            >
              Add Product
            </Button>
          </div>
        )}
      </div>

      {/* Payment Terms */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">PAYMENT TERMS</h2>
        <div className="border p-4 rounded">
          <ul className="list-disc pl-5 space-y-2">
            {(contractData.paymentTermsItems || []).map((item, index) => (
              <li key={item.id} className="flex items-start">
                {editMode ? (
                  <>
                    <Textarea 
                      value={item.term}
                      onChange={(e) => updatePaymentTerm(item.id, e.target.value)}
                      className="min-h-[60px] flex-grow mr-2"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removePaymentTerm(item.id)}
                      disabled={(contractData.paymentTermsItems || []).length <= 1}
                      className="mt-1"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <span>{item.term}</span>
                )}
              </li>
            ))}
          </ul>
          
          {editMode && (
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={addPaymentTerm}
              >
                Add Payment Term
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Terms */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">SHIPPING TERMS</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
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
          <div className="space-y-4">
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
        
        <div className="mt-6">
          <p className="font-medium">Additional Shipping Terms:</p>
          <p className="text-gray-700 italic">
            Seller to provide phytosanitary certificate, certificate of origin, ICO certificate, and all necessary export documentation. Buyer responsible for import clearance at destination port.
          </p>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-4">For and on behalf of SELLER</h3>
          <div className="grid grid-cols-[100px_1fr] gap-y-4">
            <div className="font-medium">Name:</div>
            <div>John Doe</div>
            <div className="font-medium">Title:</div>
            <div>Export Manager</div>
            <div className="font-medium">Date:</div>
            <div>{new Date().toLocaleDateString()}</div>
            <div className="font-medium">Signature:</div>
            <div className="italic text-gray-500">[Signature]</div>
          </div>
        </div>
        
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-4">For and on behalf of BUYER</h3>
          <div className="grid grid-cols-[100px_1fr] gap-y-4">
            <div className="font-medium">Name:</div>
            <div>[Authorized Representative]</div>
            <div className="font-medium">Title:</div>
            <div>[Position]</div>
            <div className="font-medium">Date:</div>
            <div>[Date]</div>
            <div className="font-medium">Signature:</div>
            <div className="italic text-gray-500">[Signature]</div>
          </div>
        </div>
      </div>
      
      {/* Company Seal */}
      <div className="text-center italic text-gray-500 mb-4">
        [Company Seal/Stamp]
      </div>
      
      {/* Save Button */}
      {editMode && (
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleSaveContract}
            className="w-40"
          >
            Save Contract
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoffeeContractTemplate;
