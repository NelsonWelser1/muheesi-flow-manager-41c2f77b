
import React from 'react';
import BulkPayrollTableContainer from './BulkPayrollTableContainer';

// This file maintains backward compatibility - same exports and interface
const BulkPayrollTable = ({ records, onUpdateRecords }) => {
  return (
    <BulkPayrollTableContainer 
      records={records} 
      onUpdateRecords={onUpdateRecords} 
    />
  );
};

export default BulkPayrollTable;
