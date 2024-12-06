import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const ProductTable = ({ products, handleProductChange }) => {
  return (
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
                <Input
                  name="code"
                  value={product.code}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="A-Robu"
                />
              </TableCell>
              <TableCell>
                <Input
                  name="description"
                  value={product.description}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="Robusta Nganda, fair average quality"
                />
              </TableCell>
              <TableCell>
                <Input
                  name="quantity"
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="packages"
                  value={product.packages}
                  onChange={(e) => handleProductChange(index, e)}
                  placeholder="15 Jute Bags (60 kg) x 8"
                />
              </TableCell>
              <TableCell>
                <Input
                  name="netWeight"
                  type="number"
                  value={product.netWeight}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="grossWeight"
                  type="number"
                  value={product.grossWeight}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </TableCell>
              <TableCell>
                <Input
                  name="measure"
                  type="number"
                  value={product.measure}
                  onChange={(e) => handleProductChange(index, e)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;