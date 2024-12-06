import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CompanyDetails from './form-sections/CompanyDetails';
import TransportDetails from './form-sections/TransportDetails';
import ImporterDetails from './form-sections/ImporterDetails';
import ShipmentDetails from './form-sections/ShipmentDetails';
import ProductTable from './form-sections/ProductTable';

const QuotationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Invoice details
    exportNumber: '34567',
    exportDate: '03 Jul 2024',
    billNumber: 'NED12345678',
    reference: '34567',
    buyerReference: 'NL788',
    
    // Company details
    companyName: '',
    address: '',
    country: '',
    phone: '',
    contactPerson: '',
    taxId: '',
    
    // Transport details
    transportCompany: '',
    transportAddress: '',
    transportLocation: '',
    transportCountry: '',
    transportPhone: '',
    transportContact: '',
    
    // Importer details
    importerName: '',
    importerAddress: '',
    importerLocation: '',
    importerPhone: '',
    importerContact: '',
    
    // Shipment details
    dispatchMethod: 'sea',
    shipmentType: 'FCL',
    originCountry: 'Uganda',
    destinationCountry: 'The Netherlands',
  });

  const [products, setProducts] = useState([
    {
      code: 'A-Robu',
      description: 'Robusta Nganda, fair average quality',
      quantity: '15',
      packages: '15 Jute Bags (60 kg) x 8',
      netWeight: '900',
      grossWeight: '950',
      measure: '12'
    },
    {
      code: 'B-Robu',
      description: 'Robusta Erecta, fair average quality',
      quantity: '30',
      packages: '30 jute bags (60 kg) x 8',
      netWeight: '800',
      grossWeight: '1850',
      measure: '15'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]: value
    };
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your form submission logic here
      toast({
        title: "Success",
        description: "Quotation created successfully",
      });
    } catch (error) {
      console.error('Error creating quotation:', error);
      toast({
        title: "Error",
        description: "Failed to create quotation",
        variant: "destructive",
      });
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const netWeightTotal = products.reduce((sum, product) => sum + Number(product.netWeight), 0);
    const grossWeightTotal = products.reduce((sum, product) => sum + Number(product.grossWeight), 0);
    const measureTotal = products.reduce((sum, product) => sum + Number(product.measure), 0);
    return { netWeightTotal, grossWeightTotal, measureTotal };
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Export invoice number & date</Label>
                  <div className="flex gap-2">
                    <Input
                      name="exportNumber"
                      value={formData.exportNumber}
                      onChange={handleInputChange}
                      className="w-1/2"
                    />
                    <Input
                      name="exportDate"
                      value={formData.exportDate}
                      onChange={handleInputChange}
                      className="w-1/2"
                    />
                  </div>
                </div>
                <div>
                  <Label>Bill of loading number</Label>
                  <Input
                    name="billNumber"
                    value={formData.billNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Reference</Label>
                  <Input
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label>Buyer reference</Label>
                  <Input
                    name="buyerReference"
                    value={formData.buyerReference}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <CompanyDetails formData={formData} handleInputChange={handleInputChange} />
            <TransportDetails formData={formData} handleInputChange={handleInputChange} />
            <ImporterDetails formData={formData} handleInputChange={handleInputChange} />
          </div>

          <div className="mb-8">
            <ShipmentDetails formData={formData} handleInputChange={handleInputChange} />
          </div>

          <div className="mb-8">
            <ProductTable products={products} handleProductChange={handleProductChange} />
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Total Net Weight:</span>
              <span>{totals.netWeightTotal} KG</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Gross Weight:</span>
              <span>{totals.grossWeightTotal} KG</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Measure:</span>
              <span>{totals.measureTotal} M²</span>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">Create Quotation</Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default QuotationForm;
