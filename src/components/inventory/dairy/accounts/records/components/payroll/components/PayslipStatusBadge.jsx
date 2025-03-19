
import React from 'react';

const PayslipStatusBadge = ({ status }) => {
  return (
    <span 
      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
        status === 'paid' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {status === 'paid' ? 'Paid' : 'Pending'}
    </span>
  );
};

export default PayslipStatusBadge;
