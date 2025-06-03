
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ProductTable = ({ products, handleProductChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Product Details</h3>
      <div className="border rounded-md">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Packages</th>
              <th className="p-3 text-left">Net Weight</th>
              <th className="p-3 text-left">Gross Weight</th>
              <th className="p-3 text-left">Measure</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td className="p-3">
                  <Input
                    name="code"
                    value={product.code}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="Product code"
                  />
                </td>
                <td className="p-3">
                  <Input
                    name="description"
                    value={product.description}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="Product description"
                  />
                </td>
                <td className="p-3">
                  <Input
                    name="quantity"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="Quantity"
                  />
                </td>
                <td className="p-3">
                  <Input
                    name="packages"
                    value={product.packages}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="Packages"
                  />
                </td>
                <td className="p-3">
                  <Input
                    name="netWeight"
                    value={product.netWeight}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="Net weight"
                  />
                </td>
                <td className="p-3">
                  <Input
                    name="grossWeight"
                    value={product.grossWeight}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="Gross weight"
                  />
                </td>
                <td className="p-3">
                  <Input
                    name="measure"
                    value={product.measure}
                    onChange={(e) => handleProductChange(index, e)}
                    placeholder="Measure"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
