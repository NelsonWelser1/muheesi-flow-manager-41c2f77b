
import React from 'react';

const PrintStyles = () => {
  return (
    <style jsx global>{`
      @media print {
        body * {
          visibility: hidden;
        }
        .inventory-table,
        .inventory-table * {
          visibility: visible;
        }
        .inventory-table {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    `}</style>
  );
};

export default PrintStyles;
