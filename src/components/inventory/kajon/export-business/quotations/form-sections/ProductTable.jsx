
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const COFFEE_PRODUCTS = {
  arabica: [
    { code: 'A-BugAA', name: 'Arabica Coffee: Bugisu AA' },
    { code: 'A-BugA', name: 'Arabica Coffee: Bugisu A' },
    { code: 'A-BugPB', name: 'Arabica Coffee: Bugisu PB' },
    { code: 'A-BugB', name: 'Arabica Coffee: Bugisu B' },
    { code: 'A-DRUG', name: 'Arabica Coffee: DRUGAR' },
    { code: 'A-PARCH', name: 'Arabica Coffee: Parchment Arabica' }
  ],
  robusta: [
    { code: 'R-FAQ', name: 'Robusta Coffee: FAQ' },
    { code: 'R-S18', name: 'Robusta Coffee: Screen 18' },
    { code: 'R-S15', name: 'Robusta Coffee: Screen 15' },
    { code: 'R-S12', name: 'Robusta Coffee: Screen 12' },
    { code: 'R-ORG', name: 'Robusta Coffee: Organic Robusta' }
  ]
};

const ProductTable = ({ products, handleProductChange }) => {
  console.log('Rendering ProductTable with products:', products);

  const addNewProduct = () => {
    handleProductChange(products.length, {
      target: {
        name: 'new',
        value: {
          code: '',
          description: '',
          quantity: '',
          packages: '',
          netWeight: '',
          grossWeight: '',
          measure: ''
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product code</TableHead>
              <TableHead>Description of goods</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Kind of packages</TableHead>
              <TableHead>Net weight (KG)</TableHead>
              <TableHead>Gross weight (KG)</TableHead>
              <TableHead>Measure (M2)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={product.code || "select-product"}  // Ensure default value is not empty
                    onValueChange={(value) => {
                      const selectedProduct = [...COFFEE_PRODUCTS.arabica, ...COFFEE_PRODUCTS.robusta]
                        .find(p => p.code === value);
                      handleProductChange(index, {
                        target: {
                          name: 'code',
                          value: value
                        }
                      });
                      if (selectedProduct) {
                        handleProductChange(index, {
                          target: {
                            name: 'description',
                            value: selectedProduct.name
                          }
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select-product">Select a product</SelectItem>
                      <SelectItem value="custom">Custom Product</SelectItem>
                      <SelectSeparator className="my-2" />
                      <div className="px-2 py-1.5 text-sm font-semibold">Arabica Coffee</div>
                      {COFFEE_PRODUCTS.arabica.map((product) => (
                        <SelectItem key={product.code} value={product.code}>
                          {product.code}
                        </SelectItem>
                      ))}
                      <SelectSeparator className="my-2" />
                      <div className="px-2 py-1.5 text-sm font-semibold">Robusta Coffee</div>
                      {COFFEE_PRODUCTS.robusta.map((product) => (
                        <SelectItem key={product.code} value={product.code}>
                          {product.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    name="description"
                    value={product.description || ''}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="Product description"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="quantity"
                    type="number"
                    value={product.quantity || ''}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="packages"
                    value={product.packages || ''}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="15 Jute Bags (60 kg) x 8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="netWeight"
                    type="number"
                    value={product.netWeight || ''}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="grossWeight"
                    type="number"
                    value={product.grossWeight || ''}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="measure"
                    type="number"
                    value={product.measure || ''}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="0"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button 
        onClick={addNewProduct}
        variant="outline"
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Product
      </Button>
    </div>
  );
};

export default ProductTable;
