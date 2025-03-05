
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SelectedProductsSection = ({ selectedProducts, formatCurrency, calculateGrandTotal }) => {
  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium mb-2">Added Products</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.product_type}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.total_amount}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">Grand Total:</TableCell>
            <TableCell className="font-bold">{formatCurrency(calculateGrandTotal())}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default SelectedProductsSection;
