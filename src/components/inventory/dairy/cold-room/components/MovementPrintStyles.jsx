
import React from 'react';

const MovementPrintStyles = () => {
  return (
    <style jsx global>{`
      @media print {
        body * {
          visibility: hidden;
        }
        .movement-table,
        .movement-table * {
          visibility: visible;
        }
        .movement-table {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    `}</style>
  );
};

export default MovementPrintStyles;
