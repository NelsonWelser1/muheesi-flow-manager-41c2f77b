
import React from 'react';

const ProductsTable = ({ products }) => {
  return (
    <div className="mt-4 pt-4 border-t">
      <p className="text-sm font-medium mb-2">Products</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-auto text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2">Product</th>
              <th className="text-right p-2">Quantity</th>
              <th className="text-right p-2">Price</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 3).map((product, idx) => (
              <tr key={idx} className="border-b border-gray-100">
                <td className="p-2">{product.name}</td>
                <td className="text-right p-2">{product.quantity}</td>
                <td className="text-right p-2">${parseFloat(product.price).toFixed(2)}</td>
                <td className="text-right p-2">${parseFloat(product.total).toFixed(2)}</td>
              </tr>
            ))}
            {products.length > 3 && (
              <tr>
                <td colSpan="4" className="p-2 text-center text-muted-foreground">
                  + {products.length - 3} more items
                </td>
              </tr>
            )}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="p-2 text-center text-muted-foreground">
                  No products in this proposal
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
