
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PRODUCT_PRICES = {
  'Grand Berna Dairies': {
    'Cheese': { USD: 15, UGX: 55000 },
    'Yogurt': { USD: 5, UGX: 18000 },
    'Fresh Milk': { USD: 2, UGX: 7000 },
    'Processed Milk': { USD: 3, UGX: 11000 },
    'Beef': { USD: 10, UGX: 37000 },
    'Goat': { USD: 12, UGX: 44000 },
    'Pork': { USD: 8, UGX: 29000 },
    'Poultry': { USD: 7, UGX: 26000 },
    'Eggs': { USD: 0.5, UGX: 1800 }
  },
  'KAJON Coffee Limited': {
    'Screen 18': { USD: 4.69, UGX: 17200 },
    'Screen 15': { USD: 4.63, UGX: 17000 },
    'Arabica AA': { USD: 5.86, UGX: 21500 },
    'DRUGAR': { USD: 4.63, UGX: 17000 }
  },
  'Kyalima Farmers Limited': {
    'Rice': { USD: 2, UGX: 7000 },
    'Maize': { USD: 1.5, UGX: 5500 },
    'Hulled white sesame': { USD: 3, UGX: 11000 },
    'Soybean': { USD: 2.5, UGX: 9000 },
    'Cocoa': { USD: 5, UGX: 18000 },
    'Bulls': { USD: 1500, UGX: 5500000 },
    'Heifers': { USD: 1200, UGX: 4400000 },
    'Mothers': { USD: 1000, UGX: 3700000 },
    'Calves': { USD: 800, UGX: 2900000 }
  }
};

const ProductTable = ({ company, currency, products, onProductsChange }) => {
  const addProduct = () => {
    onProductsChange([...products, { product: '', quantity: '', price: 0 }]);
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    
    if (field === 'product') {
      newProducts[index].price = PRODUCT_PRICES[company][value]?.[currency] || 0;
    }
    
    onProductsChange(newProducts);
  };

  const calculateTotalPrice = (price, quantity) => {
    // Convert tons to kg (1 ton = 1000 kg) and multiply by price per kg
    return price * (quantity * 1000);
  };

  // Get available products for the selected company
  const getAvailableProducts = () => {
    if (!company || !PRODUCT_PRICES[company]) return [];
    return Object.keys(PRODUCT_PRICES[company]);
  };

  const availableProducts = getAvailableProducts();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PRODUCT</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead>QTY (Tons)</TableHead>
            <TableHead>UNIT PRICE/KG ({currency})</TableHead>
            <TableHead>TOTAL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select 
                  value={item.product || "select-product"} 
                  onValueChange={(value) => updateProduct(index, 'product', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select-product">Choose a product</SelectItem>
                    {availableProducts.length > 0 ? (
                      availableProducts.map(product => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-products">No products available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{item.product || "-"}</TableCell>
              <TableCell>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                {item.price?.toLocaleString() || '-'}
              </TableCell>
              <TableCell>
                {(item.product && item.quantity) 
                  ? calculateTotalPrice(item.price, parseFloat(item.quantity)).toLocaleString() 
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button 
        onClick={addProduct}
        className="mt-4"
        variant="outline"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Product
      </Button>
    </>
  );
};

export default ProductTable;
