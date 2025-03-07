
import React from 'react';

const SalesTable = ({ salesData }) => {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Date</th>
          <th>Customer</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {salesData.map((sale) => (
          <tr key={sale.id}>
            <td>{new Date(sale.date_time).toLocaleDateString()}</td>
            <td>{sale.customer_name}</td>
            <td>${(sale.quantity * sale.price_per_unit).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SalesTable;
